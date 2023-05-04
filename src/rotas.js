const express = require('express');
const rotas = express();
const { contasBanco, criarConta, atualizarConta, excluirConta, depositar, sacar, transferir, saldo, extrato } = require('./controladores/controladores');


rotas.get('/contas', contasBanco);
rotas.post('/contas', criarConta);
rotas.put('/contas/:numeroConta/usuario', atualizarConta);
rotas.delete('/contas/:numeroConta', excluirConta);
rotas.post('/transacoes/depositar', depositar);
rotas.post('/transacoes/sacar', sacar);
rotas.post('/transacoes/transferir', transferir);
rotas.get('/contas/saldo', saldo);
rotas.get('/contas/extrato', extrato);

module.exports = rotas;
