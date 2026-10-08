import Link from "next/link";

export default function ProductCard({ slug, name, category, description, image, alt }) {
  return (
    <li className="card card--media">
      <div className="card-media">
        <img src={image} alt={alt} />
      </div>
      <div className="card-body">
        <p className="eyebrow">{category}</p>
        <h3>
          <Link className="card-link" href={`/produtos/${slug}`}>
            {name}
          </Link>
        </h3>
        <p>{description}</p>
      </div>
    </li>
  );
}