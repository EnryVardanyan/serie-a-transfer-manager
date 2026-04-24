function SquadPanel({
  formationSlots,
  autoLineup,
  selectedSlot,
  onSelectSlot,
  selectedSlotConfig,
  availableForSlot
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
            <div className="bench-player" key={player.id}>
              <span>{player.rating}</span>
              <strong>{player.name}</strong>
              <small>{player.position} - {player.role}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SquadPanel
