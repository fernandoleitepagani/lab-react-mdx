# 2. Guia de desenvolvimento

Ao final deste roteiro, você terá criado uma página editorial e entendido como reutilizar o mesmo fluxo para produtos e pessoas. Execute os comandos na raiz do lab.

## Passo 1 — Rode e localize as responsabilidades

```bash
npm ci
npm run dev
```

Abra `/` e `/paginas/boas-vindas`. Leia, nesta ordem: `cms/estrutura.json`, `content/paginas/boas-vindas.mdx`, `lib/content.mjs`, `app/paginas/[slug]/page.js` e `components/EditorialContent.js`.

**Checkpoint:** a home usa `frontmatter.title` para o card. O detalhe usa esse mesmo campo no título e passa `content` para o renderizador. Identifique as duas chamadas no código.

## Passo 2 — Crie uma página sem criar outra rota

Crie `content/paginas/nossa-historia.mdx`:

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

Abra `/paginas/nossa-historia` e recarregue `/`. O novo card deve aparecer. A pasta `[slug]` representa o segmento variável da URL; ela não se chama `nossa-historia` porque atende a todas as páginas dessa coleção.

No App Router usado aqui, leia os parâmetros assim:

```js
const { slug } = await params;
const doc = await getContent("paginas", slug);
if (!doc) notFound();
```

**Checkpoint:** abra `/paginas/arquivo-inexistente`. Deve aparecer a página 404, não um erro de leitura do disco.

## Passo 3 — Observe a separação entre dados e corpo

Altere `title` para outro texto e adicione um parágrafo ao corpo. Recarregue a listagem e o detalhe. O título muda nos dois lugares; o parágrafo aparece apenas no detalhe, porque a home não renderiza o corpo dos documentos.

Uma chamada ao leitor tem este contrato:

```js
{
  collection: "paginas",
  slug: "nossa-historia",
  frontmatter: { title: "Nossa história", lead: "..." },
  content: "\n## Como começamos\n..."
}
```

`getContent` devolve `null` quando um documento não existe ou o slug é inválido. `listContent` devolve uma lista ordenada por slug e retorna `[]` para uma pasta ainda ausente. Coleção desconhecida e YAML inválido geram erro explícito, pois indicam problemas de configuração ou edição.

**Checkpoint:** explique por que não se deve passar o arquivo inteiro, ainda com `---`, diretamente ao renderizador desta base.

## Passo 4 — Acrescente uma imagem

Crie `public/images/paginas/nossa-historia/`, coloque uma imagem própria nela e inclua no corpo:

```md
![Pessoas da equipe organizando um projeto](/images/paginas/nossa-historia/equipe.webp)
```

A extensão e o nome devem corresponder ao arquivo que você colocou na pasta. Abra a URL da imagem diretamente para conferir. Use um texto alternativo que descreva a informação relevante.

**Checkpoint:** diferencie o caminho no repositório (`public/images/...`) do endereço no navegador (`/images/...`). O Webtech Editor também usa essa organização; mantenha o caminho que ele devolver ao enviar uma imagem.

## Passo 5 — Entenda o limite entre Markdown e JSX

O exemplo `boas-vindas.mdx` usa Markdown no corpo para permitir o fluxo de edição do Webtech Editor. A interface é construída pelos componentes React da aplicação.

Como experiência opcional, feita apenas no código, adicione temporariamente este trecho ao documento:

```mdx
<Callout title="Experimente">
  Este conteúdo é recebido pelo componente React.
</Callout>
```

O registro acontece no renderizador:

```jsx
<MDXRemote source={source} components={{ Callout }} />
```

Altere o texto no MDX e o estilo de `.callout` no CSS para observar a divisão de responsabilidades. Não adicione `import` dentro do arquivo: nesta estratégia, o site fornece os componentes ao renderizador. A renderização RSC aceita `source` diretamente, sem a etapa cliente de `serialize`. [Referência](https://github.com/hashicorp/next-mdx-remote#react-server-components-rsc--nextjs-app-directory-support).

Depois de observar o resultado no navegador, remova o trecho JSX antes de editar o documento no Webtech Editor. Sua prévia usa Markdown e seu editor visual não garante suporte a componentes personalizados. Mantenha Markdown no corpo dos documentos do desafio.

**Checkpoint:** explique por que um componente JSX desconhecido pelo renderizador pode quebrar a página.

## Passo 6 — Planeje uma nova coleção

Antes de implementar produtos, responda:

1. Quais campos um card precisa receber?
2. Qual conteúdo precisa de parágrafos e deve ficar no corpo?
3. A coleção terá uma página de listagem, detalhe ou ambos?
4. Quais pastas, campos no schema e componentes serão necessários?

O percurso é cadastrar a coleção em `cms/estrutura.json`, criar `content/<coleção>/`, escrever os documentos e consumir `listContent` ou `getContent` em uma rota. Use `slug` como `key` ao renderizar uma lista. Um componente como `ProductCard` deve receber props, não ler o disco nem guardar um catálogo próprio.

## Passo 7 — Valide antes da entrega

```bash
npm run lint
npm test
npm run build
npm start
```

Pare o servidor de desenvolvimento antes de executar `npm start` na mesma porta. Confira a home, o exemplo, a página criada e uma URL inexistente. O build pré-renderiza os slugs retornados por `generateStaticParams`; criar um MDX na sua máquina não atualiza sozinho uma hospedagem já publicada.

## Problemas frequentes

| Sintoma | O que conferir |
| --- | --- |
| Erro no frontmatter | Indentação YAML; valores com `: ` devem estar entre aspas |
| Coleção desconhecida | O `id` usado na chamada e seu cadastro no schema |
| Novo arquivo não aparece | Pasta, extensão `.mdx`, slug em minúsculas e recarregamento; refaça o build em produção |
| Imagem retorna 404 | Arquivo em `public/`, nome exato e URL sem `/public` |
| Campo cadastrado não aparece na tela | O componente precisa consumir esse campo |
| Erro sobre Server Component | Remova a leitura de arquivos de componentes com `"use client"` |
| Componente MDX não encontrado | Registro em `EditorialContent.js` e uso exato de maiúsculas/minúsculas |
| Editor não encontra o schema | Ele procura `cms/estrutura.json` no repositório remoto |

Continue no [desafio](../DESAFIO.md).
