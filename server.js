const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const port = 3000;
var http = require('http');
var fs = require('fs');

const app = express();

app.set('view engine', 'ejs')

app.get('/', function (req, res) {
    res.render('index.ejs');
})
app.get('/criar', function (req, res) {
    res.render('sheet.ejs');
})

var server = app.listen(port);
console.log("Teste")