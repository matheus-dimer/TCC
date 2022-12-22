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
const { check } = require('express-validator');

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
        var checkChars = false


        const sql = 'SELECT * FROM `ficha_jogador` WHERE id_user = ?'

        con.query(sql, [idLogged], (error, data) => {
            if (data.length > 0) {
                checkChars = true;
                res.render('char.ejs', { logged, idLogged, userName, personagemJogador: data, checkChars });
            }
            else {
                checkChars = false;
                res.render('char.ejs', { logged, idLogged, userName, personagemJogador: data, checkChars });

            }

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

        res.render('perfil.ejs', { logged, idLogged, userName, message: '' })
    }
    else {
        res.redirect('/login');
    }
})

app.post('/change-user/', function (req, res) {
    if (req.session.loggedin) {
        const logged = req.session.loggedin;
        const idLogged = req.session.idLogin;
        let userName = req.session.userName;


        var sql = "UPDATE usuario SET nome = ? WHERE id_user = ?"

        con.query(sql, [req.body.novoUser, idLogged], function (err, result) {
            if (err) throw err;

            var select = "SELECT * FROM usuario where id_user = ?"

            con.query(select, idLogged, function (err, queryReturn) {

                req.session.userName = queryReturn[0]['nome']
                res.redirect('/perfil');
            })




        })
    }
})

app.post('/change-pswd', function (req, res) {
    if (req.session.loggedin) {
        const logged = req.session.loggedin;
        const idLogged = req.session.idLogin;
        let userName = req.session.userName;

        var verSql = "SELECT * FROM usuario WHERE id_user = ?"
        con.query(verSql, idLogged, function (err, checkReturn) {
            if (err) throw err;
            if (checkReturn[0]['senha'] == req.body.senhaVelha) {
                var updateSql = "UPDATE usuario SET senha = ? where id_user = ?"
                con.query(updateSql, [req.body.senhaNova, idLogged], function (err, updateResult) {
                    res.redirect('/perfil')
                })
            }
            else {
                res.render('perfil.ejs', { logged, idLogged, userName, message: 'Senha atual inválida' })
            }

        })
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
        con.query(newSql, id, function (err, newResult) {
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

    if (req.session.loggedin) {

        var check = "SELECT * FROM ficha_jogador WHERE id_ficha = ? AND id_user = ?"

        con.query(check, [id, idLogged], function (err, checkResult) {
            if (err) throw err;

            if (checkResult.length > 0) {
                var sql = "SELECT * FROM ficha_jogador WHERE id_ficha = ?";



                con.query(sql, id, function (err, result) {
                    console.log(result)
                    if (err) throw err;

                    var search = "SELECT * FROM atributos_principais WHERE id_ficha = ?"

                    con.query(search, id, function (err, newResult) {
                        res.render('sheet.ejs', { logged, idLogged, userName, dadosPlayer: result, dadosPrincipais: newResult })
                    })


                })
            }
            else {
                res.redirect('/personagens')
            }

        })
    }

})

app.post('/ficha/:id', function (req, res) {
    const logged = req.session.loggedin;
    const idLogged = req.session.idLogin;
    let userName = req.session.userName;

    if (logged) {
        var id = req.params.id;

        var sql = "UPDATE ficha_jogador SET personagem = ?, raca = ?, classe = ?, alinhamento = ?, antecedente = ?, nivel = ? WHERE id_ficha = ?"

        var values = [
            [req.body.nomePer],
            [req.body.raceSel],
            [req.body.antecedenteSel],
            [req.body.classSel],
            [req.body.alignSel],
            [req.body.levelSel],
            [id]
        ]

        con.query(sql, values, function (err, result) {
            if (err) throw err;

            var queryUpdate = "UPDATE atributos_principais SET forca = ?, destreza = ?, constituicao = ?, inteligencia = ?, sabedoria = ?, carisma = ? , iniciativa = ?, ca = ?, prof = ?, pv_atual = ?, pv_total = ?, percepcao = ? WHERE id_ficha = ?"

            var lastValues = [
                [req.body.forca],
                [req.body.destreza],
                [req.body.constituicao],
                [req.body.inteligencia],
                [req.body.sabedoria],
                [req.body.carisma],
                [req.body.inic],
                [req.body.ca],
                [req.body.prof],
                [req.body.pva],
                [req.body.pv],
                [req.body.sab_p],
                [id]

            ]

            con.query(queryUpdate, lastValues, function (err, lastResult) {
                res.redirect('/personagens')
            })
        })
    }
    else {
        res.redirect('/login')
    }


})

var server = app.listen(port);

console.log("Servidor Executando")