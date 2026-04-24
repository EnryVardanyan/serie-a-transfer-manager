function ClubStage({
  selectedClub,
  remainingBudget,
  selectedClubStrength,
  selectedClubCondition,
  seasonNumber,
  maxCareerSeasons,
  signedPlayersCount,
  databaseCount,
  opponentsCount,
  homeRevenue,
  matchRewards,
  seasonFixturesCount,
  seasonStarted,
  seasonFinished,
  careerFinished,
  seasonPlacementReward,
  onStartSeason,
  onContinueSeason,
  clubs,
  onSelectClub
}) {
  return (
    <section className="club-stage">
      <div className="scoreboard">
        <div>
          <span>Budget</span>
          <strong>EUR {remainingBudget}M</strong>
        </div>
        <div>
          <span>Team rating</span>
          <strong>{selectedClubStrength}</strong>
        </div>
        <div>
          <span>Form</span>
          <strong>{selectedClubCondition.form > 0 ? `+${selectedClubCondition.form.toFixed(1)}` : selectedClubCondition.form.toFixed(1)}</strong>
        </div>
        <div>
          <span>Fatigue</span>
          <strong>{selectedClubCondition.fatigue.toFixed(1)}</strong>
        </div>
        <div>
          <span>Signed</span>
          <strong>{signedPlayersCount}</strong>
        </div>
        <div>
          <span>Database</span>
          <strong>{databaseCount}</strong>
        </div>
        <div>
          <span>Opponents</span>
          <strong>{opponentsCount}</strong>
        </div>
        <div>
          <span>Matchday income</span>
          <strong>EUR {homeRevenue}M</strong>
        </div>
        <div>
          <span>Result rewards</span>
          <strong>EUR {matchRewards}M</strong>
        </div>
      </div>

      <div className="club-crest">{selectedClub.name.slice(0, 3)}</div>

      <div className="club-copy">
        <p className="eyebrow">Choose your story</p>
        <h2>{selectedClub.objective}</h2>
        <p>
          Control transfers, protect the wage room, and build a squad that
          can handle the Serie A season.
        </p>
        <div className="club-condition-strip">
          <span>{selectedClubCondition.form >= 1 ? 'Hot streak' : selectedClubCondition.form <= -1 ? 'Under pressure' : 'Balanced form'}</span>
          <span>{selectedClubCondition.fatigue >= 2.2 ? 'Heavy legs' : selectedClubCondition.fatigue >= 1.2 ? 'Match load building' : 'Fresh squad'}</span>
        </div>
        <div className="hero-actions">
          {seasonFinished ? (
            <button disabled={careerFinished} onClick={() => onContinueSeason(seasonPlacementReward)}>
              {careerFinished ? 'Career complete' : `Continue to season ${seasonNumber + 1}`}
            </button>
          ) : (
            <button disabled={seasonStarted} onClick={onStartSeason}>
              {seasonStarted ? `Season ${seasonNumber} in progress` : `Start season ${seasonNumber}`}
            </button>
          )}
          <span>{seasonFixturesCount} league matches ready</span>
        </div>
        {seasonFinished ? (
          <div className="club-condition-strip">
            <span>Season {seasonNumber} payout: EUR {seasonPlacementReward}M</span>
            <span>{careerFinished ? `Career ended after ${maxCareerSeasons} seasons` : 'Transfer list refreshed next season'}</span>
          </div>
        ) : null}
      </div>

      <div className="club-picker" aria-label="Choose Serie A club">
        {clubs.map((club) => (
          <button
            className={club.name === selectedClub.name ? 'club-chip active' : 'club-chip'}
            key={club.name}
            onClick={() => onSelectClub(club)}
          >
            <span>{club.name}</span>
            <small>{club.city}</small>
          </button>
        ))}
      </div>
    </section>
  )
}

export default ClubStage
