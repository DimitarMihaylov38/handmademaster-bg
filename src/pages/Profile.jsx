import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Profile() {
  const { user } = useAuth()

  return (
    <div>
      <h1>Моят профил</h1>

      <p>Имейл: {user.email}</p>

      <Link to="/profile/edit">
        Редактирай профила
      </Link>
    </div>
  )
}