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

  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      return
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        setError(error.message)
      } else {
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
      }

      setLoading(false)
    }

    fetchProfile()
  }, [user])

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview('')
      return
    }

    const previewUrl = URL.createObjectURL(avatarFile)

    setAvatarPreview(previewUrl)

    return () => {
      URL.revokeObjectURL(previewUrl)
    }
  }, [avatarFile])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      setAvatarFile(null)
      return
    }

    setAvatarFile(file)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setSaving(true)
    setError('')

    let avatarUrl = formData.avatar_url

    if (avatarFile) {
      const fileExtension = avatarFile.name.split('.').pop()

      const fileName =
        `${user.id}/${Date.now()}.${fileExtension}`

      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, avatarFile)

      if (uploadError) {
        setSaving(false)
        setError(uploadError.message)
        return
      }

      const { data: publicUrlData } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName)

      avatarUrl = publicUrlData.publicUrl
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        ...formData,
        avatar_url: avatarUrl,
      })
      .eq('id', user.id)

    setSaving(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    navigate('/profile')
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

  const displayedAvatar = avatarPreview || formData.avatar_url

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Редактиране на профил
        </h1>

        <p className="mt-2 text-slate-600">
          Добави информация за себе си и своята дейност.
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
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="full_name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Име и фамилия
            </label>

            <input
              id="full_name"
              name="full_name"
              type="text"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>

          <div>
            <label
              htmlFor="workshop_name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Име на работилница / бранд
            </label>

            <input
              id="workshop_name"
              name="workshop_name"
              type="text"
              value={formData.workshop_name}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>

          <div>
            <label
              htmlFor="city"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Град
            </label>

            <input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Телефон
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>

          <div>
            <label
              htmlFor="avatar"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Профилна снимка
            </label>

            <input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
            />
          </div>

          {displayedAvatar && (
            <div className="md:col-span-2">
              <p className="mb-3 text-sm font-medium text-slate-700">
                {avatarPreview
                  ? 'Преглед на новата снимка'
                  : 'Текуща профилна снимка'}
              </p>

              <img
                src={displayedAvatar}
                alt={formData.full_name || 'Профилна снимка'}
                className="h-36 w-36 rounded-full border border-slate-200 object-cover shadow-sm"
              />

              {avatarPreview && (
                <p className="mt-2 text-sm text-slate-500">
                  Новата снимка ще бъде качена след натискане на
                  „Запази промените“.
                </p>
              )}
            </div>
          )}

          <div>
            <label
              htmlFor="website"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Уебсайт
            </label>

            <input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>

          <div>
            <label
              htmlFor="facebook"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Facebook
            </label>

            <input
              id="facebook"
              name="facebook"
              type="url"
              value={formData.facebook}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>

          <div>
            <label
              htmlFor="instagram"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Instagram
            </label>

            <input
              id="instagram"
              name="instagram"
              type="url"
              value={formData.instagram}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="bio"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              За мен / За работилницата
            </label>

            <textarea
              id="bio"
              name="bio"
              rows="6"
              value={formData.bio}
              onChange={handleChange}
              className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>
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
            onClick={() => navigate('/profile')}
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Отказ
          </button>
        </div>
      </form>
    </div>
  )
}