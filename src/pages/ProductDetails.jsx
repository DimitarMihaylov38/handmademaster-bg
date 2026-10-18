import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { getCategoryLabel } from '../utils/categoryLabels'

export default function ProductDetails() {
  const { productId } = useParams()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [favoriteId, setFavoriteId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()

      if (error) {
        setError(error.message)
      } else {
        setProduct(data)
      }

      setLoading(false)
    }

    fetchProduct()
  }, [productId])

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setFavoriteId(null)
      return
    }

    const fetchFavorite = async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle()

      if (error) {
        setError(error.message)
        return
      }

      setFavoriteId(data?.id ?? null)
    }

    fetchFavorite()
  }, [isAuthenticated, user, productId])

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setFavoriteLoading(true)
    setError('')

    if (favoriteId) {
      const { error: deleteError } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId)

      setFavoriteLoading(false)

      if (deleteError) {
        setError(deleteError.message)
        return
      }

      setFavoriteId(null)
      return
    }

    const { data, error: insertError } = await supabase
      .from('favorites')
      .insert({
        user_id: user.id,
        product_id: product.id,
      })
      .select('id')
      .single()

    setFavoriteLoading(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    setFavoriteId(data.id)
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Сигурен ли си, че искаш да изтриеш този продукт?'
    )

    if (!confirmed) {
      return
    }

    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', product.id)

    if (deleteError) {
      setError(deleteError.message)
      return
    }

    navigate('/products')
  }

  if (loading) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-slate-600">Зареждане...</p>
      </div>
    )
  }

  if (error && !product) {
    return (
      <div className="rounded-lg bg-red-100 p-4 text-red-700">
        Грешка: {error}
      </div>
    )
  }

  if (!product) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow-sm">
        <p className="text-slate-600">
          Продуктът не е намерен.
        </p>
      </div>
    )
  }

  const isOwner = user?.id === product.owner_id

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <Link
          to="/products"
          className="text-sm font-medium text-slate-600 transition hover:text-amber-600"
        >
          ← Назад към продуктите
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
          Грешка: {error}
        </div>
      )}

      <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="grid lg:grid-cols-2">
          <div className="bg-slate-200">
            {product.main_image_url ? (
              <img
                src={product.main_image_url}
                alt={product.title}
                className="h-full min-h-80 w-full object-contain bg-slate-100 lg:min-h-[520px]"
              />
            ) : (
              <div className="flex min-h-80 items-center justify-center text-lg text-slate-500 lg:min-h-[520px]">
                Няма снимка
              </div>
            )}
          </div>

          <div className="flex flex-col p-6 sm:p-8">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                  product.status === 'available'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {product.status === 'available'
                  ? 'Наличен'
                  : 'Продаден'}
              </span>

              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                {getCategoryLabel(product.category)}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              {product.title}
            </h1>

            <p className="mt-5 text-3xl font-bold text-amber-600">
              {product.price} лв.
            </p>

            <div className="mt-6">
              <h2 className="mb-2 text-lg font-semibold text-slate-900">
                Описание
              </h2>

              <p className="leading-8 text-slate-600">
                {product.description}
              </p>
            </div>

            <div className="mt-auto pt-8">
              {isAuthenticated && !isOwner && (
                <button
                  type="button"
                  onClick={handleFavorite}
                  disabled={favoriteLoading}
                  className={`w-full rounded-lg px-5 py-3 font-semibold transition sm:w-auto ${
                    favoriteId
                      ? 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                      : 'bg-amber-500 text-slate-900 hover:bg-amber-400'
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {favoriteLoading
                    ? 'Зареждане...'
                    : favoriteId
                      ? 'Премахни от любими'
                      : 'Добави в любими'}
                </button>
              )}

              {!isAuthenticated && (
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full rounded-lg bg-amber-500 px-5 py-3 font-semibold text-slate-900 transition hover:bg-amber-400 sm:w-auto"
                >
                  Влез, за да добавиш в любими
                </button>
              )}

              {isOwner && (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    to={`/products/${product.id}/edit`}
                    className="inline-flex justify-center rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700"
                  >
                    Редактирай
                  </Link>

                  <button
                    type="button"
                    onClick={handleDelete}
                    className="rounded-lg border border-red-300 bg-white px-5 py-3 font-semibold text-red-700 transition hover:bg-red-50"
                  >
                    Изтрий
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}