import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../contexts/AuthContext'

export default function EditProfile() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    full_name: '',
    workshop_name: '',
    city: '',
    bio: '',
    phone: '',
    email: '',
    website: '',
    facebook: '',
    instagram: '',
    avatar_url: '',
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      setFormData({
        full_name: data.full_name || '',
        workshop_name: data.workshop_name || '',
        city: data.city || '',
        bio: data.bio || '',
        phone: data.phone || '',
        email: data.email || '',
        website: data.website || '',
        facebook: data.facebook || '',
        instagram: data.instagram || '',
        avatar_url: data.avatar_url || '',
      })

      setLoading(false)
    }

    fetchProfile()
  }, [user.id])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((state) => ({
      ...state,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setSaving(true)

    const { error: updateError } = await supabase
      .from('profiles')
      .update(formData)
      .eq('id', user.id)

    setSaving(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    navigate('/profile')
  }

  if (loading) {
    return <p>Зареждане...</p>
  }

  return (
    <div>
      <h1>Редакция на профил</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="full_name">Име</label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            value={formData.full_name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="workshop_name">Име на работилница</label>
          <input
            id="workshop_name"
            name="workshop_name"
            type="text"
            value={formData.workshop_name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="city">Град</label>
          <input
            id="city"
            name="city"
            type="text"
            value={formData.city}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="bio">Описание</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="phone">Телефон</label>
          <input
            id="phone"
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="email">Имейл</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="website">Сайт</label>
          <input
            id="website"
            name="website"
            type="url"
            value={formData.website}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="facebook">Facebook</label>
          <input
            id="facebook"
            name="facebook"
            type="url"
            value={formData.facebook}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="instagram">Instagram</label>
          <input
            id="instagram"
            name="instagram"
            type="url"
            value={formData.instagram}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="avatar_url">Снимка URL</label>
          <input
            id="avatar_url"
            name="avatar_url"
            type="url"
            value={formData.avatar_url}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={saving}>
          {saving ? 'Запазване...' : 'Запази профила'}
        </button>
      </form>

      {error && <p>{error}</p>}
    </div>
  )
}