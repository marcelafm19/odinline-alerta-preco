let usuario = JSON.parse(localStorage.getItem("usuarioAutenticado"));

function alertaPreco() {
    if (!usuario) {
        alert("Faça login primeiro!");
        window.location.href = "login.html";
        return;
    }
    window.location.href = "telaalerta.html";          
}

function minhaCompras() {
    if (!usuario) {
        alert("Faça login primeiro!");
        window.location.href = "login.html";
        return;
    }
    window.location.href = "telacompras.html";          
}

function fazerLogout() {
    localStorage.removeItem("usuarioAutenticado");
    localStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
}