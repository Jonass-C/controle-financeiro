const form = document.getElementById("cadastro-form");
const mensagem = document.getElementById("mensagem");

form.addEventListener("submit", function (event) {
    event.preventDefault();
    const nome = document.getElementById("nome").value;
    const identificador = document.getElementById("identificador").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    if (nome === "" || identificador === "" || senha === "" || confirmarSenha === "") {
        mensagem.textContent = "Preencha todos os campos.";
        mensagem.style.color = "red";
        return;
    }

    if (senha !== confirmarSenha) {
        mensagem.textContent = "As senhas não coincidem.";
        mensagem.style.color = "red";
        return;
    }

    if (senha !== confirmarSenha) {
            mensagem.textContent = "As senhas não coincidem.";
            mensagem.style.color = "red";
            return;
    }

    const dadosCadastro = {
            nome: nome,
            identificadorLogin: identificador,
            senhaPura: senha,
            confirmacaoSenha: confirmarSenha
    };

    fetch("/usuarios/cadastro", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosCadastro)
    })
    .then(async response => {
        if (response.ok) {
            const textoSucesso = await response.text();
            mensagem.textContent = textoSucesso;
            mensagem.style.color = "green";
            form.reset();
            setTimeout(() => {
                window.location.href = "index.html";
            }, 2000);
        } else {
            //const textoErro = await response.text();
            //mensagem.textContent = textoErro || "Erro ao realizar cadastro.";

            // mudanca aqui: le o erro como json para extrair a mensagem limpa
            const erroJson = await response.json();
            // pega apenas o detail do erro do spring boot
            const mensagemLimpa = erroJson.detail || "Erro ao realizar cadastro.";
            mensagem.textContent = mensagemLimpa;
            mensagem.style.color = "red";
        }
    })
    .catch(error => {
        console.error("erro na requisicao:", error);
        mensagem.textContent = "Erro ao conectar com o servidor.";
        mensagem.style.color = "red";
    });
});

document.querySelectorAll("img").forEach(function(img){
    img.addEventListener("contextmenu", function(e){
        e.preventDefault();
    });
});