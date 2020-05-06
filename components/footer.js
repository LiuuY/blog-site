import Container from "./container";

export default function Footer() {
  return (
    <footer className="bg-accent-1 border-t border-accent-2">
      <Container>
        <div className="py-10 flex flex-col lg:flex-row items-center">
          <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">
            <img alt="知识共享许可协议" src="https://i.creativecommons.org/l/by/4.0/80x15.png" />
          </a>
          本作品采用
          <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">知识共享署名 4.0 国际许可协议</a>
          进行许可。
        </div>
      </Container>
    </footer>
  )
}
