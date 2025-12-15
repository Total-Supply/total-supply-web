export default async function CustomerOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Order Details</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Order ID: {id}</p>
        <p className="mt-4">Order details will be displayed here</p>
      </div>
    </div>
  )
}
