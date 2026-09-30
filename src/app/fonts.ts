import localFont from 'next/font/local';

// Latin subsets generated from project/assets/fonts (see README for the pyftsubset command).
export const recoleta = localFont({
  src: [
    { path: '../fonts/Recoleta-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/Recoleta-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-recoleta',
  display: 'swap',
});

export const gilroy = localFont({
  src: [
    { path: '../fonts/Gilroy-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/Gilroy-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/Gilroy-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/Gilroy-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-gilroy',
  display: 'swap',
});

export const lilita = localFont({
  src: [{ path: '../fonts/LilitaOne-Regular.woff2', weight: '400', style: 'normal' }],
  variable: '--font-lilita',
  display: 'swap',
  preload: false,
});
