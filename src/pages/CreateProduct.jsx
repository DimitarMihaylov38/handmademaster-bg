import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../contexts/AuthContext'

export default function CreateProduct() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('available')
  const [mainImageUrl, setMainImageUrl] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    const { error: insertError } = await supabase
      .from('products')
      .insert({
        owner_id: user.id,
        title,
        description,
        price: Number(price),
        category,
        status,
        main_image_url: mainImageUrl,
      })

    setLoading(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    navigate('/products')
  }

  return (
    <div>
      <h1>Добави продукт</h1>

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
            <option value="">Избери категория</option>
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

        <button type="submit" disabled={loading}>
          {loading ? 'Добавяне...' : 'Добави продукт'}
        </button>
      </form>

      {error && <p>{error}</p>}
    </div>
  )
}