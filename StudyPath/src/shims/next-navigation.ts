import { useLocation, useNavigate } from 'react-router-dom'

export function useRouter() {
  const navigate = useNavigate()
  return {
    push: (href: string) => navigate(href),
    replace: (href: string) => navigate(href, { replace: true }),
    back: () => navigate(-1),
  }
}

export function usePathname() {
  return useLocation().pathname
}

export function useSearchParams() {
  const location = useLocation()
  return new URLSearchParams(location.search)
}
