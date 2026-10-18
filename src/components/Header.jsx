import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { isAuthenticated, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleLogout = async () => {
    await logout()
    setIsMenuOpen(false)
  }

  return (
    <header className="bg-slate-900 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={closeMenu}
          className="text-xl font-bold tracking-wide"
        >
          HandmadeMaster BG
        </Link>

        <button
          type="button"
          onClick={() => setIsMenuOpen((current) => !current)}
          className="rounded-md border border-slate-600 px-3 py-2 text-sm md:hidden"
        >
          Меню
        </button>

        <nav className="hidden items-center gap-5 md:flex">
          <Link
            to="/"
            className="transition hover:text-amber-400"
          >
            Начало
          </Link>

          <Link
            to="/products"
            className="transition hover:text-amber-400"
          >
            Продукти
          </Link>

          <Link
            to="/masters"
            className="transition hover:text-amber-400"
          >
            Майстори
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/favorites"
                className="transition hover:text-amber-400"
              >
                Любими
              </Link>

              <Link
                to="/products/create"
                className="transition hover:text-amber-400"
              >
                Добави продукт
              </Link>

              <Link
                to="/profile"
                className="transition hover:text-amber-400"
              >
                Моят профил
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md bg-amber-500 px-4 py-2 font-medium text-slate-900 transition hover:bg-amber-400"
              >
                Изход
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="transition hover:text-amber-400"
              >
                Вход
              </Link>

              <Link
                to="/register"
                className="rounded-md bg-amber-500 px-4 py-2 font-medium text-slate-900 transition hover:bg-amber-400"
              >
                Регистрация
              </Link>
            </>
          )}
        </nav>
      </div>

      {isMenuOpen && (
        <nav className="border-t border-slate-700 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link
              to="/"
              onClick={closeMenu}
              className="hover:text-amber-400"
            >
              Начало
            </Link>

            <Link
              to="/products"
              onClick={closeMenu}
              className="hover:text-amber-400"
            >
              Продукти
            </Link>

            <Link
              to="/masters"
              onClick={closeMenu}
              className="hover:text-amber-400"
            >
              Майстори
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/favorites"
                  onClick={closeMenu}
                  className="hover:text-amber-400"
                >
                  Любими
                </Link>

                <Link
                  to="/products/create"
                  onClick={closeMenu}
                  className="hover:text-amber-400"
                >
                  Добави продукт
                </Link>

                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="hover:text-amber-400"
                >
                  Моят профил
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-fit rounded-md bg-amber-500 px-4 py-2 font-medium text-slate-900"
                >
                  Изход
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="hover:text-amber-400"
                >
                  Вход
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="w-fit rounded-md bg-amber-500 px-4 py-2 font-medium text-slate-900"
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
