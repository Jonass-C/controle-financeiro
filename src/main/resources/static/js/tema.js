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
    const icone = document.querySelector("#trocar-tema .icone-menu");
    if (icone) {
        icone.textContent = novoTema === "light" ? "dark_mode" : "light_mode";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const btnTrocarTema = document.getElementById("trocar-tema");

    if (btnTrocarTema) {
        btnTrocarTema.addEventListener("click", (e) => {
            e.preventDefault();
            alternarTema();
        });
    }
});