let fp;
let linhaEditando = null;
let linhaExcluir = null;
const nomeUsuario = localStorage.getItem("nomeUsuario");
const modal = document.getElementById("modal-transacao");
const modalExcluir = document.getElementById("modal-excluir");
const abrir = document.getElementById("abrir-modal");
const cancelar = document.getElementById("cancelar");
const categoria = document.getElementById("categoria");
const novaCategoria = document.getElementById("nova-categoria");
const btnSimExcluir = document.getElementById("sim-excluir");
const btnNaoExcluir = document.getElementById("nao-excluir");
const modalDescricao = document.getElementById("modal-descricao");
const textoDescricao = document.getElementById("texto-descricao");
const fecharDescricao = document.getElementById("fechar-descricao");
const form = document.getElementById("form-transacao");
const modalDashboard = document.getElementById("modal-dashboard");
const abrirDashboard = document.getElementById("abrir-dashboard");
const usuarioBtn = document.getElementById("usuario-btn");
const menuUsuario = document.getElementById("menu-usuario");

if(nomeUsuario){
    const primeiroNome = nomeUsuario.split(" ")[0];
    document.getElementById("usuario-nome").textContent = `Olá, ${primeiroNome}`;
}

function limparFormulario(){
    form.reset();
    linhaEditando = null;
    novaCategoria.style.display = "none";
    document.getElementById("nome").classList.remove("erro-campo");
    document.getElementById("valor").classList.remove("erro-campo");
    document.getElementById("tipo").classList.remove("erro-campo");
    document.getElementById("categoria").classList.remove("erro-campo");
    if (fp && fp.altInput) {
        fp.altInput.classList.remove("erro-campo");
    }
    document.getElementById("descricao").classList.remove("erro-campo");
    document.getElementById("nova-categoria").classList.remove("erro-campo");
}

function abrirModal(){
    limparFormulario();
    modal.style.display = "flex";
}

function fecharModal(){
    limparFormulario();
    modal.style.display = "none";
}

abrir.addEventListener("click", abrirModal);
cancelar.addEventListener("click", fecharModal);

abrirDashboard.addEventListener("click", function(){
    modalDashboard.style.display = "flex";
});

usuarioBtn.addEventListener("click", function(){
    menuUsuario.classList.toggle("ativo");
});

document.getElementById("logout").addEventListener("click", function(){
        localStorage.clear();
        window.location.href="/";
});

window.addEventListener("click", function(e){
    if(e.target == modal){
        fecharModal();
    }
    if(e.target == modalExcluir){
        linhaExcluir = null;
        modalExcluir.style.display = "none";
    }
    if(e.target == modalDescricao){
        modalDescricao.style.display = "none";
    }

    if(e.target == modalDashboard){
        modalDashboard.style.display = "none";
    }

    if(!usuarioBtn.contains(e.target) && !menuUsuario.contains(e.target)){
        menuUsuario.classList.remove("ativo");
    }

});

categoria.addEventListener("change", function(){
    if(categoria.value == "nova"){
        novaCategoria.style.display = "block";
    }else{
        novaCategoria.style.display = "none";
        novaCategoria.value = "";
    }
});

form.addEventListener("submit", function(e){
    e.preventDefault();
    document.getElementById("nome").classList.remove("erro-campo");
    document.getElementById("valor").classList.remove("erro-campo");
    document.getElementById("tipo").classList.remove("erro-campo");
    document.getElementById("categoria").classList.remove("erro-campo");
    if (fp && fp.altInput) {
        fp.altInput.classList.remove("erro-campo");
    }
    document.getElementById("descricao").classList.remove("erro-campo");
    document.getElementById("nova-categoria").classList.remove("erro-campo");

    const nome = document.getElementById("nome").value;
    const valor = document.getElementById("valor").value;
    const tipo = document.getElementById("tipo").value;
    const data = document.getElementById("data").value;
    const descricao = document.getElementById("descricao").value;

    let formularioValido = true;

    if(nome.trim() == ""){
        document.getElementById("nome").classList.add("erro-campo");
        formularioValido = false;
    }

    if(valor === "" || Number(valor) <= 0){
        document.getElementById("valor").classList.add("erro-campo");
        formularioValido = false;
    }

    if(tipo == ""){
        document.getElementById("tipo").classList.add("erro-campo");
        formularioValido = false;
    }

    if(document.getElementById("categoria").value == ""){
        document.getElementById("categoria").classList.add("erro-campo");
        formularioValido = false;
    }

    if(data == ""){
        if (fp && fp.altInput) {
            fp.altInput.classList.add("erro-campo");
        }
        formularioValido = false;
    }

    if(document.getElementById("categoria").value == "nova"){
        if(document.getElementById("nova-categoria").value.trim() == ""){
            document.getElementById("nova-categoria").classList.add("erro-campo");
            formularioValido = false;
        }
    }
    if(!formularioValido){
        return;
    }

    let categoriaFinal;

    if(document.getElementById("categoria").value == "nova"){
        categoriaFinal = document.getElementById("nova-categoria").value;
    }else{
        categoriaFinal = document.getElementById("categoria").value;
    }

    let dataFormatada = "";
    if (fp.selectedDates && fp.selectedDates.length > 0) {
        dataFormatada = fp.formatDate(fp.selectedDates[0], "d/m/Y");
    } else {
        dataFormatada = document.getElementById("data").value;
    }

    const tabela = document.getElementById("tabela-transacoes");

    let linha;

    if(linhaEditando){
        linha = linhaEditando;
    }else{
        linha = tabela.insertRow();
        for(let i=0;i<6;i++){
            linha.insertCell(i);
        }
    }

    linha.cells[0].innerHTML = nome;
    linha.cells[1].innerHTML = dataFormatada;
    linha.cells[2].innerHTML = categoriaFinal;
    linha.cells[3].innerHTML = tipo;
    linha.cells[4].innerHTML = "R$ " + Number(valor).toLocaleString("pt-BR", {minimumFractionDigits: 2, maximumFractionDigits: 2});

    linha.dataset.descricao = descricao;

    const acoes = linha.cells[5];

    acoes.innerHTML = `
    <button class="btn-acao visualizar" title="Visualizar descrição">
        <span class="material-symbols-outlined">
            visibility
        </span>
    </button>

    <button class="btn-acao editar" title="Editar transação">
        <span class="material-symbols-outlined">
            edit
        </span>
    </button>

    <button class="btn-acao excluir" title="Excluir transação">
        <span class="material-symbols-outlined">
            delete
        </span>
    </button>
`;

    acoes.querySelector(".excluir")
        .addEventListener("click", function(){
            linhaExcluir = linha;
            modalExcluir.style.display = "flex";
        });

    acoes.querySelector(".visualizar")
        .addEventListener("click", function(){
            if(linha.dataset.descricao == ""){
                textoDescricao.innerHTML = "Nenhuma descrição cadastrada.";
            }else{
                textoDescricao.innerHTML = linha.dataset.descricao;
            }
            modalDescricao.style.display = "flex";
        });

    acoes.querySelector(".editar")
        .addEventListener("click", function(){
            linhaEditando = linha;
            document.getElementById("nome").value = linha.cells[0].innerHTML;
            const dataTabela = linha.cells[1].innerHTML.split("/");
            fp.setDate(dataTabela[2] + "-" + dataTabela[1] + "-" + dataTabela[0]);
            if(document.getElementById("categoria").querySelector(`option[value="${linha.cells[2].innerHTML}"]`)){
                document.getElementById("categoria").value = linha.cells[2].innerHTML;
            }else{
                document.getElementById("categoria").value = "nova";
                novaCategoria.style.display = "block";
                novaCategoria.value = linha.cells[2].innerHTML;
            }
            document.getElementById("tipo").value = linha.cells[3].innerHTML;
            document.getElementById("valor").value = linha.cells[4].innerHTML
                    .replace("R$ ", "")
                    .replace(/\./g, "")
                    .replace(",", ".");
            document.getElementById("descricao").value = linha.dataset.descricao;
            modal.style.display = "flex";
        });
    atualizarResumo();
    fecharModal();
});

btnNaoExcluir.addEventListener("click", function(){
    linhaExcluir = null;
    modalExcluir.style.display = "none";
});

btnSimExcluir.addEventListener("click", function(){
    if(linhaExcluir){
        linhaExcluir.remove();
        atualizarResumo();
    }
    linhaExcluir = null;
    modalExcluir.style.display = "none";
});

function atualizarResumo(){
    let receitas = 0;
    let despesas = 0;
    const tabela = document.getElementById("tabela-transacoes");
    for(let i = 0; i < tabela.rows.length; i++){
        const tipo = tabela.rows[i].cells[3].innerHTML;
        const valorTexto = tabela.rows[i].cells[4].innerHTML
                .replace("R$ ", "")
                .replace(/\./g, "")
                .replace(",", ".");
        const valor = parseFloat(valorTexto);
        if(tipo == "Receita"){
            receitas += valor;
        }else{
            despesas += valor;
        }
    }
    const saldo = receitas - despesas;

    document.getElementById("ganhos").innerHTML = receitas.toLocaleString("pt-BR", {style: "currency", currency: "BRL"});
    document.getElementById("gastos").innerHTML = despesas.toLocaleString("pt-BR", {style: "currency", currency: "BRL"});
    document.getElementById("saldo").innerHTML = saldo.toLocaleString("pt-BR", {style: "currency", currency: "BRL"});
}

const campos = document.querySelectorAll("input, select, textarea");

campos.forEach(function(campo){
    campo.addEventListener("input", function(){
            campo.classList.remove("erro-campo");
        }
    );
    campo.addEventListener("change", function(){
            campo.classList.remove("erro-campo");
        }
    );
});

fecharDescricao.addEventListener("click", function(){
        modalDescricao.style.display = "none";
});

document.querySelectorAll("img").forEach(function(img){
    img.addEventListener("contextmenu", function(e){
        e.preventDefault();
    });
});

fp = flatpickr("#calendario-container", {
    wrap: true,
    allowInput: true,
    clickOpens: false,
    position: "above right",
    locale: "pt",
    dateFormat: "Y-m-d",
    altInput: true,
    altFormat: "d/m/Y",
    disableMobile: true,
    monthSelectorType: "dropdown",
    showMonths: 1,
    animate: true,
    weekNumbers: false,
    fixedHeight: true
});

document.getElementById("calendario-container").addEventListener("input", function (e) {
    if (e.target.tagName === "INPUT" && e.target.id !== "data") {
        let v = e.target.value.replace(/\D/g, "");
        if (v.length > 8) v = v.slice(0, 8);
        if (v.length >= 5) {
            e.target.value = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
        } else if (v.length >= 3) {
            e.target.value = `${v.slice(0, 2)}/${v.slice(2)}`;
        } else {
            e.target.value = v;
        }
    }
});

window.addEventListener('scroll', function() {
    if (fp && fp.isOpen) {
        fp.close();
    }
}, true);

atualizarResumo();