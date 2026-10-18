import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'

export default function Masters() {
  const [masters, setMasters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMasters = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setMasters(data)
      }

      setLoading(false)
    }

    fetchMasters()
  }, [])

  if (loading) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-slate-600">Зареждане...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-100 p-4 text-red-700">
        Грешка: {error}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Майстори
        </h1>

        <p className="mt-2 text-slate-600">
          Разгледай профилите на български творци и занаятчии.
        </p>
      </div>

      {masters.length === 0 ? (
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600">
            Все още няма регистрирани майстори.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {masters.map((master) => {
            const displayName =
              master.workshop_name ||
              master.full_name ||
              'Майстор'

            return (
              <article
                key={master.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center gap-4 border-b border-slate-100 p-6">
                  {master.avatar_url ? (
                    <img
                      src={master.avatar_url}
                      alt={displayName}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-slate-200 text-2xl font-bold text-slate-500">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      {displayName}
                    </h2>

                    {master.city && (
                      <p className="mt-1 text-sm text-slate-500">
                        {master.city}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <p className="min-h-20 leading-7 text-slate-600">
                    {master.bio
                      ? master.bio
                      : 'Майсторът все още не е добавил описание.'}
                  </p>

                  <Link
                    to={`/masters/${master.id}`}
                    className="mt-6 inline-flex w-full justify-center rounded-lg bg-slate-900 px-4 py-2.5 font-medium text-white transition hover:bg-amber-500 hover:text-slate-900"
                  >
                    Виж профила
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}