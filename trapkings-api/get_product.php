<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
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

try {
    $products = [];
    if (isset($_GET['id']) && is_numeric($_GET['id'])) {
        // Fetch a single product by ID
        $id = intval($_GET['id']);
        $stmt = $conn->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
    } else {
        // Fetch all products
        $result = $conn->query("SELECT * FROM products ORDER BY id DESC");
    }

    if (!$result) {
        throw new Exception('Query failed');
    }

    while ($row = $result->fetch_assoc()) {
        // Convert image path to full URL if it exists
        if (!empty($row['image'])) {
            $row['image'] = 'http://localhost/trapkings-api/' . $row['image'];
        }
        // Optionally, convert images field to full URLs (for multi-image support)
        if (!empty($row['images'])) {
            $row['images'] = implode(',', array_map(function($img) {
                return 'http://localhost/trapkings-api/' . trim($img);
            }, explode(',', $row['images'])));
        }
        $products[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'products' => $products
    ]);
} catch (Exception $e) {
    echo json_encode([
        'error' => $e->getMessage()
    ]);
} finally {
    $conn->close();
}
?>