<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? null;
$username = $data['username'] ?? null;
$email = $data['email'] ?? null;

if (!$id || !$username || !$email) {
    echo json_encode(['success' => false, 'error' => 'Missing fields']);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE registered_user SET username = ?, email = ? WHERE id = ?");
    $success = $stmt->execute([$username, $email, $id]);
    if ($success) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to update user', 'sql_error' => $stmt->errorInfo()]);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>