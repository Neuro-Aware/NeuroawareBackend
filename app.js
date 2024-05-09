const express = require('express');
const app = express();

const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const authRoutes = require('./API/routes/auth.routes');
const userRoutes = require('./API/routes/user.routes');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const DB_pass = process.env.DB_PASS;

const multer = require('multer');

const mongouri = `mongodb+srv://rishijain2607:${DB_pass}@auth.4icuyfv.mongodb.net/?retryWrites=true&w=majority&appName=Auth`
mongoose.connect(mongouri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Database connected!');
    })
    .catch(err => {
        console.log('Database connection failed! Server is shutting down');
        console.log(err);
        process.exit();
    });

const store = new MongoDBSession({
    uri: mongouri,
    collection: 'sessions'
});

store.on('error', function (error) {
    console.log(error);
});
// mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(cors());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: store,
    name: 'sid',
}))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});
app.use("/heartbeat", (req, res) => {
    res.send("OK");
});

app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.use((res, req, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    console.log(error);
    res.status(error.status || 500).json({
        error: {
            message: error.message
        }
    });
});

module.exports = app