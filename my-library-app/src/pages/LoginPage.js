import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        if (!username || !password) {
            setMessage({ text: 'Будь ласка, заповніть усі поля.', type: 'error' });
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (!response.ok) {

                setMessage({ text: data.message || 'Помилка входу. Спробуйте ще раз.', type: 'error' });
                return;
            }

            login(data);

            setMessage({ text: data.message || 'Вхід успішний!', type: 'success' });

            if (data.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }

        } catch (error) {

            console.error('Помилка входу:', error);
            setMessage({ text: error.message || 'Невідома помилка під час входу. Перевірте з\'єднання.', type: 'error' });
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
                <h2>Вхід</h2>
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
                    <button type="submit" className="button auth-button">Увійти</button>
                </form>
                <p className="auth-link">Не маєте акаунту? <a href="/register">Зареєструватися</a></p>
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

export default LoginPage;