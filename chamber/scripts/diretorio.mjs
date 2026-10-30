// Diretório de membros: carrega o JSON, alterna entre grade e lista e filtra por nível.
import { buscarJSON, NOMES_NIVEL } from "./comum.mjs";

const area = document.querySelector("#membros");
const contagem = document.querySelector("#contagem");
const botaoGrade = document.querySelector("#ver-grade");
const botaoLista = document.querySelector("#ver-lista");
const filtro = document.querySelector("#filtro-nivel");

const CHAVE_VISAO = "camara-pg-visao";
let todos = [];

function cartao(m) {
  return `
    <article class="membro">
      <img src="images/${m.imagem}" alt="Logotipo da ${m.nome}" width="96" height="96" loading="lazy">
      <h2>${m.nome}</h2>
      <p class="categoria">${m.categoria} — associada desde ${m.desde}</p>
      <p class="descricao">${m.descricao}</p>
      <address>${m.endereco}</address>
      <p><a href="tel:${m.telefone.replace(/\D/g, "")}">${m.telefone}</a></p>
      <p><a href="${m.site}" target="_blank" rel="noopener">${m.site.replace("https://", "")}</a></p>
      <span class="etiqueta-nivel nivel-${m.nivel}">${NOMES_NIVEL[m.nivel]}</span>
    </article>`;
}

function exibir() {
  const nivel = filtro.value;
  const lista = nivel === "todos" ? todos : todos.filter((m) => String(m.nivel) === nivel);
  // Ouro primeiro, depois Prata e Sem fins lucrativos; dentro do nível, ordem alfabética
  const ordenada = [...lista].sort((a, b) => b.nivel - a.nivel || a.nome.localeCompare(b.nome, "pt-BR"));
  area.innerHTML = ordenada.map(cartao).join("");
  contagem.textContent =
    ordenada.length === 1 ? "1 membro encontrado" : `${ordenada.length} membros encontrados`;
}

function definirVisao(visao) {
  const grade = visao === "grade";
  area.classList.toggle("grade", grade);
  area.classList.toggle("lista", !grade);
  botaoGrade.setAttribute("aria-pressed", String(grade));
  botaoLista.setAttribute("aria-pressed", String(!grade));
  try {
    localStorage.setItem(CHAVE_VISAO, visao);
  } catch {
    /* armazenamento indisponível: segue sem lembrar a preferência */
  }
}

botaoGrade.addEventListener("click", () => definirVisao("grade"));
botaoLista.addEventListener("click", () => definirVisao("lista"));
filtro.addEventListener("change", exibir);

async function iniciar() {
  let salva = "grade";
  try {
    salva = localStorage.getItem(CHAVE_VISAO) ?? "grade";
  } catch {
    /* ignora */
  }
  definirVisao(salva);

  try {
    const dados = await buscarJSON("data/membros.json");
    todos = dados.membros;
    exibir();
  } catch (erro) {
    console.error(erro);
    area.innerHTML = "<p>Não foi possível carregar o diretório. Verifique sua conexão e recarregue a página.</p>";
    contagem.textContent = "";
  }
}

iniciar();
