import Container from "./container";

export default function Footer() {
  return (
    <footer className="">
      <Container>
        <img className="w-full" src="/assets/me/home.jpeg"></img>
        <div className="py-2 flex flex-col lg:flex-row items-center">
          <a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/">
            CC BY-NC 4.0 
          </a>
        </div>
      </Container>
    </footer>
  )
}
