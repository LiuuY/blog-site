import compareDesc from 'date-fns/compareAsc'
import { parseISO } from 'date-fns'
import PostLink from '../components/post-link'
import { getAllPosts } from '../lib/api'
import Intro from '../components/intro'

const sortPosts = (posts) => {
  return posts.sort((a, b) => compareDesc(parseISO(b.date), parseISO(a.date)))
}

export default function Page() {
  const allPosts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt',
  ])
  return (
    <>
      <Intro />
      {sortPosts(allPosts).map((post, index) => (
        <PostLink
          title={post.title}
          date={post.date}
          author={post.author}
          slug={post.slug}
          excerpt={post.excerpt}
          key={index}
        />
      ))}
    </>
  )
}
