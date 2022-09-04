const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
var helmet = require('helmet');
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
dotenv.config();

const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');
const myDB = process.env.DB;

mongoose.connect(myDB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

/* Limiter le nombre de requêtes */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 100 requests per windowMs
});

const app = express();

/* HTTP Request Logger */
app.use(morgan("common"));

/* Helmet pour la sécurité */
app.use(
  helmet({
    /* Middleware désactivé sinon les images ne s'affichent pas */
    crossOriginResourcePolicy: false,
  })
);

/* Ajout middleware pour autoriser les requêtes de toutes les origines */
app.use(cors());
app.use(limiter); //  Limitation du nombre de requête pour toutes les routes

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/posts', postRoutes);

module.exports = app;