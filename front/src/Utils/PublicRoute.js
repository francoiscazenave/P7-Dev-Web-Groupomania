import { Navigate, Outlet } from 'react-router-dom'
import { getToken } from './Common'

export default function PublicRoute({ auth }) {
  if (auth && getToken()) {
    return <Navigate to={'/'} replace />
  }
  return <Outlet />
}
