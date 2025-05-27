<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['error' => 'No data received']);
    exit;
}

$username = isset($data['username']) ? $data['username'] : '';
$email = isset($data['email']) ? $data['email'] : '';
$password = isset($data['password']) ? $data['password'] : '';

$conn = new mysqli('localhost', 'root', '', 'trapkings_db');
if ($conn->connect_error) {
    echo json_encode(['error' => 'Database connection failed', 'details' => $conn->connect_error]);
    exit;
}

// Hash the password before saving
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

$sql = "INSERT INTO registered_user (username, email, password) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['error' => 'Prepare failed', 'details' => $conn->error]);
    exit;
}
$stmt->bind_param("sss", $username, $email, $hashed_password);

if ($stmt->execute()) {
    echo json_encode(['message' => 'User registered successfully!']);
} else {
    echo json_encode(['error' => 'Registration failed', 'details' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>