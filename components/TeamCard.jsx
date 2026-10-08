import EditorialContent from "./EditorialContent";

export default function TeamCard({ name, position, image, alt, content }) {
  return (
    <li className="card card--media card--team">
      <div className="card-media">
        <img src={image} alt={alt} />
      </div>
      <div className="card-body">
        <p className="eyebrow">{position}</p>
        <h3>{name}</h3>
        <EditorialContent source={content} />
      </div>
    </li>
  );
}