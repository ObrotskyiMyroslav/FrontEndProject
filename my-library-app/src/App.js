import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import BookDetailsPage from './pages/BookDetailsPage';
import CatalogPage from './pages/CatalogPage';
import ContactsPage from './pages/ContactsPage';
import './App.css';

const AuthLinks = () => {
    const { user, logout, isAdmin } = React.useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            {user ? (
                <>
                    {isAdmin && (
                        <Link to="/admin" className="nav-link">Адмін-панель</Link>
                    )}
                    <span className="welcome-message">Привіт, {user.username}!</span>
                    <button onClick={handleLogout} className="button-small logout-button">Вийти</button>
                </>
            ) : (
                <>
                    <Link to="/login" className="nav-link">Вхід</Link>
                    <Link to="/register" className="nav-link">Реєстрація</Link>
                </>
            )}
        </>
    );
};

const AdminRoute = ({ children }) => {
    const { user, loading } = React.useContext(AuthContext);
    const navigate = useNavigate();

    if (loading) {
        return <p>Завантаження...</p>;
    }

    if (!user || user.role !== 'admin') {
        navigate('/login');
        return null;
    }

    return children;
};

function App() {
    return (
        <Router>
            <AuthProvider> 
                <div className="App">
                    <header className="main-header">
                        <div className="container header-content">
                            <Link to="/" className="site-title">Моя Бібліотека</Link>
                            <nav className="main-nav">
                                <Link to="/" className="nav-link">Головна</Link>
                              
                                <Link to="/catalog" className="nav-link">Каталог</Link>
                                <Link to="/contacts" className="nav-link">Контакти</Link>
                                

                                <AuthLinks />
                            </nav>
                        </div>
                    </header>

                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
     
                        <Route path="/catalog" element={<CatalogPage />} />
                        <Route path="/contacts" element={<ContactsPage />} />
                        <Route path="/books/:id" element={<BookDetailsPage />} /> 

                        <Route
                            path="/admin"
                            element={
                                <AdminRoute>
                                    <AdminPage />
                                </AdminRoute>
                            }
                        />
                    </Routes>

                    <footer className="main-footer">
                        <div className="container">
                            <p>&copy; {new Date().getFullYear()} Моя Бібліотека. Усі права захищені.</p>
                        </div>
                    </footer>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;