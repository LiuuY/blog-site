import PostBody from '../../../components/post-body'
import PostHeader from '../../../components/post-header'
import { getPostBySlug } from '../../../lib/api'
import markdownToHtml from '../../../lib/markdownToHtml'

async function getPost(params) {
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'ogImage',
    'coverImage',
  ])
  const content = await markdownToHtml(post.content || '')

  return {
    ...post,
    content,
  }
}

export default async function Post({ params }) {
  const post = await getPost(params)

  return (
    <>
      <PostHeader title={post.title} date={post.date} author={post.author} />
      <PostBody content={post.content} />
    </>
  )
}
