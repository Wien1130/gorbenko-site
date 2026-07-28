"use client";

import type { ReactNode } from "react";

export function NumInput({
  value,
  onChange,
  width = 84,
}: {
  value: string;
  onChange: (v: string) => void;
  width?: number;
}) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="fm-num-input"
      style={{ width }}
    />
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="fm-section-label">
      <h3>{children}</h3>
    </div>
  );
}

export function Callout({
  tone,
  title,
  children,
}: {
  tone: "success" | "warning" | "info";
  title: string;
  children: ReactNode;
}) {
  return (
    <div className={`fm-callout fm-callout-${tone}`}>
      <div className="fm-callout-title">{title}</div>
      <div className="fm-callout-body">{children}</div>
    </div>
  );
}

export function StatBox({
  value,
  label,
  tone,
}: {
  value: string;
  label: string;
  tone?: "success" | "warning" | "danger";
}) {
  return (
    <div className="stat-box">
      <div className="stat-label">{label}</div>
      <div className={`stat-val${tone ? ` tone-${tone}` : ""}`}>{value}</div>
    </div>
  );
}

export function PillToggle({
  active,
  onClick,
  children,
  tone,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  tone?: "warn" | "ok";
}) {
  const activeClass =
    active && tone === "warn"
      ? " active-warn"
      : active && tone === "ok"
        ? " active-ok"
        : active
          ? " active"
          : "";
  return (
    <button type="button" onClick={onClick} className={`fm-pill${activeClass}`}>
      {children}
    </button>
  );
}

export function Tag({
  tone,
  children,
}: {
  tone: "success" | "warning";
  children: ReactNode;
}) {
  return <span className={`badge ${tone === "success" ? "green" : "amber"}`}>{children}</span>;
}

type Align = "left" | "right" | "center";

export function DataTable({
  headers,
  columnAlign,
  rows,
  rowTone,
  striped,
  stickyHeader,
}: {
  headers: string[];
  columnAlign?: Align[];
  rows: ReactNode[][];
  rowTone?: Array<"success" | "warning" | "danger" | "info" | undefined>;
  striped?: boolean;
  stickyHeader?: boolean;
}) {
  return (
    <div className="fm-table-wrap">
      <table className={striped ? "fm-tbl fm-tbl-striped" : "fm-tbl"}>
        <thead className={stickyHeader ? "fm-tbl-sticky" : undefined}>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{ textAlign: columnAlign?.[i] ?? "left" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={rowTone?.[ri] ? `fm-row-${rowTone[ri]}` : undefined}>
              {row.map((cell, ci) => (
                <td key={ci} style={{ textAlign: columnAlign?.[ci] ?? "left" }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Divider() {
  return <hr className="fm-divider" />;
}
