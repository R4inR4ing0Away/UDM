<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "trapkings_db");

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

// Handle different HTTP methods
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        // Get all users
        $sql = "SELECT * FROM registered_user";
        $result = $conn->query($sql);
        $users = [];
        
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $users[] = $row;
            }
        }
        
        echo json_encode(["success" => true, "users" => $users]);
        break;

    case 'POST':
        // Add new user
        $data = json_decode(file_get_contents("php://input"), true);
        
        $username = $data['username'];
        $password = password_hash($data['password'], PASSWORD_DEFAULT);
        $email = $data['email'];
        $role = $data['role'];
        
        $sql = "INSERT INTO registered_user (username, password, email, role) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssss", $username, $password, $email, $role);
        
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "User added successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error adding user"]);
        }
        break;

    case 'PUT':
        // Update user
        $data = json_decode(file_get_contents("php://input"), true);
        
        $id = $data['id'];
        $username = $data['username'];
        $email = $data['email'];
        $role = $data['role'];
        
        // If password is provided, update it
        if (!empty($data['password'])) {
            $password = password_hash($data['password'], PASSWORD_DEFAULT);
            $sql = "UPDATE registered_user SET username = ?, email = ?, role = ?, password = ? WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ssssi", $username, $email, $role, $password, $id);
        } else {
            $sql = "UPDATE registered_user SET username = ?, email = ?, role = ? WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("sssi", $username, $email, $role, $id);
        }
        
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "User updated successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error updating user"]);
        }
        break;

    case 'DELETE':
        // Delete user
        $id = $_GET['id'];
        
        $sql = "DELETE FROM registered_user WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "User deleted successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error deleting user"]);
        }
        break;
}

$conn->close();
?>