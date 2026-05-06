<?php
header('Content-Type: application/json');
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

$required = ['name', 'phone', 'service', 'master', 'date', 'time'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Поле $field обязательно"]);
        exit;
    }
}

// Валидация даты
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $data['date']) || strtotime($data['date']) < strtotime('today')) {
    http_response_code(400);
    echo json_encode(['error' => 'Некорректная дата']);
    exit;
}

$stmt = $pdo->prepare("
    INSERT INTO bookings (name, phone, email, comment, service, master, date, time)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
");

$stmt->execute([
    trim($data['name']),
    trim($data['phone']),
    $data['email'] ?? null,
    $data['comment'] ?? null,
    $data['service'],
    $data['master'],
    $data['date'],
    $data['time']
]);

echo json_encode(['success' => true, 'message' => 'Заявка сохранена']);