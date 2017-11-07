const express = require('express');
const app = express();
const volleyball = require('volleyball');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
//const bodyParser = require('body-parser');
const socketio = require('socket.io');

const routes = require('./routes');
const PORT = 3000;

// nunjucks
app.set('view engine', 'html'); // have res.render work with html files
app.engine('html', nunjucks.render); // when giving html files to res.render, tell it to use nunjucks
nunjucks.configure('views', { noCache: true }); // point nunjucks to the proper directory for templates

// static routes
app.use(express.static('public'));

// body-parser
//parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));
// // parse application/json
// app.use(bodyParser.json());

// express built-in body parser
app.use(express.json());
app.use(express.urlencoded());

// logging
// volleyball
app.use(volleyball);

// morgan
app.use(morgan((token, req, res) => {
  let result = '***All request params***\n';
  for (let key in req.params) {
    result += `${key}: ${req.params[key]}\n`;
  }
  return result;
}));

// app.use((req, res, next) => {
//   // do your logging here
//   // call `next`, or else your app will be a black hole — receiving requests but never properly responding
//   console.log('logging shit');
//   next();
// });

const server = app.listen(PORT, () => console.log(`Listening to port: ${PORT}`));
const io = socketio.listen(server);

app.use('/', routes(io));
