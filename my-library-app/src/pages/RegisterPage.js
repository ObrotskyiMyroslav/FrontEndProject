import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });


        if (!username || !password) {
            setMessage({ text: 'Будь ласка, заповніть усі поля (логін та пароль).', type: 'error' });
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage({ text: data.message || 'Помилка реєстрації. Спробуйте ще раз.', type: 'error' });
                return;
            }

            setMessage({ text: data.message || 'Реєстрація успішна! Тепер ви можете увійти.', type: 'success' });
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            console.error('Помилка реєстрації:', error);
            setMessage({ text: 'Не вдалося підключитися до сервера. Перевірте ваше з\'єднання.', type: 'error' });
        }
    };


    const getMessageStyles = (type) => {
        const baseStyle = {
            padding: '10px 15px',
            borderRadius: '5px',
            marginBottom: '20px',
            fontWeight: 'bold',
            textAlign: 'center',
            opacity: 0,
            transform: 'translateY(-10px)',
            animation: 'fadeIn 0.5s ease-out forwards'
        };

        if (type === 'error') {
            return {
                ...baseStyle,
                backgroundColor: '#f8d7da',
                color: '#721c24',
                border: '1px solid #f5c6cb'
            };
        } else if (type === 'success') {
            return {
                ...baseStyle,
                backgroundColor: '#d4edda',
                color: '#155724',
                border: '1px solid #c3e6cb'
            };
        }
        return {};
    };

    return (
        <main className="auth-page">
            <section className="auth-container container">
                <h2>Реєстрація</h2>
                {message.text && (
                    <div style={getMessageStyles(message.type)}>
                        {message.text}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="username">Ім'я користувача:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Пароль:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="button auth-button">Зареєструватися</button>
                </form>
                <p className="auth-link">Вже маєте акаунт? <a href="/login">Увійти</a></p>
            </section>

            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                `}
            </style>
        </main>
    );
}

export default RegisterPage;