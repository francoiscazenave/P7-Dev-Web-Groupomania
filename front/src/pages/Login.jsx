import React, { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import { setUserSession } from '../Utils/Common'
import { userSchema } from '../Utils/Validations/UserValidation'

export default function Login({ setAuth }) {
  const userRef = useRef()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setError('')
  }, [email, password])

  const handleSubmit = async (e) => {
    e.preventDefault()
    /*     setEmail('')
    setPassword('') */
    setError(null)
    setLoading(true)

    const userData = {
      email: email,
      password: password,
    }

    const isValid = await userSchema.isValid(userData)

    if (isValid) {
      axios
        .post('http://localhost:4000/api/auth/login', userData)
        .then((response) => {
          setLoading(false)
          setUserSession(response.data.token, response.data.userId)
          setAuth(true)
          navigate('/')
        })
        .catch((error) => {
          setLoading(false)
          if (error.response.status === 401 || error.response.status === 400) {
            setError(error.response.data.message)
          } else {
            setError('Something went wrong. Please try again later.')
          }
          console.log('error >>>', error)
        })
    } else {
      setError('Il y a des erreurs dans le formulaire')
    }
  }

  return (
    <section className="loginSignin">
      <h1 className="title">Groupomania</h1>
      <form className="form" onSubmit={handleSubmit}>
        <legend className="legend">
          Entrez vos identifiants de connexion :
        </legend>
        <label className="label" htmlFor="email">
          Adresse email :
        </label>
        <input
          type="text"
          name="email"
          id="email"
          ref={userRef}
          placeholder="Adresse email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />
        <label className="label" htmlFor="password">
          Mot de passe :
        </label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Mot de passe"
          required
        />
        <p className={error ? 'errMsg' : 'offscreen'} aria-live="assertive">
          {error}
        </p>
        <button type="submit" className="btn__form">
          {loading ? 'Chargement' : 'Se connecter'}
        </button>
      </form>
    </section>
  )
}
