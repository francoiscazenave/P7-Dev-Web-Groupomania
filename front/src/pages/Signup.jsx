import { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { userSchema } from '../Utils/Validations/UserValidation'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const userRef = useRef()
  const errRef = useRef()

  // A supprimer plus tard
  console.log(errRef)

  let navigate = useNavigate()

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setError('')
  }, [email, password])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const userData = {
      email: email,
      password: password,
    }

    const isValid = await userSchema.isValid(userData)

    if (isValid) {
      axios
        .post('http://localhost:4000/api/auth/signup', userData)
        .then((response) => {
          setLoading(false)
          navigate('/login')
        })
        .catch((error) => {
          setLoading(false)
          if (error.response.status === 401 || error.response.status === 400) {
            setError(`${error.message} : 
            Identifiant ou mot de passe incorrect`)
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
        'Il y a des erreurs dans le formulaire (le mot de passe doit faire au minimum 5 caractères), ou le mail existe déjà'
      )
    }
  }

  return (
    <section className="loginSignin">
      <h1 className="title">Groupomania</h1>
      <form className="form">
        <legend>Créer vos identifiants de connexion :</legend>
        <label htmlFor="email">Adresse email :</label>
        <input
          type="text"
          name="email"
          id="email"
          ref={userRef}
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Mot de passe :</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <p
          ref={errRef}
          className={error ? 'errMsg' : 'offscreen'}
          aria-live="assertive"
        >
          {error}
        </p>
        <button type="submit" className="btn__form" onClick={handleSubmit}>
          {loading ? 'Chargement' : 'Créer un compte'}
        </button>
      </form>
    </section>
  )
}
