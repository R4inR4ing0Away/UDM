<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
header('Content-Type: application/json');
require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$order_id = isset($data['order_id']) ? $data['order_id'] : '';
if (!$order_id) {
    echo json_encode(['success' => false, 'error' => 'Missing order_id']);
    exit;
}
try {
    // Restock items
    $stmt = $pdo->prepare('SELECT items FROM orders WHERE id = ?');
    $stmt->execute([$order_id]);
    $order = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($order && !empty($order['items'])) {
        $items = json_decode($order['items'], true);
        if (is_array($items)) {
            foreach ($items as $item) {
                $productName = $item['name'];
                $quantity = isset($item['quantity']) ? intval($item['quantity']) : 1;
                $updateStmt = $pdo->prepare('UPDATE products SET quantity = quantity + ? WHERE name = ?');
                $updateStmt->execute([$quantity, $productName]);
            }
        }
    }
    // Update order status
    $stmt = $pdo->prepare('UPDATE orders SET status = ? WHERE id = ?');
    $stmt->execute(['cancelled', $order_id]);
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>