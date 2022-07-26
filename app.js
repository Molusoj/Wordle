const express = require('express')
const bodyparser = require('body-parser')
const engine = require('express-handlebars')
const path = require('path')
const nodemailer = require('nodemailer')

const app = express();

//View engine setup

app.engine('handlebars', engine.engine());
app.set('view engine', 'handlebars')

app.use(bodyparser.urlencoded({ extended: false}))
app.use(bodyparser.json());

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) =>{
    res.send('Hello');
});

app.listen(3000, () =>console.log('Server started'))