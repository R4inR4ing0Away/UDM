<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, OPTIONS, POST');
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

if (!isset($data['name']) || !isset($data['email']) || !isset($data['order_total'])) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

$order_id = !empty($data['order_id']) ? $data['order_id'] : uniqid('ORD-');
$name = $data['name'];
$email = $data['email'];
$order_total = $data['order_total'];
$status = 'active';

// Get all the order details
$shipping = isset($data['shipping']) ? $data['shipping'] : 0;
$full_name = isset($data['full_name']) ? $data['full_name'] : $name;
$shipping_address = isset($data['shipping_address']) ? $data['shipping_address'] : '';
$delivery_note = isset($data['delivery_note']) ? $data['delivery_note'] : '';
$method_of_payment = isset($data['method_of_payment']) ? $data['method_of_payment'] : 'Cash on Delivery';
$items = isset($data['items']) ? json_encode($data['items']) : '[]';

try {
    $stmt = $pdo->prepare('INSERT INTO orders (
        order_id, name, email, status, time_created, total, 
        shipping, full_name, shipping_address, delivery_note, 
        method_of_payment, items
    ) VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?)');
    
    $success = $stmt->execute([
        $order_id, $name, $email, $status, $order_total,
        $shipping, $full_name, $shipping_address, $delivery_note,
        $method_of_payment, $items
    ]);
    
    if ($success) {
        $new_order_id = $pdo->lastInsertId();
        echo json_encode(['success' => true, 'order_id' => $order_id, 'id' => $new_order_id]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to create order']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>