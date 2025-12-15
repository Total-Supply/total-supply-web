export default function StaffDashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Staff Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a
          href="/dashboard/staff/cleaner"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h2 className="text-lg font-semibold mb-2">Cleaner Portal</h2>
          <p className="text-gray-600">Manage cleaning services</p>
        </a>
        <a
          href="/dashboard/staff/driver"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h2 className="text-lg font-semibold mb-2">Driver Portal</h2>
          <p className="text-gray-600">Manage deliveries and routes</p>
        </a>
        <a
          href="/dashboard/staff/it"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h2 className="text-lg font-semibold mb-2">IT Portal</h2>
          <p className="text-gray-600">Manage tickets and systems</p>
        </a>
        <a
          href="/dashboard/staff/salesman"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h2 className="text-lg font-semibold mb-2">Salesman Portal</h2>
          <p className="text-gray-600">Manage leads and customers</p>
        </a>
      </div>
    </div>
  )
}
