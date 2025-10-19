
import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          background: 'hsl(195 53% 7%)', // A dark but not black background
        }}
      >
        <svg
          width="80%"
          height="80%"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Simplified magnifying glass shape with theme colors */}
          <circle cx="45" cy="45" r="30" stroke="hsl(195 100% 50%)" strokeWidth="10" />
          <line x1="68" y1="70" x2="90" y2="90" stroke="hsl(195 100% 50%)" strokeWidth="12" strokeLinecap="round" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
