function exibirCompras() {
    const usuarioId = localStorage.getItem("usuarioLogado");
    if (!usuarioId) {
        alert("Faça login primeiro!");
        window.location.href = "login.html";
        return;
    }

    const comprasPorUsuario = JSON.parse(localStorage.getItem("comprasPorUsuario")) || {};
    const compras = comprasPorUsuario[usuarioId] || [];

    const tbody = document.getElementById("tabela-compras");
    tbody.innerHTML = "";

    if (compras.length === 0) {
        const linha = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 2;
        td.textContent = "Nenhuma compra registrada.";
        td.classList.add("text-center");
        linha.appendChild(td);
        tbody.appendChild(linha);
        return;
    }

    compras.forEach(compra => {
        const linha = document.createElement("tr");

        const colunaDescricao = document.createElement("td");
        colunaDescricao.textContent = compra.descricao;
        linha.appendChild(colunaDescricao);

        const colunaValor = document.createElement("td");
        colunaValor.textContent = parseFloat(compra.valor).toFixed(2);
        linha.appendChild(colunaValor);

        tbody.appendChild(linha);
    });
}

window.onload = function() {
    if (!localStorage.getItem("usuarioLogado")) {
        window.location.href = "login.html";
        return;
    }
    exibirCompras();
};