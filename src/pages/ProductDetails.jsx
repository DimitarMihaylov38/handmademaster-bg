import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../contexts/AuthContext'

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

  if (loading) {
    return <p>Зареждане...</p>
  }

  if (error) {
    return <p>Грешка: {error}</p>
  }

  if (!product) {
    return <p>Продуктът не е намерен.</p>
  }

  const isOwner = user?.id === product.owner_id

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

  return (
    <div>
      <h1>{product.title}</h1>

      <p>{product.description}</p>

      <p>Цена: {product.price} лв.</p>

      <p>Категория: {product.category}</p>

      <p>
        Статус:{' '}
        {product.status === 'available'
          ? 'Наличен'
          : 'Продаден'}
      </p>

      {product.main_image_url && (
        <img
          src={product.main_image_url}
          alt={product.title}
          width="300"
        />
      )}

      {isAuthenticated && !isOwner && (
        <div>
          <button
            onClick={handleFavorite}
            disabled={favoriteLoading}
          >
            {favoriteLoading
              ? 'Зареждане...'
              : favoriteId
                ? 'Премахни от любими'
                : 'Добави в любими'}
          </button>
        </div>
      )}

      {isOwner && (
        <div>
          <Link to={`/products/${product.id}/edit`}>
            Редактирай
          </Link>

          {' | '}

          <button onClick={handleDelete}>
            Изтрий
          </button>
        </div>
      )}

      {error && <p>{error}</p>}
    </div>
  )
}