"use client"
export function BokehBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        background:
          "radial-gradient(120px 120px at 15% 20%, var(--color-accent-teal) / 0.25, transparent 60%)," +
          "radial-gradient(110px 110px at 80% 25%, var(--color-accent-blue) / 0.25, transparent 60%)," +
          "radial-gradient(140px 140px at 25% 70%, var(--color-brand) / 0.25, transparent 60%)," +
          "radial-gradient(100px 100px at 90% 75%, var(--color-accent-teal) / 0.22, transparent 60%)," +
          "radial-gradient(130px 130px at 60% 55%, var(--color-accent-blue) / 0.20, transparent 60%)",
        backdropFilter: "blur(0px)",
        backgroundColor: "oklch(0.145 0 0)", // bg-background
      }}
    />
  )
}
