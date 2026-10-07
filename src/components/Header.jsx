import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <header>
      <nav>
        <Link to="/">Начало</Link>
        {' | '}
        <Link to="/products">Продукти</Link>
        {' | '}
        <Link to="/masters">Майстори</Link>

        {!isAuthenticated && (
          <>
            {' | '}
            <Link to="/login">Вход</Link>
            {' | '}
            <Link to="/register">Регистрация</Link>
          </>
        )}

        {isAuthenticated && (
          <>
            {' | '}
            <Link to="/favorites">Любими</Link>
            {' | '}
            <Link to="/products/create">Добави продукт</Link>
            {' | '}
            <Link to="/profile">Моят профил</Link>
            {' | '}
            <button onClick={handleLogout}>Изход</button>
          </>
        )}
      </nav>
    </header>
  )
}
