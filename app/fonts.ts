import localFont from 'next/font/local'

export const pixel = localFont({
  src: [
    { path: './fonts/GeistPixel-Square.woff2', weight: '400', style: 'normal' },
    // { path: './fonts/MyPixelFont-Bold.woff2', weight: '700', style: 'normal' }, // if you have it
  ],
  variable: '--font-pixel',
  display: 'swap',
})
