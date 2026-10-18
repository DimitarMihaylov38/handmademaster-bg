import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../contexts/AuthContext'

export default function EditProduct() {
  const { productId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    status: 'available',
    mainImageUrl: '',
  })

  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      return
    }

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
        navigate('/products')
        return
      }

      setFormData({
        title: data.title || '',
        description: data.description || '',
        price: data.price ?? '',
        category: data.category || '',
        status: data.status || 'available',
        mainImageUrl: data.main_image_url || '',
      })

      setLoading(false)
    }

    fetchProduct()
  }, [productId, user, navigate])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setSaving(true)
    setError('')

    let imageUrl = formData.mainImageUrl

    if (imageFile) {
      const fileExtension = imageFile.name.split('.').pop()

      const fileName =
        `${user.id}/${Date.now()}.${fileExtension}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile)

      if (uploadError) {
        setSaving(false)
        setError(uploadError.message)
        return
      }

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)

      imageUrl = publicUrlData.publicUrl
    }

    const { error: updateError } = await supabase
      .from('products')
      .update({
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        status: formData.status,
        main_image_url: imageUrl,
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
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-slate-600">
          Зареждане...
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Редактирай продукт
        </h1>

        <p className="mt-2 text-slate-600">
          Промени информацията или снимката на продукта.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
          Грешка: {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Име на продукта
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Описание
            </label>

            <textarea
              id="description"
              name="description"
              rows="6"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Цена
              </label>

              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Категория
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
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
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Статус
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              >
                <option value="available">Наличен</option>
                <option value="sold">Продаден</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Нова снимка
              </label>

              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setImageFile(event.target.files?.[0] || null)
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
              />
            </div>
          </div>

          {formData.mainImageUrl && (
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">
                Текуща снимка
              </p>

              <img
                src={formData.mainImageUrl}
                alt={formData.title}
                className="max-h-72 rounded-lg border border-slate-200 object-contain"
              />
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-amber-500 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Запазване...' : 'Запази промените'}
          </button>

          <button
            type="button"
            onClick={() => navigate(`/products/${productId}`)}
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Отказ
          </button>
        </div>
      </form>
    </div>
  )
}