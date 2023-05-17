import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { notFound } from 'next/navigation'

const postsDirectory = join(process.cwd(), '_posts')

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory)
}

export function getPostBySlug(slug, fields = []) {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(postsDirectory, `${realSlug}.md`)
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    const { data, content } = matter(fileContents)

    const items = {}

    // Ensure only the minimal needed data is exposed
    fields.forEach((field) => {
      if (field === 'slug') {
        items[field] = realSlug
      }
      if (field === 'content') {
        items[field] = content
      }

      if (data[field]) {
        items[field] = data[field]
      }
    })

    return items
  } catch {
    return notFound()
  }
}

export function getAllPosts(fields = []) {
  const slugs = getPostSlugs()
  return slugs.map((slug) => getPostBySlug(slug, fields))
}
