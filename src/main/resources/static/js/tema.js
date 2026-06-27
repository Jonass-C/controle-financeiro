const body = document.body;

function aplicarTema(tema) {
    body.classList.remove("dark", "light");
    body.classList.add(tema);
}

const temaSalvo = localStorage.getItem("tema");

if (temaSalvo) {
    aplicarTema(temaSalvo);
} else {
    const temaSistema = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

    aplicarTema(temaSistema);
}

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
    if (!localStorage.getItem("tema")) {
        aplicarTema(e.matches ? "dark" : "light");
    }
});

function alternarTema() {
    const novoTema = body.classList.contains("dark") ? "light" : "dark";

    aplicarTema(novoTema);
    localStorage.setItem("tema", novoTema);
}

function usarTemaSistema() {
    localStorage.removeItem("tema");

    const temaSistema = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

    aplicarTema(temaSistema);
}