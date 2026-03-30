import { useState } from 'react'

export default function RouteForm({ onSearch, loading }) {
  const [address, setAddress] = useState('')
  const [distance, setDistance] = useState(3)

  function handleSubmit(e) {
    e.preventDefault()
    if (address.trim()) {
      onSearch({ address: address.trim(), distance })
    }
  }

  return (
    <form className="route-form" onSubmit={handleSubmit}>
      <h2>Plan your run</h2>

      <label>
        Starting address
        <input
          type="text"
          value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder="123 Main St, Portland, OR"
          required
        />
      </label>

      <label>
        Max run distance: <strong>{distance} mi</strong>
        <input
          type="range"
          min={0.5}
          max={15}
          step={0.5}
          value={distance}
          onChange={e => setDistance(Number(e.target.value))}
        />
        <div className="range-labels">
          <span>0.5 mi</span>
          <span>15 mi</span>
        </div>
      </label>

      <button type="submit" disabled={loading || !address.trim()}>
        {loading ? 'Searching…' : 'Find bakeries'}
      </button>
    </form>
  )
}
