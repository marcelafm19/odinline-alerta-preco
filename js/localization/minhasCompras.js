// Função para exibir as compras cadastradas
function exibirCompras() {
    let compras = JSON.parse(localStorage.getItem("compras")) || [];
    let tabelaBody = $("#tabelaCompras tbody");
    tabelaBody.empty(); // Limpa a tabela antes de adicionar as compras

    if (compras.length > 0) {
        compras.forEach(compra => {
            let linha = `<tr>
                            <td>${compra.produto}</td>
                            <td>${compra.quantidade}</td>
                            <td>${compra.valor}</td>
                            <td>${compra.data}</td>
                            <td><button class="btn btn-danger btn-sm" onclick="removerCompra('${compra.produto}')">Remover</button></td>
                        </tr>`;
            tabelaBody.append(linha);
        });
    } else {
        tabelaBody.append('<tr><td colspan="5" class="text-center">Nenhuma compra registrada.</td></tr>');
    }
}

// Função para adicionar uma nova compra
function adicionarCompra() {
    let produto = $("#produtoCompra").val();
    let quantidade = $("#quantidade").val();
    let valor = $("#valorCompra").val();

    // Validação dos campos
    if (produto && quantidade && valor) {
        // Verifica se o valor do produto é um número
        if (isNaN(valor)) {
            alert("O valor deve ser um número válido.");
            return;
        }

        // Cria um objeto para a compra
        let compra = {
            produto: produto,
            quantidade: quantidade,
            valor: valor,
            data: new Date().toLocaleDateString() // Data da compra
        };

        // Recupera as compras do localStorage
        let compras = JSON.parse(localStorage.getItem("compras")) || [];

        // Adiciona a nova compra
        compras.push(compra);

        // Salva as compras no localStorage
        localStorage.setItem("compras", JSON.stringify(compras));

        // Exibe a tabela atualizada
        exibirCompras();

        // Limpa os campos do formulário
        $("#produtoCompra").val("");
        $("#quantidade").val("");
        $("#valorCompra").val("");
    } else {
        alert("Por favor, preencha todos os campos.");
    }
}

// Função para remover uma compra
function removerCompra(produto) {
    let compras = JSON.parse(localStorage.getItem("compras")) || [];

    // Filtra as compras removendo a compra com o produto
    compras = compras.filter(compra => compra.produto !== produto);

    // Atualiza o localStorage com a lista de compras restante
    localStorage.setItem("compras", JSON.stringify(compras));

    // Atualiza a tabela
    exibirCompras();
}
