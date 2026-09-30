# Desafio — Uma empresa, seus produtos e sua equipe

Esta é a atividade prática do lab. A orientação de React, Next.js, MDX e do contrato do Webtech Editor está reunida no [guia básico](README.md). Conclua a página de exemplo do guia antes de iniciar.

A **Aurora Studio**, empresa fictícia de produtos para espaços de trabalho, precisa de uma página institucional. A equipe de comunicação deve conseguir cadastrar produtos, apresentar as pessoas e revisar os textos pelo Webtech Editor, sem editar componentes React. Modele os arquivos conforme o contrato do editor; a execução e a avaliação local não exigem autenticação no GitHub.

Você pode criar outro nome e identidade visual. Os dados devem ser fictícios. O objetivo é exercitar a arquitetura de conteúdo, não copiar o visual do Webtech.

## O que construir

Implemente a página inicial `/` com apresentação da empresa, seção de produtos, seção de equipe e navegação para essas seções. Apresente ao menos **3 produtos** e **3 integrantes**, com componentes React reutilizáveis e layout funcional em celular e desktop.

**Produtos e integrantes devem vir de arquivos `.mdx`.** Neste desafio, use um documento por produto e um por integrante. A apresentação da empresa também virá de `content/paginas/empresa.mdx`. Arrays com o catálogo dentro de `.js`, dados em `estrutura.json` ou textos de pessoas dentro dos componentes não atendem ao requisito.

Crie também `/produtos/[slug]` para exibir o corpo MDX de cada produto. Na home, mostre a biografia do integrante a partir do corpo do seu documento. Assim você exercita tanto metadados quanto conteúdo editorial, em vez de usar `.mdx` apenas como embalagem para YAML.

## Modelagem mínima

| Coleção | Arquivos | Frontmatter obrigatório | Corpo |
| --- | --- | --- | --- |
| `paginas` | `empresa.mdx` | `title`, `lead` | Apresentação da empresa |
| `produtos` | Um arquivo por produto | `name`, `category`, `description`, `image`, `alt` | Descrição detalhada, benefícios ou especificações |
| `equipe` | Um arquivo por pessoa | `name`, `position`, `image`, `alt` | Biografia curta |

Use `position` para o cargo: no Webtech Editor, `role` possui opções fixas próprias do Webtech. Imagens podem ser locais e precisam de descrição alternativa adequada. Não é necessário criar preço, compra, carrinho, autenticação ou uma API.

Exemplo de **um** produto, para orientar a escrita dos demais:

```mdx
---
name: Mesa modular
category: Escritório
description: Uma mesa que acompanha a rotina da equipe.
image: /images/produtos/mesa-modular/capa.webp
alt: Mesa de madeira clara com estrutura metálica preta
---

## Espaço para trabalhar

O tampo acomoda os equipamentos e permite diferentes configurações.

- Montagem simples.
- Organização de cabos.
- Acabamento de fácil limpeza.
```

Exemplo de **um** integrante:

```mdx
---
name: Ana Lima
position: Design de produto
image: /images/equipe/ana-lima/retrato.webp
alt: Retrato ilustrado de Ana Lima
---

Ana transforma necessidades do dia a dia em produtos funcionais.
Seu trabalho reúne **pesquisa**, desenho e prototipação.
```

Esses caminhos ilustram o contrato; adicione os arquivos de imagem correspondentes. Não copie a referência sem criar o recurso.

## Roteiro de implementação

1. Acrescente `produtos` e `equipe` a `cms/estrutura.json`, com `folder`, `extension` e todos os campos acima. Inclua `body` como `markdown` e preserve `paginas`.
2. Crie as pastas `content/produtos/` e `content/equipe/`, os seis documentos e o documento da empresa. Organize as imagens em `public/images/<coleção>/<slug>/`, com URLs `/images/<coleção>/<slug>/<arquivo>`, seguindo o Webtech Editor.
3. Substitua a home de apresentação do lab pela página institucional. Use `getContent("paginas", "empresa")` e `listContent` para as duas novas coleções.
4. Implemente `ProductCard` e `TeamCard` recebendo dados por props. Use o `slug` nas chaves React. Mantenha a leitura de arquivos e a compilação MDX no servidor.
5. Crie a rota de detalhe de produtos usando a página editorial existente como referência. Inclua título, imagem, corpo MDX, metadados e tratamento de slug inexistente.
6. Mostre o corpo da empresa e as biografias com `EditorialContent`. Acrescente links para os detalhes dos produtos.
7. Trate as coleções vazias com uma mensagem e escolha um comportamento explícito para a ausência do documento da empresa.
8. Confira responsividade, navegação por teclado, contraste e descrições de imagens. Rode as verificações e documente a entrega.

Rótulos da interface, como “Produtos” e “Voltar”, podem ficar no JSX. Nomes, cargos, descrições, biografias e imagens do catálogo devem vir dos documentos. Uma mesma coleção deve aceitar novos arquivos sem exigir alteração de arrays ou importações individuais.

## Critérios de aceite

- [ ] `/` mostra apresentação da empresa, pelo menos 3 produtos e 3 integrantes.
- [ ] Os conteúdos e caminhos das imagens vêm dos MDX correspondentes.
- [ ] O schema descreve as três coleções e seus campos.
- [ ] Os documentos usam Markdown no corpo e imagens em `/images/...`, conforme o contrato do Webtech Editor.
- [ ] Os componentes reutilizam props e não contêm um catálogo fixo.
- [ ] O corpo de `empresa.mdx`, dos produtos e dos integrantes é renderizado.
- [ ] Cada card de produto leva a `/produtos/<slug>`; slug inexistente mostra 404.
- [ ] Coleções vazias não quebram a home.
- [ ] Não há rolagem horizontal a 390 px; a página também funciona a 1280 px.
- [ ] Imagens têm texto alternativo; links são acessíveis por teclado.
- [ ] `npm run check` passa.
- [ ] A entrega explica o caminho do conteúdo desde o arquivo até a tela.

## Teste decisivo: conteúdo sem alteração de código

Com o servidor de desenvolvimento aberto, cadastre um quarto produto e um quarto integrante criando apenas MDX e imagens. Recarregue a página. Ambos devem aparecer sem alterar o JSX. Mude um nome e uma biografia nos arquivos e confira as mudanças. Remova temporariamente um desses novos documentos e confira que sua entrada desaparece.

Em produção, repita a verificação após um novo build/deploy. O teste não pressupõe que arquivos locais atualizem uma publicação já em execução.

## Entrega e avaliação

Inclua `ENTREGA.md` com instruções de execução, capturas de tela em desktop, resultados das verificações e respostas curtas:

1. O que o `estrutura.json` controla e o que precisa ser implementado em React/Next.js?
2. Qual a diferença entre coleção, slug, rota e pasta de imagens?
3. Como o frontmatter difere do corpo MDX?
4. Por que a leitura e a renderização ficam no servidor?
5. O que acontece entre salvar no editor e ver a alteração no site publicado?

| Critério | Pontos |
| --- | ---: |
| Conteúdo em MDX e consistência do schema | 30 |
| Leitor, rotas, componentes e renderização dos corpos | 30 |
| Responsividade, acessibilidade e estados vazios/404 | 20 |
| Verificação de novos documentos e explicação da arquitetura | 20 |

O teste decisivo de conteúdo é obrigatório: um layout completo com dados fixos não demonstra a competência central deste lab.

[Voltar ao guia básico](README.md).
