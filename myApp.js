var express = require('express');
var bodyParser = require('body-parser');
var app = express();
require('dotenv').config();

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});
const htmlPath = __dirname + '/views/index.html';
app.get('/', (req, res) => {
  res.sendFile(htmlPath);
});
const mw = express.static(__dirname + '/public');
app.use('/public', mw);
app.get('/json', (req, res) => {
  const msg = process.env.MESSAGE_STYLE === "uppercase" ? "HELLO JSON" : "Hello json";
  res.json({ message: msg });
});
app.get('/now', (req, res, next) => {
  req.time = new Date().toString();
  next();
}, (req, res) => res.send({ time: req.time }));
app.get('/:word/echo', (req, res) => {
  res.send({ echo: req.params.word });
});
const parser = bodyParser.urlencoded({ extended: false });
app.use('/name', parser);
app.route('/name')
  .get((req, res) => {
    const [first, last] = [req.query.first, req.query.last];
    if (!first || !last) return;
    res.send({ name: `${first} ${last}` });
  })
  .post((req, res) => {
    const [first, last] = [req.body.first, req.body.last];
    if (!first || !last) return;
    res.send({ name: `${first} ${last}` });
  });
module.exports = app;
