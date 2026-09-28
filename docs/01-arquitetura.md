# 1. Como a arquitetura funciona

O Webtech Editor é a referência de conteúdo deste lab. Ele lê o schema e os documentos de um repositório GitHub e oferece uma interface de edição. A aplicação Next.js do exercício consome esses arquivos e decide como apresentá-los. Um texto pode mudar sem que a pessoa responsável por ele precise alterar um componente React.

## As responsabilidades

| Peça | Responsabilidade | Exemplo no lab |
| --- | --- | --- |
| React | Compor a interface a partir de props | `components/Callout.js` |
| Next.js | Definir rotas e executar a leitura no servidor | `app/paginas/[slug]/page.js` |
| MDX | Guardar conteúdo editorial, com possibilidade de JSX | `content/paginas/boas-vindas.mdx` |
| Frontmatter | Guardar dados estruturados no início do documento | `title`, `lead`, futuramente `name` e `description` |
| `estrutura.json` | Descrever coleções, pastas e campos do editor | `cms/estrutura.json` |
| Leitor | Localizar o arquivo e separar seus dados e corpo | `lib/content.mjs` |
| `public/` | Disponibilizar arquivos estáticos por URL | `public/images/paginas/boas-vindas/fluxo.svg` |

## O percurso de uma página

```text
cms/estrutura.json → coleção paginas → pasta content/paginas
                                           ↓
URL /paginas/boas-vindas → params.slug → boas-vindas.mdx
                                           ↓
                                      gray-matter
                                      /         \
                              frontmatter       content
                                  ↓                ↓
                           título e abertura    MDXRemote
                                      \         /
                                       página React
```

O schema não cria rotas ou componentes automaticamente. Ele também não é um banco de produtos nem um arquivo com os textos de todas as páginas. Adicionar uma coleção prepara o cadastro e a localização dos documentos; ainda precisamos implementar a apresentação.

## Coleção, slug e pastas

Uma **coleção** agrupa documentos com a mesma finalidade, como `produtos`. O **slug** identifica um documento dentro dela, como `mesa-modular`. Use letras minúsculas, números e hífens, sem espaços ou acentos.

```text
content/
  produtos/
    mesa-modular.mdx
    cadeira-ergonomica.mdx
  equipe/
    ana-lima.mdx
```

Aqui `produtos` é o nome da pasta de conteúdo e `mesa-modular` é o nome do arquivo sem extensão. **Neste lab, configure `folder` como `content/<coleção>` e `extension` como `mdx`**. O Webtech Editor monta o caminho como `<folder>/<slug>.<extension>`, resultando em `content/<coleção>/<slug>.mdx`. Uma pasta `content/<slug>/index.mdx` não é a organização adotada. O leitor do lab não percorre subpastas de documentos.

Uma pasta por slug é útil para imagens relacionadas:

```text
public/images/produtos/mesa-modular/capa.webp
```

No navegador, o endereço dessa imagem é `/images/produtos/mesa-modular/capa.webp`. A pasta `public` desaparece da URL. Um documento dentro de `content/` não é servido como arquivo público; sua apresentação depende de uma rota em `app/`.

## Frontmatter e corpo MDX

```mdx
---
name: Mesa modular
category: Escritório
description: Uma mesa para diferentes formas de trabalhar.
image: /images/produtos/mesa-modular/capa.webp
alt: Mesa de madeira clara com estrutura metálica
---

## Pensada para o dia a dia

O tampo acomoda **duas telas** e os acessórios de trabalho.
```

O bloco entre `---` é YAML. `gray-matter` devolve esse bloco como `data`, que o leitor renomeia para `frontmatter`, e o restante como `content`. Metadados alimentam cards, títulos e imagens; o corpo descreve o assunto com parágrafos, listas e outros elementos.

MDX permite combinar Markdown com JSX. Para o fluxo do Webtech Editor, este lab usa Markdown no corpo dos documentos: sua prévia usa `marked` e não executa componentes React personalizados. O guia inclui uma experiência opcional com JSX, feita no código da aplicação. Apenas dar a extensão `.mdx` a um arquivo não o transforma numa página: ele precisa ser lido e renderizado. O frontmatter também precisa de um parser, pois não faz parte da sintaxe MDX por si só. [Referências: Next.js](https://nextjs.org/docs/app/guides/mdx), [gray-matter](https://github.com/jonschlinkert/gray-matter).

## O contrato de `estrutura.json`

O lab usa o formato esperado pelo Webtech Editor:

```json
{
  "collections": [
    {
      "id": "produtos",
      "label": "Produtos",
      "folder": "content/produtos",
      "extension": "mdx",
      "fields": [
        { "name": "name", "label": "Nome", "widget": "string" },
        { "name": "description", "label": "Descrição", "widget": "text" },
        { "name": "body", "label": "Conteúdo", "widget": "markdown" }
      ]
    }
  ]
}
```

`id` é a chave usada no código. `folder` é relativa à raiz do repositório. `extension` não leva ponto. `fields[].name` identifica os campos; `body` representa o corpo, fora do YAML. Esse trecho é um exemplo de coleção: durante o desafio, acrescente a definição à lista existente, preservando `paginas`.

No lab, o leitor consulta `folder` e `extension` e exige `content/<id>` e `mdx`. Ele não valida campos obrigatórios nem todos os tipos do frontmatter. O Webtech Editor também não implementa um mecanismo completo de validação a partir de `widget`; seus controles dependem de nomes de campos e dos valores. Definir um campo no JSON não garante, sozinho, sua exibição na página ou sua validação.

## Contrato observado no Webtech Editor

Referência: `app-webtech-editor`, revisão `56dbe81`, consultada em 28/09/2026. Os caminhos abaixo são relativos ao repositório do editor.

| Aspecto | Comportamento do Webtech Editor | Aplicação no lab |
| --- | --- | --- |
| Schema | `app/editor/[owner]/[repo]/page.tsx` lê `cms/estrutura.json` | Manter esse caminho e cadastrar as coleções em `collections` |
| Documentos | O catálogo consulta `folder` e `extension`; `lib/cms-publish.mjs` monta o caminho do arquivo | Usar `content/<coleção>/<slug>.mdx` e consumir os arquivos no servidor |
| Campos | `components/cms/NewContentDialog.js` inicia campos de `fields`, deixando `body` fora do frontmatter | Modelar metadados simples e corpo Markdown |
| Imagens | `components/cms/CmsEditor.js` usa `/images/<coleção>/<slug>/<arquivo>`; a publicação grava em `public/images/...` | Usar o mesmo caminho nos exemplos e no desafio |
| Prévia | `app/api/cms/preview/route.ts` gera uma prévia genérica com `marked` | Conferir o layout final na aplicação Next.js; a prévia não executa suas páginas React |

O upload do editor aceita PNG, JPEG, GIF, WebP e AVIF. O SVG do exemplo é um recurso já versionado no repositório; para praticar o upload, use um dos formatos aceitos.

## Servidor e publicação

`fs` e o renderizador RSC ficam no servidor. Por isso o leitor importa `server-only`. Não coloque `"use client"` na página que importa esse leitor. Para acrescentar um filtro interativo, leia os dados no servidor e passe apenas os metadados necessários para um componente cliente.

O fluxo editorial esperado é: edição → rascunho → publicação no GitHub → build/deploy do site → nova versão disponível. Um rascunho não altera automaticamente o site. O lab gera páginas estáticas; em produção, mudanças de conteúdo precisam de uma nova compilação e publicação.

MDX pode representar código executável. Trabalhe com conteúdo versionado e revisado por autores autorizados; esta base não oferece compilação de MDX enviado por visitantes. [Referência do renderizador](https://github.com/hashicorp/next-mdx-remote#security).
