import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: { default: "Aurora Studio", template: "%s | Aurora Studio" },
  description: "Móveis e objetos para espaços de trabalho que acompanham as pessoas.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
        <header>
          <nav className="container" aria-label="Principal">
            <Link href="/">Aurora Studio</Link>
          </nav>
        </header>
        <main id="conteudo" className="container">{children}</main>
        <footer className="container">Aurora Studio — conteúdo versionado em MDX.</footer>
      </body>
    </html>
  );
}