// Página inicial: junta os módulos do clima e dos destaques.
// O comum.js (menu e rodapé) é carregado junto pelo destaques.js.
import { carregarClima } from "./clima.js";
import { carregarDestaques } from "./destaques.js";

carregarClima();
carregarDestaques();
