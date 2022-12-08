const url = require('url');
const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const port = 3000;
const bodyParser = require('body-parser');
var mysql = require('mysql');
var http = require('http');
var fs = require('fs');
var session = require('express-session');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "diehardtcc",
    port: 3306

});

const {
    sessionName = "SessionLogin"
} = process.env

const app = express();

app.use(session({
    name: 'SessionLogin',
    secret: '2C44-4D44-WppQ38S',
    resave: false,
    saveUninitialized: true
}));


con.connect(function (err) {
    if (err) throw err;
    console.log("Banco conectado");
    con.end
})





app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.set('view engine', 'ejs')

app.get('/', function (req, res) {
    let logged = req.session.loggedin
    let idLogged = req.session.idLogin
    res.render('index.ejs', { logged, idLogged });
})
app.get('/ficha', function (req, res) {
    let logged = req.session.loggedin
    let idLogged = req.session.idLogin
    res.render('sheet.ejs', { logged, idLogged });
})

app.get('/login', function (req, res) {
    let logged = req.session.loggedin
    let idLogged = req.session.idLogin
    res.render('login.ejs', { logged, idLogged })
})

app.post('/login', function (req, res) {
    let logged = req.session.loggedin
    let idLogged = req.session.idLogin

    var email = req.body['email'];
    var senha = req.body['senha'];

    var sql = "SELECT * FROM usuario WHERE email = ?"
    con.query(sql, [email], function (err, result) {
        if (err) throw err;
        if (result.length) {
            console.log('Email confirmado')
            var sql2 = "SELECT * FROM usuario WHERE senha = ?"
            con.query(sql2, [senha], function (err, result2) {
                if (result2.length) {
                    console.log("Senha confirmada")
                    req.session.loggedin = true;
                    req.session.idLogin = result2[0]['nome'];
                    console.log(req.session.idLogin);
                    res.redirect('/personagens')
                    return
                }
                else {
                    res.redirect('/login')
                    return
                }
            })
        }
        else {
            res.redirect('/login')
            return
        }
    })
})

app.get('/cadastro', function (req, res) {
    let logged = req.session.loggedin
    let idLogged = req.session.idLogin
    res.render('cadastro.ejs',
        { mensagem: "", logged, idLogged }
    )
})

app.post('/cadastro', function (req, res) {
    let logged = req.session.loggedin
    let idLogged = req.session.idLogin
    email_exists(req.body['email'], function (exists) {
        var sql = "INSERT INTO usuario (nome, email, senha) VALUES ?"

        var values = [
            [req.body['usuario'], req.body['email'], req.body['senha']]
        ]
        if (!exists) {
            con.query(sql, [values], function (err, result) {
                if (err) throw err;

                console.log("Inserção na tabela:" + result.affectedRows);
            })
            res.redirect('/personagens')
            return
        }
        res.render('cadastro.ejs', { mensagem: "Este email já está cadastrado!", logged, idLogged })


    })


})

function email_exists(email, callback) {
    var sql = "SELECT email FROM usuario WHERE email = ?"

    con.query(sql, [email], function (err, result) {
        var exists = result.length > 0
        callback(exists)
    })

}

app.get('/personagens', function (req, res) {
    let logged = req.session.loggedin
    let idLogged = req.session.idLogin
    /*
    var sql = 'SELECT * FROM `ficha_jogador` WHERE id_user = ?'
    
    con.query(sql, [req.body['id_user']]);
    */
    res.render('char.ejs', { logged, idLogged })
})



app.get('/perfil', function (req, res) {
    let logged = req.session.loggedin
    let idLogged = req.session.idLogin
    res.render('perfil.ejs', { logged, idLogged })
})

app.get('/logout', (req, res) => {
    req.session.destroy(function (err) {
        if (err) throw err
        res.clearCookie(sessionName)
        res.redirect('/')
    })

});

var server = app.listen(port);

console.log("Servidor Executando")