import React from 'react';

function BookCard({ book }) {
    const baseUrl = 'http://localhost:5000';

    const imageUrl = book.image ? `${baseUrl}${book.image}` : `${baseUrl}/images/placeholder.jpg`;

    return (
        <div className="book-card">
            <img
                src={imageUrl}
                alt={book.title}
                className="book-card-image"
            />
            <div className="book-card-content">
                <h3 className="book-card-title">{book.title}</h3>
                <p className="book-card-author">{book.author}</p>
                <div className="book-card-details">
                    <p>Рік: {book.year}</p>
                    <p>Жанр: {book.genre}</p>
                    <p>Сторінок: {book.pages}</p>
                    <div className="book-card-rating">
                        Рейтинг: {book.rating}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookCard;