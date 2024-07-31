require('dotenv').config();
const express = require('express');
const path = require('path');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const connectDB = require('./connectDB');
const expressLayout = require('express-ejs-layouts');

const app = express();

// Connect to MongoDB
connectDB();

// MongoDB session store setup
const store = new MongoDBStore({
    uri: process.env.MONGODB_URL,
    databaseName: process.env.DB_NAME,
    collection: 'sessions'
});

store.on('error', function(error) {
    console.error('Session store error:', error);
});

// Middleware setup
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayout);

// EJS setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// CSRF setup
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

// Route registration
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const mainRoutes = require('./routes');


app.use(mainRoutes);
app.use('/', userRouter);
app.use('/auth', authRouter);


// Example frontend routes
app.get('/index', (req, res) => {
    res.render('Frontend/index', { layout: false });
});
app.get('/about', (req, res) => {
    res.render('Frontend/about', { layout: false });
});
app.get('/appointment', (req, res) => {
    res.render('Frontend/appointment', { layout: false });
});
app.get('/blog-single', (req, res) => {
    res.render('Frontend/blog-single', { layout: false });
});
app.get('/blog', (req, res) => {
    res.render('Frontend/blog', { layout: false });
});
app.get('/case-details', (req, res) => {
    res.render('Frontend/case-details', { layout: false });
});
app.get('/contact', (req, res) => {
    res.render('Frontend/contact', { layout: false });
});
app.get('/service-single', (req, res) => {
    res.render('Frontend/service-single', { layout: false });
});
app.get('/services', (req, res) => {
    res.render('Frontend/services', { layout: false });
});
app.get('/study-case', (req, res) => {
    res.render('Frontend/study-case', { layout: false });
});

// Error handling for 404
app.use((req, res) => {
    res.status(404).render('404', { layout: false });
});

// Error handling for other errors
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).render('500', { layout: false });
});

// Server setup
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
