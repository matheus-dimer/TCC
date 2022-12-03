function girarDado() {
    var tipoDado = Number(document.getElementById('dado-select').value);
    var quantidadeDados = Number(document.getElementById('dado-quantidade').value);
    var bonus = Number(document.getElementById('bonus').value);


    var jogadas = [];
    while (jogadas.length < quantidadeDados) {
        var value = Math.floor(Math.random() * (tipoDado) + 1);
        jogadas.push(value);
    }

    var resultado = jogadas.reduce((partialSum, a) => partialSum + a, 0) + bonus;

    var resultadoContent = jogadas.map(jogada => `${jogada} + `).join('') + `Bonus(${bonus}) = ` + resultado;

    document.getElementById('historico').innerHTML += resultadoContent + '<br/>'
}