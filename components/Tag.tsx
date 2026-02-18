import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="text-primary-500 font-pixel hover:text-primary-600 font-pixel dark:hover:text-primary-400 font-pixel mr-3 text-sm font-medium font-pixel uppercase"
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
