import express from 'express';

const host = '0.0.0.0';
const porta = 3000;

const server = express(); 


server.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Calculadora de Reajuste Salarial</title>
        <style>
            body {
                font-family: times new roman, serif;
                margin: 20px;
                background-color: #f0f0f0;
                }
            u {
                text-decoration: underline;
                color: blue;
                }
                </style>
    </head>
    <body>
        <h1>Calculadora de Reajuste Salarial</h1>
        <h3> Por favor, insira as informações na URL para calcular o reajuste salarial.</h3>
        <p>Exemplo de URL: <u>http://localhost:3000/calculadora?idade=18&sexo=F&salario_base=1700&anoContratacao=2014&matricula=12345</u></p>

    </body>
    </html>
    `);
});

server.get('/calculadora', (req, res) => {

    const idade = req.query.idade;
    const sexo = req.query.sexo;
    const salario_base = req.query.salario_base;
    const anoContratacao = req.query.anoContratacao;
    const matricula = req.query.matricula;

    if (!idade || !sexo || !salario_base || !anoContratacao || !matricula) {

        res.write(`
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <title>Erro</title>
            </head>
            <body>
                <h1>Erro</h1>
                <p>Informe os dados corretamente na URL.</p>
                <p>
                http://localhost:3000/calculadora?idade=18&sexo=F&salario_base=1700&anoContratacao=2014&matricula=12345
                </p>
            </body>
            </html>
        `);

         res.end();
    }

    const idadeNum = parseInt(idade);
    const salarioNum = parseFloat(salario_base);
    const anoNum = parseInt(anoContratacao);
    const matriculaNum = parseInt(matricula);

    if (isNaN(idadeNum) || idadeNum < 16 || idadeNum > 99) {
    res.write(`
        <h1>Erro</h1>
        <p>Idade inválida! Informe uma idade entre 16 e 99 anos.</p>
    `);
    return res.end();
}

// Sexo inválido
if (sexo !== "M" && sexo !== "F") {
    res.write(`
        <h1>Erro</h1>
        <p>Sexo inválido! Informe apenas M ou F.</p>
    `);
    return res.end();
}

// Salário inválido
if (isNaN(salarioNum) || salarioNum <= 0) {
    res.write(`
        <h1>Erro</h1>
        <p>Salário inválido! Informe um valor maior que zero.</p>
    `);
    return res.end();
}

// Ano de contratação inválido
const anoAtual = new Date().getFullYear();

if (isNaN(anoNum) || anoNum > anoAtual || anoNum < 1960) {
    res.write(`
        <h1>Erro</h1>
        <p>Ano de contratação inválido!</p>
    `);
    return res.end();
}

// Matrícula inválida
if (isNaN(matriculaNum) || matriculaNum <= 0) {
    res.write(`
        <h1>Erro</h1>
        <p>Matrícula inválida! Informe apenas números positivos.</p>
    `);
    return res.end();
}

    let reajuste = 0;
    let desconto = 0;
    let acrescimo = 0;

    const tempoEmpresa = anoAtual - anoNum;

    // 16 a 39 anos
    if (idadeNum >= 16 && idadeNum <= 39) {

        if (sexo == "M") {
            reajuste = 0.10;
            if (tempoEmpresa <= 10) desconto = 10;
            else acrescimo = 17;
        } else {
            reajuste = 0.08;
            if (tempoEmpresa <= 10) desconto = 11;
            else acrescimo = 16;
        }

    }
    // 40 a 69 anos
    else if (idadeNum >= 40 && idadeNum <= 69) {

        if (sexo == "M") {
            reajuste = 0.08;
            if (tempoEmpresa <= 10) desconto = 5;
            else acrescimo = 15;
        } else {
            reajuste = 0.10;
            if (tempoEmpresa <= 10) desconto = 7;
            else acrescimo = 14;
        }

    }
    // 70 a 99 anos
    else if (idadeNum >= 70 && idadeNum <= 99) {

        if (sexo == "M") {
            reajuste = 0.15;
            if (tempoEmpresa <= 10) desconto = 15;
            else acrescimo = 13;
        } else {
            reajuste = 0.17;
            if (tempoEmpresa <= 10) desconto = 17;
            else acrescimo = 12;
        }
    }

    const salarioFinal = salarioNum + (salarioNum * reajuste) - desconto + acrescimo;

    res.write(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <title>Resultado</title>
        </head>
        <body>
            <h1>Dados recebidos com sucesso!</h1>
            <p>Idade: ${idade}</p>
            <p>Sexo: ${sexo}</p>
            <p>Salário Base: R$ ${salarioNum.toFixed(2)}</p>
            <p>Ano de Contratação: ${anoContratacao}</p>
            <p>Tempo de Empresa: ${tempoEmpresa} anos</p>
            <p>Matrícula: ${matricula}</p>
            <hr>
            <h2 style="color: green;">
                Salário Reajustado: R$ ${salarioFinal.toFixed(2)}
            </h2>
        </body>
        </html>
    `);

    res.end();

});

server.listen(porta, host, () => {
    console.log(`Servidor escutando em http://${host}:${porta}`);
        });
