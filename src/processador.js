function somar(a,b){
return a + b
}

function formatarTexto(texto){
    return texto.toUpperCase();
}

const enviroment = {
    version: "1.0.0",
    production: true,


}


module.exports = {
    somar,
    formatarTexto,
    enviroment
}

