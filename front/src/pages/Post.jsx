import { useEffect, useState } from 'react'
import { getUser, getToken } from '../Utils/Common'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { postSchema } from '../Utils/Validations/PostValidation'
import { FaRegThumbsUp } from 'react-icons/fa'

export default function Post() {
  const [post, setPost] = useState({})
  const [imageAlt, setImageAlt] = useState('')
  const [modif, setModif] = useState(false)
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [image, setImage] = useState()
  const [like, setLike] = useState()
  const [likeActive, setLikeActive] = useState(true)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const { REACT_APP_ADMIN_ID } = process.env
  const { id } = useParams()
  let navigate = useNavigate()

  // Hooks qui récupére les informations du post
  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
    axios
      .get(`http://localhost:4000/api/posts/${id}`, config)
      .then((data) => {
        setPost(data.data)
        setImageAlt(data.data.imageUrl.split('/images/')[1].split('.')[0])
        setLike(data.data.likes)
        const userLike = data.data.usersLiked.includes(getUser())
        if (!userLike) {
          setLikeActive(false)
        }
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
  }, [id])

  const handleReturn = () => {
    navigate('/')
  }

  // fonction qui gère la suppression du post pour le créateur et l'administrateur
  const handleDelete = () => {
    const config = {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
    axios
      .delete(`http://localhost:4000/api/posts/${id}`, config)
      .then(() => {
        navigate('/')
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
  }

  // fonction qui gère l'affichage du formulaire de modification du post pour le créateur
  const handleChange = () => {
    setModif(true)
    setTitle(post.title)
    setText(post.text)
  }

  // fonction qui gère l'envoie des modifications du post
  const sendPost = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const config = {
      headers: {
        Authorization: 'Bearer ' + getToken(),
        'Content-Type': 'multipart/form-data',
      },
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('text', text)
    if (image) {
      formData.append('image', image)
    }

    const formCheck = {
      title: title,
      text: text,
    }

    const isValid = await postSchema.isValid(formCheck)

    if (isValid || image) {
      axios
        .put(`http://localhost:4000/api/posts/${id}`, formData, config)
        .then((response) => {
          setLoading(false)
          setModif(false)
          navigate('/')
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

  // fonction qui gère les likes
  const handleLike = () => {
    setLikeActive(true)
    const config = {
      headers: {
        Authorization: 'Bearer ' + getToken(),
      },
    }
    axios
      .post(`http://localhost:4000/api/posts/${id}/like`, { like: 1 }, config)
      .then((response) => {
        setLike(like + 1)
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
  }

  if (!modif) {
    return (
      <main className="main">
        <h1>{post.title}</h1>
        <p>{post.text}</p>
        <img src={post.imageUrl} alt={imageAlt} />
        <div className="like__container">
          <div className="wrapper">
            <div className="radio_group">
              {likeActive ? (
                <input
                  type="radio"
                  name="like"
                  onChange={handleLike}
                  checked={likeActive}
                />
              ) : (
                <input
                  type="radio"
                  name="like"
                  onChange={handleLike}
                  checked={likeActive}
                />
              )}
              <label htmlFor="like">
                <FaRegThumbsUp />
              </label>
            </div>
            <p className="count">
              {like} {like > 1 ? 'Likes' : 'Like'}
            </p>
          </div>
        </div>
        <div>
          <button className="btn__form btn__post" onClick={handleReturn}>
            Retour
          </button>
          {getUser() === post.userId || getUser() === REACT_APP_ADMIN_ID ? (
            <>
              <button className="btn__form btn__post" onClick={handleChange}>
                Modifier
              </button>
              <button className="btn__form btn__post" onClick={handleDelete}>
                Supprimer
              </button>
            </>
          ) : (
            <></>
          )}
        </div>
      </main>
    )
  } else {
    return (
      <section className="createPost">
        <h1>
          {getUser() === REACT_APP_ADMIN_ID
            ? 'Modération du post'
            : 'Modifier votre post'}
        </h1>
        <form className="form__createPost" onSubmit={sendPost}>
          <label htmlFor="title">Titre :</label>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <br />
          <label htmlFor="description">Description :</label>
          <textarea
            cols="130"
            rows="15"
            name="description"
            id="description"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
          <label htmlFor="picture">Choisir votre image :</label>

          <input
            type="file"
            id="image"
            name="image"
            accept="image/png, image/jpeg, image/jpg"
            onChange={(e) => setImage(e.target.files[0])}
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
}
