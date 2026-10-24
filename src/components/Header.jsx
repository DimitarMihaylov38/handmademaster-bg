import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { isAuthenticated, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `transition ${
      isActive
        ? 'text-white font-semibold'
        : 'text-neutral-300 hover:text-white'
    }`

  const handleLogout = async () => {
    await logout()
    setMenuOpen(false)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <header className="w-full bg-neutral-900 text-white">
      <div className="flex w-full items-center justify-between px-6 py-4 lg:px-10">
        <Link
          to="/"
          onClick={closeMenu}
          className="text-xl font-bold tracking-tight"
        >
          HandmadeMaster BG
        </Link>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="rounded-md border border-neutral-700 px-4 py-2 text-sm font-medium md:hidden"
        >
          Меню
        </button>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={linkClass}>
            Начало
          </NavLink>

          <NavLink to="/products" className={linkClass}>
            Продукти
          </NavLink>

          <NavLink to="/masters" className={linkClass}>
            Майстори
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/favorites" className={linkClass}>
                Любими
              </NavLink>

              <NavLink to="/products/create" className={linkClass}>
                Добави продукт
              </NavLink>

              <NavLink to="/profile" className={linkClass}>
                Моят профил
              </NavLink>

              <button
                type="button"
                onClick={handleLogout}
                className="text-neutral-300 transition hover:text-white"
              >
                Изход
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Вход
              </NavLink>

              <NavLink to="/register" className={linkClass}>
                Регистрация
              </NavLink>
            </>
          )}
        </nav>
      </div>

      {menuOpen && (
        <nav className="border-t border-neutral-800 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <NavLink
              to="/"
              onClick={closeMenu}
              className={linkClass}
            >
              Начало
            </NavLink>

            <NavLink
              to="/products"
              onClick={closeMenu}
              className={linkClass}
            >
              Продукти
            </NavLink>

            <NavLink
              to="/masters"
              onClick={closeMenu}
              className={linkClass}
            >
              Майстори
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink
                  to="/favorites"
                  onClick={closeMenu}
                  className={linkClass}
                >
                  Любими
                </NavLink>

                <NavLink
                  to="/products/create"
                  onClick={closeMenu}
                  className={linkClass}
                >
                  Добави продукт
                </NavLink>

                <NavLink
                  to="/profile"
                  onClick={closeMenu}
                  className={linkClass}
                >
                  Моят профил
                </NavLink>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-left text-neutral-300 transition hover:text-white"
                >
                  Изход
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={closeMenu}
                  className={linkClass}
                >
                  Вход
                </NavLink>

                <NavLink
                  to="/register"
                  onClick={closeMenu}
                  className={linkClass}
                >
                  Регистрация
                </NavLink>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
