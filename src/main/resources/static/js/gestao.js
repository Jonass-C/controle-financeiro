const nomeUsuario =
    localStorage.getItem("nomeUsuario");

if (nomeUsuario) {

    const primeiroNome =
        nomeUsuario.split(" ")[0];

    document.getElementById("usuario-nome")
        .textContent = `Olá, ${primeiroNome}`;

}

const modal = document.getElementById("modal");

const abrirModal = document.getElementById("abrir-modal");
const fecharModal = document.getElementById("fechar-modal");

const categoria = document.getElementById("categoria");
const novaCategoriaGroup = document.getElementById("nova-categoria-group");

const form = document.getElementById("form-transacao");

const tabela = document.getElementById("tabela-transacoes");

/* ABRIR MODAL */

abrirModal.addEventListener("click", function () {

    modal.style.display = "flex";

});

/* FECHAR MODAL */

fecharModal.addEventListener("click", function () {

    modal.style.display = "none";

    form.reset();

    novaCategoriaGroup.style.display = "none";

});

/* FECHAR AO CLICAR FORA */

window.addEventListener("click", function (event) {

    if (event.target === modal) {

        modal.style.display = "none";

        form.reset();

        novaCategoriaGroup.style.display = "none";

    }

});

/* NOVA CATEGORIA */

categoria.addEventListener("change", function () {

    if (categoria.value === "Adicionar categoria") {

        novaCategoriaGroup.style.display = "flex";

    } else {

        novaCategoriaGroup.style.display = "none";

    }

});

/* ADICIONAR TRANSAÇÃO */

form.addEventListener("submit", function (event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value;

    const data = document.getElementById("data").value;

    const valor = document.getElementById("valor").value;

    const tipo = document.getElementById("tipo").value;

    let categoriaValor = categoria.value;

    /* NOVA CATEGORIA */

    if (categoriaValor === "Adicionar categoria") {

        categoriaValor =
            document.getElementById("nova-categoria").value;

    }

    /* VALIDAR CAMPOS */

    if (
        nome === "" ||
        data === "" ||
        valor === ""
    ) {

        alert("Preencha todos os campos.");

        return;

    }

    /* FORMATAR DATA */

    const dataFormatada = new Date(data)
        .toLocaleDateString("pt-BR");

    /* CRIAR LINHA */

    const novaLinha = document.createElement("tr");

    novaLinha.innerHTML = `
    
        <td>${nome}</td>
        <td data-data="${data}">
            ${dataFormatada}
        </td>
        <td>${categoriaValor}</td>
        <td>${tipo}</td>
        <td>R$ ${valor}</td>

        <td>
            <button class="editar">
                Editar
            </button>

            <button class="excluir">
                Excluir
            </button>
        </td>
    
    `;

    tabela.appendChild(novaLinha);

    /* LIMPAR FORM */

    form.reset();

    novaCategoriaGroup.style.display = "none";

    /* FECHAR MODAL */

    modal.style.display = "none";

});

/* EXCLUIR TRANSAÇÃO */

tabela.addEventListener("click", function (event) {

    if (
        event.target.classList.contains("excluir")
    ) {

        const confirmar = confirm(
            "Deseja excluir esta transação?"
        );

        if (confirmar) {

            event.target
                .closest("tr")
                .remove();

        }

    }

});

/* EDITAR TRANSAÇÃO */

tabela.addEventListener("click", function (event) {

    if (
        event.target.classList.contains("editar")
    ) {

        const linha =
            event.target.closest("tr");

        const colunas =
            linha.querySelectorAll("td");

        const nome = colunas[0].textContent;

        const dataOriginal =
            colunas[1].getAttribute("data-data");

        const categoriaTexto =
            colunas[2].textContent;

        const tipo = colunas[3].textContent;

        const valor =
            colunas[4]
                .textContent
                .replace("R$ ", "");

        document.getElementById("nome").value = nome;

        document.getElementById("data").value = dataOriginal;

        document.getElementById("valor").value = valor;

        document.getElementById("tipo").value = tipo;

        document.getElementById("categoria").value =
            categoriaTexto;

        modal.style.display = "flex";

    }

});