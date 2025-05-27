<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db_connect.php';

$sql = "SELECT username, email FROM admin WHERE id = 1";
$result = $conn->query($sql);

if ($result && $row = $result->fetch_assoc()) {
    echo json_encode(['success' => true, 'username' => $row['username'], 'email' => $row['email']]);
} else {
    echo json_encode(['success' => false, 'message' => 'Admin not found']);
}

$conn->close();
