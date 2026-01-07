import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Akshaya Garments | Premium Clothing Collection',
  description: 'Discover our exclusive collection of premium clothing for Men, Women, Girls, Boys, and Babies. Akshaya Garments - Quality fashion at its finest.',
  keywords: 'clothing, fashion, mens wear, womens wear, kids clothing, premium fashion, Akshaya Garments',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#0a0a0f" />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

