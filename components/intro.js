export default function Intro() {
  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8">
        Blog.
      </h1>
      <div className="flex flex-row items-center flex-no-wrap divide-x mt-4">
        <h4 className="text-center md:text-left text-sm px-2">我</h4>
        <h4 className="text-center md:text-left text-sm px-2">刘宇</h4>
        <h4 className="text-center md:text-left text-sm px-2">LiuuY</h4>
        <a href="mailto:mail4c59@gmail.com" target="_blank">
          <img alt="mailto:mail4c59@gmail.com" src="assets/me/gmail.svg" className="w-4 mx-2" />
        </a>
        <a href="https://github.com/LiuuY" target="_blank">
          <img alt="https://github.com/LiuuY" src="assets/me/github.svg" className="w-4 mx-2" />
        </a>
      </div>
    </section>
  )
}
