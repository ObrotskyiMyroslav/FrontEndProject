
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function BookDetailsPage() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:5000/api/books/${id}`);
if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
}
const data = await response.json();
                if (data) {
                    setBook(data);
                } else {
                    setError('Книгу не знайдено.');
                }
            } catch (err) {
                setError('Не вдалося завантажити деталі книги.');
                console.error("Помилка завантаження деталей книги:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [id]);

    return (
        <main>
            <section className="book-details container">
                {loading ? (
                    <p>Завантаження деталей книги...</p>
                ) : error ? (
                    <div className="error-message-inline">
                        <p>{error}</p>
                        <Link to="/catalog" className="button">Повернутися до каталогу</Link>
                    </div>
                ) : book ? (
                    <div className="book-details-content">
                        <h2 className="book-title">{book.title}</h2>
                        <div className="book-info-grid">
                            <div className="book-image-container">
                                <img src={book.image} alt={book.title} className="book-cover-large" />
                            </div>
                            <div className="book-text-info">
                                <p><strong>Автор:</strong> {book.author}</p>
                                <p><strong>Рік видання:</strong> {book.year}</p>
                                <p><strong>Жанр:</strong> {book.genre}</p>
                                <p><strong>Кількість сторінок:</strong> {book.pages}</p>
                                <p><strong>Рейтинг:</strong> {book.rating} / 5</p>
                                <p><strong>Опис:</strong></p>
                                <p>{book.description}</p>
                                <Link to="/catalog" className="button">Повернутися до каталогу</Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>Немає інформації про книгу.</p>
                )}
            </section>
        </main>
    );
}

export default BookDetailsPage;