<?php
header('Content-Type: application/json');
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['name']) || empty($data['phone'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Имя и телефон обязательны']);
    exit;
}

$stmt = $pdo->prepare("
    INSERT INTO quick_requests (name, phone, idea)
    VALUES (?, ?, ?)
");

$stmt->execute([
    trim($data['name']),
    trim($data['phone']),
    $data['idea'] ?? null
]);

echo json_encode(['success' => true, 'message' => 'Заявка принята']);