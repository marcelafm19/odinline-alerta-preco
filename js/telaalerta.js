function cadastrar() {
    const usuarioId = localStorage.getItem("usuarioLogado");
    if (!usuarioId) {
        alert("Faça login primeiro!");
        window.location.href = "login.html";
        return;
    }

    const produtoId = document.getElementById("produto").value;
    const valor = document.getElementById("valor").value;
    const acao = document.getElementById("acao").value;

    if (!produtoId || !valor || !acao) {
        alert("Preencha todos os campos!");
        return;
    }

    const produtos = JSON.parse(localStorage.getItem("mapaProdutos")) || [];
    const produtoSelecionado = produtos.find(p => p.id === parseInt(produtoId));

    if (!produtoSelecionado) {
        alert("Produto inválido.");
        return;
    }

    const novoAlerta = {
        produto: produtoSelecionado.id,
        descricao: produtoSelecionado.descricao,
        valor: parseFloat(valor),
        acao: acao
    };

    const alertasPorUsuario = JSON.parse(localStorage.getItem("alertasPorUsuario")) || {};
    if (!alertasPorUsuario[usuarioId]) {
        alertasPorUsuario[usuarioId] = [];
    }

    if (alertasPorUsuario[usuarioId].some(a => a.produto === novoAlerta.produto)) {
        alert("Já existe um alerta para esse produto.");
        return;
    }

    alertasPorUsuario[usuarioId].push(novoAlerta);
    localStorage.setItem("alertasPorUsuario", JSON.stringify(alertasPorUsuario));
    exibirTabela();
    alert("Alerta cadastrado com sucesso!");
}

async function preencherProduto() {
    const usuario = JSON.parse(localStorage.getItem("usuarioAutenticado"));
    if (!usuario) {
        alert("Faça login primeiro!");
        window.location.href = "login.html";
        return;
    }

    const select = document.getElementById("produto");
    select.innerHTML = '<option value="" disabled selected>Selecione um Produto</option>';

    try {
        const resposta = await fetch(`https://api-odinline.odiloncorrea.com/produto/${usuario.chave}/usuario`);
        const produtos = await resposta.json();

        localStorage.setItem("mapaProdutos", JSON.stringify(produtos));

        produtos.forEach(produto => {
            const option = document.createElement("option");
            option.value = produto.id;
            option.textContent = produto.descricao;
            select.appendChild(option);
        });
    } catch (error) {
        alert("Erro ao carregar produtos.");
        console.error(error);
    }
}

function exibirTabela() {
    const usuarioId = localStorage.getItem("usuarioLogado");
    if (!usuarioId) return;

    const tabela = document.getElementById("tabela");
    const tbody = tabela.querySelector("tbody");
    tbody.innerHTML = "";

    const alertasPorUsuario = JSON.parse(localStorage.getItem("alertasPorUsuario")) || {};
    const alertas = alertasPorUsuario[usuarioId] || [];

    alertas.forEach(alerta => {
        const linha = document.createElement("tr");

        const colunaProduto = document.createElement("td");
        colunaProduto.textContent = alerta.descricao;
        linha.appendChild(colunaProduto);

        const colunaValor = document.createElement("td");
        colunaValor.textContent = alerta.valor.toFixed(2);
        linha.appendChild(colunaValor);

        const colunaAcao = document.createElement("td");
        colunaAcao.textContent = alerta.acao;
        linha.appendChild(colunaAcao);

        tbody.appendChild(linha);
    });
}

async function verificarAlertas() {
    const usuarioId = localStorage.getItem("usuarioLogado");
    if (!usuarioId) return;

    const alertasPorUsuario = JSON.parse(localStorage.getItem("alertasPorUsuario")) || {};
    const comprasPorUsuario = JSON.parse(localStorage.getItem("comprasPorUsuario")) || {};
    
    let alertas = alertasPorUsuario[usuarioId] || [];
    let compras = comprasPorUsuario[usuarioId] || [];
    const alertasRestantes = [];

    for (let alerta of alertas) {
        try {
            const resposta = await fetch(`https://api-odinline.odiloncorrea.com/produto/${alerta.produto}`);
            if (!resposta.ok) continue;

            const produto = await resposta.json();
            const valorAtual = parseFloat(produto.valor);

            if (valorAtual <= alerta.valor) {
                if (alerta.acao === "notificar") {
                    alert(`🔔 Produto "${produto.descricao}" atingiu o valor desejado: R$ ${valorAtual}`);
                } else if (alerta.acao === "comprar") {
                    const novaCompra = {
                        id: produto.id,
                        descricao: produto.descricao,
                        valor: valorAtual
                    };
                    compras.push(novaCompra);
                    alert(`✅ Compra registrada: "${produto.descricao}" por R$ ${valorAtual}`);
                }
            } else {
                alertasRestantes.push(alerta);
            }
        } catch (error) {
            console.error("Erro ao verificar alerta:", error);
            alertasRestantes.push(alerta);
        }
    }

    alertasPorUsuario[usuarioId] = alertasRestantes;
    comprasPorUsuario[usuarioId] = compras;
    
    localStorage.setItem("alertasPorUsuario", JSON.stringify(alertasPorUsuario));
    localStorage.setItem("comprasPorUsuario", JSON.stringify(comprasPorUsuario));
    exibirTabela();
}

window.onload = function () {
    if (!localStorage.getItem("usuarioLogado")) {
        window.location.href = "login.html";
        return;
    }
    exibirTabela();
    preencherProduto();
    setInterval(verificarAlertas, 10000); 
};