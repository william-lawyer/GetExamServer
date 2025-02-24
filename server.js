const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000; // Используем порт из окружения или 3000 по умолчанию

// Middleware
app.use(express.json());
app.use(cors()); // Разрешаем CORS для всех источников

// Настройка Nodemailer для отправки email через Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'majesticonlinedocuments@gmail.com', // Ваш email
        pass: 'lzrz bttw xxuc tfpa' // Ваш пароль приложения Gmail
    }
});

// Объект для хранения кодов подтверждения
const verificationCodes = {};

// Эндпоинт для отправки email с кодом
app.post('/send-email', (req, res) => {
    const { email } = req.body;

    // Генерация случайного 4-значного кода
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    verificationCodes[email] = code;

    const mailOptions = {
        from: 'majesticonlinedocuments@gmail.com',
        to: email,
        subject: 'Код подтверждения',
        text: `Ваш код подтверждения: ${code}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Ошибка отправки:', error);
            return res.status(500).json({ error: 'Не удалось отправить код' });
        }
        console.log('Письмо отправлено:', info.response);
        res.status(200).json({ message: 'Код отправлен' });
    });
});

// Эндпоинт для проверки кода
app.post('/verify-code', (req, res) => {
    const { email, code } = req.body;

    if (verificationCodes[email] && verificationCodes[email] === code) {
        delete verificationCodes[email]; // Удаляем код после успешной проверки
        res.status(200).json({ message: 'Код верный' });
    } else {
        res.status(400).json({ error: 'Неверный код' });
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});