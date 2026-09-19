import { STAGE_LABELS, STAGE_COLORS, type Stage } from "../../lib/cold-leads-stats";

export default function StageBadge({ stage }: { stage: string }) {
  const s = stage as Stage;
  const label = STAGE_LABELS[s] ?? stage;
  const color = STAGE_COLORS[s] ?? "#9ca3af";
  return (
    <span className="crm-stage" style={{ background: color + "22", color, border: `1px solid ${color}55` }}>
      {label}
    </span>
  );
}
