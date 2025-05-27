<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Debug log
file_put_contents('debug_signin.txt', date('Y-m-d H:i:s') . " - Sign in attempt\n", FILE_APPEND);

require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'error' => 'No data received']);
    exit;
}

$username = isset($data['username']) ? $data['username'] : '';
$password = isset($data['password']) ? $data['password'] : '';

// Debug log
file_put_contents('debug_signin.txt', "Username: " . $username . "\n", FILE_APPEND);

if (empty($username) || empty($password)) {
    echo json_encode(['success' => false, 'error' => 'Username and password are required']);
    exit;
}

try {
    // Fetch user by username
    $stmt = $pdo->prepare("SELECT id, username, email, password, role FROM registered_user WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // Debug log
        file_put_contents('debug_signin.txt', "User found in database\n", FILE_APPEND);
        // Force role to lowercase for consistency
        if (isset($user['role'])) {
            $user['role'] = strtolower($user['role']);
        }
        // Debug log password verification
        file_put_contents('debug_signin.txt', "Attempting password verification\n", FILE_APPEND);
        // Verify password
        if (password_verify($password, $user['password'])) {
            unset($user['password']); // Remove password from response
            if (empty($user['role'])) {
                $user['role'] = 'user';
            }
            file_put_contents('debug_signin.txt', "Password verified successfully\n", FILE_APPEND);
            echo json_encode([
                'success' => true,
                'message' => 'Sign in successful!',
                'user' => $user
            ]);
        } else {
            file_put_contents('debug_signin.txt', "Password verification failed\n", FILE_APPEND);
            echo json_encode(['success' => false, 'error' => 'Invalid username or password']);
        }
    } else {
        file_put_contents('debug_signin.txt', "No user found with username: " . $username . "\n", FILE_APPEND);
        echo json_encode(['success' => false, 'error' => 'Invalid username or password']);
    }
} catch (Exception $e) {
    file_put_contents('debug_signin.txt', "Error: " . $e->getMessage() . "\n", FILE_APPEND);
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
?>