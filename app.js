const express = require('express');
const logger = require('morgan');
const chalk = require('chalk');
const dotenv = require('dotenv');
const path = require('path');

/**
 * Cargar las variables de entorno del archivo .env.
 */
dotenv.config();

/**
 * Controladores.
 */
const homeController = require('./controllers/home');

/**
 * Crear el servidor de Express.
 */
const app = express();

/**
 * Configuración de Express.
 */
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Rutas principales de la aplicación.
 */
app.get('/', homeController.index);

/**
 * Iniciar el servidor de Express.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d', chalk.green('✓'), app.get('port'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
