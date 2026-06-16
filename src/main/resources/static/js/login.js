const form = document.getElementById("login-form");
const mensagem = document.getElementById("mensagem");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const identificador = document.getElementById("identificador").value;
    const senha = document.getElementById("senha").value;

    if (identificador === "" || senha === "") {
        mensagem.textContent = "Preencha todos os campos.";
        mensagem.style.color = "red";
        return;
    }

    const dadosLogin = {
        identificadorLogin: identificador,
        senhaPura: senha
    };

    fetch("/usuarios/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosLogin)
    })
    .then(async response => {
        if (response.ok) {
            const usuarioLogado = await response.json();

            mensagem.textContent = "Login realizado com sucesso!";
            mensagem.style.color = "green";

            localStorage.setItem("usuarioId", usuarioLogado.id);
            localStorage.setItem("usuarioIdentificador", usuarioLogado.identificadorLogin);

            setTimeout(() => {
                window.location.href = "gestao.html";
            }, 1500);
        } else {
            mensagem.textContent = "Usuário ou senha incorretos.";
            mensagem.style.color = "red";
        }
    })
    .catch(error => {
        console.error("erro na requisicao:", error);
        mensagem.textContent = "Erro ao conectar com o servidor.";
        mensagem.style.color = "red";
    });
});
