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
const marcaController = require('./controllers/marca');
const categoriaController = require('./controllers/categoria');
const productoController = require('./controllers/producto');

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
app.use((req, res, next) => {
  // Después de iniciar sesión, volver a la página que se quería visitar
  if (
    !req.user
    && req.path !== '/iniciar-sesion'
    && req.path !== '/registro'
    && !req.path.match(/\./)
  ) {
    req.session.returnTo = req.originalUrl;
  }
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
app.get('/registro', userController.getSignup);
app.post('/registro', userController.postSignup);

/**
 * Rutas para la administración de categorías.
 */
app.get('/categorias', passportConfig.isAuthenticated, passportConfig.isAdmin, categoriaController.getCategorias);
app.get('/categorias/agregar', passportConfig.isAuthenticated, passportConfig.isAdmin, categoriaController.getAddCategoria);
app.post('/categorias/agregar', passportConfig.isAuthenticated, passportConfig.isAdmin, categoriaController.postAddCategoria);
app.get('/categorias/editar/:idCategoria', passportConfig.isAuthenticated, passportConfig.isAdmin, categoriaController.getEditCategoria);
app.post('/categorias/editar/:idCategoria', passportConfig.isAuthenticated, passportConfig.isAdmin, categoriaController.postEditCategoria);
app.get('/categorias/eliminar/:idCategoria', passportConfig.isAuthenticated, passportConfig.isAdmin, categoriaController.deleteCategoria);

/**
 * Rutas para la administración de marcas.
 */
app.get('/marcas', passportConfig.isAuthenticated, passportConfig.isAdmin, marcaController.getMarcas);
app.get('/marcas/agregar', passportConfig.isAuthenticated, passportConfig.isAdmin, marcaController.getAddMarca);
app.post('/marcas/agregar', passportConfig.isAuthenticated, passportConfig.isAdmin, marcaController.postAddMarca);
app.get('/marcas/editar/:idMarca', passportConfig.isAuthenticated, passportConfig.isAdmin, marcaController.getEditMarca);
app.post('/marcas/editar/:idMarca', passportConfig.isAuthenticated, passportConfig.isAdmin, marcaController.postEditMarca);
app.get('/marcas/eliminar/:idMarca', passportConfig.isAuthenticated, passportConfig.isAdmin, marcaController.deleteMarca);

/**
 * Rutas para la administración de productos.
 */
app.get('/productos', passportConfig.isAuthenticated, passportConfig.isAdmin, productoController.getProductos);

/**
 * Iniciar el servidor de Express.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d', chalk.green('✓'), app.get('port'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
