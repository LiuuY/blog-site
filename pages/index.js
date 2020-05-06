import Container from '../components/container'
import HeroPost from '../components/hero-post'
import Intro from '../components/intro'
import Layout from '../components/layout'
import { getAllPosts } from '../lib/api'
import compareDesc from 'date-fns/compareAsc'
import { parseISO } from 'date-fns'

function sortPosts(posts) {
  return posts.sort((a, b) => compareDesc(parseISO(b.date), parseISO(a.date))) 
}

export default function Index({ allPosts }) {
  return (
    <>
      <Layout preview="">
        <Container>
          <Intro />
          {sortPosts(allPosts).map((post, index) => (
            <HeroPost
              title={post.title}
              date={post.date}
              author={post.author}
              slug={post.slug}
              excerpt={post.excerpt}
              key={index}
            /> 
          ))}
        </Container>
      </Layout>
    </>
  )
}

export async function getStaticProps() {
  const allPosts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt',
  ])

  return {
    props: { allPosts },
  }
}
