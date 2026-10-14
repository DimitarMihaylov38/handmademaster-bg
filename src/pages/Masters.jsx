import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'

export default function Masters() {
  const [masters, setMasters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMasters = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setMasters(data)
      }

      setLoading(false)
    }

    fetchMasters()
  }, [])

  if (loading) {
    return <p>Зареждане...</p>
  }

  if (error) {
    return <p>Грешка: {error}</p>
  }

  return (
    <div>
      <h1>Майстори</h1>

      {masters.length === 0 ? (
        <p>Все още няма регистрирани майстори.</p>
      ) : (
        <div>
          {masters.map((master) => (
            <article key={master.id}>
              <h2>
                {master.workshop_name || master.full_name || 'Майстор'}
              </h2>

              {master.city && (
                <p>Град: {master.city}</p>
              )}

              {master.bio && (
                <p>{master.bio}</p>
              )}

              <Link to={`/masters/${master.id}`}>
                Виж профил
              </Link>

              <hr />
            </article>
          ))}
        </div>
      )}
    </div>
  )
}