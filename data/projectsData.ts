interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Personal site',
    description: `The best way to get started: shipping something.`,
    imgSrc: '/static/images/site_screenshot.png',
    href: '/blog/experiment-1/',
  },
]

export default projectsData
