export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Total Supply - Customer</h1>
            <div className="flex gap-4">
              <a
                href="/dashboard/customer"
                className="text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </a>
              <a
                href="/dashboard/customer/services"
                className="text-gray-600 hover:text-gray-900"
              >
                Services
              </a>
              <a
                href="/dashboard/customer/orders"
                className="text-gray-600 hover:text-gray-900"
              >
                Orders
              </a>
              <a
                href="/dashboard/customer/bookings"
                className="text-gray-600 hover:text-gray-900"
              >
                Bookings
              </a>
              <a
                href="/dashboard/customer/profile"
                className="text-gray-600 hover:text-gray-900"
              >
                Profile
              </a>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}
