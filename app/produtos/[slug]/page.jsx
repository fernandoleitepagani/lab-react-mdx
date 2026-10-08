import Link from "next/link";
import { notFound } from "next/navigation";
import EditorialContent from "@/components/EditorialContent";
import { getContent, listContent } from "@/lib/content.mjs";

export async function generateStaticParams() {
  return (await listContent("produtos")).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const doc = await getContent("produtos", slug);
  return doc
    ? { title: doc.frontmatter.name, description: doc.frontmatter.description }
    : { title: "Produto não encontrado" };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const doc = await getContent("produtos", slug);
  if (!doc) notFound();

  const { name, category, description, image, alt } = doc.frontmatter;

  return (
    <article>
      <p className="eyebrow">{category}</p>
      <h1>{name}</h1>
      <p className="lead">{description}</p>

      <div className="product-cover">
        <img src={image} alt={alt} />
      </div>

      <EditorialContent source={doc.content} />

      <p className="back-link">
        <Link href="/#produtos">Voltar aos produtos</Link>
      </p>
    </article>
  );
}