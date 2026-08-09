export default function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="16" fill="#0F6E56" />
      <path
        d="M14 32 Q22 20, 32 32 T50 32"
        stroke="#E1F5EE"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M14 42 Q22 30, 32 42 T50 42"
        stroke="#5DCAA5"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
