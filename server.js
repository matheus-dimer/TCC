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
    let userName = req.session.userName;
    res.render('index.ejs', { logged, idLogged, userName });
})
app.get('/ficha', function (req, res) {
    if (req.session.loggedin) {
        let logged = req.session.loggedin
        let idLogged = req.session.idLogin
        let userName = req.session.userName;
        res.render('sheet.ejs', { logged, idLogged, userName });
    }
    else {
        res.redirect('/login');
    }
})

app.get('/login', function (req, res) {
    let logged = req.session.loggedin
    let idLogged = req.session.idLogin
    let userName = req.session.userName;
    res.render('login.ejs', { logged, idLogged, userName })
})

app.post('/login', function (req, res) {
    let logged = req.session.loggedin
    let idLogged = req.session.idLogin
    let userName = req.session.userName;

    var email = req.body.email;
    var senha = req.body['senha'];

    var sql = "SELECT * FROM usuario WHERE email = ?"
    con.query(sql, [email], function (err, result) {
        if (err) throw err;
        if (result.length) {
            console.log('Email confirmado')

            var idConfirma = result[0]['id_user']


            var sql2 = "SELECT * FROM usuario WHERE senha = ? AND id_user = ?"
            con.query(sql2, [senha, idConfirma], function (err, result2) {
                if (err) throw err;

                if (result2.length) {
                    console.log("Senha confirmada")
                    req.session.loggedin = true;
                    req.session.userName = result[0]['nome'];
                    req.session.idLogin = result[0]['id_user'];
                    console.log(req.session);
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
    let userName = req.session.userName
    res.render('cadastro.ejs',
        { mensagem: "", logged, idLogged, userName }
    )
})

app.post('/cadastro', function (req, res) {
    let logged = req.session.loggedin;
    let idLogged = req.session.idLogin;
    let userName = req.session.userName;
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
        res.render('cadastro.ejs', { mensagem: "Este email já está cadastrado!", logged, idLogged, userName })


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
    if (req.session.loggedin) {
        const logged = req.session.loggedin;
        const idLogged = req.session.idLogin;
        let userName = req.session.userName;


        const sql = 'SELECT * FROM `ficha_jogador` WHERE id_user = ?'

        con.query(sql, [idLogged], (error, data) => {
            res.render('char.ejs', { logged, idLogged, userName, personagemJogador: data });
        });
    }
    else {
        res.redirect('/login');
    }

})

app.post('/personagens', function (req, res) {

    var sql = "INSERT INTO ficha_jogador (id_user, personagem, raca, classe, alinhamento, antecedente, nivel) VALUES ?"

    var values = [
        [req.session.idLogin, req.body.nomeChar, req.body.racaChar, req.body.alinChar, req.body.classChar, req.body.antChar, req.body.nivChar]
    ]

    con.query(sql, [values], function (err, result) {
        if (err) throw err;

        var select = "INSERT INTO atributos_principais (forca, destreza, constituicao, inteligencia, sabedoria, carisma) VALUES (10, 10, 10, 10, 10, 10)";

        con.query(select, function (err, returnedId) {
            if (err) throw err;
            res.redirect('/personagens');
        })
    })
})

app.get('/perfil', function (req, res) {
    if (req.session.loggedin) {
        const logged = req.session.loggedin;
        const idLogged = req.session.idLogin;
        let userName = req.session.userName;

        res.render('perfil.ejs', { logged, idLogged, userName })
    }
    else {
        res.redirect('/login');
    }
})



app.get('/logout', (req, res) => {
    req.session.destroy(function (err) {
        if (err) throw err
        res.clearCookie(sessionName)
        res.redirect('/')
    })

});

app.get('/delete/:id', function (req, res) {
    var id = req.params.id;
    var sql = "DELETE FROM atributos_principais WHERE id_ficha = ?"
    con.query(sql, id, function (err, result) {
        if (err) throw err;
        newSql = "DELETE FROM ficha_jogador WHERE id_ficha = ?"
        con.query(newSql, id, function(err, newResult){
          if (err) throw err;
        console.log("Apagado com sucesso: " + result.affectedRows)
        res.redirect('/personagens')  
        })
        
    })
})

app.get('/ficha/:id', function (req, res) {
    const logged = req.session.loggedin;
    const idLogged = req.session.idLogin;
    let userName = req.session.userName;


    var id = req.params.id;
    var sql = "SELECT * FROM ficha_jogador WHERE id_ficha = ?";



    con.query(sql, id, function (err, result) {
        console.log(result)
        if (err) throw err;

        var search = "SELECT * FROM atributos_principais WHERE id_ficha = ?"

        con.query(search, id, function (err, newResult) {
            res.render('sheet.ejs', { logged, idLogged, userName, dadosPlayer: result, dadosPrincipais: newResult })
        })


    })
})

var server = app.listen(port);

console.log("Servidor Executando")