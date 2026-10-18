import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { getCategoryLabel } from '../utils/categoryLabels'

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
          Продукти
        </h1>

        <p className="mt-2 text-slate-600">
          Разгледай ръчно изработени изделия от български майстори.
        </p>
      </div>

      <section className="mb-10 rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-5 text-xl font-semibold text-slate-800">
          Търсене и филтри
        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <label
              htmlFor="search"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Търси продукт
            </label>

            <input
              id="search"
              type="text"
              placeholder="Например: нож, гривна..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Категория
            </label>

            <select
              id="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
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
            <label
              htmlFor="status"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Статус
            </label>

            <select
              id="status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            >
              <option value="">Всички</option>
              <option value="available">Наличен</option>
              <option value="sold">Продаден</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 lg:col-span-1 lg:grid-cols-1">
            <div>
              <label
                htmlFor="minPrice"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Цена от
              </label>

              <input
                id="minPrice"
                type="number"
                min="0"
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
            </div>

            <div>
              <label
                htmlFor="maxPrice"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Цена до
              </label>

              <input
                id="maxPrice"
                type="number"
                min="0"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            Намерени продукти: {filteredProducts.length}
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Изчисти филтрите
          </button>
        </div>
      </section>

      {filteredProducts.length === 0 ? (
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600">
            Няма продукти, отговарящи на избраните критерии.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
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

                <div className="mb-4 flex items-center justify-between">
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
                  Виж детайли
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}