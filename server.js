const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const port = 3000;
const {validarResultado} = require('express-validator')
const {validarEmail} = require('validar')
const bodyParser = require('body-parser');
var mysql = require('mysql');
var http = require('http');
var fs = require('fs');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "diehardtcc",
    port: 3307

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

app.post('/cadastro', [validarEmail], function (req, res){

    const errors = validarResultado(req)
    if (!errors.isEmpty()){
        return res.redirect('/cadastro'({errors}))
    }

    var sql = "INSERT INTO usuario (nome, email, senha) VALUES ?"

    var values = [
        [req.body['usuario'], req.body['email'], req.body['senha']]
];

con.query(sql, [values], function (err, result){
    if (err) throw err;

    console.log("Inserção na tabela:" + result.affectedRows);
})
    res.redirect('/')
})

app.get('/personagens', function (req, res) {
    res.render('char.ejs')
})

app.get('/perfil', function (req, res) {
    res.render('perfil.ejs')
})

var server = app.listen(port);

console.log("Teste")