// Membros em destaque: sorteia 2 ou 3 membros Ouro ou Prata a cada visita.
import { NOMES_NIVEL } from "./comum.js";

const URL_MEMBROS = "dados/membros.json";
const area = document.querySelector("#destaques");

// Embaralha uma cópia da lista (algoritmo de Fisher–Yates)
function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function criarCartao(membro) {
  const telefone = membro.telefone.replace(/\D/g, "");
  const classe = membro.nivel === 3 ? "nivel-ouro" : "nivel-prata";

  return `
    <article class="destaque ${classe}">
      <img src="images/${membro.imagem}" alt="Logotipo da ${membro.nome}" width="72" height="72" loading="lazy">
      <h3>${membro.nome}</h3>
      <p class="categoria">${membro.categoria}</p>
      <ul class="detalhes">
        <li>${membro.endereco}</li>
        <li><a href="tel:+55${telefone}">${membro.telefone}</a></li>
        <li><a href="${membro.site}" target="_blank" rel="noopener">${membro.site.replace("https://", "")}</a></li>
        <li><span class="etiqueta-nivel nivel-${membro.nivel}">Membro ${NOMES_NIVEL[membro.nivel]}</span></li>
      </ul>
    </article>`;
}

export async function carregarDestaques() {
  try {
    const resposta = await fetch(URL_MEMBROS);
    if (!resposta.ok) {
      throw new Error(`Erro ao carregar os membros: ${resposta.status}`);
    }
    const dados = await resposta.json();

    const ouroEPrata = dados.membros.filter((m) => m.nivel === 2 || m.nivel === 3);
    // 3 destaques em telas grandes, 2 em telas menores
    const quantidade = window.matchMedia("(min-width: 64em)").matches ? 3 : 2;
    const escolhidos = embaralhar(ouroEPrata).slice(0, quantidade);

    area.innerHTML = escolhidos.map(criarCartao).join("");
  } catch (erro) {
    console.error(erro);
    area.innerHTML = '<p>Os destaques não carregaram. Veja todos os membros no <a href="diretorio.html">diretório</a>.</p>';
  }
}
