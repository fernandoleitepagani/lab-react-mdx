import "server-only";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const validSlug = (value) => typeof value === "string"
  && value.length <= 100 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

// O root permite exercitar o leitor com arquivos temporários nos testes.
export function createContentReader(root = process.cwd()) {
  async function getCollection(collection) {
    const schema = JSON.parse(await readFile(path.join(root, "cms/estrutura.json"), "utf8"));
    const definition = schema.collections.find((item) => item.id === collection);
    if (!validSlug(collection) || !definition) throw new Error(`Coleção desconhecida: ${collection}`);
    // Este lab adota uma convenção mais restrita que o editor genérico.
    if (definition.folder !== `content/${collection}` || definition.extension !== "mdx") {
      throw new Error(`Use content/${collection} e extension mdx no schema.`);
    }
    return definition;
  }

  async function getContent(collection, slug) {
    const definition = await getCollection(collection);
    if (!validSlug(slug)) return null;
    const file = path.join(root, definition.folder, `${slug}.mdx`);
    let source;
    try {
      source = await readFile(file, "utf8");
    } catch (error) {
      if (error.code === "ENOENT") return null;
      throw error;
    }
    // Erros de YAML devem aparecer: não os transformamos em um 404 silencioso.
    const { data: frontmatter, content } = matter(source);
    return { collection, slug, frontmatter, content };
  }

  async function listContent(collection) {
    const definition = await getCollection(collection);
    let entries;
    try {
      entries = await readdir(path.join(root, definition.folder), { withFileTypes: true });
    } catch (error) {
      if (error.code === "ENOENT") return [];
      throw error;
    }
    const slugs = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
      .map((entry) => entry.name.slice(0, -4));
    const documents = await Promise.all(slugs.map((slug) => getContent(collection, slug)));
    return documents.filter(Boolean).sort((a, b) => a.slug.localeCompare(b.slug));
  }

  return { getContent, listContent };
}

export const { getContent, listContent } = createContentReader();
