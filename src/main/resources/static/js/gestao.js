let fp;
let linhaEditando = null;
let linhaExcluir = null;
let categoriaIdParaExcluir = null;
let categoriaPrecisaTransferir = false;

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

if(nomeUsuario){
    const primeiroNome = nomeUsuario.split(" ")[0];
    const divSaudacao = document.getElementById("usuario-nome");
    if (divSaudacao) divSaudacao.textContent = `Olá, ${primeiroNome}`;
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
    carregarCategoriasParaGestao();
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

document.getElementById("logout").addEventListener("click", function() {
    const token = localStorage.getItem("token");

    fetch('/usuarios/logout', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .finally(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("idUsuario");
            window.location.href = "index.html";
        });
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
        selectCategoria.value = categoriaLinha;
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

    criarNovaCategoriaNoBackend(nomeCategoria);
    input.value = "";
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

    categoriasSalvas.sort((a, b) => a.localeCompare(b));

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
            if (msgErroData) msgErroData.style.display = "block";
            if (fp && fp.altInput) fp.altInput.classList.add("erro-campo");
            if (fp && fp.input) fp.input.classList.add("erro-campo");
        }
    }

    if(!formularioValido){
        return;
    }

    let categoriaFinal;
    if(categoriaSelect == "nova"){
        categoriaFinal = document.getElementById("nova-categoria").value.trim();
    }else{
        categoriaFinal = categoriaSelect;
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
        categoriaNome: categoriaFinal,
        usuarioId: parseInt(idUsuario)
    };

    const token = localStorage.getItem("token");
    const url = linhaEditando ? `/transacoes/${linhaEditando.dataset.id}` : '/transacoes';
    const metodo = linhaEditando ? 'PUT' : 'POST';

    fetch(url, {
        method: metodo,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
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
            atualizarTodaATelaDeCategorias();
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
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
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
    campo.addEventListener("input", function(){ campo.classList.remove("erro-campo"); });
    campo.addEventListener("change", function(){ campo.classList.remove("erro-campo"); });
});

fecharDescricao.addEventListener("click", function(){
    modalDescricao.style.display = "none";
});

document.querySelectorAll("img").forEach(function(img){
    img.addEventListener("contextmenu", function(e){ e.preventDefault(); });
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
    if (fp && fp.isOpen) { fp.close(); }
}, true);

function carregarTransacoesDoBanco() {
    const token = obterToken();
    if (!token) {
        console.warn("Nenhum token JWT de autenticação encontrado no localStorage.");
        return;
    }

    fetch('/transacoes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
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

function carregarCategoriasDoBanco() {
    const token = obterToken();
    fetch('/categorias/gestao', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(response => response.json())
        .then(categorias => {
            console.log("DADOS RECEBIDOS DO BACKEND:", categorias);
            if (Array.isArray(categorias) && categorias.length > 0) {
                atualizarSelectNovaTransacao(categorias);
                atualizarListaGestaoCategorias(categorias);
            } else {
                console.warn("A lista de categorias está vazia ou não é um array!");
            }
        })
        .catch(erro => console.error("Erro ao carregar categorias:", erro));
}

function carregarCategoriasParaSelect() {
    console.log("Tentando buscar categorias...");
    fetch('/categorias', {
        headers: { 'Authorization': `Bearer ${obterToken()}` }
    })
        .then(res => res.json())
        .then(lista => {
            const listaOrdenada = lista.sort((a, b) => a.nome.localeCompare(b.nome));
            atualizarSelectNovaTransacao(listaOrdenada, true);
        })
        .catch(erro => console.error("Erro no fetch:", erro));
}

function carregarCategoriasParaGestao() {
    const token = localStorage.getItem("token");

    Promise.all([
        fetch('/categorias', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
        fetch('/categorias/gestao', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json())
    ])
        .then(([todasCategorias, dadosGestao]) => {
            const mapaQuantidades = {};
            if (Array.isArray(dadosGestao)) {
                dadosGestao.forEach(g => {
                    mapaQuantidades[g.nome.toLowerCase()] = g.quantidadeTransacoes || 0;
                });
            }

            const listaFinal = todasCategorias.map(cat => {
                return {
                    id: cat.id,
                    nome: cat.nome,
                    quantidadeTransacoes: mapaQuantidades[cat.nome.toLowerCase()] || 0
                };
            });

            listaFinal.sort((a, b) => a.nome.localeCompare(b.nome));
            atualizarListaGestaoCategorias(listaFinal);
        })
        .catch(erro => {
            console.error("Erro ao sincronizar modais de categoria:", erro);
        });
}

function atualizarTodaATelaDeCategorias() {
    carregarCategoriasParaSelect();
    carregarCategoriasParaGestao();
}

function verificarResposta(response) {
    if (response.status === 401) {
        console.error("Token expirado ou inválido!");
        localStorage.removeItem("token");
        window.location.href = "login.html";
        throw new Error("Não autorizado");
    }
    if (!response.ok) {
        throw new Error("Erro na requisição: " + response.statusText);
    }
    return response.json();
}

function criarNovaCategoriaNoBackend(nomeCategoria) {
    const token = obterToken();

    fetch('/categorias', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: nomeCategoria })
    })
        .then(response => {
            if (!response.ok) throw new Error("Não foi possível salvar a categoria no servidor.");
            return response.json();
        })
        .then(() => {
            exibirMensagemModal("Categoria criada com sucesso!", "sucesso");
            atualizarTodaATelaDeCategorias();
        })
        .catch(erro => {
            console.error(erro);
            exibirMensagemModal("Erro ao criar categoria.", "erro");
        });
}

function atualizarSelectNovaTransacao(categorias, forcarAtualizacao = false) {
    const select = document.getElementById("categoria");
    if (!select) return;

    if (!forcarAtualizacao && select.options.length > 1) {
        console.log("Ignorando redesenho para evitar bugs.");
        return;
    }

    select.innerHTML = '<option value="">Selecione uma categoria</option>';
    categorias.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat.nome;
        opt.textContent = cat.nome;
        select.appendChild(opt);
    });

    const optNova = document.createElement("option");
    optNova.value = "nova";
    optNova.textContent = "+ Adicionar nova categoria";
    select.appendChild(optNova);
}

function atualizarListaGestaoCategorias(categorias) {
    const containerLista = document.getElementById("lista-categorias");
    if (!containerLista) return;

    containerLista.innerHTML = "";
    categorias.forEach(cat => {
        const item = document.createElement("div");
        item.className = "item-categoria";
        item.id = `cat-linha-${cat.id}`;

        item.innerHTML = `
            <span class="nome-categoria">${cat.nome} <span class="badge-transacoes">(${cat.quantidadeTransacoes || 0})</span></span>
            <div class="acoes-categoria">
                <button onclick="editarCategoriaAcao(${cat.id}, '${cat.nome}')" class="btn-editar" title="Editar">
                    <span class="material-symbols-outlined">edit</span>
                </button>
                <button onclick="excluirCategoriaAcao(${cat.id}, '${cat.nome}', ${cat.quantidadeTransacoes || 0})" class="btn-excluir" title="Excluir">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
        `;
        containerLista.appendChild(item);
    });
}

function exibirMensagemModal(mensagem, tipo = "sucesso", tempo = 7000) {
    let alerta = document.getElementById("alerta-modal-perfil");
    if (!alerta) {
        alerta = document.createElement("div");
        alerta.id = "alerta-modal-perfil";
        alerta.style.position = "relative";

        const containerInterno = document.querySelector("#modal-perfil > div") ||
            document.querySelector(".modal-conteudo") ||
            document.getElementById("modal-perfil") ||
            (typeof modalPerfil !== 'undefined' ? modalPerfil : null);

        if (containerInterno) {
            containerInterno.append(alerta);
        }
    }

    if (alerta) {
        alerta.textContent = mensagem;
        alerta.className = `alerta-texto-${tipo}`;
    }

    setTimeout(() => { if (alerta) alerta.remove(); }, tempo);
}

window.editarCategoriaAcao = function(idCategoria, nomeAtual) {
    const linha = document.getElementById(`cat-linha-${idCategoria}`);
    if (!linha) return;

    linha.innerHTML = `
        <input type="text" id="input-edit-cat-${idCategoria}" value="${nomeAtual}" style="flex: 1; margin-right: 10px; padding: 4px 8px; border: 1px solid #ccc; border-radius: 4px;">
        <div class="acoes-categoria">
            <button onclick="salvarEdicaoInline(${idCategoria})" class="editar-categoria" title="Salvar" style="color: #2e7d32;">
                <span class="material-symbols-outlined">check</span>
            </button>
            <button onclick="carregarCategoriasParaGestao()" class="remover-categoria" title="Cancelar" style="color: #c62828;">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
    `;
};

window.salvarEdicaoInline = function(idCategoria) {
    const input = document.getElementById(`input-edit-cat-${idCategoria}`);
    if (!input) return;

    const novoNome = input.value.trim();
    if (!novoNome) return;

    const token = obterToken();
    fetch(`/categorias/${idCategoria}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ nome: novoNome })
    })
        .then(response => {
            if (!response.ok) throw new Error("Erro ao editar.");
            exibirMensagemModal("Categoria updated com sucesso!", "sucesso");
            atualizarTodaATelaDeCategorias();
        })
        .catch(erro => console.error(erro));
};

window.excluirCategoriaAcao = function(idCategoria, nomeCategoria, quantidadeTransacoes) {
    categoriaIdParaExcluir = idCategoria;

    const modalConfirmar = document.getElementById("modal-confirmar-exclusao");
    const textoExclusao = document.getElementById("texto-exclusao-categoria");


    const areaTransferencia = document.getElementById("area-transferencia-categoria");
    const selectTransferir = document.getElementById("select-transferir-categoria");

    if (!modalConfirmar || !textoExclusao || !areaTransferencia || !selectTransferir) {
        console.error("Erro: Elementos do modal de exclusão de categoria não foram encontrados no HTML.");
        return;
    }

    if (quantidadeTransacoes > 0) {
        categoriaPrecisaTransferir = true;
        textoExclusao.textContent = `A categoria "${nomeCategoria}" possui ${quantidadeTransacoes} transações vinculadas.`;
        areaTransferencia.style.display = "block";

        const token = obterToken();
        fetch('/categorias', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(categorias => {
                selectTransferir.innerHTML = "";
                const outrasCategorias = categorias.filter(cat => cat.id !== idCategoria);

                outrasCategorias.forEach(cat => {
                    const option = document.createElement("option");
                    option.value = cat.id;
                    option.textContent = cat.nome;
                    selectTransferir.appendChild(option);
                });
            })
            .catch(erro => console.error("Erro ao popular o select de transferência:", erro));

    } else {
        categoriaPrecisaTransferir = false;
        textoExclusao.textContent = `Tem certeza que deseja excluir a categoria "${nomeCategoria}"?`;
        areaTransferencia.style.display = "none";
    }

    modalConfirmar.style.display = "flex";
};
function excluirCategoriaNoBackend(idCategoria, idCategoriaDestino = null) {
    const token = obterToken();
    const destinoFinal = (idCategoriaDestino && idCategoriaDestino !== "") ? idCategoriaDestino : null;

    const url = destinoFinal
        ? `/categorias/${idCategoria}?transferirPara=${destinoFinal}`
        : `/categorias/${idCategoria}`;

    console.log("Disparando requisição DELETE para:", url);

    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(async response => {
            if (!response.ok) {
                const textoErro = await response.text();
                throw new Error(textoErro || `Erro do servidor (Código ${response.status})`);
            }

            const linhaNaGestao = document.getElementById(`cat-linha-${idCategoria}`);
            let nomeCategoriaDeletada = "";
            if (linhaNaGestao) {
                const spanNome = linhaNaGestao.querySelector(".nome-categoria");
                if (spanNome) {
                    nomeCategoriaDeletada = spanNome.textContent.split("(")[0].trim();
                }
                linhaNaGestao.remove();
            }

            const selectCategoria = document.getElementById("categoria");
            if (selectCategoria && nomeCategoriaDeletada) {
                const opcaoParaRemover = Array.from(selectCategoria.options).find(
                    opt => opt.value.trim().toLowerCase() === nomeCategoriaDeletada.toLowerCase()
                );
                if (opcaoParaRemover) {
                    selectCategoria.removeChild(opcaoParaRemover);
                }
            }

            exibirMensagemModal("Categoria excluída e transações movidas com sucesso!", "sucesso");

            setTimeout(() => {
                const modalConfirmarExclusaoContexto = document.getElementById("modal-confirmar-exclusao");
                if (modalConfirmarExclusaoContexto) {
                    modalConfirmarExclusaoContexto.style.display = "none";
                }

                categoriaIdParaExcluir = null;
                categoriaPrecisaTransferir = false;

                atualizarTodaATelaDeCategorias();
                carregarTransacoesDoBanco();
            }, 25);
        })
        .catch(erro => {
            console.error("Erro no processo de exclusão:", erro);

            let mensagemFinal = erro.message;
            try {
                const erroJson = JSON.parse(erro.message);
                if (erroJson.detail) mensagemFinal = erroJson.detail;
            } catch (e) {}

            exibirMensagemModal(`Falha ao excluir: ${mensagemFinal}`, "erro");
        });
}

window.executarExclusaoComTransferencia = function(idCategoria) {
    const idCat = idCategoria || categoriaIdParaExcluir;
    console.log("Botão de confirmação acionado para a categoria ID:", idCat);

    if (!idCat) {
        alert("Erro: Nenhuma categoria identificada para exclusão.");
        return;
    }

    let idCategoriaDestino = null;
    if (categoriaPrecisaTransferir) {
        const selectTransferir = document.getElementById("select-transferir-categoria");
        if (selectTransferir) {
            idCategoriaDestino = selectTransferir.value;
            console.log("Transferência necessária. ID da categoria destino selecionada:", idCategoriaDestino);

            if (!idCategoriaDestino || idCategoriaDestino === "") {
                alert("Por favor, selecione uma categoria de destino para transferir as transações.");
                return;
            }
        }
    }

    excluirCategoriaNoBackend(idCat, idCategoriaDestino);
};

function obterToken() {
    return localStorage.getItem("token");
}

function configurarEdicaoPerfilBackend() {
    const linhaNome = document.getElementById("linha-nome-perfil");
    const linhaEmail = document.getElementById("linha-email-perfil");
    if (!linhaNome || !linhaEmail) return;

    const displayNome = document.getElementById("display-nome-perfil");
    const displayEmail = document.getElementById("display-email-perfil");

    if (displayNome) displayNome.textContent = localStorage.getItem("nomeUsuario") || "";
    if (displayEmail) displayEmail.textContent = localStorage.getItem("identificadorLogin") || "";

    window.habilitarEdicaoPerfilCompleto = function() {
        const inputNomeExistente = document.getElementById("input-nome-perfil");
        const inputEmailExistente = document.getElementById("input-email-perfil");

        const nomeAtual = inputNomeExistente ? inputNomeExistente.value : (document.getElementById("display-nome-perfil")?.textContent || localStorage.getItem("nomeUsuario") || "");
        const emailAtual = inputEmailExistente ? inputEmailExistente.value : (document.getElementById("display-email-perfil")?.textContent || localStorage.getItem("identificadorLogin") || "");

        linhaNome.innerHTML = `
            <div class="container-edicao-perfil" style="width: 100%;">
                <span class="label-dado" style="min-width: 80px;">Nome:</span>
                <input type="text" id="input-nome-perfil" class="input-perfil" value="${nomeAtual}" style="flex: 1;">
            </div>
        `;

        linhaEmail.innerHTML = `
            <div class="container-edicao-perfil" style="width: 100%;">
                <span class="label-dado" style="min-width: 80px;">Identificador:</span>
                <input type="text" id="input-email-perfil" class="input-perfil" value="${emailAtual}" style="flex: 1;">
            </div>
        `;

        let areaBotoes = document.getElementById("controles-edicao-perfil");
        if (!areaBotoes) {
            areaBotoes = document.createElement("div");
            areaBotoes.id = "controles-edicao-perfil";
            areaBotoes.style.display = "flex";
            areaBotoes.style.gap = "10px";
            areaBotoes.style.marginTop = "15px";
            areaBotoes.style.justifyContent = "flex-end";
            linhaEmail.parentNode.insertBefore(areaBotoes, linhaEmail.nextSibling);
        }

        areaBotoes.innerHTML = `
            <button onclick="salvarAlteracoesPerfilBackend()" class="confirmar-edicao-perfil btn-icone-sucesso" title="Salvar">
                <span class="material-symbols-outlined">check</span> Salvar
            </button>
            <button onclick="restaurarVisualizacaoPerfilOriginal()" class="cancelar-edicao-perfil btn-icone-perigo" title="Cancelar">
                <span class="material-symbols-outlined">close</span> Cancelar
            </button>
        `;
        document.querySelectorAll(".btn-editar-perfil").forEach(btn => btn.style.display = "none");
    };

    window.salvarAlteracoesPerfilBackend = function() {
        const inputNome = document.getElementById("input-nome-perfil");
        const inputEmail = document.getElementById("input-email-perfil");
        if (!inputNome || !inputEmail) return;

        const novoNome = inputNome.value.trim();
        const novoEmail = inputEmail.value.trim();
        const token = obterToken();

        if (!novoNome || !novoEmail) {
            alert("Nome e Identificador não podem ficar vazios.");
            return;
        }

        fetch('/usuarios/perfil', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ nome: novoNome, identificadorLogin: novoEmail })
        })
            .then(response => {
                if (!response.ok) throw new Error("Erro ao atualizar o perfil.");
                return response.json();
            })
            .then(dados => {
                if (dados.token) localStorage.setItem("token", dados.token);
                localStorage.setItem("nomeUsuario", novoNome);
                localStorage.setItem("identificadorLogin", novoEmail);

                const primeiroNome = novoNome.split(" ")[0];
                const divSaudacao = document.getElementById("usuario-nome");
                if (divSaudacao) divSaudacao.textContent = `Olá, ${primeiroNome}`;

                alert("Perfil atualizado com sucesso!");
                restaurarVisualizacaoPerfilOriginal();
            })
            .catch(erro => {
                console.error(erro);
                alert("Falha ao atualizar perfil no servidor.");
                restaurarVisualizacaoPerfilOriginal();
            });
    };

    window.restaurarVisualizacaoPerfilOriginal = function() {
        const nome = localStorage.getItem("nomeUsuario") || "";
        const email = localStorage.getItem("identificadorLogin") || "";

        linhaNome.innerHTML = `
            <div class="info-dado">
                <span class="label-dado">Nome:</span>
                <span class="valor-dado" id="display-nome-perfil">${nome}</span>
            </div>
            <button class="btn-editar-perfil" title="Editar" onclick="habilitarEdicaoPerfilCompleto()">
                <span class="material-symbols-outlined">edit</span>
            </button>
        `;

        linhaEmail.innerHTML = `
            <div class="info-dado">
                <span class="label-dado">Identificador:</span>
                <span class="valor-dado" id="display-email-perfil">${email}</span>
            </div>
            <button class="btn-editar-perfil" title="Editar" onclick="habilitarEdicaoPerfilCompleto()">
                <span class="material-symbols-outlined">edit</span>
            </button>
        `;
        const areaBotoes = document.getElementById("controles-edicao-perfil");
        if (areaBotoes) areaBotoes.remove();

        document.querySelectorAll(".btn-editar-perfil").forEach(btn => btn.style.display = "flex");
    };

    document.querySelectorAll(".btn-editar-perfil").forEach(btn => {
        btn.setAttribute("onclick", "habilitarEdicaoPerfilCompleto()");
    });
}

function limparCamposSenha() {
    const aktual = document.getElementById("senha-atual");
    const nova = document.getElementById("nova-senha");
    const confirmInput = document.getElementById("confirmar-senha");
    if (aktual) aktual.value = "";
    if (nova) nova.value = "";
    if (confirmInput) confirmInput.value = "";
}

function configurarEdicaoSenhaBackend() {
    const btnAlterarSenha = document.getElementById("btn-alterar-senha");
    const containerSenha = document.getElementById("container-senha");
    const btnCancelarSenha = document.getElementById("btn-cancelar-senha");
    const btnSalvarSenha = document.getElementById("btn-salvar-senha");

    if (!btnAlterarSenha) return;

    btnAlterarSenha.addEventListener("click", () => {
        btnAlterarSenha.style.display = "none";
        if (containerSenha) containerSenha.classList.remove("escondido");
    });

    if (btnCancelarSenha) {
        btnCancelarSenha.addEventListener("click", () => {
            if (containerSenha) containerSenha.classList.add("escondido");
            btnAlterarSenha.style.display = "flex";
            limparCamposSenha();
        });
    }

    if (btnSalvarSenha) {
        btnSalvarSenha.addEventListener("click", async () => {
            const token = obterToken();
            const elSenhaAtual = document.getElementById("senha-atual");
            const elNovaSenha = document.getElementById("nova-senha");
            const elConfirmarSenha = document.getElementById("confirmar-senha");

            const senhaAtual = elSenhaAtual ? elSenhaAtual.value : "";
            const novaSenha = elNovaSenha ? elNovaSenha.value : "";
            const confirmacaoNovaSenha = elConfirmarSenha ? elConfirmarSenha.value : "";

            if (!senhaAtual || !novaSenha || !confirmacaoNovaSenha) {
                exibirMensagemModal("Preencha todos os campos!", "erro");
                return;
            }
            if (novaSenha.length < 6) {
                exibirMensagemModal("Mínimo de 6 caracteres!", "erro");
                return;
            }
            if (novaSenha !== confirmacaoNovaSenha) {
                exibirMensagemModal("As senhas não coincidem!", "erro");
                return;
            }

            exibirMensagemModal("Processando...", "sucesso");
            btnSalvarSenha.disabled = true;

            try {
                const response = await fetch('/usuarios/senha', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ senhaAtual, novaSenha, confirmacaoNovaSenha: novaSenha })
                });

                const respostaTexto = await response.text();
                if (!response.ok) throw new Error(respostaTexto || "Erro ao alterar senha.");

                exibirMensagemModal("Senha alterada com sucesso!", "sucesso");
                setTimeout(() => { if (btnCancelarSenha) btnCancelarSenha.click(); }, 1500);

            } catch (erro) {
                let mensagemFinal = erro.message;
                try {
                    const erroJson = JSON.parse(erro.message);
                    if (erroJson.detail) mensagemFinal = erroJson.detail;
                } catch (e) {}
                exibirMensagemModal(mensagemFinal, "erro", 5000);
            } finally {
                btnSalvarSenha.disabled = false;
            }
        });
    }
}

const btnConfirmarExclusaoModal = document.getElementById("btn-confirmar-exclusao");
const btnCancelarExclusaoModal = document.getElementById("btn-cancelar-exclusao");
const modalConfirmarExclusaoContexto = document.getElementById("modal-confirmar-exclusao");

if (btnCancelarExclusaoModal && modalConfirmarExclusaoContexto) {
    btnCancelarExclusaoModal.onclick = function() {
        modalConfirmarExclusaoContexto.style.display = "none";
        categoriaIdParaExcluir = null;
        categoriaPrecisaTransferir = false;
    };
}

if (btnConfirmarExclusaoModal) {
    btnConfirmarExclusaoModal.onclick = function() {
        window.executarExclusaoComTransferencia(categoriaIdParaExcluir);
    };
}

window.addEventListener("load", function() {
    carregarCategoriasParaSelect();
    carregarTransacoesDoBanco();
});
carregarTransacoesDoBanco = function(ordem = "") {
    const token = obterToken();
    if (!token) {
        console.warn("Nenhum token JWT de autenticação encontrado no localStorage.");
        return;
    }

    let ordemBackend = ordem;
    if (ordem === "todas") {
        ordemBackend = "";
    }

    const ehFiltroTipoApenas = (ordem === "receitas" || ordem === "despesas" || ordem === "todas");
    const url = (ordemBackend && !ehFiltroTipoApenas) ? `/transacoes?ordem=${ordemBackend}` : '/transacoes';

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) throw new Error("Erro ao buscar transações filtradas.");
            return response.json();
        })
        .then(transacoes => {
            const tabela = document.getElementById("tabela-transacoes");
            if (!tabela) return;

            tabela.innerHTML = "";

            transacoes.forEach(t => {
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
                t._dataCalendario = isNaN(dataObjeto.getTime()) ? new Date(0) : dataObjeto;
            });

            if (ordem === "data_dec") {
                transacoes.sort((a, b) => b._dataCalendario - a._dataCalendario);
            } else if (ordem === "data_asc") {
                transacoes.sort((a, b) => a._dataCalendario - b._dataCalendario);
            }

            transacoes.forEach(t => {
                const linha = tabela.insertRow();
                for(let i = 0; i < 6; i++) linha.insertCell(i);

                linha.dataset.id = t.id;
                linha.dataset.descricao = t.descricao;

                linha.cells[0].innerHTML = t.titulo;
                linha.cells[1].innerHTML = t._dataCalendario.getTime() === 0 ? "Data Inválida" : t._dataCalendario.toLocaleDateString("pt-BR");

                let nomeCategoriaExibir = "Geral";
                if (t.categoria) {
                    nomeCategoriaExibir = typeof t.categoria === 'object' ? t.categoria.nome : t.categoria;
                } else if (t.categoriaNome) {
                    nomeCategoriaExibir = t.categoriaNome;
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

                if (ordem === "receitas" && t.tipo !== "RECEITA") {
                    linha.style.display = "none";
                } else if (ordem === "despesas" && t.tipo !== "DESPESA") {
                    linha.style.display = "none";
                }
            });

            atualizarResumo();
        })
        .catch(erro => console.error("Erro ao listar dados ordenados:", erro));
};

const opcoesFiltroOriginais = `
    <option value="" disabled selected>Filtrar por...</option>
    <option value="todas">Todas</option>
    <option value="receitas">Receitas</option>
    <option value="despesas">Despesas</option>
    <option value="recentes">Mais recentes</option>
    <option value="antigas">Mais antigas</option>
    <option value="data_dec">Data mais atual</option>
    <option value="data_dac">Data mais antiga</option>
    <option value="maior_valor">Maior valor</option>
    <option value="menor_valor">Menor valor</option>
    <option value="categoria">Categoria ❯</option>
`;
window.aplicarFiltroTransacoes = function(valorFiltro) {
    const selectFiltro = document.getElementById("filtro-transacoes");
    if (!selectFiltro) return;

    if (valorFiltro === "voltar_filtros") {
        selectFiltro.innerHTML = opcoesFiltroOriginais;
        carregarTransacoesDoBanco();
        return;
    }

    if (valorFiltro.startsWith("cat_")) {
        const nomeDaCategoria = valorFiltro.replace("cat_", "");
        filtrarTabelaLocalPorCategoriaEspecifica(nomeDaCategoria);
        return;
    }

    if (valorFiltro === "categoria") {
        const token = obterToken();

        fetch('/categorias', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(lista => {
                lista.sort((a, b) => a.nome.localeCompare(b.nome));

                selectFiltro.blur();

                while (selectFiltro.options.length > 0) {
                    selectFiltro.remove(0);
                }

                const optVoltar = document.createElement("option");
                optVoltar.value = "voltar_filtros";
                optVoltar.textContent = "↩ Voltar aos Filtros";
                selectFiltro.appendChild(optVoltar);

                const optTitulo = document.createElement("option");
                optTitulo.value = "";
                optTitulo.disabled = true;
                optTitulo.selected = true;
                optTitulo.textContent = "Escolha uma Categoria";
                selectFiltro.appendChild(optTitulo);

                lista.forEach(cat => {
                    const option = document.createElement("option");
                    option.value = `cat_${cat.nome}`;
                    option.textContent = cat.nome;
                    selectFiltro.appendChild(option);
                });

                setTimeout(() => {
                    selectFiltro.focus();
                    const eventoClique = new MouseEvent('mousedown', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    selectFiltro.dispatchEvent(eventoClique);
                }, 50);
            })
            .catch(erro => console.error("Erro ao buscar sub-categorias para o select:", erro));
    } else {
        carregarTransacoesDoBanco(valorFiltro);
    }
};

function filtrarTabelaLocalPorCategoriaEspecifica(nomeCategoria) {
    const tabela = document.getElementById("tabela-transacoes");
    if (!tabela) return;

    for (let i = 0; i < tabela.rows.length; i++) {
        const celulaCategoria = tabela.rows[i].cells[2].textContent.trim();

        if (celulaCategoria.toLowerCase() === nomeCategoria.toLowerCase()) {
            tabela.rows[i].style.display = "";
        } else {
            tabela.rows[i].style.display = "none";
        }
    }
}


configurarEdicaoPerfilBackend();
configurarEdicaoSenhaBackend();
atualizarResumo();
