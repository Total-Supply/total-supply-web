import { MarketingLayout } from '@/src/components/layout'

export default function Layout(props: { children: React.ReactNode }) {
  return <MarketingLayout>{props.children}</MarketingLayout>
}
