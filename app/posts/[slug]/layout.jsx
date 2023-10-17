import Header from '../../../components/header'

export default function PostLayout({ children }) {
  return (
    <div className="min-h-screen">
      <main>
        <Header />
        <article className="mb-32">{children}</article>
      </main>
    </div>
  )
}
