# Lab — React, Next.js e MDX com Webtech Editor

Aprenda a desenvolver uma aplicação React e Next.js cujo conteúdo segue o contrato do Webtech Editor: coleções em `cms/estrutura.json`, documentos `.mdx` e imagens em `public/images/`. O laboratório contém uma base executável, um roteiro guiado e um desafio: construir o site de uma empresa com produtos e equipe cadastrados em arquivos `.mdx`.


## Comece aqui

Requisitos: Node.js 22 ou superior e npm. O `.nvmrc` sugere Node 24. Não são necessários login, banco de dados nem variáveis de ambiente para executar o lab.

```bash
npm ci
npm run dev
```

Abra [localhost:3000](http://localhost:3000) e acesse o exemplo **Conteúdo que vira interface**. Se a porta estiver ocupada, use `npm run dev -- --port 3001`.

| Etapa | Material | Resultado esperado |
| --- | --- | --- |
| 1 · Entender | [Arquitetura de conteúdo](docs/01-arquitetura.md) | Distinguir schema, coleção, slug, conteúdo, rota e componente |
| 2 · Praticar | [Guia de desenvolvimento](docs/02-guia.md) | Criar e exibir uma nova página MDX |
| 3 · Aplicar | [Desafio da empresa](DESAFIO.md) | Implementar produtos e equipe com conteúdo editável |

## O que já funciona

- Leitura de coleções descritas em `cms/estrutura.json`.
- Separação de frontmatter YAML e corpo MDX com `gray-matter`.
- Listagem na home e rota `/paginas/[slug]`, com metadados e página de erro 404.
- Renderização no servidor com `next-mdx-remote/rsc`, com conteúdo Markdown para edição no Webtech Editor.
- Exemplo de imagem local, estilos responsivos e testes do leitor de conteúdo.

Os componentes de produtos, equipe e a página da empresa são a atividade do aluno. Eles não estão resolvidos nesta base.

## Organização

```text
app/                         rotas e layout Next.js
  paginas/[slug]/page.js      detalhe de uma página editorial
cms/estrutura.json           contrato de coleções do lab e do editor
components/                  apresentação em React e renderizador MDX
content/paginas/              documentos .mdx, um por slug
lib/content.mjs              acesso ao conteúdo, somente no servidor
public/images/paginas/       imagens do exemplo guiado
docs/                        arquitetura e roteiro de desenvolvimento
tests/                       comportamento do leitor
DESAFIO.md                   enunciado, critérios e entrega
```

**Contrato do editor:** `cms/estrutura.json` descreve cada coleção com `id`, `label`, `folder`, `extension` e `fields`. O Webtech Editor usa esse arquivo para localizar os documentos e iniciar seus campos. Veja os detalhes em [arquitetura](docs/01-arquitetura.md).

## Verificar e executar em produção local

```bash
npm run check
npm start
```

`check` executa lint, testes do leitor e build. Ele verifica a base técnica; os critérios da atividade são conferidos pelo checklist do desafio. Após mudar conteúdo numa execução de produção, refaça o build e reinicie. No desenvolvimento, recarregue a página.

O lockfile fixa a instalação. A aplicação didática usa Next.js 15, React 19 e `next-mdx-remote` 6 para apresentar os documentos. O Webtech Editor é uma aplicação separada: a integração depende do contrato de arquivos, não de usar as mesmas versões de suas dependências. O editor e a autenticação GitHub não estão incluídos nesta base.

## Referências

- [MDX no Next.js](https://nextjs.org/docs/app/guides/mdx).
- [next-mdx-remote: renderização com Server Components](https://github.com/hashicorp/next-mdx-remote#react-server-components-rsc--nextjs-app-directory-support).
- [gray-matter: extração de frontmatter](https://github.com/jonschlinkert/gray-matter).

O contrato do Webtech Editor e sua aplicação neste lab estão descritos em [docs/01-arquitetura.md](docs/01-arquitetura.md).
