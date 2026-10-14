import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../contexts/AuthContext'

export default function Favorites() {
  const { user } = useAuth()

  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchFavorites = async () => {
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
      } else {
        setFavorites(data)
      }

      setLoading(false)
    }

    fetchFavorites()
  }, [user.id])

  if (loading) {
    return <p>Зареждане...</p>
  }

  if (error) {
    return <p>Грешка: {error}</p>
  }

  return (
    <div>
      <h1>Любими</h1>

      {favorites.length === 0 ? (
        <p>Все още нямаш добавени любими продукти.</p>
      ) : (
        <div>
          {favorites.map((favorite) => {
            const product = favorite.products

            if (!product) {
              return null
            }

            return (
              <article key={favorite.id}>
                <h2>{product.title}</h2>

                <p>{product.description}</p>

                <p>Цена: {product.price} лв.</p>

                <p>Категория: {product.category}</p>

                <Link to={`/products/${product.id}`}>
                  Виж продукта
                </Link>

                <hr />
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}