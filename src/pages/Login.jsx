import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError('Невалиден email или парола.')
      return
    }

    navigate('/')
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          Вход
        </h1>

        <p className="mt-2 text-slate-600">
          Влез в своя профил в HandmadeMaster BG.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              placeholder="example@email.com"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Парола
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-amber-500 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Влизане...' : 'Вход'}
        </button>

        <p className="mt-6 text-center text-sm text-slate-600">
          Нямаш профил?{' '}
          <Link
            to="/register"
            className="font-semibold text-amber-600 hover:text-amber-700"
          >
            Регистрация
          </Link>
        </p>
      </form>
    </div>
  )
}