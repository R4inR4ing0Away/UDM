<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = "localhost";
$user = "root";
$pass = "";
$db = "trapkings_db";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(['error' => 'Database connection failed']));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die(json_encode(['error' => 'Only POST requests are allowed']));
}

if (!isset($_POST['name']) || !isset($_POST['price'])) {
    die(json_encode(['error' => 'Missing required fields']));
}

$name = $_POST['name'];
$price = $_POST['price'];
$category = $_POST['category'] ?? '';
$size = $_POST['size'] ?? '';
$color = $_POST['color'] ?? '';
$quantity = $_POST['quantity'] ?? '0';
$description = $_POST['description'] ?? '';
$status = $_POST['status'] ?? 'ACTIVE';

$imagePaths = [];
if (isset($_FILES['images'])) {
    $files = $_FILES['images'];
    for ($i = 0; $i < count($files['name']); $i++) {
        if ($files['error'][$i] === UPLOAD_ERR_OK) {
            $targetDir = __DIR__ . "/uploads/";
            if (!file_exists($targetDir)) {
                mkdir($targetDir, 0777, true);
            }
            $fileExtension = pathinfo($files["name"][$i], PATHINFO_EXTENSION);
            $sanitizedProductName = preg_replace('/[^A-Za-z0-9_\-]/', '_', $name);
            $newFilename = $sanitizedProductName . '_' . uniqid() . "_$i." . $fileExtension;
            $targetFile = $targetDir . $newFilename;
            $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!in_array($files['type'][$i], $allowedTypes)) continue;
            if (move_uploaded_file($files["tmp_name"][$i], $targetFile)) {
                $imagePaths[] = "uploads/" . $newFilename;
            }
        }
    }
}
$imagesString = implode(',', $imagePaths);

try {
    $stmt = $conn->prepare("INSERT INTO products (name, price, category, size, color, quantity, description, images, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssssss", $name, $price, $category, $size, $color, $quantity, $description, $imagesString, $status);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Product added successfully',
            'product' => [
                'name' => $name,
                'price' => $price,
                'images' => $imagesString,
                'status' => $status
            ]
        ]);
    } else {
        throw new Exception('Failed to insert product');
    }
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
} finally {
    $stmt->close();
    $conn->close();
}
?>