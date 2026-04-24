function TransferMarketPanel({ players, onSignPlayer }) {
  return (
    <section className="panel-section">
      <div className="section-heading">
        <p className="eyebrow">Transfer list</p>
        <h3>Market targets</h3>
      </div>

      <div className="market-list">
        {players.map((player) => (
          <article className="player-row" key={player.name}>
            <div className="player-rating">{player.rating}</div>
            <div className="player-main">
              <strong>{player.name}</strong>
              <span>{player.position} - {player.club} - {player.role}</span>
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
