export function SpaceBackground({ children, className = '' }) {
  return (
    <div className={`cosmos-bg relative min-h-screen ${className}`}>
      <div className="cosmos-overlay" />
      <div className="stars-overlay pointer-events-none fixed inset-0 z-[2]" />
      <div className="relative z-10 flex min-h-screen flex-col">{children}</div>
    </div>
  )
}
