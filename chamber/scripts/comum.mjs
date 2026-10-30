// Comportamentos compartilhados por todas as páginas:
// menu responsivo (hambúrguer) e dados dinâmicos do rodapé.

export function iniciarMenu() {
  const botao = document.querySelector("#menu-botao");
  const nav = document.querySelector("#navegacao");
  if (!botao || !nav) return;

  botao.addEventListener("click", () => {
    const aberto = nav.classList.toggle("aberta");
    botao.setAttribute("aria-expanded", String(aberto));
    botao.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  });

  // Fecha o menu com a tecla Esc e devolve o foco ao botão
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && nav.classList.contains("aberta")) {
      nav.classList.remove("aberta");
      botao.setAttribute("aria-expanded", "false");
      botao.setAttribute("aria-label", "Abrir menu");
      botao.focus();
    }
  });
}

export function preencherRodape() {
  const ano = document.querySelector("#ano-atual");
  const modificado = document.querySelector("#ultima-modificacao");
  if (ano) ano.textContent = new Date().getFullYear();
  if (modificado) {
    const data = new Date(document.lastModified);
    modificado.textContent = data.toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
    modificado.setAttribute("datetime", data.toISOString());
  }
}

// Busca um arquivo JSON e devolve o objeto; lança erro descritivo em caso de falha
export async function buscarJSON(url) {
  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error(`Não foi possível carregar ${url} (status ${resposta.status})`);
  }
  return resposta.json();
}

export const NOMES_NIVEL = {
  1: "Sem fins lucrativos",
  2: "Prata",
  3: "Ouro",
};

iniciarMenu();
preencherRodape();
