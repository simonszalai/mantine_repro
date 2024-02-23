// This is called a "splat route" and as it's in the root `/app/routes/`
// directory, it's a catchall. If no other routes match, this one will and we
// can know that the user is hitting a URL that doesn't exist. By throwing a
// 404 from the loader, we can force the error boundary to render which will
// ensure the user gets the right status code and we can display a nicer error
// message for them than the Remix and/or browser default.

import { LoaderFunctionArgs } from '@remix-run/node'

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  return null
}

export default function Main() {
  // due to the loader, this component will never be rendered, but we'll return
  // the error boundary just in case.
  return <h1>main</h1>
}
