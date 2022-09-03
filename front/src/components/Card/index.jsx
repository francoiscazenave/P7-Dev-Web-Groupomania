export default function Card(props) {
  return (
    <div className="card">
      <img src={props.imageUrl} alt={props.imageAlt} />
      <div className="card-body">
        <h2>{props.title}</h2>
        <p>{props.text}</p>
        <a href={`http://localhost:3000/${props.id}`}>Lire l'article</a>
      </div>
    </div>
  )
}
