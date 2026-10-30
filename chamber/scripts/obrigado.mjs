// Página de agradecimento: lê os dados enviados pela URL (método GET) e mostra um resumo.
import "./comum.mjs";
const parametros = new URLSearchParams(window.location.search);
const resumo = document.querySelector("#resumo");

const NIVEIS = {
  "sem-fins-lucrativos": "Sem fins lucrativos",
  prata: "Prata",
  ouro: "Ouro",
};

const CAMPOS = [
  ["nome", "Nome"],
  ["sobrenome", "Sobrenome"],
  ["email", "E-mail"],
  ["celular", "Celular"],
  ["empresa", "Empresa ou organização"],
  ["nivel", "Nível de associação"],
  ["carimbo", "Pedido enviado em"],
];

function formatar(chave, valor) {
  if (chave === "nivel") return NIVEIS[valor] ?? valor;
  if (chave === "carimbo") {
    const data = new Date(valor);
    return Number.isNaN(data.getTime())
      ? valor
      : data.toLocaleString("pt-BR", { dateStyle: "long", timeStyle: "short" });
  }
  return valor;
}

if (!parametros.has("nome")) {
  resumo.outerHTML =
    '<p>Nenhum pedido foi recebido nesta visita. Para se associar, preencha o <a href="associe-se.html">formulário de associação</a>.</p>';
} else {
  for (const [chave, rotulo] of CAMPOS) {
    const valor = parametros.get(chave);
    if (!valor) continue;
    const linha = document.createElement("div");
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = rotulo;
    dd.textContent = formatar(chave, valor); // textContent evita injeção de HTML
    linha.append(dt, dd);
    resumo.append(linha);
  }
  const nome = document.querySelector("#nome-saudacao");
  nome.textContent = parametros.get("nome");
}
