// Página do diretório: busca os membros no JSON com fetch + async/await
// e permite alternar entre visualização em grade e em lista.
import { NOMES_NIVEL } from "./comum.js";

const URL_MEMBROS = "dados/membros.json";

const area = document.querySelector("#membros");
const contagem = document.querySelector("#contagem");
const botaoGrade = document.querySelector("#ver-grade");
const botaoLista = document.querySelector("#ver-lista");
const filtro = document.querySelector("#filtro-nivel");

let membros = [];

// Busca os dados de forma assíncrona
async function buscarMembros() {
  try {
    const resposta = await fetch(URL_MEMBROS);
    if (!resposta.ok) {
      throw new Error(`Erro ao carregar os membros: ${resposta.status}`);
    }
    const dados = await resposta.json();
    membros = dados.membros;
    exibirMembros();
  } catch (erro) {
    console.error(erro);
    area.innerHTML = "<p>Não foi possível carregar o diretório. Recarregue a página.</p>";
    contagem.textContent = "";
  }
}

// Monta o cartão de um membro
function criarCartao(membro) {
  const classeNivel = membro.nivel === 3 ? "nivel-ouro" : membro.nivel === 2 ? "nivel-prata" : "nivel-membro";
  const telefone = membro.telefone.replace(/\D/g, "");
  const siteSemProtocolo = membro.site.replace("https://", "");

  return `
    <article class="membro ${classeNivel}">
      <img src="images/${membro.imagem}" alt="Logotipo da ${membro.nome}" width="88" height="88" loading="lazy">
      <h2>${membro.nome}</h2>
      <p class="categoria">${membro.categoria} · associada desde ${membro.desde}</p>
      <p class="descricao">${membro.descricao}</p>
      <address>${membro.endereco}</address>
      <p><a href="tel:+55${telefone}">${membro.telefone}</a></p>
      <p><a href="${membro.site}" target="_blank" rel="noopener">${siteSemProtocolo}</a></p>
      <span class="etiqueta-nivel nivel-${membro.nivel}">${NOMES_NIVEL[membro.nivel]}</span>
    </article>`;
}

// Exibe os membros de acordo com o filtro escolhido
function exibirMembros() {
  const nivel = filtro.value;
  const filtrados = nivel === "todos" ? membros : membros.filter((m) => String(m.nivel) === nivel);

  // Ouro primeiro, depois Prata e Membro; dentro de cada nível, ordem alfabética
  const ordenados = [...filtrados].sort(
    (a, b) => b.nivel - a.nivel || a.nome.localeCompare(b.nome, "pt-BR")
  );

  area.innerHTML = ordenados.map(criarCartao).join("");
  contagem.textContent =
    ordenados.length === 1 ? "1 membro encontrado" : `${ordenados.length} membros encontrados`;
}

// Alterna entre grade e lista
function definirVisao(visao) {
  const grade = visao === "grade";
  area.classList.toggle("grade", grade);
  area.classList.toggle("lista", !grade);
  botaoGrade.setAttribute("aria-pressed", String(grade));
  botaoLista.setAttribute("aria-pressed", String(!grade));
}

botaoGrade.addEventListener("click", () => definirVisao("grade"));
botaoLista.addEventListener("click", () => definirVisao("lista"));
filtro.addEventListener("change", exibirMembros);

buscarMembros();
