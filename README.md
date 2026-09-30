# Guia básico — React, Next.js e MDX com Webtech Editor

Este lab ensina a construir uma aplicação em que os componentes definem a apresentação e os arquivos MDX guardam o conteúdo. O contrato de arquivos segue o **Webtech Editor**. Ao terminar, você terá criado uma página editorial e estará pronto para construir o site de uma empresa.

O material está organizado em duas páginas: **este guia**, com os fundamentos e uma prática acompanhada, e o [desafio](DESAFIO.md), com a atividade e os critérios de entrega. A base executável já contém uma página de exemplo; produtos e equipe serão implementados por você no desafio.

## 1. Execute a base

Use Node.js 22 ou superior e npm. O `.nvmrc` sugere Node 24. Na pasta do repositório, execute:

```bash
npm ci
npm run dev
```

Abra [localhost:3000](http://localhost:3000) e acesse **Conteúdo que vira interface**. Se a porta estiver ocupada, use `npm run dev -- --port 3001` e abra a porta 3001. Não é necessário configurar login, banco de dados ou variáveis de ambiente para fazer o lab.

A base usa React 19, Next.js 15, `gray-matter` e `next-mdx-remote` 6. O lockfile fixa as versões instaladas. O Webtech Editor é uma aplicação separada: ele edita os arquivos do repositório, enquanto esta aplicação apresenta seu conteúdo.

## 2. Entenda o papel de React e Next.js

**React** organiza a interface em componentes: funções que recebem dados e devolvem JSX, uma sintaxe de marcação usada dentro do JavaScript. As informações recebidas são chamadas de **props**. Veja um componente de apresentação:

```jsx
function PageHeading({ title, lead }) {
  return (
    <header>
      <h1>{title}</h1>
      <p>{lead}</p>
    </header>
  );
}
```

As chaves inserem valores JavaScript no JSX. O componente pode receber os dados de qualquer documento: `<PageHeading title={doc.frontmatter.title} lead={doc.frontmatter.lead} />`. Assim, o mesmo visual atende a conteúdos diferentes. Uma prop especial, `children`, recebe o conteúdo colocado entre as tags de um componente. [Saiba mais sobre props no React](https://react.dev/learn/passing-props-to-a-component).

**Next.js** é o framework que organiza essa aplicação React, incluindo suas rotas e a execução no servidor. Esta base usa o **App Router**, no qual os arquivos dentro de `app/` definem as páginas:

| Arquivo | Papel |
| --- | --- |
| `app/layout.js` | Estrutura compartilhada: documento HTML, cabeçalho, rodapé e `children` da página atual |
| `app/page.js` | Página inicial, acessível em `/` |
| `app/paginas/[slug]/page.js` | Página com endereço variável, como `/paginas/boas-vindas` |
| `app/not-found.js` | Interface exibida quando a página chama `notFound()` |

A pasta `[slug]` recebe uma parte da URL. Em `/paginas/boas-vindas`, o parâmetro `slug` vale `boas-vindas`. Uma única implementação atende a vários documentos. Para navegar entre páginas, a base usa `Link`, de `next/link`. [Referência de páginas e layouts](https://nextjs.org/docs/app/getting-started/layouts-and-pages).

As páginas deste lab são **Server Components**: executam no servidor e podem ler os arquivos do projeto. Um componente que precise de estado, eventos ou APIs do navegador usa `"use client"`. Mantenha a leitura dos MDX no servidor; para um filtro interativo, por exemplo, passe os metadados necessários para um componente cliente. O leitor importa `server-only` para impedir seu uso acidental no cliente.

## 3. Separe conteúdo e apresentação

A organização do projeto acompanha essas responsabilidades:

```text
app/                         rotas, layout e estilos da aplicação
components/                  componentes React reutilizáveis
cms/estrutura.json           coleções e campos para o Webtech Editor
content/paginas/              arquivos MDX da coleção paginas
lib/content.mjs              leitura dos documentos no servidor
public/images/               imagens acessíveis pelo navegador
tests/                       testes do leitor de conteúdo
README.md                    este guia
DESAFIO.md                   atividade e critérios de entrega
```

Uma **coleção** agrupa documentos com a mesma finalidade. Um **slug** identifica um documento dentro dela. No arquivo `content/paginas/boas-vindas.mdx`, a coleção é `paginas` e o slug é `boas-vindas`. Use letras minúsculas, números e hífens, sem espaços ou acentos.

Neste lab, os documentos seguem `content/<coleção>/<slug>.mdx`. Não crie `content/<slug>/index.mdx`: o leitor busca arquivos diretamente na pasta da coleção. Já as imagens podem ter uma pasta por documento, como `public/images/paginas/boas-vindas/`.

### O que existe dentro de um MDX

Abra [content/paginas/boas-vindas.mdx](content/paginas/boas-vindas.mdx). O início tem este formato:

```mdx
---
title: Conteúdo que vira interface
lead: "Um arquivo, dois papéis: metadados para a interface e texto para a página."
---

## Do arquivo à tela

Este parágrafo faz parte do **corpo** do documento.
```

O bloco entre `---` é o **frontmatter**, escrito em YAML. Ele guarda dados estruturados, como título, descrição e caminho de imagem. O restante é o **corpo**, usado para parágrafos, subtítulos e listas. O parser `gray-matter` separa essas partes: o leitor devolve `frontmatter` como objeto e `content` como texto.

MDX permite combinar Markdown e JSX, mas o fluxo principal deste lab usa **Markdown no corpo**. A prévia do Webtech Editor usa `marked` e não executa componentes React personalizados. A aplicação Next.js renderiza o corpo com `MDXRemote`, de `next-mdx-remote/rsc`. O frontmatter precisa ser separado antes dessa renderização; a extensão `.mdx` não faz isso sozinha.

### Como o editor encontra os documentos

O [cms/estrutura.json](cms/estrutura.json) cadastra as coleções. A definição já disponível na base é:

```json
{
  "collections": [
    {
      "id": "paginas",
      "label": "Páginas",
      "folder": "content/paginas",
      "extension": "mdx",
      "fields": [
        { "name": "title", "label": "Título", "widget": "string" },
        { "name": "lead", "label": "Abertura", "widget": "text" },
        { "name": "body", "label": "Conteúdo", "widget": "markdown" }
      ]
    }
  ]
}
```

`id` identifica a coleção no código; `label` dá seu nome de apresentação. `folder` aponta para a pasta relativa à raiz do repositório e `extension` indica a extensão sem ponto. O editor monta o caminho `<folder>/<slug>.<extension>`.

`fields` descreve os campos. Cada `name` corresponde a um dado; `body` representa o corpo e fica fora do YAML. Nesta base, `folder` deve ser `content/<id>` e `extension` deve ser `mdx`. O editor aceita pastas configuráveis, mas o leitor didático usa essa convenção mais restrita.

**O schema não cria páginas nem componentes.** Cadastrar um campo também não faz com que ele apareça na tela: o React precisa consumi-lo. O leitor não valida campos obrigatórios, e os controles do editor dependem dos nomes e valores dos campos; não suponha validação completa de tipos apenas por declarar `widget`.

## 4. Acompanhe o caminho do arquivo até a tela

![Fluxo entre o arquivo MDX, o leitor e a página React](public/images/paginas/boas-vindas/fluxo.svg)

Quando alguém abre `/paginas/boas-vindas`, o Next.js entrega o slug à página. Ela chama `getContent("paginas", slug)`, o leitor consulta a coleção no schema e abre o MDX. O resultado tem este formato:

```js
{
  collection: "paginas",
  slug: "boas-vindas",
  frontmatter: { title: "Conteúdo que vira interface", lead: "..." },
  content: "\n## Do arquivo à tela\n..."
}
```

Em [app/paginas/[slug]/page.js](app/paginas/%5Bslug%5D/page.js), a parte principal da página usa esses dados assim:

```jsx
export default async function Page({ params }) {
  const { slug } = await params;
  const doc = await getContent("paginas", slug);
  if (!doc) notFound();

  return (
    <article>
      <h1>{doc.frontmatter.title}</h1>
      <p>{doc.frontmatter.lead}</p>
      <EditorialContent source={doc.content} />
    </article>
  );
}
```

Esse trecho resume a implementação existente: seus imports já estão no arquivo. `await` aguarda os parâmetros e a leitura assíncrona. `EditorialContent` recebe o corpo por uma prop e o entrega ao renderizador. O título e a abertura são apresentados separadamente, a partir do frontmatter.

Para mostrar uma coleção inteira, a [home](app/page.js) chama `listContent("paginas")` e usa `map` para criar um card por documento. A chave `key={slug}` identifica cada item da lista. Assim, novos arquivos entram na listagem sem exigir um array de conteúdo dentro do componente.

O [leitor](lib/content.mjs) devolve `null` para documento ausente ou slug inválido. Uma coleção cadastrada sem pasta retorna `[]` na listagem. Coleção desconhecida e YAML inválido geram erro explícito, pois indicam um problema de configuração ou edição. A rota também usa `generateMetadata` para o título do navegador e `generateStaticParams` para informar os slugs que serão pré-renderizados no build.

## 5. Pratique criando uma página

Agora aplique o mesmo fluxo a um novo documento. Crie `content/paginas/nossa-historia.mdx`:

```mdx
---
title: Nossa história
lead: Uma ideia que começou com um pequeno grupo.
---

## Como começamos

Nosso trabalho nasceu da vontade de resolver problemas cotidianos.

## O que valorizamos

- Clareza na comunicação.
- Cuidado com as pessoas.
- Produtos que fazem sentido.
```

Com `npm run dev` aberto, acesse `/paginas/nossa-historia` e recarregue `/`. A nova página e seu card devem aparecer. Você não precisou criar outra rota: a coleção já estava cadastrada e `[slug]` atende ao novo endereço.

Altere `title` e acrescente um parágrafo ao corpo. O título muda na listagem e no detalhe; o parágrafo aparece apenas no detalhe, porque a home usa somente os metadados. Depois, abra `/paginas/arquivo-inexistente` e confira a página 404.

Para incluir uma imagem, crie `public/images/paginas/nossa-historia/`, coloque uma imagem própria chamada `equipe.webp` e acrescente ao corpo:

```md
![Pessoas da equipe organizando um projeto](/images/paginas/nossa-historia/equipe.webp)
```

Use o nome e a extensão reais do arquivo. O prefixo `public` não aparece na URL. Abra `/images/paginas/nossa-historia/equipe.webp` diretamente para conferir. O Webtech Editor usa essa mesma organização nos uploads e aceita PNG, JPEG, GIF, WebP e AVIF. O SVG do exemplo inicial já está versionado no repositório; ele não é um exemplo de formato aceito pelo upload.

Para entender a capacidade adicional do MDX, você pode experimentar temporariamente `<Callout title="Experimente">Um destaque.</Callout>` no corpo. O componente está registrado em [components/EditorialContent.js](components/EditorialContent.js), por meio de `components={{ Callout }}`. Essa experiência é feita no código; remova o JSX antes de editar o documento no Webtech Editor. Mantenha Markdown nos documentos do desafio.

## 6. Entenda edição, publicação e atualização

No Webtech Editor, o schema e os documentos são lidos do GitHub. Salvar um rascunho guarda as mudanças no IndexedDB daquele navegador, por conta e repositório. Publicar envia as alterações à branch padrão, verificando conflitos com os arquivos remotos. A aplicação passa a mostrar a nova versão após seu build/deploy; o checkout local também precisa receber as alterações remotas.

```text
Webtech Editor → rascunho → publicação no GitHub → build/deploy → aplicação atualizada
```

A prévia do editor é genérica e não reproduz necessariamente o layout da sua aplicação. Confirme o resultado no Next.js. O lab não inclui o editor ou sua autenticação, e a integração depende do contrato de arquivos, não de usar as mesmas versões de dependências.

Estas convenções foram conferidas no Webtech Editor, revisão `56dbe81`: leitura de `cms/estrutura.json`, documentos em `<folder>/<slug>.<extension>`, uploads em `public/images/` e prévia com `marked`. Use conteúdo MDX versionado e revisado por autores autorizados, pois MDX pode representar código executável.

## 7. Verifique o resultado e siga para o desafio

Para verificar a base e executar uma versão de produção local:

```bash
npm run check
npm start
```

`check` executa lint, os testes do leitor e o build. Pare o servidor de desenvolvimento antes de usar a mesma porta com `npm start`. Em produção, **pare o servidor, refaça o build e reinicie após alterar conteúdo ou mover imagens**: um processo antigo pode continuar servindo páginas e caminhos anteriores. Durante os exercícios, prefira `npm run dev` e recarregue a página.

| Se acontecer… | Confira… |
| --- | --- |
| Erro no frontmatter | Indentação YAML; valores com `: ` devem estar entre aspas |
| Coleção desconhecida | Cadastro e `id` em `cms/estrutura.json` |
| Novo documento não aparece | Pasta, extensão `.mdx`, slug e atualização da aplicação |
| Imagem retorna 404 | Arquivo em `public/images/`, URL sem `/public` e reinício após mudar arquivos em produção |
| Campo não aparece na tela | Se o componente consome o valor do frontmatter |
| Erro de Server Component | Se algum componente cliente está importando o leitor de arquivos |
| Editor não encontra o schema | Se `cms/estrutura.json` existe no repositório remoto |

Você concluiu a prática quando a nova página aparece na home, título e corpo mudam ao editar o MDX, a imagem carrega e um slug inexistente mostra 404. Para criar outra coleção, o percurso será o mesmo: cadastrar o schema, escrever os documentos e implementar sua apresentação.

**Continue no [desafio — uma empresa, seus produtos e sua equipe](DESAFIO.md).** Ele reúne o que construir, a modelagem, os critérios de aceite e a entrega.

Para aprofundar: [MDX no Next.js](https://nextjs.org/docs/app/guides/mdx), [renderização com next-mdx-remote](https://github.com/hashicorp/next-mdx-remote#react-server-components-rsc--nextjs-app-directory-support) e [frontmatter com gray-matter](https://github.com/jonschlinkert/gray-matter).
