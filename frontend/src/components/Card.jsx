import "../styles/card.css";

export default function Card({ title, value }) {
  return (
    <div className="card">
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}