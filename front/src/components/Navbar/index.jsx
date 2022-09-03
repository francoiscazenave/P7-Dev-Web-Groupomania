import { useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'

import { getToken, removeUserSession } from '../../Utils/Common'

import Logo from '../../assets/icon-left-font-monochrome-white.png'
import { FaBars, FaTimes } from 'react-icons/fa'

export default function Navbar({ auth, setAuth }) {
  // état créé pour render la navbar lors de la déconnexion de l'utilisateur
  const [protect, setProtect] = useState(true)

  const navRef = useRef()

  const showNavbar = () => {
    navRef.current.classList.toggle('nav_responsive')
  }

  const deconnexion = () => {
    removeUserSession()
    setProtect(!protect)
    setAuth(false)
  }

  if (!auth && !getToken()) {
    return (
      <header>
        <img src={Logo} alt="Logo deGroupomania" className="logo" />
        <nav ref={navRef}>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? 'activeLink link' : 'link'
            }
          >
            Connexion
          </NavLink>
          <NavLink
            to="/signup"
            className={({ isActive }) =>
              isActive ? 'activeLink link' : 'link'
            }
          >
            S'inscrire
          </NavLink>
          <button className="nav_btn nav_close_btn" onClick={showNavbar}>
            <FaTimes />
          </button>
        </nav>
        <button className="nav_btn nav_menu_btn" onClick={showNavbar}>
          <FaBars />
        </button>
      </header>
    )
  }
  return (
    <header>
      <img src={Logo} alt="Logo deGroupomania" className="logo" />
      <nav ref={navRef}>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'activeLink link' : 'link')}
        >
          Tous les articles
        </NavLink>
        <NavLink
          to="/createPost"
          className={({ isActive }) => (isActive ? 'activeLink link' : 'link')}
        >
          Écrire
        </NavLink>
        <NavLink
          to="/login"
          className={({ isActive }) => (isActive ? 'activeLink link' : 'link')}
          onClick={deconnexion}
        >
          Déconnexion
        </NavLink>
        <button className="nav_btn nav_close_btn" onClick={showNavbar}>
          <FaTimes />
        </button>
      </nav>
      <button className="nav_btn nav_menu_btn" onClick={showNavbar}>
        <FaBars />
      </button>
    </header>
  )
}
