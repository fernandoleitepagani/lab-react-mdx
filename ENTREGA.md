# Entrega — Aurora Studio

Página institucional da Aurora Studio construída com React, Next.js (App Router) e MDX, seguindo o contrato de conteúdo do Webtech Editor descrito em `README.md` e `DESAFIO.md`.

## Como executar

Requisitos: Node.js 22 ou superior (o `.nvmrc` sugere Node 24) e npm.

```bash
npm ci
npm run dev
```

Abra `http://localhost:3000`. Se a porta estiver ocupada:

```bash
npm run dev -- --port 3001
```

Para validar lint, testes e build de produção:

```bash
npm run check
```

Para servir a build de produção localmente:

```bash
npm run build
npm start
```

## Capturas de tela

| Tela | Arquivo |
| --- | --- |
| Home em desktop (1280 px) | `docs/home-desktop.png` |
| Home em celular (390 px) | `docs/home-mobile.png` |
| Detalhe de produto | `docs/produto-desktop.png` |
| Página 404 para slug inexistente | `docs/404.png` |

## Resultado das verificações

- `npm run check`: passa (lint + testes do leitor + build).
- Rotas pré-renderizadas no build: `/`, `/paginas/[slug]`, `/produtos/[slug]`, `/_not-found`.
- Sem rolagem horizontal a 390 px; layout funcional a 1280 px.
- Navegação por teclado: skip link → cabeçalho → âncoras das seções → cards → rodapé, com foco visível em cada parada.
- Todas as imagens de produto e equipe têm `alt` vindo do frontmatter.
- Slug inexistente em `/produtos/<slug>` e `/paginas/<slug>` renderiza `app/not-found.js`.

## Teste decisivo: conteúdo sem alteração de código

Com o servidor de desenvolvimento aberto, criei `content/produtos/cadeira-alta.mdx`, `content/equipe/diego-souza.mdx` e as respectivas imagens em `public/images/...`. Recarreguei `/` e os dois novos itens apareceram sem alterar nenhum arquivo de componente.

Em seguida, mudei o `name` em `cadeira-alta.mdx` e acrescentei um parágrafo ao corpo. As mudanças apareceram em `/` e `/produtos/cadeira-alta` após recarregar.

Por fim, renomeei os dois arquivos novos para `.bak`. Recarreguei `/`. As entradas sumiram sem quebrar a página.

No modo de produção (`npm run build` + `npm start`), as alterações só aparecem depois de parar o servidor, refazer o build e iniciar de novo. Esse comportamento está descrito na resposta 5 abaixo.

## Respostas

### 1. O que o `estrutura.json` controla e o que precisa ser implementado em React/Next.js?

O `estrutura.json` declara as coleções (`paginas`, `produtos`, `equipe`), a pasta de cada uma (`content/<id>`), a extensão dos documentos (`mdx`) e os campos que o Webtech Editor deve exibir. Ele é o contrato entre o editor e a aplicação.

Em React/Next.js é preciso implementar: as rotas (`app/page.js`, `app/produtos/[slug]/page.js`, `app/paginas/[slug]/page.js`), a leitura dos arquivos via `lib/content.mjs`, os componentes de apresentação (`ProductCard`, `TeamCard`, `EditorialContent`), a renderização dos corpos MDX, os estilos, os estados vazios, o 404, a acessibilidade e a responsividade. O schema não cria páginas nem componentes: só descreve onde o conteúdo mora.

### 2. Qual a diferença entre coleção, slug, rota e pasta de imagens?

- Coleção: agrupamento de documentos com a mesma finalidade, como `produtos` ou `equipe`, declarado em `cms/estrutura.json`.
- Slug: identificador de um documento dentro da coleção. Vem do nome do arquivo sem a extensão (por exemplo, `mesa-modular` em `content/produtos/mesa-modular.mdx`).
- Rota: o caminho de URL que o Next.js atende. `/produtos/[slug]` recebe o slug e chama `getContent("produtos", slug)`.
- Pasta de imagens: onde os arquivos de mídia ficam em `public/images/<coleção>/<slug>/`. A URL usada no frontmatter é `/images/<coleção>/<slug>/<arquivo>`, sem o prefixo `public`.

### 3. Como o frontmatter difere do corpo MDX?

O frontmatter é o bloco YAML entre `---` no topo do arquivo. Guarda dados estruturados: `title`/`lead` para páginas, `name`/`category`/`description`/`image`/`alt` para produtos, `name`/`position`/`image`/`alt` para integrantes.

O corpo é o restante do arquivo, em Markdown. É renderizado por `EditorialContent` com `MDXRemote`. Na home, os cards usam apenas o frontmatter; a biografia de cada integrante e a descrição detalhada de cada produto vêm do corpo. Em `app/paginas/[slug]/page.js`, o título e a abertura vêm do frontmatter e o texto longo do corpo.

### 4. Por que a leitura e a renderização ficam no servidor?

Porque elas acessam o sistema de arquivos (`node:fs/promises`) e compilam MDX em tempo de renderização. Rodar isso no cliente exigiria enviar todos os `.mdx` e o compilador para o navegador, aumentaria o bundle e exporia a lógica do leitor. O arquivo `lib/content.mjs` importa `server-only` justamente para impedir uso acidental em componentes cliente. Como o conteúdo não depende de estado do navegador, Server Components resolvem tudo antes de enviar HTML.

### 5. O que acontece entre salvar no editor e ver a alteração no site publicado?

Fluxo: **Webtech Editor → rascunho → publicação no GitHub → build/deploy → aplicação atualizada**.

No editor, salvar guarda um rascunho no IndexedDB daquele navegador, por conta e repositório. Publicar envia as mudanças para a branch padrão do GitHub, verificando conflitos com os arquivos remotos. A aplicação em produção só mostra a nova versão depois que o deploy roda um novo build. Localmente, o `npm run dev` detecta alterações nos arquivos assim que o checkout recebe o commit. Em `npm start`, é necessário parar o servidor, refazer o build e iniciar de novo — um processo antigo continua servindo páginas e imagens anteriores.

## Estrutura entregue

```text
app/
layout.js                 estrutura compartilhada
page.js                   home institucional
not-found.js              404
    globals.css               estilos
paginas/[slug]/page.js    página editorial (base)
    produtos/[slug]/page.js   detalhe de produto
    components/
    EditorialContent.js
    ProductCard.js
    TeamCard.js
    Callout.js
    cms/
    estrutura.json            schema das três coleções
    content/
    paginas/empresa.mdx
    produtos/mesa-modular.mdx
    produtos/luminaria-foco.mdx
    produtos/organizador-cabos.mdx
    equipe/ana-lima.mdx
    equipe/bruno-costa.mdx
    equipe/carla-mendes.mdx
    lib/content.mjs             leitor server-only
    public/images/...           imagens locais
    docs/                       capturas de tela
    ```

## Escolhas explícitas

    - **Ausência de `empresa.mdx`**: `app/page.js` chama `notFound()` porque a home é a própria apresentação institucional. Sem ela, não há o que apresentar.
    - **Coleções vazias**: quando `produtos` ou `equipe` retornam `[]`, a seção exibe uma mensagem com `role="status"` e a página continua funcional.
    - **Nomes de campos**: usei `position` na equipe, conforme orientação do desafio, em vez de `role`.
    - **Formato das imagens**: a base executável usa SVG apenas como ilustração de exemplo. O Webtech Editor aceita PNG, JPEG, GIF, WebP e AVIF; para publicar via editor, troque os arquivos por um desses formatos mantendo os mesmos caminhos no frontmatter.
