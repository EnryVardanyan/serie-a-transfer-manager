function SquadPanel({
  formationSlots,
  autoLineup,
  selectedSlot,
  onSelectSlot,
  selectedSlotConfig,
  availableForSlot,
  unavailablePlayers,
  onAssignPlayer
}) {
  return (
    <section className="panel-section squad-section">
      <div className="section-heading">
        <p className="eyebrow">Squad room</p>
        <h3>Starting XI</h3>
      </div>

      <div className="lineup-grid">
        {formationSlots.map((slot) => {
          const player = autoLineup[slot.key]
          const isActive = selectedSlot === slot.key

          return (
            <button
              className={isActive ? 'lineup-slot active' : 'lineup-slot'}
              key={slot.key}
              onClick={() => onSelectSlot(slot.key)}
            >
              <span>{slot.label}</span>
              <strong>{player ? player.name : 'Empty slot'}</strong>
              <small>{player ? `${player.position} - ${player.rating}` : 'Choose player'}</small>
            </button>
          )
        })}
      </div>

      <div className="bench-panel">
        <div className="bench-heading">
          <strong>{selectedSlotConfig.label} options</strong>
          <small>{availableForSlot.length} available</small>
        </div>

        <div className="bench-list">
          {availableForSlot.map((player) => (
            <button
              className={player.isSelected ? 'bench-player active' : 'bench-player'}
              key={player.id}
              onClick={() => onAssignPlayer(player.id)}
            >
              <span>{player.rating}</span>
              <strong>{player.name}</strong>
              <small>
                {player.position} - {player.role}
                {player.assignedSlot ? ` - in ${player.assignedSlot}` : ''}
              </small>
            </button>
          ))}
        </div>
      </div>

      <div className="bench-panel">
        <div className="bench-heading">
          <strong>Unavailable</strong>
          <small>{unavailablePlayers.length} out</small>
        </div>

        <div className="bench-list">
          {unavailablePlayers.length === 0 ? (
            <div className="season-empty small">No injuries or suspensions.</div>
          ) : (
            unavailablePlayers.map((player) => (
              <div className="bench-player unavailable" key={`${player.id}-${player.type}`}>
                <span>{player.rating}</span>
                <strong>{player.name}</strong>
                <small>
                  {player.label} - {player.matchesLeft} match{player.matchesLeft > 1 ? 'es' : ''} left
                </small>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export default SquadPanel
