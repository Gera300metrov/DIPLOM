<?php
session_start();
if (isset($_POST['password']) && $_POST['password'] === 'DragonAdmin2026') {
    $_SESSION['admin_logged'] = true;
    header('Location: index.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Вход в админ-панель</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-black flex items-center justify-center h-screen">
    <div class="bg-zinc-900 p-8 rounded-2xl border border-yellow-600 w-96">
        <h2 class="text-3xl font-bold text-yellow-500 mb-6">DRAGON TATTOO</h2>
        <form method="POST">
            <input type="password" name="password" placeholder="Пароль" class="w-full p-3 bg-black text-white border border-yellow-700 rounded mb-4" required>
            <button type="submit" class="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-2 rounded">Войти</button>
        </form>
    </div>
</body>
</html>