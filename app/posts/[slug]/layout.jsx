import Container from '../../../components/container'
import Header from '../../../components/header'

export default function PostLayout({ children }) {
  return (
    <>
      <div className="min-h-screen">
        <main>
          <Container>
            <Header />
            <article className="mb-32">{children}</article>
          </Container>
        </main>
      </div>
    </>
  )
}
