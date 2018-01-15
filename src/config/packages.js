module.exports = function (app) {

    // Get information from html forms
    var bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    // Cryptography
    app.crypt = require('bcrypt-nodejs');

    // Configure session
    var session = require('express-session');
    app.set('trust proxy', 1); // trust first proxy
    app.use(session({
        secret: 'fhljasfnjkanlouiowpqur8q9psadflknljkh',
        resave: true,
        saveUninitialized: true
    }));

    // Read cookies (needed for auth)
    var cookieParser = require('cookie-parser');
    app.use(cookieParser());

    // Excel
    app.xlsx = require('exceljs');
};