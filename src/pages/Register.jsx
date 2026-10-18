import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'

export default function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    repeatPassword: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')

    if (formData.password !== formData.repeatPassword) {
      setError('Паролите не съвпадат.')
      return
    }

    if (formData.password.length < 6) {
      setError('Паролата трябва да бъде поне 6 символа.')
      return
    }

    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    })

    if (signUpError) {
      setLoading(false)
      setError(signUpError.message)
      return
    }

    if (!data.user) {
      setLoading(false)
      setError('Регистрацията не беше успешна.')
      return
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        full_name: formData.fullName,
        email: formData.email,
      })

    setLoading(false)

    if (profileError) {
      setError(profileError.message)
      return
    }

    navigate('/profile')
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          Регистрация
        </h1>

        <p className="mt-2 text-slate-600">
          Създай безплатен профил в HandmadeMaster BG.
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
              htmlFor="fullName"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Име и фамилия
            </label>

            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
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
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              autoComplete="new-password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>

          <div>
            <label
              htmlFor="repeatPassword"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Повтори паролата
            </label>

            <input
              id="repeatPassword"
              name="repeatPassword"
              type="password"
              value={formData.repeatPassword}
              onChange={handleChange}
              required
              minLength="6"
              autoComplete="new-password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-amber-500 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Регистрация...' : 'Регистрация'}
        </button>

        <p className="mt-6 text-center text-sm text-slate-600">
          Вече имаш профил?{' '}
          <Link
            to="/login"
            className="font-semibold text-amber-600 hover:text-amber-700"
          >
            Вход
          </Link>
        </p>
      </form>
    </div>
  )
}