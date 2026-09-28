# 1. Como a arquitetura funciona

O conteúdo é escrito em MDX, o editor oferece uma interface de edição e o site decide como apresentar cada documento. Um texto pode mudar sem que a pessoa responsável por ele precise alterar um componente React.

## As responsabilidades

| Peça | Responsabilidade | Exemplo no lab |
| --- | --- | --- |
| React | Compor a interface a partir de props | `components/Callout.js` |
| Next.js | Definir rotas e executar a leitura no servidor | `app/paginas/[slug]/page.js` |
| MDX | Guardar conteúdo editorial, com possibilidade de JSX | `content/paginas/boas-vindas.mdx` |
| Frontmatter | Guardar dados estruturados no início do documento | `title`, `lead`, futuramente `name` e `description` |
| `estrutura.json` | Descrever coleções, pastas e campos do editor | `cms/estrutura.json` |
| Leitor | Localizar o arquivo e separar seus dados e corpo | `lib/content.mjs` |
| `public/` | Disponibilizar arquivos estáticos por URL | `public/content/paginas/boas-vindas/fluxo.svg` |

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

Aqui `produtos` é o nome da pasta de conteúdo e `mesa-modular` é o nome do arquivo sem extensão. Quando alguém fala em criar `/content/slug/`, vale explicitar qual dessas duas coisas deseja criar. **O padrão adotado neste lab e encontrado no site é `content/<coleção>/<slug>.mdx`**, não `content/<slug>/index.mdx`. O leitor não percorre subpastas de documentos.

Uma pasta por slug é útil para imagens relacionadas:

```text
public/content/produtos/mesa-modular/capa.webp
```

No navegador, o endereço dessa imagem é `/content/produtos/mesa-modular/capa.webp`. A pasta `public` desaparece da URL. Um documento dentro de `content/` não é servido como arquivo público; sua apresentação depende de uma rota em `app/`.

## Frontmatter e corpo MDX

```mdx
---
name: Mesa modular
category: Escritório
description: Uma mesa para diferentes formas de trabalhar.
image: /content/produtos/mesa-modular/capa.webp
alt: Mesa de madeira clara com estrutura metálica
---

## Pensada para o dia a dia

O tampo acomoda **duas telas** e os acessórios de trabalho.
```

O bloco entre `---` é YAML. `gray-matter` devolve esse bloco como `data`, que o leitor renomeia para `frontmatter`, e o restante como `content`. Metadados alimentam cards, títulos e imagens; o corpo descreve o assunto com parágrafos, listas e outros elementos.

MDX permite combinar Markdown com JSX. No exemplo guiado, `<Callout>` é um componente registrado pelo site. Apenas dar a extensão `.mdx` a um arquivo não o transforma numa página: ele precisa ser lido e renderizado. O frontmatter também precisa de um parser, pois não faz parte da sintaxe MDX por si só. [Referências: Next.js](https://nextjs.org/docs/app/guides/mdx), [gray-matter](https://github.com/jonschlinkert/gray-matter).

## O contrato de `estrutura.json`

O lab usa o formato esperado pelo editor independente:

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

No lab, o leitor consulta `folder` e `extension` e exige `content/<id>` e `mdx`. Ele não valida campos obrigatórios nem todos os tipos do frontmatter. O editor consultado também não implementa um mecanismo completo de validação a partir de `widget`; seus controles dependem de nomes de campos e dos valores. Definir um campo no JSON não garante, sozinho, sua exibição na página ou sua validação.

## Relação com os projetos Webtech

Leitura realizada em 28/09/2026, com os checkouts sem alterações locais: `site-webtech-novo` em `a180f01` e `app-webtech-editor` em `56dbe81`. Os caminhos abaixo são relativos a cada repositório, para que o guia possa ser compartilhado.

| Aspecto | Novo site Webtech | Webtech Editor independente | Escolha do lab |
| --- | --- | --- | --- |
| Schema | `estrutura.json` na raiz tem modelos `frontmatter`; `lib/cms-schema.mjs` também mantém coleções e templates em código | Busca `cms/estrutura.json` com `folder`, `extension` e `fields` | Um único `cms/estrutura.json` no formato do editor |
| Leitura | `lib/content.js` delega para `getPublished`/`listPublished` de `lib/backend/content.mjs`; essas funções leem MDX do disco | Consulta pastas e documentos pelo GitHub | Leitor local simplificado, sem autenticação |
| Renderização | Rotas como `app/projetos/[slug]/page.js` usam `MDXRemote` | `app/api/cms/preview/route.ts` usa `marked` para prévia genérica | `MDXRemote` no servidor |
| Imagens | Exemplos em `public/content/<coleção>/<slug>/` | Upload usa `/images/<coleção>/<slug>/...`, publicado em `public/images/...` | Exemplo manual em `public/content`; uploads do editor seguem `public/images` |
| Equipe | `lib/team.js` combina GitHub, conteúdo editorial MDX e badges | Edita os documentos das coleções cadastradas | Equipe inteiramente em MDX, como requisito didático |

O nome `backend` não significa que os textos estejam sendo buscados no banco: na revisão consultada, o código de conteúdo publicado lê o filesystem. Documentos antigos de arquitetura podem refletir etapas anteriores da migração.

As duas variantes de schema não são intercambiáveis sem adaptação. Este lab explicita um contrato de referência; ele não modifica nem unifica os projetos Webtech.

## Servidor e publicação

`fs` e o renderizador RSC ficam no servidor. Por isso o leitor importa `server-only`. Não coloque `"use client"` na página que importa esse leitor. Para acrescentar um filtro interativo, leia os dados no servidor e passe apenas os metadados necessários para um componente cliente.

O fluxo editorial esperado é: edição → rascunho → publicação no GitHub → build/deploy do site → nova versão disponível. Um rascunho não altera automaticamente o site. O lab gera páginas estáticas; em produção, mudanças de conteúdo precisam de uma nova compilação e publicação.

MDX pode representar código executável. Trabalhe com conteúdo versionado e revisado por autores autorizados; esta base não oferece compilação de MDX enviado por visitantes. [Referência do renderizador](https://github.com/hashicorp/next-mdx-remote#security).
