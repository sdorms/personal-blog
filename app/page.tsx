import Main from './Main'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'

const isProduction =
  process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production'

export default function Page() {
  const posts = allCoreContent(sortPosts(allBlogs.filter((p) => !isProduction || p.draft !== true)))

  return <Main posts={posts} />
}
