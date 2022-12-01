function calcularBonus(){
    var atributo = document.getElementsByClassName('main_atb');
    var atributos = []

    Array.from(atributo).forEach((atb) => {
        if(atributos.length >= 6){
            atributos = [];
        }
        
        var bonus = Math.floor((atb.value - 10) / 2);

        atributos.push(bonus);
        
    });
    console.log(atributos);
}