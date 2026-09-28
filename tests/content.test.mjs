import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createContentReader } from "../lib/content.mjs";

async function fixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), "lab-mdx-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, "cms"));
  await mkdir(path.join(root, "content/paginas"), { recursive: true });
  const schema = { collections: [
    { id: "paginas", folder: "content/paginas", extension: "mdx" },
    { id: "produtos", folder: "content/produtos", extension: "mdx" },
  ] };
  await writeFile(path.join(root, "cms/estrutura.json"), JSON.stringify(schema));
  const write = (name, source) => writeFile(path.join(root, "content/paginas", name), source);
  return { root, schema, write, ...createContentReader(root) };
}

test("separa metadados e corpo, preservando JSX e acentos", async (t) => {
  const { write, getContent } = await fixture(t);
  await write("ola.mdx", '---\ntitle: Olá\nlead: "Texto: exemplo"\n---\n<Callout title="Ação">Corpo</Callout>\n');
  const doc = await getContent("paginas", "ola");
  assert.deepEqual(doc.frontmatter, { title: "Olá", lead: "Texto: exemplo" });
  assert.equal(doc.slug, "ola");
  assert.equal(doc.collection, "paginas");
  assert.match(doc.content, /<Callout/);
  assert.doesNotMatch(doc.content, /lead:/);
});

test("descobre novos documentos, ordena por slug e ignora outros arquivos", async (t) => {
  const { root, write, listContent } = await fixture(t);
  await write("zeta.mdx", "---\ntitle: Zeta\n---\nTexto");
  await write("nota.txt", "Não é MDX");
  await mkdir(path.join(root, "content/paginas/pasta.mdx"));
  assert.deepEqual((await listContent("paginas")).map((doc) => doc.slug), ["zeta"]);
  await write("alfa.mdx", "---\ntitle: Alfa\n---\nTexto");
  assert.deepEqual((await listContent("paginas")).map((doc) => doc.slug), ["alfa", "zeta"]);
});

test("documento ausente retorna null e coleção sem pasta retorna lista vazia", async (t) => {
  const { getContent, listContent } = await fixture(t);
  assert.equal(await getContent("paginas", "ausente"), null);
  assert.deepEqual(await listContent("produtos"), []);
});

test("impede leitura por slugs fora da convenção e coleções desconhecidas", async (t) => {
  const { getContent, listContent } = await fixture(t);
  for (const slug of ["../segredo", "a/b", "Com Espaço", "", "a".repeat(101)]) {
    assert.equal(await getContent("paginas", slug), null);
  }
  await assert.rejects(listContent("nao-cadastrada"), /Coleção desconhecida/);
});

test("não oculta YAML inválido como se fosse documento inexistente", async (t) => {
  const { write, getContent } = await fixture(t);
  await write("quebrado.mdx", "---\ntitle: [sem fechamento\n---\nCorpo");
  await assert.rejects(getContent("paginas", "quebrado"));
});

test("recusa schema apontando para fora da convenção de conteúdo", async (t) => {
  const { root, schema, listContent } = await fixture(t);
  schema.collections[0].folder = "../outro-repositorio";
  await writeFile(path.join(root, "cms/estrutura.json"), JSON.stringify(schema));
  await assert.rejects(listContent("paginas"), /Use content\/paginas/);
});
