import "./styles.css";

export default function RiskGradient() {
  const scalePoints = [0, 0.25, 0.5, 0.7, 1];

  return (
    <div className="gradient-bar">
      <div className="scale-points">
        {scalePoints.map((point) => (
          <div key={point.toString()} className="scale-point">
            {point}
          </div>
        ))}
      </div>
    </div>
  );
}
