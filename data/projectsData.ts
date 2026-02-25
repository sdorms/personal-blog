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
  {
    title: 'ARR Calculator',
    description: `Estimate the level of traction you need to hit your revenue goals.`,
    imgSrc: '/static/images/arr_calculator.png',
    href: '/tools/arr-planner/',
  },
]

export default projectsData
