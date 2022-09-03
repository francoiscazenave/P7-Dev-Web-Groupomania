import { useEffect, useState } from 'react'
import axios from 'axios'
import { getToken } from '../Utils/Common'
import Card from '../components/Card/index'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
    axios
      .get(`http://localhost:4000/api/posts/`, config)
      .then((data) => {
        setPosts(data.data)
      })
      .catch((error) => {
        if (error.response.status === 401 || error.response.status === 400) {
          setError(error.response.data.message)
        } else {
          setError(
            "Quelque chose s'est mal passé. Veuillez réessayer plus tard."
          )
        }
        console.log('error >>>', error)
      })
  }, [])

  return (
    <section className="home">
      <h1>Tous les articles</h1>
      <p className={error ? 'errMsg' : 'offscreen'} aria-live="assertive">
        {error}
      </p>
      <div className="cards">
        {posts.map((post) => (
          <Card
            key={post._id}
            title={post.title}
            text={post.text}
            imageUrl={post.imageUrl}
            imageAlt={post.imageUrl.split('/images/')[1].split('.')[0]}
            id={post._id}
          />
        ))}
      </div>
    </section>
  )
}
