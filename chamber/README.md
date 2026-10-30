# Câmara de Comércio de Ponta Grossa

Projeto do site da Câmara de Comércio com HTML, CSS e JavaScript puros.
Autora: Yankha. Empresas, eventos e contatos são fictícios.

## Como abrir

As páginas usam módulos JavaScript e `fetch` para ler os arquivos JSON, por isso
precisam de um servidor local (abrir o arquivo direto com duplo clique não funciona):

- VS Code: clique com o botão direito em `index.html` → **Open with Live Server**; ou
- Terminal, dentro da pasta: `python -m http.server` e acesse `http://localhost:8000`.

Para publicar, envie a pasta para o GitHub e ative o GitHub Pages.

## Estrutura

```
chamber/
├── index.html        Página inicial: herói, eventos, clima, números e destaques
├── sobre.html        História, dados atuais, eventos recentes e montagem de imagens
├── diretorio.html    Membros em grade ou lista, com filtro por nível
├── associe-se.html   Formulário de associação e os 3 níveis com janelas de benefícios
├── obrigado.html     Resumo do pedido enviado (lido da URL)
├── data/
│   ├── membros.json  9 membros (nivel: 1 = sem fins lucrativos, 2 = prata, 3 = ouro)
│   └── lugares.json  8 lugares da montagem de imagens
├── images/           Ilustrações em WebP e logotipo em SVG
├── scripts/          Um módulo por página + comum.mjs (menu e rodapé)
└── styles/main.css   Estilo único, mobile-first, consultas de mídia em 40em e 64em
```

## Onde cada requisito é atendido

| Requisito | Onde |
|---|---|
| HTML semântico e válido | `header`, `nav`, `main`, `section`, `article`, `figure`, `dl`, `time`, `address`, `dialog` |
| Design consistente | Cabeçalho, navegação e rodapé idênticos em todas as páginas; página atual marcada no menu |
| Responsivo | Mobile-first, menu hambúrguer abaixo de 64em, grades que se reorganizam em 40em e 64em |
| Previsão do tempo | `scripts/inicio.mjs` – clima atual + 3 dias (API Open-Meteo, sem chave) |
| Destaques de empresas | Sorteio aleatório de membros Ouro/Prata a cada visita |
| Chamadas para ação | Botões do herói (“Quero me associar”, “Conhecer os membros”) |
| Montagem de imagens | `sobre.html` com `grid-template-areas`, `loading="lazy"` e efeito de mouse só em telas grandes |
| Mensagem de visita | `localStorage` informa há quantos dias foi a última visita |
| Diretório | `fetch` do JSON, alternância grade/lista lembrada no `localStorage` |
| Formulário | Campos obrigatórios, `pattern` no cargo (mín. 7 letras/hífens), carimbo de data/hora oculto, envio via GET |
| Níveis de associação | Cartões com animação de entrada e `<dialog>` com os benefícios |
| Acessibilidade | Link “pular para o conteúdo”, foco visível, `aria-current`, `aria-pressed`, `prefers-reduced-motion` |

## Personalizar

- **Fotos reais:** substitua os arquivos em `images/` mantendo os mesmos nomes
  (lugares em 600×400, logotipos em 200×200, herói em 800×400 e 1600×800).
- **Membros e lugares:** edite os JSON em `data/`.
- **OpenWeatherMap:** se o professor exigir essa API, troque `URL_CLIMA` em
  `scripts/inicio.mjs` pela URL da OpenWeatherMap com sua chave e ajuste os campos lidos.
