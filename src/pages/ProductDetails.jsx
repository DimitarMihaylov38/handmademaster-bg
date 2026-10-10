import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../contexts/AuthContext'

export default function ProductDetails() {
  const { productId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
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
    </div>
  )
}