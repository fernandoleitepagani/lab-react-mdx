import Link from "next/link";
import { notFound } from "next/navigation";
import EditorialContent from "@/components/EditorialContent";
import ProductCard from "@/components/ProductCard";
import TeamCard from "@/components/TeamCard";
import { getContent, listContent } from "@/lib/content.mjs";

export default async function Home() {
  const [empresa, produtos, equipe] = await Promise.all([
    getContent("paginas", "empresa"),
    listContent("produtos"),
    listContent("equipe"),
  ]);

  // Comportamento explícito (Fase 7): sem o documento institucional, não há home.
  if (!empresa) notFound();

  return (
    <>
      <article>
        <p className="eyebrow">Empresa</p>
        <h1>{empresa.frontmatter.title}</h1>
        <p className="lead">{empresa.frontmatter.lead}</p>
        <EditorialContent source={empresa.content} />
      </article>

      <nav className="section-nav" aria-label="Seções da página">
        <Link href="#produtos">Produtos</Link>
        <Link href="#equipe">Equipe</Link>
      </nav>

      <section id="produtos" aria-labelledby="produtos-titulo">
        <h2 id="produtos-titulo">Produtos</h2>
        {produtos.length ? (
          <ul className="grid">
            {produtos.map(({ slug, frontmatter }) => (
              <ProductCard
                key={slug}
                slug={slug}
                name={frontmatter.name}
                category={frontmatter.category}
                description={frontmatter.description}
                image={frontmatter.image}
                alt={frontmatter.alt}
              />
            ))}
          </ul>
        ) : (
          <p className="empty" role="status">
            Nenhum produto cadastrado.
          </p>
        )}
      </section>

      <section id="equipe" aria-labelledby="equipe-titulo">
        <h2 id="equipe-titulo">Equipe</h2>
        {equipe.length ? (
          <ul className="grid">
            {equipe.map(({ slug, frontmatter, content }) => (
              <TeamCard
                key={slug}
                name={frontmatter.name}
                position={frontmatter.position}
                image={frontmatter.image}
                alt={frontmatter.alt}
                content={content}
              />
            ))}
          </ul>
        ) : (
          <p className="empty" role="status">
            Nenhum integrante cadastrado.
          </p>
        )}
      </section>
    </>
  );
}