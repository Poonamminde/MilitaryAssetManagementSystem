import React, { useEffect, useState } from "react";
import { IOrder, OrderStatus } from "../../types";
import { orderService } from "../../services/order.service";
import Badge, { getOrderStatusVariant } from "../../components/ui/Badge";

const OrderTracking: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

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

  const statusSteps: OrderStatus[] = [
    OrderStatus.PENDING,
    OrderStatus.APPROVED,
    OrderStatus.DISPATCHED,
    OrderStatus.IN_TRANSIT,
    OrderStatus.DELIVERED,
  ];

  const getStepIndex = (status: OrderStatus): number => {
    if (status === OrderStatus.REJECTED) return -1;
    return statusSteps.indexOf(status);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-accent" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-text-secondary text-sm">Loading orders...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Order Tracking</h1>
        <p className="text-sm text-text-secondary mt-1">
          Track your orders in real-time
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-bg-surface border border-border rounded-xl p-12 text-center">
          <svg className="w-12 h-12 mx-auto text-text-muted opacity-40 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-text-muted">No orders placed yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Order List */}
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order._id}
                onClick={() => setSelectedOrder(order)}
                className={`
                  bg-bg-surface border rounded-xl p-4 cursor-pointer
                  transition-all duration-200 hover:shadow-lg hover:shadow-black/10
                  ${selectedOrder?._id === order._id
                    ? "border-accent/50 shadow-lg shadow-accent/5"
                    : "border-border hover:border-border-light"
                  }
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-text-muted">
                    #{order._id.slice(-8).toUpperCase()}
                  </span>
                  <Badge variant={getOrderStatusVariant(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {order.totalItems} item{order.totalItems > 1 ? "s" : ""}
                    </p>
                    <p className="text-xs text-text-muted">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <svg
                    className="w-4 h-4 text-text-muted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Order Details */}
          <div>
            {selectedOrder ? (
              <div className="bg-bg-surface border border-border rounded-xl p-5 sticky top-20 animate-fade-in">
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-semibold text-text-primary">
                      Order Details
                    </h3>
                    <Badge variant={getOrderStatusVariant(selectedOrder.status)}>
                      {selectedOrder.status}
                    </Badge>
                  </div>
                  <p className="text-xs font-mono text-text-muted">
                    #{selectedOrder._id.slice(-8).toUpperCase()}
                  </p>
                </div>

                {/* Items */}
                <div className="mb-5">
                  <h4 className="text-sm font-medium text-text-secondary mb-2">
                    Items
                  </h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 px-3 bg-bg-dark/50 rounded-lg"
                      >
                        <span className="text-sm text-text-primary">
                          {item.asset?.name || "Unknown Asset"}
                        </span>
                        <span className="text-sm text-text-secondary font-mono">
                          ×{item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Tracker */}
                {selectedOrder.status !== OrderStatus.REJECTED && (
                  <div className="mb-5">
                    <h4 className="text-sm font-medium text-text-secondary mb-3">
                      Shipping Progress
                    </h4>
                    <div className="flex items-center justify-between">
                      {statusSteps.map((step, index) => {
                        const currentIndex = getStepIndex(selectedOrder.status);
                        const isCompleted = index <= currentIndex;
                        const isCurrent = index === currentIndex;
                        return (
                          <div key={step} className="flex flex-col items-center flex-1">
                            <div className="flex items-center w-full">
                              {index > 0 && (
                                <div
                                  className={`flex-1 h-0.5 ${
                                    isCompleted
                                      ? "bg-accent"
                                      : "bg-border"
                                  }`}
                                />
                              )}
                              <div
                                className={`
                                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                                  ${isCurrent
                                    ? "bg-accent text-bg-dark ring-4 ring-accent/20"
                                    : isCompleted
                                    ? "bg-accent/60 text-bg-dark"
                                    : "bg-border text-text-muted"
                                  }
                                `}
                              >
                                {isCompleted ? "✓" : index + 1}
                              </div>
                              {index < statusSteps.length - 1 && (
                                <div
                                  className={`flex-1 h-0.5 ${
                                    index < currentIndex
                                      ? "bg-accent"
                                      : "bg-border"
                                  }`}
                                />
                              )}
                            </div>
                            <span className="text-[10px] text-text-muted mt-1.5 text-center leading-tight">
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tracking History */}
                <div>
                  <h4 className="text-sm font-medium text-text-secondary mb-3">
                    Tracking History
                  </h4>
                  <div className="space-y-3">
                    {selectedOrder.trackingHistory.map((entry, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-accent flex-shrink-0 mt-1.5" />
                          {index < selectedOrder.trackingHistory.length - 1 && (
                            <div className="w-px h-full bg-border mt-1" />
                          )}
                        </div>
                        <div className="pb-3">
                          <p className="text-sm font-medium text-text-primary">
                            {entry.status}
                          </p>
                          {entry.notes && (
                            <p className="text-xs text-text-muted">
                              {entry.notes}
                            </p>
                          )}
                          <p className="text-[10px] text-text-muted mt-0.5">
                            {new Date(entry.timestamp).toLocaleString()}
                            {entry.updatedBy?.name && ` • ${entry.updatedBy.name}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-bg-surface border border-border rounded-xl p-12 text-center">
                <p className="text-text-muted text-sm">
                  Select an order to view details
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
