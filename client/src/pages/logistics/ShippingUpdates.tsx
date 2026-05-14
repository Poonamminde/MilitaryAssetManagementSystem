import React, { useEffect, useState } from "react";
import { IOrder, OrderStatus } from "../../types";
import { orderService } from "../../services/order.service";
import Table from "../../components/ui/Table";
import Badge, { getOrderStatusVariant } from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";

const ShippingUpdates: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus>(OrderStatus.APPROVED);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAllOrders();
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const getNextStatuses = (current: OrderStatus): OrderStatus[] => {
    const transitions: Record<string, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.APPROVED, OrderStatus.REJECTED],
      [OrderStatus.APPROVED]: [OrderStatus.DISPATCHED, OrderStatus.REJECTED],
      [OrderStatus.DISPATCHED]: [OrderStatus.IN_TRANSIT],
      [OrderStatus.IN_TRANSIT]: [OrderStatus.DELIVERED],
    };
    return transitions[current] || [];
  };

  const openUpdateModal = (order: IOrder) => {
    const nextStatuses = getNextStatuses(order.status);
    if (nextStatuses.length === 0) return;
    setSelectedOrder(order);
    setNewStatus(nextStatuses[0]);
    setNotes("");
    setModalOpen(true);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setSubmitting(true);
    try {
      await orderService.updateOrderStatus(selectedOrder._id, { status: newStatus, notes });
      showToast("Status updated successfully", "success");
      setModalOpen(false);
      fetchOrders();
    } catch (error: any) {
      showToast(error.response?.data?.message || "Failed to update status", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: "orderId", header: "Order ID",
      render: (order: IOrder) => (
        <span className="font-mono text-xs">#{order._id.slice(-8).toUpperCase()}</span>
      ),
    },
    {
      key: "base", header: "Base",
      render: (order: IOrder) => <span className="text-text-secondary">{order.base}</span>,
    },
    {
      key: "orderedBy", header: "Commander",
      render: (order: IOrder) => (
        <span className="text-text-primary">{order.orderedBy?.name || "Unknown"}</span>
      ),
    },
    {
      key: "items", header: "Total Items",
      render: (order: IOrder) => <span className="font-mono">{order.totalItems}</span>,
    },
    {
      key: "status", header: "Status",
      render: (order: IOrder) => (
        <Badge variant={getOrderStatusVariant(order.status)}>{order.status}</Badge>
      ),
    },
    {
      key: "actions", header: "Actions",
      render: (order: IOrder) => {
        const next = getNextStatuses(order.status);
        return next.length > 0 ? (
          <Button size="sm" variant="accent" onClick={() => openUpdateModal(order)}>
            Update Status
          </Button>
        ) : (
          <span className="text-xs text-text-muted">No action</span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Shipping Updates</h1>
        <p className="text-sm text-text-secondary mt-1">Update the shipping status of orders</p>
      </div>

      {toast && (
        <div className={`px-4 py-3 rounded-lg text-sm animate-slide-up ${
          toast.type === "success" ? "bg-success/10 border border-success/30 text-success" : "bg-danger/10 border border-danger/30 text-danger"
        }`}>{toast.message}</div>
      )}

      <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
        <Table columns={columns} data={orders} keyExtractor={(o) => o._id} loading={loading} emptyMessage="No orders found" />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Update Shipping Status">
        {selectedOrder && (
          <form onSubmit={handleUpdateStatus} className="space-y-4">
            <div className="px-3 py-2 bg-bg-dark/50 rounded-lg">
              <p className="text-xs text-text-muted">Order</p>
              <p className="text-sm font-mono text-text-primary">#{selectedOrder._id.slice(-8).toUpperCase()}</p>
              <p className="text-xs text-text-muted mt-1">Current: <Badge variant={getOrderStatusVariant(selectedOrder.status)}>{selectedOrder.status}</Badge></p>
            </div>
            <Select
              id="new-status" label="New Status"
              options={getNextStatuses(selectedOrder.status).map((s) => ({ value: s, label: s }))}
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
            />
            <Input id="status-notes" label="Notes (Optional)" placeholder="Add a note..." value={notes} onChange={(e) => setNotes(e.target.value)} />
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button variant="accent" type="submit" loading={submitting}>Update Status</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ShippingUpdates;
