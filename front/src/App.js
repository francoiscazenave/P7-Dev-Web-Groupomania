import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { getUser, getToken } from './Utils/Common'
import PrivateRoute from './Utils/PrivateRoute'
import PublicRoute from './Utils/PublicRoute'

import Navbar from './components/Navbar/index'
import Footer from './components/Footer/index'
import Home from './pages/Home'
import Login from './pages/Login'
import Signin from './pages/Signup'
import Post from './pages/Post'
import CreatePost from './pages/CreatePost'
import Error from './pages/Error'
import './styles/App.css'

function App() {
  const [auth, setAuth] = useState(false)

  const changeStatus = () => {
    if (getUser && getToken) {
      setAuth(true)
    } else {
      setAuth(false)
    }
  }

  return (
    <BrowserRouter>
      <Navbar auth={auth} setAuth={setAuth} />
      <Routes>
        <Route element={<PublicRoute auth={auth} />}>
          <Route path="/login" element={<Login setAuth={changeStatus} />} />
          <Route path="/signup" element={<Signin />} />
        </Route>
        <Route element={<PrivateRoute auth={auth} />}>
          <Route index element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/:id" element={<Post />} />
          <Route path="/createPost" element={<CreatePost />} />
        </Route>
        <Route path="/*" element={<Error />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
