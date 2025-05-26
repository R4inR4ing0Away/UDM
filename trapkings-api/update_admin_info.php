<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = new mysqli("localhost", "root", "", "trapkings_db");

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);

$username = isset($data['username']) ? trim($data['username']) : '';
$email = isset($data['email']) ? trim($data['email']) : '';

if ($username === '' && $email === '') {
    echo json_encode(["success" => false, "message" => "No changes provided"]);
    exit;
}

$fields = [];
$params = [];
$types = '';
if ($username !== '') {
    $fields[] = 'username = ?';
    $params[] = $username;
    $types .= 's';
}
if ($email !== '') {
    $fields[] = 'email = ?';
    $params[] = $email;
    $types .= 's';
}
$sql = "UPDATE registered_user SET " . implode(', ', $fields) . " WHERE role = 'admin' LIMIT 1";
$stmt = $conn->prepare($sql);
if ($types && $stmt) {
    $stmt->bind_param($types, ...$params);
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Admin info updated successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error updating admin info"]);
    }
    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Prepare failed or no fields to update"]);
}

$conn->close();
?>