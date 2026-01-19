import { redirect } from 'next/navigation'

export default function AdminCatalogIndexPage() {
  redirect('/dashboard/admin/catalog/items')
}
