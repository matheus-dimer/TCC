const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const port = 3000;
var mysql = require('mysql');
var http = require('http');
var fs = require('fs');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
    res.render('index.ejs');
})
app.get('/ficha', function (req, res) {
    res.render('sheet.ejs');
})

app.get('/login', function (req, res) {
    res.render('login.ejs')
})

app.get('/cadastro', function (req, res) {
    res.render('cadastro.ejs')
})

app.get('/personagens', function (req, res) {
    res.render('char.ejs')
})

app.get('/criar', function (req, res) {
    res.render('criar.ejs')
})

var server = app.listen(port);

console.log("Teste")