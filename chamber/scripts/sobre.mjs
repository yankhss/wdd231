// Página Sobre: mensagem de visita (localStorage) e montagem de imagens a partir do JSON.
import { buscarJSON } from "./comum.mjs";

const CHAVE_VISITA = "camara-pg-ultima-visita";
const UM_DIA = 24 * 60 * 60 * 1000;

function mensagemVisita() {
  const aviso = document.querySelector("#aviso-visita");
  const texto = document.querySelector("#texto-visita");
  const agora = Date.now();
  let anterior = null;

  try {
    anterior = Number(localStorage.getItem(CHAVE_VISITA)) || null;
    localStorage.setItem(CHAVE_VISITA, String(agora));
  } catch {
    return; // sem armazenamento, sem mensagem
  }

  if (!anterior) {
    texto.textContent = "Boas-vindas! Fique à vontade para conhecer Ponta Grossa.";
  } else {
    const dias = Math.floor((agora - anterior) / UM_DIA);
    if (dias < 1) {
      texto.textContent = "Que bom ver você de novo tão rápido!";
    } else {
      texto.textContent = `Sua última visita foi há ${dias} ${dias === 1 ? "dia" : "dias"}.`;
    }
  }

  aviso.hidden = false;
  document.querySelector("#fechar-aviso").addEventListener("click", () => {
    aviso.hidden = true;
  });
}

async function montagem() {
  const area = document.querySelector("#montagem");
  try {
    const { lugares } = await buscarJSON("data/lugares.json");
    area.innerHTML = lugares
      .map(
        (l, i) => `
      <figure class="lugar">
        <img src="images/${l.imagem}" alt="${l.alt}" width="600" height="400"
          ${i === 0 ? "" : 'loading="lazy"'}>
        <figcaption>
          <h3>${l.nome}</h3>
          <p class="local">${l.local}</p>
          <p>${l.descricao}</p>
        </figcaption>
      </figure>`
      )
      .join("");
  } catch (erro) {
    console.error(erro);
    area.innerHTML = "<p>As imagens dos pontos turísticos não carregaram. Recarregue a página.</p>";
  }
}

mensagemVisita();
montagem();
