let fp;
let linhaEditando = null;
let linhaExcluir = null;
const nomeUsuario = localStorage.getItem("nomeUsuario");
const idUsuario = localStorage.getItem("usuarioId");
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
const modalCategorias = document.getElementById("modal-categorias");
const abrirCategorias = document.getElementById("abrir-categorias");
const listaCategorias = document.getElementById("lista-categorias");
const btnAdicionarCategoria = document.getElementById("adicionar-categoria");
const btnFecharCategorias = document.getElementById("fechar-categorias");
const btnVerPerfil = document.getElementById("ver-perfil");
const modalPerfil = document.getElementById("modal-perfil");
const btnFecharPerfil = document.getElementById("fechar-perfil");
const btnAlterarSenha = document.getElementById("btn-alterar-senha");
const containerSenha = document.getElementById("container-senha");
const btnCancelarSenha = document.getElementById("btn-cancelar-senha");
const btnSalvarSenha = document.getElementById("btn-salvar-senha");
const displayNome = document.getElementById("display-nome-perfil");
const chaveNomePerfil = `perfil_nome_${idUsuario}`;

const mapaCategorias = {
    "Alimentação": 1,
    "Moradia": 2,
    "Transporte": 3,
    "Saúde": 4,
    "Educação": 5,
    "Lazer": 6,
    "Compras": 7,
    "Salário": 8,
    "Investimentos": 9
};
const chaveUsuario = `categoriasCustomizadas_${idUsuario}`;
let categoriasSalvas = JSON.parse(localStorage.getItem(chaveUsuario));
if (!categoriasSalvas) {
    categoriasSalvas = Object.keys(mapaCategorias);
    localStorage.setItem(chaveUsuario, JSON.stringify(categoriasSalvas));
}
const select = document.getElementById("categoria");
categoriasSalvas.forEach(cat => {
    const jaExiste = Array.from(select.options).some(opt => opt.value === cat);
    if (!jaExiste) {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        const indiceUltimo = select.options.length - 1;
        select.insertBefore(opt, select.options[indiceUltimo]);
    }
});

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

abrirCategorias.addEventListener("click", function(){
    atualizarListaCategorias();
    modalCategorias.style.display = "flex";
});

usuarioBtn.addEventListener("click", function(){
    menuUsuario.classList.toggle("ativo");
});

btnVerPerfil.addEventListener("click", function(){
    modalPerfil.style.display = "flex";
    menuUsuario.classList.remove("ativo");
});

btnFecharPerfil.addEventListener("click", function(){
    modalPerfil.style.display = "none";
});

document.getElementById("logout").addEventListener("click", function(){
    const temaAtual = localStorage.getItem("tema");
    localStorage.clear();
    if (temaAtual) {
        localStorage.setItem("tema", temaAtual);
    }
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

    if(e.target == modalCategorias){
        modalCategorias.style.display = "none";
    }

    if(!usuarioBtn.contains(e.target) && !menuUsuario.contains(e.target)){
        menuUsuario.classList.remove("ativo");
    }

    if(e.target == modalPerfil){
        modalPerfil.style.display = "none";
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

function configurarEventosLinha(linha) {
    const acoes = linha.cells[5];

    acoes.querySelector(".excluir").addEventListener("click", function(){
        linhaExcluir = linha;
        modalExcluir.style.display = "flex";
    });

    acoes.querySelector(".visualizar").addEventListener("click", function(){
        if(!linha.dataset.descricao || linha.dataset.descricao === "undefined" || linha.dataset.descricao === ""){
            textoDescricao.innerHTML = "Nenhuma descrição cadastrada.";
        }else{
            textoDescricao.innerHTML = linha.dataset.descricao;
        }
        modalDescricao.style.display = "flex";
    });

    acoes.querySelector(".editar").addEventListener("click", function(){
        linhaEditando = linha;
        document.getElementById("nome").value = linha.cells[0].innerHTML;
        const dataTabela = linha.cells[1].innerHTML.split("/");
        fp.setDate(dataTabela[2] + "-" + dataTabela[1] + "-" + dataTabela[0]);

        const selectCategoria = document.getElementById("categoria");
        const categoriaLinha = linha.cells[2].textContent.trim();
        const opcaoExiste = Array.from(selectCategoria.options).find(opcao => opcao.value.trim() === categoriaLinha);
        if (opcaoExiste) {
            selectCategoria.value = categoriaLinha;
            novaCategoria.style.display = "none";
            novaCategoria.value = "";
        } else {
            selectCategoria.value = "nova";
            novaCategoria.style.display = "block";
            novaCategoria.value = categoriaLinha;
        }
        document.getElementById("tipo").value = linha.cells[3].innerHTML;
        document.getElementById("valor").value = linha.cells[4].innerHTML
            .replace("R$ ", "")
            .replace(/\./g, "")
            .replace(",", ".");
        document.getElementById("descricao").value = linha.dataset.descricao === "undefined" ? "" : (linha.dataset.descricao || "");
        modal.style.display = "flex";
    });
}

function adicionarCategoriaNaLista(nomeCategoria) {
    const select = document.getElementById("categoria");
    const existe = Array.from(select.options).some(opt => opt.value.toLowerCase() === nomeCategoria.toLowerCase());
    if (existe) {
        return false;
    }
    const novaOption = document.createElement("option");
    novaOption.value = nomeCategoria;
    novaOption.textContent = nomeCategoria;
    const indiceUltimo = select.options.length - 1;
    select.insertBefore(novaOption, select.options[indiceUltimo]);
    const chaveUsuario = `categoriasCustomizadas_${idUsuario}`;
    let categoriasSalvas = JSON.parse(localStorage.getItem(chaveUsuario)) || [];
    if (!categoriasSalvas.includes(nomeCategoria)) {
        categoriasSalvas.push(nomeCategoria);
        localStorage.setItem(chaveUsuario, JSON.stringify(categoriasSalvas));
    }
    return true;
}

btnAdicionarCategoria.addEventListener("click", function () {
    const input = document.getElementById("nova-categoria-gerenciar");
    const nomeCategoria = input.value.trim();
    if (nomeCategoria === "") {
        input.focus();
        return;
    }
    const foiAdicionada = adicionarCategoriaNaLista(nomeCategoria);
    if (foiAdicionada) {
        atualizarListaCategorias();
        input.value = "";
    } else {
        alert("Esta categoria já existe!");
    }
    input.focus();
});

btnFecharCategorias.addEventListener("click", function () {
    modalCategorias.style.display = "none";
});

function atualizarListaCategorias() {
    listaCategorias.innerHTML = "";
    const select = document.getElementById("categoria");
    const tabela = document.getElementById("tabela-transacoes");
    const chaveUsuario = `categoriasCustomizadas_${idUsuario}`;
    let categoriasSalvas = JSON.parse(localStorage.getItem(chaveUsuario)) || [];
    categoriasSalvas.forEach(nomeDaCategoria => {
        let qtdTransacoes = 0;
        for (let i = 0; i < tabela.rows.length; i++) {
            if (tabela.rows[i].cells[2].textContent.trim() === nomeDaCategoria) {
                qtdTransacoes++;
            }
        }
        const item = document.createElement("div");
        item.className = "item-categoria";
        item.innerHTML = `
            <span>${nomeDaCategoria} (${qtdTransacoes})</span>
            <div class="acoes-categoria">
                <button class="editar-categoria" title="Editar">
                    <span class="material-symbols-outlined">edit</span>
                </button>
                <button class="remover-categoria" title="Excluir">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
        `;
        item.querySelector(".remover-categoria").addEventListener("click", function() {
            const modalExclusao = document.getElementById("modal-confirmar-exclusao");
            const textoExclusao = document.getElementById("texto-exclusao-categoria");
            const areaTransferencia = document.getElementById("area-transferencia-categoria");
            const selectTransferencia = document.getElementById("select-transferir-categoria");
            if (qtdTransacoes > 0) {
                textoExclusao.innerHTML = `Existem <strong>${qtdTransacoes} transação(ões)</strong> usando a categoria "${nomeDaCategoria}".<br>Para qual categoria você deseja movê-las?`;
                areaTransferencia.style.display = "block";
                selectTransferencia.innerHTML = "";
                categoriasSalvas.forEach(cat => {
                    if(cat !== nomeDaCategoria) {
                        const opt = document.createElement("option");
                        opt.value = cat;
                        opt.textContent = cat;
                        selectTransferencia.appendChild(opt);
                    }
                });
            } else {
                textoExclusao.innerHTML = `Tem certeza que deseja excluir a categoria <strong>"${nomeDaCategoria}"</strong> definitivamente?`;
                areaTransferencia.style.display = "none";
            }
            modalExclusao.style.display = "flex";
            document.getElementById("btn-cancelar-exclusao").onclick = function() {
                modalExclusao.style.display = "none";
            };
            document.getElementById("btn-confirmar-exclusao").onclick = function() {
                if (qtdTransacoes > 0) {
                    const novaCat = selectTransferencia.value;
                    if(novaCat) {
                        for (let i = 0; i < tabela.rows.length; i++) {
                            if (tabela.rows[i].cells[2].textContent.trim() === nomeDaCategoria) {
                                tabela.rows[i].cells[2].textContent = novaCat;
                            }
                        }
                    }
                }
                let catsAtualizadas = JSON.parse(localStorage.getItem(chaveUsuario)) || [];
                catsAtualizadas = catsAtualizadas.filter(c => c !== nomeDaCategoria);
                localStorage.setItem(chaveUsuario, JSON.stringify(catsAtualizadas));
                Array.from(select.options).forEach(opt => {
                    if(opt.value === nomeDaCategoria) opt.remove();
                });
                modalExclusao.style.display = "none";
                atualizarListaCategorias();
            };
        });
        item.querySelector(".editar-categoria").addEventListener("click", function() {
            item.innerHTML = `
                <input type="text" value="${nomeDaCategoria}" class="input-edicao-inline">
                <div class="acoes-categoria">
                    <button class="confirmar-edicao btn-icone-sucesso" title="Confirmar">
                        <span class="material-symbols-outlined">check</span>
                    </button>
                    <button class="cancelar-edicao btn-icone-perigo" title="Cancelar">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
            `;
            const inputEdicao = item.querySelector(".input-edicao-inline");
            inputEdicao.focus();
            item.querySelector(".cancelar-edicao").addEventListener("click", function() {
                atualizarListaCategorias();
            });
            item.querySelector(".confirmar-edicao").addEventListener("click", function() {
                const novoNome = inputEdicao.value.trim();
                if (!novoNome || novoNome === "" || novoNome === nomeDaCategoria) {
                    atualizarListaCategorias();
                    return;
                }
                const processarEdicao = (atualizarTransacoes) => {
                    if (atualizarTransacoes && qtdTransacoes > 0) {
                        for (let i = 0; i < tabela.rows.length; i++) {
                            if (tabela.rows[i].cells[2].textContent.trim() === nomeDaCategoria) {
                                tabela.rows[i].cells[2].textContent = novoNome;
                            }
                        }
                    }
                    let catsAtualizadas = JSON.parse(localStorage.getItem(chaveUsuario)) || [];
                    const index = catsAtualizadas.indexOf(nomeDaCategoria);
                    if (index !== -1) catsAtualizadas[index] = novoNome;
                    localStorage.setItem(chaveUsuario, JSON.stringify(catsAtualizadas));
                    Array.from(select.options).forEach(opt => {
                        if(opt.value === nomeDaCategoria) {
                            opt.value = novoNome;
                            opt.textContent = novoNome;
                        }
                    });
                    atualizarListaCategorias();
                };
                if (qtdTransacoes > 0) {
                    const modalEdicao = document.getElementById("modal-confirmar-edicao");
                    const textoEdicao = document.getElementById("texto-edicao-categoria");
                    textoEdicao.innerHTML = `Esta categoria está ligada a <strong>${qtdTransacoes} transação(ões)</strong>.<br>Deseja alterar o nome de "${nomeDaCategoria}" para "${novoNome}" nelas também?`;
                    modalEdicao.style.display = "flex";
                    document.getElementById("btn-nao-atualizar-edicao").onclick = function() {
                        modalEdicao.style.display = "none";
                        processarEdicao(false);
                    };
                    document.getElementById("btn-sim-atualizar-edicao").onclick = function() {
                        modalEdicao.style.display = "none";
                        processarEdicao(true);
                    };
                    document.getElementById("btn-cancelar-edicao").onclick = function() {
                        modalEdicao.style.display = "none";
                        atualizarListaCategorias();
                    };
                } else {
                    processarEdicao(false);
                }
            });
        });
        listaCategorias.appendChild(item);
    });
}

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
    const categoriaSelect = document.getElementById("categoria").value;

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

    if(document.getElementById("categoria").value == "nova"){
        if(document.getElementById("nova-categoria").value.trim() == ""){
            document.getElementById("nova-categoria").classList.add("erro-campo");
            formularioValido = false;
        }
    }
    const msgErroData = document.getElementById("erro-data-limite");
    if (msgErroData) msgErroData.style.display = "none";

    if (!data || (fp.selectedDates && fp.selectedDates.length === 0)) {
        formularioValido = false;

        if (document.getElementById("data")) document.getElementById("data").classList.add("erro-campo");
        if (fp && fp.altInput) fp.altInput.classList.add("erro-campo");
        if (fp && fp.input) fp.input.classList.add("erro-campo");
    } else {
        const anoSelecionado = fp.selectedDates[0].getFullYear();
        const anoAtual = new Date().getFullYear();

        if (anoSelecionado > anoAtual + 5 || anoSelecionado < anoAtual - 5) {
            formularioValido = false;

            if (msgErroData) {
                msgErroData.style.display = "block";
            }

            if (fp && fp.altInput) fp.altInput.classList.add("erro-campo");
            if (fp && fp.input) fp.input.classList.add("erro-campo");
        }
    }

    if(!formularioValido){
        return;
    }

    let categoriaFinal;
    if(categoriaSelect == "nova"){
        categoriaFinal = document.getElementById("nova-categoria").value;
    }else{
        categoriaFinal = categoriaSelect;
    }

    let idCategoriaDesejado = 1;

    if (categoriaSelect !== "nova" && mapaCategorias[categoriaSelect]) {
        idCategoriaDesejado = mapaCategorias[categoriaSelect];
    }

    let dataFormatada = "";
    if (fp.selectedDates && fp.selectedDates.length > 0) {
        dataFormatada = fp.formatDate(fp.selectedDates[0], "Y-m-d");
    } else {
        dataFormatada = data;
    }

    const dadosTransacao = {
        titulo: nome,
        data: dataFormatada,
        valor: parseFloat(valor),
        tipo: tipo === "Receita" ? "RECEITA" : "DESPESA",
        descricao: descricao,
        categoriaId: idCategoriaDesejado,
        usuarioId: parseInt(idUsuario)
    };

    const url = linhaEditando ? `/transacoes/${linhaEditando.dataset.id}` : '/transacoes';
    const metodo = linhaEditando ? 'PUT' : 'POST';

    fetch(url, {
        method: metodo,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosTransacao)
    })
        .then(response => {
            if (!response.ok) throw new Error('Erro ao salvar transação no banco de dados.');
            return response.json();
        })
        .then(transacaoSalva => {
            const tabela = document.getElementById("tabela-transacoes");
            let linha;

            adicionarCategoriaNaLista(categoriaFinal);

            let vinculos = JSON.parse(localStorage.getItem(`vinculoCategorias_${idUsuario}`)) || {};
            vinculos[transacaoSalva.id] = categoriaFinal;
            localStorage.setItem(`vinculoCategorias_${idUsuario}`, JSON.stringify(vinculos));

            if(linhaEditando){
                linha = linhaEditando;
            }else{
                linha = tabela.insertRow(0);
                for(let i=0;i<6;i++){
                    linha.insertCell(i);
                }
            }

            linha.dataset.id = transacaoSalva.id;
            linha.dataset.descricao = transacaoSalva.descricao;

            let dataObjeto;
            if (transacaoSalva.data.includes("-")) {
                const [ano, mes, dia] = transacaoSalva.data.split("-");
                dataObjeto = new Date(ano, mes - 1, dia);
            } else if (transacaoSalva.data.includes("/")) {
                const [dia, mes, ano] = transacaoSalva.data.split("/");
                dataObjeto = new Date(ano, mes - 1, dia);
            } else {
                dataObjeto = new Date(transacaoSalva.data);
            }

            linha.cells[0].innerHTML = transacaoSalva.titulo;
            linha.cells[1].innerHTML = dataObjeto.toLocaleDateString("pt-BR");
            linha.cells[2].innerHTML = categoriaFinal;
            linha.cells[3].innerHTML = transacaoSalva.tipo === "RECEITA" ? "Receita" : "Despesa";
            linha.cells[4].innerHTML = "R$ " + transacaoSalva.valor.toLocaleString("pt-BR", {minimumFractionDigits: 2, maximumFractionDigits: 2});

            const acoes = linha.cells[5];
            acoes.innerHTML = `
            <button class="btn-acao visualizar" title="Visualizar descrição"><span class="material-symbols-outlined">visibility</span></button>
            <button class="btn-acao editar" title="Editar transação"><span class="material-symbols-outlined">edit</span></button>
            <button class="btn-acao excluir" title="Excluir transação"><span class="material-symbols-outlined">delete</span></button>
        `;

            configurarEventosLinha(linha);
            atualizarResumo();
            fecharModal();
        })
        .catch(erro => {
            console.error(erro);
            alert('Erro na integração: Verifique se o servidor Java está rodando e se você está logado.');
        });
});

btnNaoExcluir.addEventListener("click", function(){
    linhaExcluir = null;
    modalExcluir.style.display = "none";
});

btnSimExcluir.addEventListener("click", function(){
    if(linhaExcluir){
        const idTransacao = linhaExcluir.dataset.id;

        fetch(`/transacoes/${idTransacao}`, {
            method: 'DELETE'
        })
            .then(response => {
                if(response.ok) {
                    linhaExcluir.remove();
                    atualizarResumo();
                } else {
                    alert("Erro ao excluir a transação no servidor backend.");
                }
            })
            .catch(erro => console.error("Erro ao deletar:", erro))
            .finally(() => {
                linhaExcluir = null;
                modalExcluir.style.display = "none";
            });
    }
});

function atualizarResumo(){
    let recipes = 0;
    let despesas = 0;
    const tabela = document.getElementById("tabela-transacoes");
    for(let i = 0; i < tabela.rows.length; i++){
        const tipoCell = tabela.rows[i].cells[3].innerHTML;
        const valorTexto = tabela.rows[i].cells[4].innerHTML
            .replace("R$ ", "")
            .replace(/\./g, "")
            .replace(",", ".");
        const valor = parseFloat(valorTexto);
        if(tipoCell == "Receita"){
            recipes += valor;
        }else{
            despesas += valor;
        }
    }
    const saldo = recipes - despesas;

    document.getElementById("ganhos").innerHTML = recipes.toLocaleString("pt-BR", {style: "currency", currency: "BRL"});
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
    fixedHeight: true,
    onChange: function(selectedDates, dateStr, instance) {
        if (instance.input) instance.input.classList.remove("erro-campo");
        if (instance.altInput) instance.altInput.classList.remove("erro-campo");
        document.getElementById("data").classList.remove("erro-campo");
        const msgErroData = document.getElementById("erro-data-limite");
        if (msgErroData) msgErroData.style.display = "none";
    }
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

function carregarTransacoesDoBanco() {
    if(!idUsuario) {
        console.warn("Nenhum idUsuario encontrado no localStorage.");
        return;
    }

    fetch(`/transacoes?idUsuario=${idUsuario}`)
        .then(response => {
            if (!response.ok) throw new Error("Erro ao buscar transações antigas.");
            return response.json();
        })
        .then(transacoes => {
            const tabela = document.getElementById("tabela-transacoes");
            tabela.innerHTML = "";

            transacoes.sort((a, b) => b.id - a.id);

            transacoes.forEach(t => {
                const linha = tabela.insertRow();
                for(let i=0;i<6;i++) linha.insertCell(i);

                linha.dataset.id = t.id;
                linha.dataset.descricao = t.descricao;

                let dataObjeto;
                if (t.data && typeof t.data === 'string') {
                    if (t.data.includes("-")) {
                        const [ano, mes, dia] = t.data.split("-");
                        dataObjeto = new Date(ano, mes - 1, dia);
                    } else if (t.data.includes("/")) {
                        const [dia, mes, ano] = t.data.split("/");
                        dataObjeto = new Date(ano, mes - 1, dia);
                    } else {
                        dataObjeto = new Date(t.data);
                    }
                } else if (t.data) {
                    dataObjeto = new Date(t.data);
                } else {
                    dataObjeto = new Date();
                }
                linha.cells[0].innerHTML = t.titulo;
                linha.cells[1].innerHTML = isNaN(dataObjeto.getTime()) ? "Data Inválida" : dataObjeto.toLocaleDateString("pt-BR");

                let nomeCategoriaExibir = "Geral";
                if (t.categoria) {
                    nomeCategoriaExibir = typeof t.categoria === 'object' ? t.categoria.nome : t.categoria;
                } else if (t.categoriaNome) {
                    nomeCategoriaExibir = t.categoriaNome;
                }

                const vinculosLocais = JSON.parse(localStorage.getItem(`vinculoCategorias_${idUsuario}`)) || {};

                if (vinculosLocais[t.id]) {
                    nomeCategoriaExibir = vinculosLocais[t.id];
                }
                linha.cells[2].innerHTML = nomeCategoriaExibir;
                linha.cells[3].innerHTML = t.tipo === "RECEITA" ? "Receita" : "Despesa";
                linha.cells[4].innerHTML = "R$ " + t.valor.toLocaleString("pt-BR", {minimumFractionDigits: 2, maximumFractionDigits: 2});
                linha.cells[5].innerHTML = `
                <button class="btn-acao visualizar" title="Visualizar descrição"><span class="material-symbols-outlined">visibility</span></button>
                <button class="btn-acao editar" title="Editar transação"><span class="material-symbols-outlined">edit</span></button>
                <button class="btn-acao excluir" title="Excluir transação"><span class="material-symbols-outlined">delete</span></button>
            `;
                configurarEventosLinha(linha);
            });
            atualizarResumo();
        })
        .catch(erro => console.error("Erro ao listar dados iniciais:", erro));
}

(function carregarCategoriasDoLocalStorage() {
    const chaveUsuario = `categoriasCustomizadas_${idUsuario}`;
    const categoriasSalvas = JSON.parse(localStorage.getItem(chaveUsuario)) || [];
    categoriasSalvas.forEach(cat => {
        const select = document.getElementById("categoria");
        if (!Array.from(select.options).some(opt => opt.value === cat)) {
            const novaOption = document.createElement("option");
            novaOption.value = cat;
            novaOption.textContent = cat;
            select.insertBefore(novaOption, select.options[select.options.length - 1]);
        }
    });
})();

function configurarEdicaoPerfil(idLinha, idDisplay, chaveLocalStorage, label) {
    const linha = document.getElementById(idLinha);
    const display = document.getElementById(idDisplay);
    const btnEditar = linha.querySelector(".btn-editar-perfil");
    const valorSalvo = localStorage.getItem(chaveLocalStorage);
    if (valorSalvo) {
        display.textContent = valorSalvo;
    }
    btnEditar.addEventListener("click", function() {
        const valorAtual = display.textContent;
        linha.innerHTML = `
            <div class="container-edicao-perfil">
                <input type="text" class="input-perfil" value="${valorAtual}">
                <button class="confirmar-edicao-perfil btn-icone-sucesso" title="Salvar">
                    <span class="material-symbols-outlined">check</span>
                </button>
                <button class="cancelar-edicao-perfil btn-icone-perigo" title="Cancelar">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
        `;
        const input = linha.querySelector(".input-perfil");
        input.focus();
        linha.querySelector(".cancelar-edicao-perfil").addEventListener("click", function() {
            restaurarVisualizacao();
        });
        linha.querySelector(".confirmar-edicao-perfil").addEventListener("click", function() {
            const novoValor = input.value.trim();
            if (novoValor) {
                localStorage.setItem(chaveLocalStorage, novoValor);
                display.textContent = novoValor;
                if (idDisplay === "display-nome-perfil") {
                    const primeiroNome = novoValor.split(" ")[0];
                    document.getElementById("usuario-nome").textContent = `Olá, ${primeiroNome}`;
                }
            }
            restaurarVisualizacao();
        });
        function restaurarVisualizacao() {
            linha.innerHTML = `
                <div class="info-dado">
                    <span class="label-dado">${label}</span>
                    <span class="valor-dado" id="${idDisplay}">${display.textContent}</span>
                </div>
                <button class="btn-editar-perfil" title="Editar">
                    <span class="material-symbols-outlined">edit</span>
                </button>
            `;
            configurarEdicaoPerfil(idLinha, idDisplay, chaveLocalStorage, label);
        }
    });
}

if (!localStorage.getItem(chaveNomePerfil) && nomeUsuario) {
    displayNome.textContent = nomeUsuario;
}

configurarEdicaoPerfil("linha-nome-perfil", "display-nome-perfil", chaveNomePerfil, "Nome:");
configurarEdicaoPerfil("linha-email-perfil", "display-email-perfil", `perfil_identificador_${idUsuario}`, "Identificador:");

if(btnAlterarSenha) {
    btnAlterarSenha.addEventListener("click", () => {
        btnAlterarSenha.style.display = "none";
        containerSenha.style.display = "flex";
    });
}

if(btnCancelarSenha) {
    btnCancelarSenha.addEventListener("click", () => {
        containerSenha.style.display = "none";
        btnAlterarSenha.style.display = "flex";
        document.getElementById("senha-atual").value = "";
        document.getElementById("nova-senha").value = "";
    });
}

if(btnSalvarSenha) {
    btnSalvarSenha.addEventListener("click", () => {
        const senhaAtual = document.getElementById("senha-atual").value;
        const novaSenha = document.getElementById("nova-senha").value;
        if(!senhaAtual || !novaSenha) {
            alert("Preencha a senha atual e a nova senha!");
            return;
        }
        alert("Simulação: Senha alterada com sucesso! (Falta conectar com o Java)");
        btnCancelarSenha.click();
    });
}

atualizarResumo();
carregarTransacoesDoBanco();