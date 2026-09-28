# Lab — React, Next.js e MDX na arquitetura Webtech

Aprenda a separar conteúdo e apresentação usando a arquitetura do novo site Webtech e do Webtech Editor como referência. O laboratório contém uma base executável, um roteiro guiado e um desafio: construir o site de uma empresa com produtos e equipe cadastrados em arquivos `.mdx`.


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
- Renderização no servidor com `next-mdx-remote/rsc`, incluindo um componente React no MDX.
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
public/content/paginas/      imagens do exemplo guiado
docs/                        arquitetura e roteiro de desenvolvimento
tests/                       comportamento do leitor
DESAFIO.md                   enunciado, critérios e entrega
```

**Atenção ao nome do arquivo:** neste lab, `estrutura.json` fica em `cms/`, conforme o editor independente. O site de referência também tem um arquivo com esse nome na raiz, mas com outro formato. Veja o mapeamento em [arquitetura](docs/01-arquitetura.md).

## Verificar e executar em produção local

```bash
npm run check
npm start
```

`check` executa lint, testes do leitor e build. Ele verifica a base técnica; os critérios da atividade são conferidos pelo checklist do desafio. Após mudar conteúdo numa execução de produção, refaça o build e reinicie. No desenvolvimento, recarregue a página.

O lockfile fixa a instalação. A base utiliza Next.js 15 e React 19, acompanhando a geração do site de referência; o renderizador está na versão 6. A versão consultada do site usava `next-mdx-remote` 5. O lab não pretende reproduzir todas as dependências ou integrações do site.

## Referências

- [MDX no Next.js](https://nextjs.org/docs/app/guides/mdx).
- [next-mdx-remote: renderização com Server Components](https://github.com/hashicorp/next-mdx-remote#react-server-components-rsc--nextjs-app-directory-support).
- [gray-matter: extração de frontmatter](https://github.com/jonschlinkert/gray-matter).

A análise dos projetos locais e as diferenças entre suas implementações estão registradas em [docs/01-arquitetura.md](docs/01-arquitetura.md).
