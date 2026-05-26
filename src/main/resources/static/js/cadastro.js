const form = document.getElementById("cadastro-form");
const mensagem = document.getElementById("mensagem");

form.addEventListener("submit", function (event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const identificador = document.getElementById("identificador").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    if (
        nome === "" ||
        identificador === "" ||
        senha === "" ||
        confirmarSenha === ""
    ) {
        mensagem.textContent = "Preencha todos os campos.";
        return;
    }

    if (senha !== confirmarSenha) {
        mensagem.textContent = "As senhas não coincidem.";
        return;
    }

    mensagem.textContent = "Cadastro realizado com sucesso!";

    localStorage.setItem("nomeUsuario", nome);

    window.location.href = "gestao.html";
});