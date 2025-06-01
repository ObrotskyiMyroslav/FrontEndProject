import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import BookCard from '../components/BookCard';
import '../App.css';

function CatalogPage() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterGenre, setFilterGenre] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [sortBy, setSortBy] = useState('title');
    const [sortOrder, setSortOrder] = useState('asc');

    const fetchBooks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams();
            if (searchTerm) queryParams.append('search', searchTerm);
            if (filterGenre) queryParams.append('genre', filterGenre);
            if (filterYear) queryParams.append('year', filterYear);
            if (sortBy) queryParams.append('sortBy', sortBy);
            if (sortOrder) queryParams.append('sortOrder', sortOrder);

            const url = `http://localhost:5000/api/books?${queryParams.toString()}`;
            console.log("Відправляю запит на:", url);

            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setBooks(data);
        } catch (err) {
            console.error("Помилка завантаження книг:", err);
            setError('Не вдалося завантажити книги. Спробуйте пізніше.');
        } finally {
            setLoading(false);
        }
    }, [searchTerm, filterGenre, filterYear, sortBy, sortOrder]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    const handleSearchChange = (e) => setSearchTerm(e.target.value);
    const handleGenreChange = (e) => setFilterGenre(e.target.value);
    const handleYearChange = (e) => setFilterYear(e.target.value);
    const handleSortByChange = (e) => setSortBy(e.target.value);
    const handleSortOrderChange = (e) => setSortOrder(e.target.value);

    const genres = [
        "Всі жанри", "Фантастика", "Фентезі", "Детектив", "Роман", "Історичний",
        "Пригоди", "Наукова література", "Антиутопія", "Філософський роман",
        "Казка, Філософська повість", "Високе фентезі"
    ];
    const years = [
        "Усі роки", "1997", "1949", "1967", "1943", "1954", "1900-2014",
        "2015", "2016", "2017", "2018", "2019", "2020"
    ];
    const sortOptions = [
        { value: 'title', label: 'Назвою' },
        { value: 'author', label: 'Автором' },
        { value: 'year', label: 'Роком' },
        { value: 'rating', label: 'Рейтингом' },
    ];

    return (
        <main>
            <section className="catalog-section container">
                <h1>Повний каталог книг</h1>

                <div className="filter-sort-panel">
                    <input
                        type="text"
                        placeholder="Пошук за назвою або автором..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="filter-input"
                    />

                    <select value={filterGenre} onChange={handleGenreChange} className="filter-select">
                        <option value="">Усі жанри</option>
                        {genres.map(genre => (
                            <option key={genre} value={genre === "Всі жанри" ? "" : genre}>
                                {genre}
                            </option>
                        ))}
                    </select>

                    <select value={filterYear} onChange={handleYearChange} className="filter-select">
                        <option value="">Усі роки</option>
                        {years.map(year => (
                            <option key={year} value={year === "Усі роки" ? "" : year}>
                                {year}
                            </option>
                        ))}
                    </select>

                    <select value={sortBy} onChange={handleSortByChange} className="filter-select">
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                Сортувати за {option.label}
                            </option>
                        ))}
                    </select>

                    <select value={sortOrder} onChange={handleSortOrderChange} className="filter-select">
                        <option value="asc">Зростання</option>
                        <option value="desc">Спадання</option>
                    </select>
                </div>

                {loading ? (
                    <p>Завантаження книг...</p>
                ) : error ? (
                    <p className="error-message-inline">{error}</p>
                ) : books.length === 0 ? (
                    <p>Наразі немає книг, що відповідають вашим критеріям.</p>
                ) : (
                    <div className="books-grid">
                        {books.map(book => (
                            <BookCard key={book._id} book={book} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default CatalogPage;
