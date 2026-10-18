import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">
        404
      </p>

      <h1 className="mt-4 text-4xl font-bold text-slate-900 sm:text-5xl">
        Страницата не е намерена
      </h1>

      <p className="mt-4 text-lg leading-8 text-slate-600">
        Адресът, който отвори, не съществува или страницата е преместена.
      </p>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          to="/"
          className="rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-amber-500 hover:text-slate-900"
        >
          Към началото
        </Link>

        <Link
          to="/products"
          className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-amber-500 hover:text-amber-600"
        >
          Към продуктите
        </Link>
      </div>
    </div>
  )
}