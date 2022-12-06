const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const port = 3000;
const bodyParser = require('body-parser');
var mysql = require('mysql');
var http = require('http');
var fs = require('fs');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tcc"

})

con.connect(function (err) {
    if (err) throw err;
    console.log("Banco conectado");
    con.end
})

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

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

app.post('/cadastro', function (req, res){
    console.log(req.body);
    res.write("teste");
    res.write(req.body['usuario']);
    res.write(req.body['email']);
    res.write(req.body['senha']);
})

app.get('/personagens', function (req, res) {
    res.render('char.ejs')
})

app.get('/perfil', function (req, res) {
    res.render('perfil.ejs')
})

var server = app.listen(port);

console.log("Teste")