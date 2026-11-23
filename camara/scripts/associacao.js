// Página de associação: registro de data e hora do formulário
// e janelas (modais) com os benefícios de cada nível.
// O comum.js cuida do menu e do rodapé.
import "./comum.js";

// Data e hora em que o formulário foi carregado
const campoTimestamp = document.querySelector("#timestamp");
campoTimestamp.value = new Date().toISOString();

// Cada botão "Ver benefícios" abre o modal indicado em data-modal
const botoesBeneficios = document.querySelectorAll("[data-modal]");

botoesBeneficios.forEach((botao) => {
  botao.addEventListener("click", () => {
    const modal = document.getElementById(botao.dataset.modal);
    modal.showModal();
  });
});

// Fecha o modal pelo botão "Fechar" ou com um clique fora da caixa
const modais = document.querySelectorAll(".modal-nivel");

modais.forEach((modal) => {
  modal.querySelector(".fechar-modal").addEventListener("click", () => {
    modal.close();
  });

  modal.addEventListener("click", (evento) => {
    if (evento.target === modal) {
      modal.close();
    }
  });
});
