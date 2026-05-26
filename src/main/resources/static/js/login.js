const form = document.getElementById("login-form");
const mensagem = document.getElementById("mensagem");

form.addEventListener("submit", function (event) {

    event.preventDefault();

    const identificador = document.getElementById("identificador").value;
    const senha = document.getElementById("senha").value;

    if (identificador === "" || senha === "") {

        mensagem.textContent = "Preencha todos os campos.";
        return;
    }

    mensagem.textContent = "Login realizado com sucesso!";
});