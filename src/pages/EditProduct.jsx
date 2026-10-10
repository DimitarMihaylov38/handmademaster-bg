import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../contexts/AuthContext'

export default function EditProduct() {
  const { productId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('available')
  const [mainImageUrl, setMainImageUrl] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
        setLoading(false)
        return
      }

      if (data.owner_id !== user.id) {
        setError('Нямаш право да редактираш този продукт.')
        setLoading(false)
        return
      }

      setTitle(data.title)
      setDescription(data.description)
      setPrice(data.price)
      setCategory(data.category)
      setStatus(data.status)
      setMainImageUrl(data.main_image_url || '')
      setLoading(false)
    }

    fetchProduct()
  }, [productId, user.id])

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setSaving(true)

    const { error: updateError } = await supabase
      .from('products')
      .update({
        title,
        description,
        price: Number(price),
        category,
        status,
        main_image_url: mainImageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId)

    setSaving(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    navigate(`/products/${productId}`)
  }

  if (loading) {
    return <p>Зареждане...</p>
  }

  if (error && !title) {
    return <p>{error}</p>
  }

  return (
    <div>
      <h1>Редактирай продукт</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Име на продукта</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="price">Цена</label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="category">Категория</label>
          <select
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            required
          >
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
            <option value="available">Наличен</option>
            <option value="sold">Продаден</option>
          </select>
        </div>

        <div>
          <label htmlFor="mainImageUrl">Снимка URL</label>
          <input
            id="mainImageUrl"
            type="url"
            value={mainImageUrl}
            onChange={(event) => setMainImageUrl(event.target.value)}
          />
        </div>

        <button type="submit" disabled={saving}>
          {saving ? 'Запазване...' : 'Запази промените'}
        </button>
      </form>

      {error && <p>{error}</p>}
    </div>
  )
}