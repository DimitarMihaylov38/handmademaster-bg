import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Profile() {
  const { user } = useAuth()

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Моят профил
        </h1>

        <p className="mt-2 text-slate-600">
          Управлявай информацията в своя профил на майстор.
        </p>
      </div>

      <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <p className="text-sm font-medium text-slate-500">
            Потребител
          </p>

          <p className="mt-1 text-lg font-semibold text-slate-900">
            {user?.email}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/profile/edit"
            className="inline-flex justify-center rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-amber-500 hover:text-slate-900"
          >
            Редактирай профила
          </Link>

          <Link
            to="/products/create"
            className="inline-flex justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:border-amber-500 hover:text-amber-600"
          >
            Добави продукт
          </Link>
        </div>
      </section>
    </div>
  )
}