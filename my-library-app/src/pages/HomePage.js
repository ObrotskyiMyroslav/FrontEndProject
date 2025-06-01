import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookCard from '../components/BookCard';
import './HomePage.css';

function HomePage() {
    const [recommendedBooks, setRecommendedBooks] = useState([]);
    const [loadingRecommended, setLoadingRecommended] = useState(true);
    const [errorRecommended, setErrorRecommended] = useState(null);

    useEffect(() => {
        const fetchRecommendedBooks = async () => {
            try {
                setLoadingRecommended(true);

                const response = await fetch('http://localhost:5000/api/books?limit=4&sortBy=rating&sortOrder=desc'); // Приклад
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setRecommendedBooks(data);
            } catch (err) {
                setErrorRecommended('Не вдалося завантажити рекомендовані книги.');
                console.error("Помилка завантаження рекомендованих книг:", err);
            } finally {
                setLoadingRecommended(false);
            }
        };

        fetchRecommendedBooks();
    }, []);

    return (
        <main>
            <section className="hero-section container">
                <h1>Ласкаво просимо до Моєї Бібліотеки!</h1>
                <p className="lead-text">
                    Відкрийте для себе безмежний світ літератури. У нашому каталозі ви знайдете тисячі книг на будь-який смак та жанр.
                </p>
                <Link to="/catalog" className="button-primary hero-button">Переглянути повний каталог</Link>
            </section>

            <section className="recommended-books-section container">
                <h2>Рекомендовані книги</h2>
                {loadingRecommended ? (
                    <p>Завантаження рекомендованих книг...</p>
                ) : errorRecommended ? (
                    <p className="error-message-inline">{errorRecommended}</p>
                ) : recommendedBooks.length === 0 ? (
                    <p>Наразі немає рекомендованих книг.</p>
                ) : (
                    <div className="books-grid">
                        {recommendedBooks.map(book => (
                            <BookCard key={book._id} book={book} />
                        ))}
                    </div>
                )}
            </section>

            <section className="features-section container">
                <h2>Наші переваги</h2>
                <div className="features-grid">
                    <div className="feature-item">
                        <h3>Широкий вибір</h3>
                        <p>Тисячі книг різних жанрів та авторів.</p>
                    </div>
                    <div className="feature-item">
                        <h3>Зручний пошук</h3>
                        <p>Легко знаходьте потрібні книги за назвою, автором чи жанром.</p>
                    </div>
                    <div className="feature-item">
                        <h3>Детальні описи</h3>
                        <p>Ознайомтеся з кожною книгою перед читанням.</p>
                    </div>
                </div>
            </section>

            <section className="call-to-action-section container">
                <p>Не знаєте, що почитати? Відвідайте наш повний каталог!</p>
                <Link to="/catalog" className="button-secondary">До каталогу</Link>
            </section>
        </main>
    );
}

export default HomePage;