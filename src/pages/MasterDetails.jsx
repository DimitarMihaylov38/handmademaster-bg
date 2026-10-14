import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'

export default function MasterDetails() {
  const { masterId } = useParams()

  const [master, setMaster] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMasterData = async () => {
      setLoading(true)
      setError('')

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

    fetchMasterData()
  }, [masterId])

  if (loading) {
    return <p>Зареждане...</p>
  }

  if (error) {
    return <p>Грешка: {error}</p>
  }

  if (!master) {
    return <p>Майсторът не е намерен.</p>
  }

  return (
    <div>
      <h1>
        {master.workshop_name || master.full_name || 'Майстор'}
      </h1>

      {master.full_name && (
        <p>Име: {master.full_name}</p>
      )}

      {master.city && (
        <p>Град: {master.city}</p>
      )}

      {master.bio && (
        <p>{master.bio}</p>
      )}

      <h2>Контакти</h2>

      {master.phone && (
        <p>Телефон: {master.phone}</p>
      )}

      {master.email && (
        <p>Имейл: {master.email}</p>
      )}

      {master.website && (
        <p>
          Сайт:{' '}
          <a
            href={master.website}
            target="_blank"
            rel="noreferrer"
          >
            {master.website}
          </a>
        </p>
      )}

      {master.facebook && (
        <p>
          Facebook:{' '}
          <a
            href={master.facebook}
            target="_blank"
            rel="noreferrer"
          >
            Профил
          </a>
        </p>
      )}

      {master.instagram && (
        <p>
          Instagram:{' '}
          <a
            href={master.instagram}
            target="_blank"
            rel="noreferrer"
          >
            Профил
          </a>
        </p>
      )}

      <hr />

      <h2>Продукти на майстора</h2>

      {products.length === 0 ? (
        <p>Този майстор все още няма добавени продукти.</p>
      ) : (
        <div>
          {products.map((product) => (
            <article key={product.id}>
              <h3>{product.title}</h3>

              <p>{product.description}</p>

              <p>Цена: {product.price} лв.</p>

              <Link to={`/products/${product.id}`}>
                Виж продукта
              </Link>

              <hr />
            </article>
          ))}
        </div>
      )}
    </div>
  )
}