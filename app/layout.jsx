import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/react'
import Container from '../components/container'
import Footer from '../components/footer'

import './global.css'

const Optima = localFont({
  src: [
    {
      path: '../components/fonts/Optima/Optima-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../components/fonts/Optima/Optima-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../components/fonts/Optima/Optima-Bold.ttf',
      weight: '700',
      style: 'bold',
    },
  ],
})

export default function RootLayout({ children }) {
  return (
    <html lang="zh" className={Optima.className}>
      <body>
        <div className="min-h-screen">
          <main>
            <Container>{children}</Container>
          </main>
        </div>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}

export const metadata = {
  title: 'LiuuY blog.',
  description: "LiuuY's blog mainly focus on frontend. LiuuY 的博客。",
  themeColor: '#000',
}
