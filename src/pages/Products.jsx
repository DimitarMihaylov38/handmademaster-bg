import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

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

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesCategory =
        !category || product.category === category

      const matchesStatus =
        !status || product.status === status

      const matchesMinPrice =
        !minPrice || Number(product.price) >= Number(minPrice)

      const matchesMaxPrice =
        !maxPrice || Number(product.price) <= Number(maxPrice)

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesMinPrice &&
        matchesMaxPrice
      )
    })
  }, [
    products,
    search,
    category,
    status,
    minPrice,
    maxPrice,
  ])

  const clearFilters = () => {
    setSearch('')
    setCategory('')
    setStatus('')
    setMinPrice('')
    setMaxPrice('')
  }

  if (loading) {
    return <p>Зареждане...</p>
  }

  if (error) {
    return <p>Грешка: {error}</p>
  }

  return (
    <div>
      <h1>Продукти</h1>

      <section>
        <h2>Търсене и филтри</h2>

        <div>
          <label htmlFor="search">Търси продукт</label>
          <input
            id="search"
            type="text"
            placeholder="Например: нож, гривна..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="category">Категория</label>
          <select
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">Всички категории</option>
            <option value="knives">Ножарство</option>
            <option value="wood">Дървообработка</option>
            <option value="leather">Кожени изделия</option>
            <option value="jewelry">Бижута</option>
            <option value="ceramics">Керамика</option>
            <option value="textile">Текстил</option>
            <option value="metal">Металообработка</option>
            <option value="decoration">Декорация</option>
            <option value="other">Други</option>
          </select>
        </div>

        <div>
          <label htmlFor="status">Статус</label>
          <select
            id="status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">Всички</option>
            <option value="available">Наличен</option>
            <option value="sold">Продаден</option>
          </select>
        </div>

        <div>
          <label htmlFor="minPrice">Минимална цена</label>
          <input
            id="minPrice"
            type="number"
            min="0"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="maxPrice">Максимална цена</label>
          <input
            id="maxPrice"
            type="number"
            min="0"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
          />
        </div>

        <button type="button" onClick={clearFilters}>
          Изчисти филтрите
        </button>
      </section>

      <hr />

      {filteredProducts.length === 0 ? (
        <p>Няма продукти, отговарящи на избраните критерии.</p>
      ) : (
        <div>
          {filteredProducts.map((product) => (
            <article key={product.id}>
              <h2>{product.title}</h2>

              <p>{product.description}</p>

              <p>Цена: {product.price} лв.</p>

              <p>Категория: {product.category}</p>

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