import express from 'express';
import mongoose from 'mongoose';
import regScheme from './schema';
import bodyParser from 'body-parser';
import config from './config/database';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.locals.error = '';
app.locals.successful = '';

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

mongoose.connect(config.database, {useNewUrlParser: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('we are connected');
});

let Model = mongoose.model('Model', regScheme);

function checkValidation(users, email, password, reppssword) {
  users.filter(checkemail => checkemail.email != email);
  password === reppssword && password != '' && email != '' && reppssword != '';
}

app.post('/registration', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const reppssword = req.body.reppssword;
  Model.find(async (err, users) => {
    if (err) return console.error(err);
    if (checkValidation(users, email, password, reppssword)) {
      let newuser = new Model({ email, password});
      await newuser.save((err, newuser) => {
        if (err) return console.error(err);
        app.locals.successful = 'Успешная регестрация';
      })
    } else {
      app.locals.error = 'Ошибка в регистрации, убедитесь в правильном заполненинии';
    }
    res.render('pages/signup');
  })
})

app.get('/', (req, res) => {
  res.render('pages/index');
})

app.get('/signup', (req, res) => {
  res.render('pages/signup');
})

app.get('/signin', (req, res) => {
  res.render('pages/signin');
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
