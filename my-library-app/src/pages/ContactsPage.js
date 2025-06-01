import React, { useState } from 'react';

function ContactsPage() {

    const [contactMessage, setContactMessage] = useState({ text: '', type: '' });

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [newsletter, setNewsletter] = useState(false);


    const handleContactSubmit = (event) => {
        event.preventDefault();
        setContactMessage({ text: '', type: '' }); 

        let isValid = true;
        let errorMessage = '';

        if (name.trim() === '') {
            isValid = false;
            errorMessage += 'Будь ласка, введіть ваше ім\'я. ';
        }
        if (email.trim() === '' || !email.includes('@') || !email.includes('.')) {
            isValid = false;
            errorMessage += 'Будь ласка, введіть коректний email. ';
        }
        if (message.trim() === '') {
            isValid = false;
            errorMessage += 'Будь ласка, введіть ваше повідомлення. ';
        }

        if (isValid) {
            console.log('Form Submitted:', { name, email, subject, message, newsletter });
            setContactMessage({ text: 'Дякуємо за ваше повідомлення! Ми зв\'яжемося з вами найближчим часом.', type: 'success' });
            setName('');
            setEmail('');
            setSubject('');
            setMessage('');
            setNewsletter(false);
        } else {
            setContactMessage({ text: 'Будь ласка, виправте наступні помилки: ' + errorMessage, type: 'error' });
        }

        setTimeout(() => {
            setContactMessage({ text: '', type: '' });
        }, 5000);
    };

    return (
        <main>
            <section className="contact-section container">
                <h2>Наші Контакти</h2>
                {contactMessage.text && (
                    <div className={`message-area ${contactMessage.type}`} id="contact-message">
                        {contactMessage.text}
                    </div>
                )}
                <p>Якщо у вас є запитання або пропозиції, будь ласка, заповніть форму нижче:</p>
                <form onSubmit={handleContactSubmit} className="contact-form" id="contact-form">
                    <div className="form-group">
                        <label htmlFor="name">Ім'я:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            placeholder="Ваше ім'я"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            placeholder="Ваш email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="subject">Тема:</label>
                        <select
                            id="subject"
                            name="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        >
                            <option value="">Оберіть тему</option>
                            <option value="question">Запитання</option>
                            <option value="suggestion">Пропозиція</option>
                            <option value="feedback">Відгук</option>
                            <option value="other">Інше</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Повідомлення:</label>
                        <textarea
                            id="message"
                            name="message"
                            rows="5"
                            required
                            placeholder="Ваше повідомлення"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="form-group checkbox-group">
                        <input
                            type="checkbox"
                            id="newsletter"
                            name="newsletter"
                            checked={newsletter}
                            onChange={(e) => setNewsletter(e.target.checked)}
                        />
                        <label htmlFor="newsletter">Підписатися на розсилку новин</label>
                    </div>

                    <button type="submit" className="button">Надіслати повідомлення</button>
                </form>
            </section>
        </main>
    );
}

export default ContactsPage;