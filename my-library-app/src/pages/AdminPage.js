import React, { useState, useEffect } from 'react';
import './AdminPage.css';

function AdminPage() {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        year: '',
        genre: '',
        pages: '',
        rating: '',
        description: '',
    });
    const [selectedFile, setSelectedFile] = useState(null);

    const [imageUrl, setImageUrl] = useState('');

    const [message, setMessage] = useState('');

    const [books, setBooks] = useState([]);

    const [editingBookId, setEditingBookId] = useState(null);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/books');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setBooks(data);
        } catch (error) {
            console.error('Помилка завантаження книг:', error);
            setMessage('Помилка завантаження книг.');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImageUrl('');
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        if (selectedFile) {
            data.append('image', selectedFile);
        } else if (editingBookId && !selectedFile && imageUrl && imageUrl.startsWith('http')) {

            data.append('image', imageUrl.replace('http://localhost:5000', ''));
        }


        const url = editingBookId 
            ? `http://localhost:5000/api/books/${editingBookId}` 
            : 'http://localhost:5000/api/books';
        const method = editingBookId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                body: data,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Невідома помилка сервера');
            }

            const result = await response.json();
            setMessage(`Книгу успішно ${editingBookId ? 'оновлено' : 'додано'}!`);
            console.log(result);
            resetForm();
            fetchBooks();
        } catch (error) {
            console.error('Помилка відправки запиту:', error);
            setMessage(`Помилка: ${error.message}`);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            author: '',
            year: '',
            genre: '',
            pages: '',
            rating: '',
            description: '',
        });
        setSelectedFile(null);
        setImageUrl('');
        setEditingBookId(null);
    };

    const handleEdit = (book) => {
        setEditingBookId(book._id);
        setFormData({
            title: book.title,
            author: book.author,
            year: book.year,
            genre: book.genre,
            pages: book.pages,
            rating: book.rating,
            description: book.description,
        });

        if (book.image) {
            setImageUrl(`http://localhost:5000${book.image}`);
        } else {
            setImageUrl('');
        }
        setSelectedFile(null);
        setMessage('');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Ви впевнені, що хочете видалити цю книгу?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/books/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                setMessage('Книгу успішно видалено!');
                fetchBooks();
            } catch (error) {
                console.error('Помилка видалення книги:', error);
                setMessage('Помилка видалення книги.');
            }
        }
    };

    return (
        <div className="admin-page-container">
            <h2>{editingBookId ? 'Редагувати книгу' : 'Додати нову книгу'}</h2>
            {message && <p className="admin-message">{message}</p>}
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="book-form">
                <div className="form-group">
                    <label htmlFor="title">Назва:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="author">Автор:</label>
                    <input
                        type="text"
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="year">Рік:</label>
                    <input
                        type="number"
                        id="year"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="genre">Жанр:</label>
                    <input
                        type="text"
                        id="genre"
                        name="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="pages">Сторінок:</label>
                    <input
                        type="number"
                        id="pages"
                        name="pages"
                        value={formData.pages}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="rating">Рейтинг (1-5):</label>
                    <input
                        type="number"
                        id="rating"
                        name="rating"
                        step="0.1"
                        min="1"
                        max="5"
                        value={formData.rating}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Опис:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="imageFile">Зображення обкладинки:</label>
                    <input 
                        type="file" 
                        id="imageFile" 
                        name="image"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleFileChange} 
                    />
                    {imageUrl && (
                        <div className="image-preview">
                            <p>Попередній перегляд:</p>
                            <img src={imageUrl} alt="Попередній перегляд обкладинки" style={{ maxWidth: '150px', maxHeight: '200px', objectFit: 'contain' }} />
                        </div>
                    )}
                </div>

                <div className="form-actions">
                    <button type="submit">
                        {editingBookId ? 'Оновити книгу' : 'Додати книгу'}
                    </button>
                    {editingBookId && (
                        <button type="button" onClick={resetForm} className="cancel-button">
                            Скасувати редагування
                        </button>
                    )}
                </div>
            </form>

            <h2 className="books-list-header">Список книг</h2>
            <div className="books-grid">
                {books.length > 0 ? (
                    books.map(book => (
                        <div key={book._id} className="book-item-admin">
                            <img 
                                src={`http://localhost:5000${book.image}`} 
                                alt={book.title} 
                                className="book-item-admin-image" 
                                onError={(e) => { 
                                    e.target.onerror = null; 
                                    e.target.src = 'http://localhost:5000/images/placeholder.jpg'; 
                                }}
                            />
                            <div className="book-item-admin-details">
                                <h3>{book.title}</h3>
                                <p>Автор: {book.author}</p>
                                <p>Рік: {book.year}</p>
                                <p>Жанр: {book.genre}</p>
                                <p>Рейтинг: {book.rating}</p>
                            </div>
                            <div className="book-item-admin-actions">
                                <button onClick={() => handleEdit(book)}>Редагувати</button>
                                <button onClick={() => handleDelete(book._id)}>Видалити</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Книг немає.</p>
                )}
            </div>
        </div>
    );
}

export default AdminPage;