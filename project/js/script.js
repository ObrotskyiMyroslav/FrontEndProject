document.addEventListener('DOMContentLoaded', function() {

    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const authMessage = document.getElementById('auth-message');
    const usernameError = document.getElementById('username-error');
    const passwordError = document.getElementById('password-error');

    const correctUsername = 'user';
    const correctPassword = 'password123';

    function displayMessage(message, type) {
        authMessage.textContent = message;
        authMessage.className = 'message-area';
        authMessage.classList.add(type);
        authMessage.style.display = 'block';
        setTimeout(() => {
            authMessage.style.display = 'none';
        }, 5000);
    }

    function clearFieldErrors() {
        usernameError.textContent = '';
        passwordError.textContent = '';
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            clearFieldErrors();

            const enteredUsername = usernameInput.value;
            const enteredPassword = passwordInput.value;

            if (enteredUsername === '') {
                usernameError.textContent = 'Будь ласка, введіть логін.';
                return;
            }
            if (enteredUsername.length < 3) {
                usernameError.textContent = 'Логін має бути щонайменше 3 символи.';
                return;
            }

            if (enteredPassword === '') {
                passwordError.textContent = 'Будь ласка, введіть пароль.';
                return;
            }
            if (enteredPassword.length < 6) {
                passwordError.textContent = 'Пароль має бути щонайменше 6 символів.';
                return;
            }

            if (enteredUsername === correctUsername && enteredPassword === correctPassword) {
                displayMessage('Успішна авторизація! Ласкаво просимо, ' + enteredUsername + '!', 'success');
                loginForm.reset();

            } else {
                displayMessage('Невірний логін або пароль. Спробуйте ще раз.', 'error');
            }
        });

        usernameInput.addEventListener('blur', function() {
            if (usernameInput.value !== '' && usernameInput.value.length < 3) {
                usernameError.textContent = 'Логін має бути щонайменше 3 символи.';
            } else {
                usernameError.textContent = '';
            }
        });

        passwordInput.addEventListener('blur', function() {
            if (passwordInput.value !== '' && passwordInput.value.length < 6) {
                passwordError.textContent = 'Пароль має бути щонайменше 6 символів.';
            } else {
                passwordError.textContent = '';
            }
        });
    }

    const contactForm = document.getElementById('contact-form');
    const contactMessage = document.getElementById('contact-message');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            let isValid = true;
            let errorMessage = '';

            if (name.trim() === '') {
                isValid = false;
                errorMessage += 'Будь ласка, введіть ваше ім\'я. ';
            }
            if (email.trim() === '' || !email.includes('@')) {
                isValid = false;
                errorMessage += 'Будь ласка, введіть коректний email. ';
            }
            if (message.trim() === '') {
                isValid = false;
                errorMessage += 'Будь ласка, введіть ваше повідомлення. ';
            }

            if (isValid) {
                contactMessage.textContent = 'Дякуємо за ваше повідомлення! Ми зв\'яжемося з вами найближчим часом.';
                contactMessage.className = 'message-area success';
                contactMessage.style.display = 'block';
                contactForm.reset();
            } else {
                contactMessage.textContent = 'Будь ласка, виправте наступні помилки: ' + errorMessage;
                contactMessage.className = 'message-area error';
                contactMessage.style.display = 'block';
            }

            setTimeout(() => {
                contactMessage.style.display = 'none';
            }, 5000);
        });
    }
});