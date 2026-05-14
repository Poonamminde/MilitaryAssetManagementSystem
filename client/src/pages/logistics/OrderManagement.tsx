import React, { useEffect, useState } from "react";
import { IOrder } from "../../types";
import { orderService } from "../../services/order.service";
import Table from "../../components/ui/Table";
import Badge, { getOrderStatusVariant } from "../../components/ui/Badge";

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderService.getAllOrders();
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  const statusCounts = orders.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const columns = [
    {
      key: "orderId",
      header: "Order ID",
      render: (order: IOrder) => (
        <span className="font-mono text-xs text-text-primary">
          #{order._id.slice(-8).toUpperCase()}
        </span>
      ),
    },
    {
      key: "orderedBy",
      header: "Ordered By",
      render: (order: IOrder) => (
        <div>
          <p className="text-sm font-medium text-text-primary">
            {order.orderedBy?.name || "Unknown"}
          </p>
          <p className="text-xs text-text-muted">{order.orderedBy?.email || ""}</p>
        </div>
      ),
    },
    {
      key: "base",
      header: "Base",
      render: (order: IOrder) => (
        <span className="text-text-secondary">{order.base}</span>
      ),
    },
    {
      key: "items",
      header: "Items",
      render: (order: IOrder) => (
        <div className="space-y-0.5">
          {order.items.slice(0, 2).map((item, i) => (
            <p key={i} className="text-xs text-text-secondary">
              {item.asset?.name || "Unknown"} ×{item.quantity}
            </p>
          ))}
          {order.items.length > 2 && (
            <p className="text-xs text-text-muted">+{order.items.length - 2} more</p>
          )}
        </div>
      ),
    },
    {
      key: "totalItems",
      header: "Total",
      render: (order: IOrder) => (
        <span className="font-mono text-text-primary">{order.totalItems}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (order: IOrder) => (
        <Badge variant={getOrderStatusVariant(order.status)}>
          {order.status}
        </Badge>
      ),
    },
    {
      key: "date",
      header: "Date",
      render: (order: IOrder) => (
        <span className="text-xs text-text-muted">
          {new Date(order.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Order Management</h1>
        <p className="text-sm text-text-secondary mt-1">View all orders across bases</p>
      </div>

      {/* Status Filter Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all cursor-pointer ${
            filterStatus === "all"
              ? "bg-accent/15 text-accent border-accent/30"
              : "bg-bg-surface text-text-secondary border-border hover:border-border-light"
          }`}
        >
          All ({orders.length})
        </button>
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all cursor-pointer ${
              filterStatus === status
                ? "bg-accent/15 text-accent border-accent/30"
                : "bg-bg-surface text-text-secondary border-border hover:border-border-light"
            }`}
          >
            {status} ({count})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
        <Table
          columns={columns}
          data={filteredOrders}
          keyExtractor={(order) => order._id}
          loading={loading}
          emptyMessage="No orders found"
        />
      </div>
    </div>
  );
};

export default OrderManagement;
