function TransferMarketPanel({ players, onSignPlayer, remainingBudget }) {
  return (
    <section className="panel-section">
      <div className="section-heading">
        <p className="eyebrow">Transfer list</p>
        <h3>Market targets</h3>
      </div>

      <div className="market-summary">
        <div>
          <span>Available budget</span>
          <strong>EUR {remainingBudget}M</strong>
        </div>
        <div>
          <span>Affordable deals</span>
          <strong>{players.filter((player) => player.canBuy && !player.isSigned).length}</strong>
        </div>
      </div>

      <div className="market-list">
        {players.map((player) => (
          <article className={player.canBuy ? 'player-row' : 'player-row blocked'} key={player.name}>
            <div className="player-rating">{player.rating}</div>
            <div className="player-main">
              <strong>{player.name}</strong>
              <span>{player.position} - {player.club} - {player.role}</span>
              <small>{player.valueLabel}</small>
            </div>
            <button
              disabled={!player.canBuy || player.isSigned}
              onClick={() => onSignPlayer(player)}
            >
              {player.isSigned ? 'Signed' : `EUR ${player.value}M`}
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default TransferMarketPanel
