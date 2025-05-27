<?php
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Headers: Content-Type');
  header('Access-Control-Allow-Methods: GET, OPTIONS');
  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
      http_response_code(200);
      exit();
  }
  header('Content-Type: application/json');
  require_once 'db.php';

  $email = isset($_GET['email']) ? $_GET['email'] : '';
  if (!$email) {
      echo json_encode(['success' => false, 'error' => 'Missing email']);
      exit;
  }

  try {
      $stmt = $pdo->prepare('SELECT id, order_id, name, email, status, time_created, total, shipping, full_name, shipping_address, delivery_note, method_of_payment, items FROM orders WHERE email = ? ORDER BY time_created DESC');
      $stmt->execute([$email]);
      $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode(['success' => true, 'orders' => $orders]);
  } catch (Exception $e) {
      echo json_encode(['success' => false, 'error' => $e->getMessage()]);
  }
?>