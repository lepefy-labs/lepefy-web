export default function LogoSvg({ height = 36 }: { height?: number }) {
  const w = Math.round((168 / 48) * height);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 168 48"
      width={w}
      height={height}
      role="img"
    >
      <title>Lepefy</title>
      <path d="M 4 4 L 4 44 L 36 44" stroke="#1E1B4B" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 4 34 A 10 10 0 0 1 14 44" stroke="#6366F1" strokeWidth="1.5" fill="none" />
      <path d="M 4 24 A 20 20 0 0 1 24 44" stroke="#6366F1" strokeWidth="1.5" fill="none" opacity="0.55" />
      <path d="M 4 14 A 30 30 0 0 1 34 44" stroke="#6366F1" strokeWidth="1.5" fill="none" opacity="0.25" />
      <text
        x="50"
        y="35"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif"
        fontSize="28"
        fontWeight="800"
        fill="#1E1B4B"
        letterSpacing="-1"
      >
        lepefy
      </text>
    </svg>
  );
}
