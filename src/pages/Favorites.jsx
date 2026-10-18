import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { getCategoryLabel } from '../utils/categoryLabels'

export default function Favorites() {
  const { user } = useAuth()

  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      return
    }

    const fetchFavorites = async () => {
      setLoading(true)
      setError('')

      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          product_id,
          products (
            id,
            title,
            description,
            price,
            category,
            status,
            main_image_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
        setFavorites([])
      } else {
        setFavorites(data || [])
      }

      setLoading(false)
    }

    fetchFavorites()
  }, [user])

  if (!user || loading) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-slate-600">
          Зареждане...
        </p>
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
          Любими продукти
        </h1>

        <p className="mt-2 text-slate-600">
          Продуктите, които си запазил за по-късно.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Все още нямаш любими продукти
          </h2>

          <p className="mt-3 text-slate-600">
            Разгледай каталога и добави продукти, които ти харесват.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-amber-500 hover:text-slate-900"
          >
            Разгледай продуктите
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((favorite) => {
            const product = favorite.products

            if (!product) {
              return null
            }

            return (
              <article
                key={favorite.id}
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
                    <h2 className="text-xl font-semibold text-slate-900">
                      {product.title}
                    </h2>

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
            )
          })}
        </div>
      )}
    </div>
  )
}