<?php
session_start();
if (!isset($_SESSION['admin_logged'])) {
    header('Location: login.php');
    exit;
}
require_once '../config.php';

// Удаление заявки
if (isset($_GET['delete_booking'])) {
    $stmt = $pdo->prepare("DELETE FROM bookings WHERE id = ?");
    $stmt->execute([(int)$_GET['delete_booking']]);
    header('Location: index.php?deleted=1');
    exit;
}

if (isset($_GET['delete_quick'])) {
    $stmt = $pdo->prepare("DELETE FROM quick_requests WHERE id = ?");
    $stmt->execute([(int)$_GET['delete_quick']]);
    header('Location: index.php?deleted=1');
    exit;
}

// Получение данных
$bookings = $pdo->query("SELECT * FROM bookings ORDER BY created_at DESC")->fetchAll();
$quickReqs = $pdo->query("SELECT * FROM quick_requests ORDER BY created_at DESC")->fetchAll();
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Админ-панель | DRAGON TATTOO</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .gold-btn { background: #d4af37; color: black; font-weight: bold; }
        .gold-btn:hover { background: #b8960c; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #333; padding: 8px; text-align: left; vertical-align: top; }
        th { background: #1a1a1a; color: #d4af37; }
        tr:hover { background: #1a1a1a; }
    </style>
</head>
<body class="bg-black text-gray-200">
    <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-4xl font-bold text-yellow-500">Админ-панель</h1>
            <a href="logout.php" class="bg-red-700 hover:bg-red-600 px-4 py-2 rounded">Выйти</a>
        </div>

        <?php if (isset($_GET['deleted'])): ?>
            <div class="bg-green-900 text-green-200 p-3 rounded mb-4">✔ Запись удалена</div>
        <?php endif; ?>

        <!-- Полные заявки -->
        <div class="mb-12">
            <h2 class="text-2xl font-bold text-yellow-400 mb-3">📋 Заявки онлайн-записи</h2>
            <?php if (count($bookings) === 0): ?>
                <p class="text-gray-500">Нет заявок</p>
            <?php else: ?>
                <div class="overflow-x-auto">
                    <table>
                        <thead>
                            <tr><th>ID</th><th>Имя</th><th>Телефон</th><th>Email</th><th>Услуга</th><th>Мастер</th><th>Дата</th><th>Время</th><th>Комментарий</th><th>Дата создания</th><th>Действие</th></tr>
                        </thead>
                        <tbody>
                            <?php foreach ($bookings as $b): ?>
                            <tr>
                                <td><?= $b['id'] ?></td>
                                <td><?= htmlspecialchars($b['name']) ?></td>
                                <td><?= htmlspecialchars($b['phone']) ?></td>
                                <td><?= htmlspecialchars($b['email']) ?></td>
                                <td><?= htmlspecialchars($b['service']) ?></td>
                                <td><?= htmlspecialchars($b['master']) ?></td>
                                <td><?= $b['date'] ?></td>
                                <td><?= $b['time'] ?></td>
                                <td><?= nl2br(htmlspecialchars($b['comment'])) ?></td>
                                <td><?= $b['created_at'] ?></td>
                                <td><a href="?delete_booking=<?= $b['id'] ?>" class="text-red-400 hover:text-red-300" onclick="return confirm('Удалить заявку?')">🗑</a></td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>
        </div>

        <!-- Быстрые заявки -->
        <div>
            <h2 class="text-2xl font-bold text-yellow-400 mb-3">⚡ Быстрые заявки (из формы в контактах)</h2>
            <?php if (count($quickReqs) === 0): ?>
                <p class="text-gray-500">Нет заявок</p>
            <?php else: ?>
                <div class="overflow-x-auto">
                    <table>
                        <thead><tr><th>ID</th><th>Имя</th><th>Телефон</th><th>Идея тату</th><th>Дата</th><th>Действие</th></tr></thead>
                        <tbody>
                            <?php foreach ($quickReqs as $q): ?>
                            <tr>
                                <td><?= $q['id'] ?></td>
                                <td><?= htmlspecialchars($q['name']) ?></td>
                                <td><?= htmlspecialchars($q['phone']) ?></td>
                                <td><?= nl2br(htmlspecialchars($q['idea'])) ?></td>
                                <td><?= $q['created_at'] ?></td>
                                <td><a href="?delete_quick=<?= $q['id'] ?>" class="text-red-400 hover:text-red-300" onclick="return confirm('Удалить заявку?')">🗑</a></td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>