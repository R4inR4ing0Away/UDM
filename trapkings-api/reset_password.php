<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

$email = isset($data['email']) ? $data['email'] : '';
$newPassword = isset($data['newPassword']) ? $data['newPassword'] : '';

if (empty($email) || empty($newPassword)) {
    echo json_encode(['success' => false, 'error' => 'Email and new password are required.']);
    exit;
}

try {
    // Check if user exists
    $stmt = $pdo->prepare("SELECT id FROM registered_user WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->rowCount() === 0) {
        echo json_encode(['success' => false, 'error' => 'No user found with that email.']);
        exit;
    }

    // Hash the new password
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

    // Update password
    $updateStmt = $pdo->prepare("UPDATE registered_user SET password = ? WHERE email = ?");
    $success = $updateStmt->execute([$hashedPassword, $email]);

    if ($success) {
        echo json_encode(['success' => true, 'message' => 'Password successfully changed!']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to update password.', 'sql_error' => $updateStmt->errorInfo()]);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>