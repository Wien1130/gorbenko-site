import type { Metric } from "../../lib/content";
import Counter from "./Counter";

/** Renders a Metric: animated Counter for numbers, plain text otherwise. */
export default function MetricValue({
  metric,
  className = "font-display text-3xl font-bold text-[var(--accent)] sm:text-4xl",
}: {
  metric: Metric;
  className?: string;
}) {
  return (
    <span className={className}>
      {metric.text ? (
        metric.text
      ) : (
        <Counter value={metric.value} prefix={metric.prefix} suffix={metric.suffix} />
      )}
    </span>
  );
}
