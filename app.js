const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo');
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');

/**
 * Cargar las variables de entorno del archivo .env.
 */
dotenv.config();

/**
 * Controladores.
 */
const homeController = require('./controllers/home');
const userController = require('./controllers/user');

/**
 * Configuración de Passport.
 */
const passportConfig = require('./config/passport');

/**
 * Crear el servidor de Express.
 */
const app = express();

/**
 * Conectarse a MongoDB.
 */
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
 console.error(err);
 console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
 process.exit();
});

/**
 * Configuración de Express.
 */
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended : false }));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 1209600000 }, // dos semanas
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.csrf());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Rutas principales de la aplicación.
 */
app.get('/', homeController.index);
app.get('/iniciar-sesion', userController.getLogin);
app.post('/iniciar-sesion', userController.postLogin);
app.get('/cerrar-sesion', userController.logout);

/**
 * Iniciar el servidor de Express.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d', chalk.green('✓'), app.get('port'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
