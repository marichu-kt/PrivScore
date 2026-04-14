const LETTERS = ["A", "B", "C", "D", "E"];

export default function NutriScore({
  rating,
  size = "compact",
  score,
  label = "Privacidad",
  brand = "",
}) {
  return (
    <div
      className={`nutriScore nutriScore--${size} ${rating ? `nutriScore--active-${rating.toLowerCase()}` : ""}`.trim()}
      aria-label={`Escala ${label}${rating ? `, nivel ${rating}` : ""}`}
    >
      <div className="nutriScorePlate">
        {brand ? <div className="nutriScoreWordmark">{brand}</div> : null}
        <div className="nutriScoreTrack">
          {LETTERS.map((letter) => {
            const active = rating === letter;
            return (
              <div
                key={letter}
                className={`nutriSegment nutriSegment--${letter.toLowerCase()} ${active ? "is-active" : ""}`.trim()}
                aria-current={active ? "true" : undefined}
              >
                <span>{letter}</span>
              </div>
            );
          })}
        </div>
      </div>
      {score !== undefined && score !== null ? (
        <div className="nutriScoreMeta">
          <strong>{score}/100</strong>
          <span>{label}</span>
        </div>
      ) : null}
    </div>
  );
}
