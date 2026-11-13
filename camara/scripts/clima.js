// Clima de Ponta Grossa (PR) com a API do OpenWeatherMap:
// tempo atual e previsão de temperatura para os próximos 3 dias.

// Coloque aqui a SUA chave da API do OpenWeatherMap (appid).
const CHAVE_API = "4d4733bcac15e7ccd2e3cc340f0c368f";

// Coordenadas de Ponta Grossa, com 2 casas decimais
const LAT = -25.09;
const LON = -50.16;

const BASE = "https://api.openweathermap.org/data/2.5";
const PARAMETROS = `lat=${LAT}&lon=${LON}&units=metric&lang=pt_br&appid=${CHAVE_API}`;
const URL_ATUAL = `${BASE}/weather?${PARAMETROS}`;
const URL_PREVISAO = `${BASE}/forecast?${PARAMETROS}`;

const areaAtual = document.querySelector("#clima-atual");
const areaPrevisao = document.querySelector("#previsao");

async function buscar(url) {
  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error(await resposta.text());
  }
  return resposta.json();
}

// Primeira letra maiúscula: "nublado" vira "Nublado"
function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function mostrarTempoAtual(dados) {
  const evento = dados.weather[0];
  const icone = `https://openweathermap.org/img/wn/${evento.icon}@2x.png`;

  areaAtual.innerHTML = `
    <img class="clima-icone" src="${icone}" alt="${evento.description}" width="80" height="80">
    <div>
      <p class="clima-temp">${Math.round(dados.main.temp)}°C</p>
      <p class="clima-descricao">${capitalizar(evento.description)}</p>
    </div>
    <ul class="clima-detalhes">
      <li><span>Máxima</span><span>${Math.round(dados.main.temp_max)}°C</span></li>
      <li><span>Mínima</span><span>${Math.round(dados.main.temp_min)}°C</span></li>
      <li><span>Umidade</span><span>${dados.main.humidity}%</span></li>
    </ul>`;
}

// A previsão gratuita vem em blocos de 3 em 3 horas.
// Aqui os blocos são agrupados por dia e fica a maior e a menor temperatura de cada dia.
function mostrarPrevisao(dados) {
  const fuso = dados.city.timezone; // diferença em segundos em relação ao UTC
  const dias = new Map();

  dados.list.forEach((bloco) => {
    const dataLocal = new Date((bloco.dt + fuso) * 1000).toISOString().slice(0, 10);
    const dia = dias.get(dataLocal) ?? { max: -Infinity, min: Infinity };
    dia.max = Math.max(dia.max, bloco.main.temp_max);
    dia.min = Math.min(dia.min, bloco.main.temp_min);
    dias.set(dataLocal, dia);
  });

  const hoje = new Date((Date.now() / 1000 + fuso) * 1000).toISOString().slice(0, 10);
  const proximos = [...dias.entries()].filter(([data]) => data > hoje).slice(0, 3);

  const nomeDia = new Intl.DateTimeFormat("pt-BR", { weekday: "long", timeZone: "UTC" });

  areaPrevisao.innerHTML = proximos
    .map(([data, temp]) => {
      const nome = capitalizar(nomeDia.format(new Date(`${data}T12:00:00Z`)));
      return `<li>
        <span class="dia-semana">${nome}</span>
        <span class="max">${Math.round(temp.max)}°C</span>
        <span class="min">${Math.round(temp.min)}°C</span>
      </li>`;
    })
    .join("");
}

export async function carregarClima() {
  try {
    const [atual, previsao] = await Promise.all([buscar(URL_ATUAL), buscar(URL_PREVISAO)]);
    mostrarTempoAtual(atual);
    mostrarPrevisao(previsao);
  } catch (erro) {
    console.error(erro);
    areaAtual.innerHTML = "<p>Previsão indisponível no momento. Recarregue a página em alguns minutos.</p>";
    areaPrevisao.innerHTML = "";
  }
}
