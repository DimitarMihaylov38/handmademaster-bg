import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setProducts(data)
      }

      setLoading(false)
    }

    fetchProducts()
  }, [])

  if (loading) {
    return <p>Зареждане...</p>
  }

  if (error) {
    return <p>Грешка: {error}</p>
  }

  return (
    <div>
      <h1>Продукти</h1>

      {products.length === 0 ? (
        <p>Все още няма добавени продукти.</p>
      ) : (
        <div>
          {products.map((product) => (
            <article key={product.id}>
              <h2>{product.title}</h2>

              <p>{product.description}</p>

              <p>
                Цена: {product.price} лв.
              </p>

              <p>
                Категория: {product.category}
              </p>

              <p>
                Статус:{' '}
                {product.status === 'available'
                  ? 'Наличен'
                  : 'Продаден'}
              </p>

              <Link to={`/products/${product.id}`}>
                Виж детайли
              </Link>

              <hr />
            </article>
          ))}
        </div>
      )}
    </div>
  )
}