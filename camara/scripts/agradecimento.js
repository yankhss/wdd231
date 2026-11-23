// Página de agradecimento: lê os dados do formulário na URL
// e mostra os campos obrigatórios enviados.
// O comum.js cuida do menu e do rodapé.
import "./comum.js";

const parametros = new URLSearchParams(window.location.search);
const listaDados = document.querySelector("#dados-pedido");

const campos = [
  { chave: "nome", rotulo: "Nome" },
  { chave: "sobrenome", rotulo: "Sobrenome" },
  { chave: "email", rotulo: "E-mail" },
  { chave: "celular", rotulo: "Celular" },
  { chave: "organizacao", rotulo: "Empresa ou organização" },
  { chave: "timestamp", rotulo: "Data e hora do pedido" },
];

function formatarDataHora(valor) {
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) {
    return valor;
  }
  return data.toLocaleString("pt-BR", { dateStyle: "long", timeStyle: "short" });
}

function obterValor(chave) {
  const valor = parametros.get(chave)?.trim();
  if (!valor) {
    return "Não informado";
  }
  return chave === "timestamp" ? formatarDataHora(valor) : valor;
}

// textContent evita que algo digitado na URL seja interpretado como HTML
campos.forEach(({ chave, rotulo }) => {
  const termo = document.createElement("dt");
  termo.textContent = rotulo;

  const descricao = document.createElement("dd");
  descricao.textContent = obterValor(chave);

  listaDados.append(termo, descricao);
});

if (!parametros.has("nome")) {
  const aviso = document.createElement("p");
  aviso.textContent = "Nenhum pedido foi encontrado. Preencha o formulário na página Associe-se.";
  listaDados.before(aviso);
}
