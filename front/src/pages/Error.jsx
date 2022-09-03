import ErrorImg from '../assets/error.jpeg'

export default function Error() {
  return (
    <section className="error">
      <h1>Erreur 404</h1>
      <p>Cette page n'existe pas</p>
      <img src={ErrorImg} alt="error" />
    </section>
  )
}
