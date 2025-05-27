<?php
file_put_contents('debug_update_order.txt', json_encode([
    'method' => $_SERVER['REQUEST_METHOD'],
    'post' => $_POST,
    'input' => file_get_contents('php://input')
]) . PHP_EOL, FILE_APPEND);
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
header('Content-Type: application/json');
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$order_id = isset($data['order_id']) ? $data['order_id'] : '';
$status = isset($data['status']) ? $data['status'] : '';

if (!$order_id || !$status) {
    echo json_encode(['success' => false, 'error' => 'Missing order_id or status']);
    exit;
}

$allowed_statuses = ['active', 'in_transit', 'received', 'cancelled'];
if (!in_array($status, $allowed_statuses)) {
    echo json_encode(['success' => false, 'error' => 'Invalid status']);
    exit;
}

try {
    // Update order status
    $stmt = $pdo->prepare('UPDATE orders SET status = ? WHERE order_id = ?');
    $result = $stmt->execute([$status, $order_id]);
    if ($stmt->rowCount() === 0 && is_numeric($order_id)) {
        $stmt = $pdo->prepare('UPDATE orders SET status = ? WHERE id = ?');
        $result = $stmt->execute([$status, $order_id]);
    }

    // If moving to in_transit, deduct inventory
    if ($status === 'in_transit') {
        // Fetch the order's items
        $stmt = $pdo->prepare('SELECT items FROM orders WHERE order_id = ?');
        $stmt->execute([$order_id]);
        $order = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($order && !empty($order['items'])) {
            $items = json_decode($order['items'], true);
            if (is_array($items)) {
                foreach ($items as $item) {
                    // Deduct quantity from products table
                    $productName = $item['name'];
                    $quantity = isset($item['quantity']) ? intval($item['quantity']) : 1;
                    // If you have product id, use it instead of name for more reliability
                    $updateStmt = $pdo->prepare('UPDATE products SET quantity = GREATEST(quantity - ?, 0) WHERE name = ?');
                    $updateStmt->execute([$quantity, $productName]);
                }
            }
        }
    }

    if ($result && $stmt->rowCount() > 0) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to update order (order not found or no change)']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>