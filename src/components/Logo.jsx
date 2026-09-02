export default function Logo({ size = 42, ring = true }) {
  return (
    <span className="logo-badge" style={{ width: size, height: size }}>
      <img
        src={`${import.meta.env.BASE_URL}logo.jpg`}
        alt="FIKRADO Security logo"
        style={{ width: size, height: size }}
      />
      <span className="status-dot" />
    </span>
  );
}