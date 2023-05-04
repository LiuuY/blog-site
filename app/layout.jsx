import { Analytics } from '@vercel/analytics/react'
import Container from '../components/container'
import Footer from '../components/footer'

import './global.css'

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
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
