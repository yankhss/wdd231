// Página inicial: clima atual, previsão de 3 dias e destaques de membros.
import { buscarJSON, NOMES_NIVEL } from "./comum.mjs";

// Coordenadas de Ponta Grossa (PR)
const LAT = -25.095;
const LON = -50.162;

// Open-Meteo: API de clima gratuita que não exige chave
const URL_CLIMA =
  `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
  "&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m" +
  "&daily=weather_code,temperature_2m_max,temperature_2m_min" +
  "&timezone=America%2FSao_Paulo&forecast_days=4";

// Códigos WMO → descrição em português e ícone
const CONDICOES = {
  0: ["Céu limpo", "sol"],
  1: ["Predomínio de sol", "sol"],
  2: ["Parcialmente nublado", "nuvem-sol"],
  3: ["Nublado", "nuvem"],
  45: ["Neblina", "neblina"],
  48: ["Neblina com geada", "neblina"],
  51: ["Garoa fraca", "chuva"],
  53: ["Garoa", "chuva"],
  55: ["Garoa forte", "chuva"],
  61: ["Chuva fraca", "chuva"],
  63: ["Chuva", "chuva"],
  65: ["Chuva forte", "chuva"],
  80: ["Pancadas de chuva", "chuva"],
  81: ["Pancadas de chuva", "chuva"],
  82: ["Pancadas fortes", "chuva"],
  95: ["Trovoadas", "tempestade"],
  96: ["Trovoadas com granizo", "tempestade"],
  99: ["Trovoadas com granizo", "tempestade"],
};

const ICONES = {
  sol: '<circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/>',
  nuvem: '<path d="M7 18h10a4 4 0 0 0 .5-8 6 6 0 0 0-11.4 1.6A3.3 3.3 0 0 0 7 18z"/>',
  "nuvem-sol": '<path d="M8 4.5V3M3.5 8H2M4.8 4.8l-1-1M12.2 4.8l1-1"/><path d="M5.2 10.5a3.5 3.5 0 0 1 6.3-3"/><path d="M8 20h9a3.6 3.6 0 0 0 .4-7.2 5.4 5.4 0 0 0-10.2 1.5A2.9 2.9 0 0 0 8 20z"/>',
  chuva: '<path d="M7 15h10a4 4 0 0 0 .5-8 6 6 0 0 0-11.4 1.6A3.3 3.3 0 0 0 7 15z"/><path d="M8 18l-1 3M12 18l-1 3M16 18l-1 3"/>',
  tempestade: '<path d="M7 15h10a4 4 0 0 0 .5-8 6 6 0 0 0-11.4 1.6A3.3 3.3 0 0 0 7 15z"/><path d="M12 15l-2 4h3l-2 4"/>',
  neblina: '<path d="M4 9h16M2 13h20M5 17h14"/>',
};

function condicao(codigo) {
  return CONDICOES[codigo] ?? ["Tempo variável", "nuvem"];
}

function icone(nome, classe = "clima-icone") {
  return `<svg class="${classe}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONES[nome]}</svg>`;
}

async function carregarClima() {
  const atual = document.querySelector("#clima-atual");
  const previsao = document.querySelector("#previsao");

  try {
    const dados = await buscarJSON(URL_CLIMA);
    const c = dados.current;
    const [descricao, nomeIcone] = condicao(c.weather_code);

    atual.innerHTML = `
      ${icone(nomeIcone)}
      <div>
        <p class="clima-temp">${Math.round(c.temperature_2m)}°C</p>
        <p class="clima-descricao">${descricao}</p>
      </div>
      <ul class="clima-detalhes">
        <li><span>Máxima / mínima hoje</span><span>${Math.round(dados.daily.temperature_2m_max[0])}° / ${Math.round(dados.daily.temperature_2m_min[0])}°</span></li>
        <li><span>Sensação térmica</span><span>${Math.round(c.apparent_temperature)}°C</span></li>
        <li><span>Umidade</span><span>${c.relative_humidity_2m}%</span></li>
        <li><span>Vento</span><span>${Math.round(c.wind_speed_10m)} km/h</span></li>
      </ul>`;

    // Próximos 3 dias (índices 1, 2 e 3 — o índice 0 é hoje)
    const formatoDia = new Intl.DateTimeFormat("pt-BR", { weekday: "long", timeZone: "UTC" });
    const itens = [1, 2, 3].map((i) => {
      const dia = formatoDia.format(new Date(dados.daily.time[i]));
      const [desc] = condicao(dados.daily.weather_code[i]);
      return `<li>
        <span><strong>${dia.charAt(0).toUpperCase() + dia.slice(1)}</strong><br>${desc}</span>
        <span class="max">${Math.round(dados.daily.temperature_2m_max[i])}°</span>
        <span class="min">${Math.round(dados.daily.temperature_2m_min[i])}°</span>
      </li>`;
    });
    previsao.innerHTML = itens.join("");
  } catch (erro) {
    console.error(erro);
    const msg = '<p>Previsão indisponível no momento. Recarregue a página em alguns minutos.</p>';
    atual.innerHTML = msg;
    previsao.innerHTML = "";
  }
}

// Embaralha uma cópia do vetor (Fisher–Yates)
function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

async function carregarDestaques() {
  const area = document.querySelector("#destaques");
  try {
    const { membros } = await buscarJSON("data/membros.json");
    // Apenas membros Ouro (3) e Prata (2), sorteados a cada visita
    const elegiveis = membros.filter((m) => m.nivel >= 2);
    const quantidade = window.matchMedia("(min-width: 64em)").matches ? 3 : 2;
    const escolhidos = embaralhar(elegiveis).slice(0, quantidade);

    area.innerHTML = escolhidos
      .map(
        (m) => `
      <article class="destaque ${m.nivel === 3 ? "ouro" : "prata"}">
        <img src="images/${m.imagem}" alt="Logotipo da ${m.nome}" width="72" height="72" loading="lazy">
        <h3>${m.nome}</h3>
        <p class="categoria">${m.categoria}</p>
        <ul class="detalhes">
          <li>${m.endereco}</li>
          <li><a href="tel:${m.telefone.replace(/\D/g, "")}">${m.telefone}</a></li>
          <li><a href="${m.site}" target="_blank" rel="noopener">Visitar site</a></li>
          <li><span class="etiqueta-nivel nivel-${m.nivel}">Membro ${NOMES_NIVEL[m.nivel]}</span></li>
        </ul>
      </article>`
      )
      .join("");
  } catch (erro) {
    console.error(erro);
    area.innerHTML = '<p>Os destaques não carregaram. Veja todos os membros no <a href="diretorio.html">diretório</a>.</p>';
  }
}

carregarClima();
carregarDestaques();
