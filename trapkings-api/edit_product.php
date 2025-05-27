<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$host = "localhost";
$user = "root";
$pass = "";
$db = "trapkings_db";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(['error' => 'Database connection failed']));
}

$id = $_POST['id'] ?? null;
$name = $_POST['name'] ?? '';
$price = $_POST['price'] ?? '';
$category = $_POST['category'] ?? '';
$size = $_POST['size'] ?? '';
$quantity = $_POST['quantity'] ?? 0;
$status = $_POST['status'] ?? 'ACTIVE';

if (!$id) {
    die(json_encode(['error' => 'Missing product ID']));
}

$stmt = $conn->prepare("UPDATE products SET name=?, price=?, category=?, size=?, quantity=?, status=? WHERE id=?");
$stmt->bind_param("ssssisi", $name, $price, $category, $size, $quantity, $status, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'Update failed']);
}
$stmt->close();
$conn->close();
?>