const { json } = require('express');
let { banco, contas, saques, depositos, transferencias } = require('../bancodedados.js');
const { format } = require('date-fns');

const contasBanco = async function (req, res) {
    const { senha_banco } = req.query;

    if (!senha_banco) {
        return res.status(400).json({ mensagem: 'A senha do banco é obrigatório' })
    };
    if (senha_banco != banco.senha) {
        return res.status(403).json({ mensagem: 'A senha do banco informada é inválida!' })
    };

    return res.status(200).send();
};

const criarConta = async function (req, res) {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    if (!nome) {
        return res.status(400).json({ mensagem: 'O nome é obrigatório!' })
    };
    if (!cpf) {
        return res.status(400).json({ mensagem: 'O cpf é obrigatório!' })
    };
    if (!data_nascimento) {
        return res.status(400).json({ mensagem: 'A data de nascimento é obrigatória!' })
    };
    if (!telefone) {
        return res.status(400).json({ mensagem: 'O telefone é obrigatório!' })
    };
    if (!email) {
        return res.status(400).json({ mensagem: 'O email é obrigatório!' })
    };
    if (!senha) {
        return res.status(400).json({ mensagem: 'A senha é obrigatória!' })
    };
    if (contas.find(contas => telefone === contas.usuario.telefone)) {
        return res.status(403).json({ mensagem: 'Já existe uma conta com o telefone informado!' })
    }
    if (contas.find(contas => cpf === contas.usuario.cpf)) {
        return res.status(403).json({ mensagem: 'Já existe uma conta com o cpf informado!' })
    }
    if (contas.find(contas => email === contas.usuario.email)) {
        return res.status(403).json({ mensagem: 'Já existe uma conta com o email informado!' })
    }

    const ultimaConta = contas[contas.length - 1]
    const novaConta = {
        numero: ultimaConta.numero + 1,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha,
        }
    };
    contas.push(novaConta);
    return res.status(201).send();
};

const atualizarConta = async function (req, res) {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const { numeroConta } = req.params;

    if (!nome) {
        return res.status(400).json({ mensagem: 'O nome é obrigatório!' })
    };
    if (!cpf) {
        return res.status(400).json({ mensagem: 'O cpf é obrigatório!' })
    };
    if (!data_nascimento) {
        return res.status(400).json({ mensagem: 'A data de nascimento é obrigatória!' })
    };
    if (!telefone) {
        return res.status(400).json({ mensagem: 'O telefone é obrigatório!' })
    };
    if (!email) {
        return res.status(400).json({ mensagem: 'O email é obrigatório!' })
    };
    if (!senha) {
        return res.status(400).json({ mensagem: 'A senha é obrigatória!' })
    };

    if (conta.usuario.cpf !== cpf) {
        return res.status(403).json({ mensagem: 'CPF da conta não é original' });
    }

    if (contas.find(contas => cpf === contas.usuario.cpf && cpf === contas.usuario.cpf)) {
        return res.status(403).json({ mensagem: 'Já existe uma conta com o cpf informado!' })
    }

    if (conta.usuario.email !== email) {
        return res.status(403).json({ mensagem: 'Email da conta não é original' });
    }

    if (contas.find(contas => email === contas.usuario.email && email === contas.usuario.email)) {
        return res.status(403).json({ mensagem: 'Já existe uma conta com o email informado!' })
    }

    contas[numeroConta].usuario.cpf = cpf
    contas[numeroConta].usuario.telefone = telefone
    contas[numeroConta].usuario.email = email

    return res.status(201).send();
};

const excluirConta = async function (req, res) {
    const { numeroConta } = req.params;

    if (!contas[numeroConta]) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada!' })
    }
    if (contas[numeroConta].saldo !== 0) {
        return res.status(403).json({ mensagem: 'Conta bancária não pode ser excluida quando tiver saldo!' })
    }

    contas = contas.filter(function (conta) {
        return conta.numero !== Number(numeroConta);
    });

    return res.status(204).send();
};

const depositar = async function (req, res) {
    const { numeroConta, valor } = req.body;
    if (!numeroConta) {
        return res.status(400).json({ mensagem: 'É necessário digitar o número da conta' })
    }
    if (!valor) {
        return res.status(400).json({ mensagem: 'É necessário informar o valor a ser depositado' })
    }
    if (!contas[numeroConta]) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada!' })
    }
    if (valor <= 0) {
        return res.status(403).json({ mensagem: 'O Valor do depósito não pode ser igual ou menor que 0 centavos!' })
    }
    contas[numeroConta].saldo += valor;
    const deposito = {
        data: format(new Date(), "dd/MM/yyyy' 'H'h':m'm':s's'"),
        numeroConta: numeroConta,
        valor: valor
    };
    depositos.push(deposito);
    return res.status(201).send();

};

const sacar = async function (req, res) {
    const { numeroConta, valor, senha } = req.body;
    if (!numeroConta) {
        return res.status(400).json({ mensagem: 'É necessário digitar o número da conta' })
    }
    if (!valor) {
        return res.status(400).json({ mensagem: 'É necessário informar o valor a ser sacado' })
    }
    if (!senha) {
        return res.status(400).json({ mensagem: 'É necessário informar a senha para sacar!' })
    }
    if (!contas[numeroConta]) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada!' })
    }
    if (senha != contas[numeroConta].usuario.senha) {
        return res.status(403).json({ mensagem: 'Senha incorreta!' })
    }
    if (valor > contas[numeroConta].saldo) {
        return res.status(403).json({ mensagem: 'Você não tem saldo suficiente' })
    };

    contas[numeroConta].saldo -= valor;

    const saque = {
        data: format(new Date(), "dd/MM/yyyy' 'H'h':m'm':s's'"),
        numeroConta: numeroConta,
        valor: valor
    };
    saques.push(saque);

    return res.status(201).send();

};

const transferir = async function (req, res) {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (numero_conta_origem === numero_conta_destino) {
        return res.status(400).json({ mensagem: 'Você não pode transferir para você mesmo!' });
    };
    if (!valor) {
        return res.status(400).json({ mensagem: 'É necessário informar o valor a ser transferido!' });
    };
    if (!senha) {
        return res.status(400).json({ mensagem: 'É necessário informar a senha para transferir!' });
    };
    if (!numero_conta_destino) {
        return res.status(400).json({ mensagem: 'É necessário informar a conta do destinatário para transferir!' });
    };
    if (!numero_conta_origem) {
        return res.status(400).json({ mensagem: 'É necessário informar a conta do mandante para transferir!' });
    };
    if (!contas[numero_conta_origem]) {
        return res.status(400).json({ mensagem: 'Conta bancária não encontrada!' });
    };
    if (!contas[numero_conta_destino]) {
        return res.status(404).json({ mensagem: 'Conta bancária do destinatário não encontrada!' });
    };
    if (senha != contas[numero_conta_origem].usuario.senha) {
        return res.status(403).json({ mensagem: 'Senha incorreta!' });
    };
    if (valor > contas[numero_conta_origem].saldo) {
        return res.status(403).json({ mensagem: 'Você não tem saldo suficiente para transferir' });
    };
    contas[numero_conta_origem].saldo -= valor;
    contas[numero_conta_destino].saldo += valor;

    const transferencia = {
        data: format(new Date(), "dd/MM/yyyy' 'H'h':m'm':s's'"),
        numero_conta_origem,
        numero_conta_destino,
        valor
    };
    transferencias.push(transferencia);
    return res.status(201).send();

};

const saldo = async function (req, res) {
    const { numero_conta, senha } = req.query;

    const nConta = Number(numero_conta);

    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'É necessário informar o número da conta para ver o saldo!' });
    };
    if (!contas[numero_conta]) {
        return res.status(400).json({ mensagem: 'Conta bancária não encontrada!' });
    };
    if (!senha) {
        return res.status(400).json({ mensagem: 'É necessário informar a senha para ver o saldo!' });
    };
    if (senha != contas[nConta].usuario.senha) {
        return res.status(403).json({ mensagem: 'Senha incorreta!' });
    };

    return res.status(200).json({ Saldo: contas[numero_conta].saldo })

};

const extrato = async function (req, res) {
    const { numero_conta, senha } = req.query;
    const nConta = Number(numero_conta);

    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'É necessário informar o número da conta para ver o extrato!' });
    };
    if (!contas[numero_conta]) {
        return res.status(400).json({ mensagem: 'Conta bancária não encontrada!' });
    };
    if (!senha) {
        return res.status(400).json({ mensagem: 'É necessário informar a senha para ver o extrato!' });
    };
    if (senha != contas[nConta].usuario.senha) {
        return res.status(403).json({ mensagem: 'Senha incorreta!' });
    };

    const deposito = depositos.filter(function (depositos) {
        return depositos.numeroConta == nConta;
    });
    const saque = saques.filter(function (saques) {
        return saques.numeroConta == nConta;
    });
    const transferenciasEnviadas = transferencias.filter(function (transf) {
        return transf.numero_conta_origem == nConta;
    });
    const transferenciasRecebidas = transferencias.filter(function (transf) {
        return transf.numero_conta_destino == nConta;
    });

    const extrato = {
        deposito,
        saque,
        transferenciasRecebidas,
        transferenciasEnviadas
    };


    return res.status(201).json(extrato)
};

module.exports = {
    contasBanco,
    criarConta,
    atualizarConta,
    excluirConta,
    depositar,
    sacar,
    transferir,
    saldo,
    extrato
};