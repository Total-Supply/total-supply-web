'use client'

import {
  AdminTable,
  AdminTableSkeleton,
} from '@/src/components/admin/admin-table'

import { OrderRow } from './order-row'

type AdminOrder = {
  id: number
  orderNumber: string
  status: string
  totalPrice: number | string
  createdAt: string
}

type OrdersTableProps = {
  orders: AdminOrder[]
  isLoading: boolean
  statusOptions: { label: string; value: string }[]
}

export function OrdersTable({
  orders,
  isLoading,
  statusOptions,
}: OrdersTableProps) {
  return (
    <AdminTable>
      <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
        <tr>
          <th className="px-4 py-3 text-left">Order #</th>
          <th className="px-4 py-3 text-left">Date</th>
          <th className="px-4 py-3 text-left">Status</th>
          <th className="px-4 py-3 text-right">Total</th>
          <th className="px-4 py-3 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <AdminTableSkeleton columns={5} rows={10} />
        ) : orders.length === 0 ? (
          <tr>
            <td
              className="px-4 py-8 text-center text-muted-foreground"
              colSpan={5}
            >
              No orders found.
            </td>
          </tr>
        ) : (
          orders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              statusOptions={statusOptions}
            />
          ))
        )}
      </tbody>
    </AdminTable>
  )
}
