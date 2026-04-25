import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
}

const Link = React.forwardRef<HTMLAnchorElement, Props>(({ href, children, ...props }, ref) => {
  if (href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return <a ref={ref} href={href} {...props}>{children}</a>
  }
  return <RouterLink ref={ref as any} to={href} {...(props as any)}>{children}</RouterLink>
})

Link.displayName = 'Link'
export default Link
