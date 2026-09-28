import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: { default: "Lab React + Next.js + MDX", template: "%s | Lab MDX" },
  description: "Laboratório de React, Next.js e MDX com o contrato de conteúdo do Webtech Editor.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
        <header><nav className="container" aria-label="Principal"><Link href="/">Webtech / Lab MDX</Link></nav></header>
        <main id="conteudo" className="container">{children}</main>
        <footer className="container">React, Next.js e conteúdo versionado.</footer>
      </body>
    </html>
  );
}
