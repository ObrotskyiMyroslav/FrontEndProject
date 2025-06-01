const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'public/images');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|webp/; 
        const mimetype = filetypes.test(file.mimetype); 
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); 

        if (mimetype && extname) {
            return cb(null, true); 
        } else {
            cb(new Error('Дозволено лише файли зображень (jpeg, jpg, png, gif, webp)!'), false);
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 }
});

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/librarydb';

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('Підключення до MongoDB успішно встановлено.');
        // Закоментовано після першого запуску, щоб колекція книг не очищалася при кожному запуску
        // try {
        //     const Book = mongoose.model('Book', bookSchema);
        //     await Book.deleteMany({}); 
        //     console.log('Колекція книг очищена для перезавантаження початкових даних.');
        // } catch (error) {
        //     console.warn('Не вдалося очистити колекцію книг (можливо, модель Book ще не визначена або вже пуста).');
        // }

    })
    .catch(err => {
        console.error('Помилка підключення до MongoDB:', err);
        console.error('Переконайтеся, що MongoDB запущений у WSL (sudo systemctl status mongod має показувати active (running)).');
        process.exit(1);
    });

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    pages: { type: Number, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    description: { type: String, default: 'Опис відсутній.' },
    image: { type: String, default: '/images/placeholder.jpg' } 
});

const Book = mongoose.model('Book', bookSchema);

const initialBooks = [
    {
        title: 'Гаррі Поттер і Філософський камінь',
        author: 'Джоан Роулінг',
        year: 1997,
        genre: 'Фентезі',
        pages: 336,
        rating: 4.8,
        description: 'Перша книга із серії про хлопчика-чарівника Гаррі Поттера, який дізнається про свій магічний світ та починає навчання у школі чарівництва Хогвартс.',
        image: '/images/PotterPhylosofyStone.jpg' 
    },
    {
        title: '1984',
        author: 'Джордж Орвелл',
        year: 1949,
        genre: 'Антиутопія',
        pages: 328,
        rating: 4.7,
        description: 'Відомий роман-антиутопія, що описує тоталітарне суспільство, де держава повністю контролює життя кожного громадянина.',
        image: '/images/1984.jpg' 
    },
    {
        title: 'Майстер і Маргарита',
        author: 'Михайло Булгаков',
        year: 1967,
        genre: 'Філософський роман',
        pages: 480,
        rating: 4.9,
        description: 'Містичний роман, що переплітає сатиру на радянське суспільство з біблійними мотивами та ліричною історією кохання.',
        image: '/images/MasterandMargarita.jpg' 
    },
    {
        title: 'Маленький принц',
        author: 'Антуан де Сент-Екзюпері',
        year: 1943,
        genre: 'Казка, Філософська повість',
        pages: 96,
        rating: 4.9,
        description: 'Філософська казка, що розповідає про зустріч льотчика з маленьким принцом, який подорожує з планети на планету.',
        image: '/images/LittlePrince.jpg' 
    },
    {
        title: 'Володар перснів: Хранителі Персня',
        author: 'Дж. Р. Р. Толкін',
        year: 1954,
        genre: 'Високе фентезі',
        pages: 423,
        rating: 4.9,
        description: 'Перша частина епічної фентезійної трилогії про пригоди хоббіта Фродо, який вирушає у небезпечну подорож, щоб знищити могутнє кільце.',
        image: '/images/LordoftheRing1.jpg' 
    },
];

async function initializeBooks() {
    try {
        const count = await Book.countDocuments();
        if (count === 0) {
            await Book.insertMany(initialBooks);
            console.log('Початкові книги додано до бази даних.');
        } else {
            console.log('База даних вже містить книги. Початкові дані не додавалися.');
        }
    } catch (error) {
        console.error('Помилка ініціалізації книг:', error);
    }
}

initializeBooks();


const generateToken = (id, role = 'user') => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '1h', 
    });
};

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/images', express.static(path.join(__dirname, 'public/images')));


app.get('/api/books', async (req, res) => {
    try {
        console.log('Отримано запит до /api/books. Параметри:', req.query);
        const { search, genre, year, sortBy, sortOrder } = req.query;

        let query = {};
        let sort = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } }
            ];
        }

        if (genre) {
            query.genre = genre;
        }

        if (year) {
            if (year.includes('-')) {
                const [startYear, endYear] = year.split('-').map(Number);
                query.year = { $gte: startYear, $lte: endYear };
            } else {
                query.year = parseInt(year);
            }
        }

        let sortField = sortBy || 'title';
        let order = sortOrder === 'desc' ? -1 : 1;

        const validSortFields = ['title', 'author', 'year', 'rating', 'pages'];
        if (!validSortFields.includes(sortField)) {
            sortField = 'title';
        }
        
        sort[sortField] = order;

        const books = await Book.find(query).sort(sort);

        res.json(books);
    } catch (err) {
        console.error("Помилка сервера при отриманні книг (фільтрація/сортування):", err);
        res.status(500).send('Помилка сервера при отриманні книг');
    }
});

app.get('/api/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (book) {
            res.json(book);
        } else {
            res.status(404).send('Книгу не знайдено');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Помилка сервера при отриманні книги');
    }
});


app.post('/api/books', upload.single('image'), async (req, res) => {
    const { title, author, year, genre, pages, rating, description } = req.body;

    const imagePath = req.file ? `/images/${req.file.filename}` : '/images/placeholder.jpg'; 

    try {
        const newBook = new Book({
            title,
            author,
            year: parseInt(year),
            genre,
            pages: parseInt(pages),
            rating: parseFloat(rating),
            description: description || 'Опис відсутній.',
            image: imagePath 
        });
        await newBook.save();
        res.status(201).json(newBook);
    } catch (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: `Помилка завантаження файлу: ${err.message}` });
        }
        console.error(err);
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ message: 'Помилка валідації', errors });
        }
        res.status(500).send('Помилка сервера при додаванні книги');
    }
});


app.put('/api/books/:id', upload.single('image'), async (req, res) => {
    const bookId = req.params.id;
    const { title, author, year, genre, pages, rating, description } = req.body; 

    let imagePath;
    let oldImagePath;

    try {
        const existingBook = await Book.findById(bookId);
        if (!existingBook) {
            return res.status(404).send('Книгу не знайдено');
        }

        oldImagePath = existingBook.image;

        if (req.file) {

            imagePath = `/images/${req.file.filename}`;

            if (oldImagePath && oldImagePath !== '/images/placeholder.jpg') {
                const fullOldImagePath = path.join(__dirname, 'public', oldImagePath);
                if (fs.existsSync(fullOldImagePath)) {
                    fs.unlink(fullOldImagePath, (err) => {
                        if (err) console.error("Помилка видалення старого файлу зображення:", err);
                        else console.log(`Старий файл ${oldImagePath} успішно видалено.`);
                    });
                }
            }
        } else if (req.body.image && req.body.image !== existingBook.image) {
            imagePath = req.body.image;
            if (oldImagePath && oldImagePath !== '/images/placeholder.jpg') {
                 const fullOldImagePath = path.join(__dirname, 'public', oldImagePath);
                 if (fs.existsSync(fullOldImagePath)) {
                    fs.unlink(fullOldImagePath, (err) => {
                        if (err) console.error("Помилка видалення старого файлу зображення при зміні через URL:", err);
                        else console.log(`Старий файл ${oldImagePath} успішно видалено через зміну URL.`);
                    });
                 }
            }
        } else {

            imagePath = existingBook.image;
        }

        const updatedBook = await Book.findByIdAndUpdate(
            bookId,
            { 
                title, 
                author, 
                year: parseInt(year), 
                genre, 
                pages: parseInt(pages), 
                rating: parseFloat(rating), 
                description, 
                image: imagePath 
            },
            { new: true, runValidators: true } 
        );

        res.json(updatedBook);

    } catch (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: `Помилка завантаження файлу: ${err.message}` });
        }
        console.error(err);
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ message: 'Помилка валідації', errors });
        }
        res.status(500).send('Помилка сервера при оновленні книги');
    }
});



app.delete('/api/books/:id', async (req, res) => {
    const bookId = req.params.id;

    try {
        const bookToDelete = await Book.findById(bookId);
        if (!bookToDelete) {
            return res.status(404).send('Книгу не знайдено');
        }

        if (bookToDelete.image && bookToDelete.image !== '/images/placeholder.jpg') {
            const imageFullPath = path.join(__dirname, 'public', bookToDelete.image);
            

            if (fs.existsSync(imageFullPath)) {
                fs.unlink(imageFullPath, (err) => {
                    if (err) {
                        console.error(`Помилка видалення файлу зображення ${imageFullPath}:`, err);
                    } else {
                        console.log(`Файл ${imageFullPath} успішно видалено.`);
                    }
                });
            } else {
                console.log(`Файл ${imageFullPath} не існує, пропущено видалення.`);
            }
        }

        const deletedBook = await Book.findByIdAndDelete(bookId);

        res.status(204).send();

    } catch (err) {
        console.error(err);
        res.status(500).send('Помилка сервера при видаленні книги');
    }
});



app.post('/api/auth/register', async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Будь ласка, введіть ім\'я користувача та пароль.' });
    }

    try {

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Користувач з таким ім\'ям вже існує.' });
        }

        const user = new User({ username, password });
        await user.save();

        const token = generateToken(user._id, user.role || 'user'); 

        res.status(201).json({
            _id: user._id,
            username: user.username,
            role: user.role || 'user',
            token: token,
            message: 'Реєстрація успішна!'
        });

    } catch (error) {
        console.error('Помилка реєстрації:', error);
        res.status(500).json({ message: 'Помилка сервера під час реєстрації.' });
    }
});


app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Невірні облікові дані.' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Невірні облікові дані.' });
        }

        const token = generateToken(user._id, user.role || 'user');

        res.json({
            _id: user._id,
            username: user.username,
            role: user.role || 'user',
            token: token,
            message: 'Вхід успішний!'
        });

    } catch (error) {
        console.error('Помилка входу:', error);
        res.status(500).json({ message: 'Помилка сервера під час входу.' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер працює на порту ${PORT}`);
    console.log(`Відкрийте в браузері: http://localhost:${PORT}`);
});