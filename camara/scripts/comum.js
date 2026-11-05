// Comportamentos usados em todas as páginas da câmara:
// menu responsivo e informações do rodapé.

export const NOMES_NIVEL = {
  1: "Membro",
  2: "Prata",
  3: "Ouro",
};

function iniciarMenu() {
  const botao = document.querySelector("#menu-botao");
  const nav = document.querySelector("#navegacao");
  if (!botao || !nav) return;

  botao.addEventListener("click", () => {
    const aberto = nav.classList.toggle("aberta");
    botao.setAttribute("aria-expanded", String(aberto));
    botao.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  });
}

function preencherRodape() {
  // Ano dos direitos autorais
  document.querySelector("#ano-atual").textContent = new Date().getFullYear();

  // Data da última modificação do documento
  document.querySelector("#ultima-modificacao").textContent = document.lastModified;
}

iniciarMenu();
preencherRodape();
