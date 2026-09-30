import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header>
      <nav>
        <Link to="/">Начало</Link>
        {' | '}
        <Link to="/products">Продукти</Link>
        {' | '}
        <Link to="/masters">Майстори</Link>
        {' | '}
        <Link to="/login">Вход</Link>
        {' | '}
        <Link to="/register">Регистрация</Link>
      </nav>
    </header>
  )
}