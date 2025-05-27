<?php
header('Content-Type: application/json');
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? null;

if (!$id) {
    echo json_encode(['success' => false, 'error' => 'Missing user ID']);
    exit;
}

$stmt = $conn->prepare("SELECT id, username, email FROM users WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
if ($row = $result->fetch_assoc()) {
    echo json_encode([
        'success' => true,
        'id' => $row['id'],
        'username' => $row['username'],
        'email' => $row['email']
    ]);
} else {
    echo json_encode(['success' => false, 'error' => 'User not found']);
}
$stmt->close();
$conn->close();
?>