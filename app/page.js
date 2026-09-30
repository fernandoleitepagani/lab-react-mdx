import Link from "next/link";
import { listContent } from "@/lib/content.mjs";

export default async function Home() {
  const pages = await listContent("paginas");
  return (
    <>
      <p className="eyebrow">Laboratório de desenvolvimento</p>
      <h1>Uma interface.<br />Muitos conteúdos.</h1>
      <p className="lead">Explore o exemplo, entenda o fluxo de publicação e construa a página de uma empresa.</p>
      <section aria-labelledby="exemplos">
        <h2 id="exemplos">Páginas vindas de MDX</h2>
        {pages.length ? <ul className="grid">{pages.map(({ slug, frontmatter }) => (
          <li key={slug} className="card"><h3><Link href={`/paginas/${slug}`}>{frontmatter.title || slug}</Link></h3><p>{frontmatter.lead}</p></li>
        ))}</ul> : <p>Nenhuma página cadastrada.</p>}
      </section>
      <section><h2>Seu próximo passo</h2><p>O README reúne toda a orientação de React, Next.js e MDX. Depois da prática guiada, siga o DESAFIO.md para construir a página da sua empresa com produtos e equipe carregados dos arquivos MDX.</p></section>
    </>
  );
}
