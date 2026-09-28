import { MDXRemote } from "next-mdx-remote/rsc";
import Callout from "./Callout";

// Somente conteúdo do repositório, revisado por pessoas autorizadas.
export default function EditorialContent({ source }) {
  return <div className="prose"><MDXRemote source={source} components={{ Callout }} /></div>;
}
