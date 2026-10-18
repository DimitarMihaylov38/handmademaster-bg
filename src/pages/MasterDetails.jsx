import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { getCategoryLabel } from '../utils/categoryLabels'

export default function MasterDetails() {
  const { masterId } = useParams()

  const [master, setMaster] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMaster = async () => {
      const { data: masterData, error: masterError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', masterId)
        .single()

      if (masterError) {
        setError(masterError.message)
        setLoading(false)
        return
      }

      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('owner_id', masterId)
        .order('created_at', { ascending: false })

      if (productsError) {
        setError(productsError.message)
        setLoading(false)
        return
      }

      setMaster(masterData)
      setProducts(productsData)
      setLoading(false)
    }

    fetchMaster()
  }, [masterId])

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

  if (!master) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow-sm">
        <p className="text-slate-600">
          Майсторът не е намерен.
        </p>
      </div>
    )
  }

  const displayName =
    master.workshop_name ||
    master.full_name ||
    'Майстор'

  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          {master.avatar_url ? (
            <img
              src={master.avatar_url}
              alt={displayName}
              className="h-32 w-32 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-slate-200 text-4xl font-bold text-slate-500">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900">
              {displayName}
            </h1>

            {master.full_name && master.workshop_name && (
              <p className="mt-2 text-slate-500">
                {master.full_name}
              </p>
            )}

            {master.city && (
              <p className="mt-3 text-sm font-medium text-slate-600">
                {master.city}
              </p>
            )}

            {master.bio && (
              <p className="mt-5 max-w-3xl leading-7 text-slate-700">
                {master.bio}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              {master.phone && (
  <a
    href={`tel:${master.phone}`}
    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-500 hover:text-slate-900"
  >
    Телефон: {master.phone}
  </a>
)}

{master.email && (
  <a
    href={`mailto:${master.email}`}
    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-amber-500 hover:text-amber-600"
  >
    Email: {master.email}
  </a>
)}

              {master.website && (
                <a
                  href={master.website}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-amber-500 hover:text-amber-600"
                >
                  Уебсайт
                </a>
              )}

              {master.facebook && (
                <a
                  href={master.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-amber-500 hover:text-amber-600"
                >
                  Facebook
                </a>
              )}

              {master.instagram && (
                <a
                  href={master.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-amber-500 hover:text-amber-600"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Продукти от този майстор
          </h2>

          <p className="mt-2 text-slate-600">
            Общо продукти: {products.length}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-slate-600">
              Този майстор все още няма добавени продукти.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="aspect-[4/3] bg-slate-200">
                  {product.main_image_url ? (
                    <img
                      src={product.main_image_url}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-500">
                      Няма снимка
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h3 className="text-xl font-semibold text-slate-900">
                      {product.title}
                    </h3>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        product.status === 'available'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {product.status === 'available'
                        ? 'Наличен'
                        : 'Продаден'}
                    </span>
                  </div>

                  <p className="mb-4 line-clamp-3 text-sm leading-6 text-slate-600">
                    {product.description}
                  </p>

                  <div className="mb-4 flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-500">
                      {getCategoryLabel(product.category)}
                    </span>

                    <span className="text-lg font-bold text-slate-900">
                      {product.price} лв.
                    </span>
                  </div>

                  <Link
                    to={`/products/${product.id}`}
                    className="inline-flex w-full justify-center rounded-lg bg-slate-900 px-4 py-2.5 font-medium text-white transition hover:bg-amber-500 hover:text-slate-900"
                  >
                    Виж продукта
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}