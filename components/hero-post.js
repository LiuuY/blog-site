import Avatar from '../components/avatar'
import DateFormater from '../components/date-formater'
import Link from 'next/link'

export default function HeroPost({
  title,
  date,
  excerpt,
  author,
  slug,
}) {
  return (
    <section>
      <div className="md:grid md:grid-cols-2 md:col-gap-16 lg:col-gap-8 mb-6 md:mb-8">
        <div>
          <h3 className="mb-1 text-base lg:text-base leading-tight">
            <Link as={`/posts/${slug}`} href="/posts/[slug]">
              <a className="hover:underline">{title}</a>
            </Link>
          </h3>
          <div className="mb-4 md:mb-0 text-xs text-gray-500">
            <DateFormater dateString={date} />
          </div>
        </div>
      </div>
    </section>
  )
}
