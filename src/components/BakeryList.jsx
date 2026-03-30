export default function BakeryList({ bakeries, selected, onSelect, startCoords }) {
  return (
    <div className="bakery-list">
      <h2>{bakeries.length} bakeries found</h2>
      <ul>
        {bakeries.map(bakery => (
          <li
            key={bakery.id}
            className={`bakery-item ${selected?.id === bakery.id ? 'active' : ''}`}
            onClick={() => onSelect(bakery.id === selected?.id ? null : bakery)}
          >
            <div className="bakery-header">
              <span className="bakery-name">{bakery.name}</span>
              <span className="bakery-distance">{bakery.distance} mi</span>
            </div>
            {bakery.address && (
              <p className="bakery-address">{bakery.address}</p>
            )}
            {selected?.id === bakery.id && (
              <div className="bakery-details">
                {bakery.hours && <p><strong>Hours:</strong> {bakery.hours}</p>}
                {bakery.phone && <p><strong>Phone:</strong> {bakery.phone}</p>}
                {bakery.website && (
                  <p>
                    <a href={bakery.website} target="_blank" rel="noopener noreferrer">
                      Visit website
                    </a>
                  </p>
                )}
                {startCoords && (
                  <a
                    className="directions-link"
                    href={`https://www.google.com/maps/dir/?api=1&origin=${startCoords.lat},${startCoords.lng}&destination=${bakery.lat},${bakery.lng}&travelmode=walking`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get directions
                  </a>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
