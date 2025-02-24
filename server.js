async function sendVerificationCode(email) {
    try {
        const response = await fetch('https://getexamserver.onrender.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            showScreen(codeScreen);
            inputs.regCode.value = '';
            errors.regCode.textContent = '';
        } else {
            errors.regEmail.textContent = 'Ошибка при отправке кода';
            showScreen(registerScreen);
        }
    } catch (error) {
        errors.regEmail.textContent = 'Ошибка сети';
        showScreen(registerScreen);
        console.error(error);
    }
}

async function verifyCode() {
    const code = inputs.regCode.value.trim();
    const email = regData.email;

    if (!validateCode(inputs.regCode, errors.regCode)) return;

    try {
        const response = await fetch('https://learning-app-server.onrender.com/verify-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code })
        });

        if (response.ok) {
            localStorage.setItem('name', regData.name);
            localStorage.setItem('username', regData.username);
            localStorage.setItem('email', regData.email);
            localStorage.setItem('password', regData.password);
            localStorage.setItem('loggedIn', 'true');
            startApp();
        } else {
            errors.regCode.textContent = 'Неверный код';
        }
    } catch (error) {
        errors.regCode.textContent = 'Ошибка сети';
        console.error(error);
    }
}