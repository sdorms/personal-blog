import { NewsletterAPI } from 'pliny/newsletter'
import siteMetadata from '@/data/siteMetadata'

export const dynamic = 'force-static'

const handler = NewsletterAPI({
  // @ts-ignore
  provider: siteMetadata.newsletter.provider,
})

export { handler as GET, handler as POST }

// import { NewsletterAPI } from 'pliny/newsletter'
// import siteMetadata from '@/data/siteMetadata'

// export const dynamic = 'force-dynamic'

// const handler = NewsletterAPI({
//   // @ts-ignore
//   provider: siteMetadata.newsletter.provider,
// })

// export async function POST(req: Request) {
//   console.log('[newsletter] provider:', siteMetadata.newsletter.provider)
//   console.log('[newsletter] has API key:', !!process.env.CONVERTKIT_API_KEY)
//   console.log('[newsletter] form id:', process.env.CONVERTKIT_FORM_ID)
//   return handler(req)
// }

// export async function GET(req: Request) {
//   return handler(req)
// }
