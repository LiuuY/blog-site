import Avatar from '../components/avatar'
import DateFormater from '../components/date-formater'
import PostTitle from '../components/post-title'

export default function PostHeader({ title, date, author }) {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      <div className="hidden md:block md:mb-12">
        <Avatar name={author.name} picture={author.picture} />
        <div className="text-xs text-gray-500">
          <DateFormater dateString={date} />
        </div>
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="block md:hidden mb-6">
          <Avatar name={author.name} picture={author.picture} />
        </div>
      </div>
    </>
  )
}
