// Página Associe-se: carimbo de data/hora do formulário e janelas de benefícios.
import "./comum.mjs";

// Campo oculto com o momento em que a página foi carregada
const carimbo = document.querySelector("#carimbo");
if (carimbo) carimbo.value = new Date().toISOString();

// Cada botão "Ver benefícios" abre o <dialog> indicado em data-modal
let ultimoBotao = null;

document.querySelectorAll("[data-modal]").forEach((botao) => {
  botao.addEventListener("click", () => {
    const modal = document.getElementById(botao.dataset.modal);
    ultimoBotao = botao;
    modal.showModal();
  });
});

document.querySelectorAll(".modal").forEach((modal) => {
  modal.querySelector(".modal-fechar").addEventListener("click", () => modal.close());

  // Clique fora da caixa (no fundo) também fecha
  modal.addEventListener("click", (evento) => {
    if (evento.target === modal) modal.close();
  });

  // Devolve o foco ao botão que abriu a janela
  modal.addEventListener("close", () => ultimoBotao?.focus());
});

// Selecionar um nível pelo botão "Escolher" já preenche o formulário
document.querySelectorAll("[data-escolher]").forEach((botao) => {
  botao.addEventListener("click", () => {
    const select = document.querySelector("#nivel");
    select.value = botao.dataset.escolher;
    botao.closest("dialog")?.close();
    select.focus();
  });
});
