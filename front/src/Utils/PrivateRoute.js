import { Navigate, Outlet } from 'react-router-dom'
import { getToken } from './Common'

export default function PrivateRoute({ auth }) {
  if (!auth && !getToken()) {
    return <Navigate to={'/login'} replace />
  }
  return <Outlet />
}
