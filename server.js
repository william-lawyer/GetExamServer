const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors'); // Добавляем cors
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors()); // Разрешаем CORS для всех источников

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'majesticonlinedocuments@gmail.com', // Ваш email
        pass: 'lzrz bttw xxuc tfpa'     // Ваш пароль приложения
    }
});

const verificationCodes = {};

app.post('/send-email', (req, res) => {
    const { email } = req.body;
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    
    verificationCodes[email] = code;

    const mailOptions = {
        from: 'your-email@gmail.com',
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

app.post('/verify-code', (req, res) => {
    const { email, code } = req.body;

    if (verificationCodes[email] && verificationCodes[email] === code) {
        delete verificationCodes[email];
        res.status(200).json({ message: 'Код верный' });
    } else {
        res.status(400).json({ error: 'Неверный код' });
    }
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});