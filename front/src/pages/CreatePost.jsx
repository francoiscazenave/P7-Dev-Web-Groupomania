import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { postSchema } from '../Utils/Validations/PostValidation'
import { getUser, getToken } from '../Utils/Common'

export default function CreatePost() {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [image, setImage] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const config = {
    headers: {
      Authorization: 'Bearer ' + getToken(),
      'Content-Type': 'multipart/form-data',
    },
  }

  const formData = new FormData()
  formData.append('id', uuidv4())
  formData.append('userId', getUser())
  formData.append('title', title)
  formData.append('text', text)
  formData.append('image', image)

  const navigate = useNavigate()

  const sendPost = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formCheck = {
      title: title,
      text: text,
    }

    const isValid = await postSchema.isValid(formCheck)

    if (isValid) {
      axios
        .post(`http://localhost:4000/api/posts/`, formData, config)
        .then((response) => {
          setLoading(false)
          navigate('/')
          console.log('response >>>', response)
        })
        .catch((error) => {
          setLoading(false)
          if (error.response.status === 401 || error.response.status === 400) {
            setError(error.response.data.message)
          } else {
            setError(
              "Quelque chose s'est mal passé. Veuillez réessayer plus tard."
            )
          }
          console.log('error >>>', error)
        })
    } else {
      setLoading(false)
      setError(
        'Le titre doit faire entre 2 et 30 caractères et le texte au moins 2 caractères'
      )
    }
  }

  return (
    <section className="createPost">
      <h1>Créer votre article</h1>
      <form className="form__createPost" onSubmit={sendPost}>
        <label htmlFor="title">Titre :</label>
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Votre titre"
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <label htmlFor="description">Description :</label>
        <textarea
          name="description"
          id="description"
          placeholder="Votre texte"
          onChange={(e) => setText(e.target.value)}
          required
        />
        <label htmlFor="image">Choisir votre image :</label>

        <input
          type="file"
          id="image"
          name="image"
          accept="image/png, image/jpeg, image/jpg"
          onChange={(e) => setImage(e.target.files[0])}
          required
        ></input>
        <p className={error ? 'errMsg' : 'offscreen'} aria-live="assertive">
          {error}
        </p>
        <button type="submit" className="btn__form">
          {loading ? 'Chargement' : 'Soumettre'}
        </button>
      </form>
    </section>
  )
}
