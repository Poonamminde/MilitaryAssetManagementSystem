import React, { useEffect, useState } from "react";
import { IAsset } from "../../types";
import { assetService } from "../../services/asset.service";
import { orderService, ICreateOrderPayload } from "../../services/order.service";
import Button from "../../components/ui/Button";
import Badge, { getAssetStatusVariant } from "../../components/ui/Badge";
import Card from "../../components/ui/Card";

interface CartItem {
  asset: IAsset;
  quantity: number;
}

const OrderAssets: React.FC = () => {
  const [assets, setAssets] = useState<IAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await assetService.getAvailableAssets();
        setAssets(response.data);
      } catch (error) {
        console.error("Error fetching assets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  const addToCart = (asset: IAsset) => {
    const existing = cart.find((item) => item.asset._id === asset._id);
    if (existing) {
      if (existing.quantity < asset.quantity) {
        setCart(
          cart.map((item) =>
            item.asset._id === asset._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      }
    } else {
      setCart([...cart, { asset, quantity: 1 }]);
    }
  };

  const removeFromCart = (assetId: string) => {
    setCart(cart.filter((item) => item.asset._id !== assetId));
  };

  const updateCartQuantity = (assetId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(assetId);
      return;
    }
    setCart(
      cart.map((item) =>
        item.asset._id === assetId ? { ...item, quantity } : item
      )
    );
  };

  const submitOrder = async () => {
    if (cart.length === 0) return;
    setSubmitting(true);

    try {
      const payload: ICreateOrderPayload = {
        items: cart.map((item) => ({
          asset: item.asset._id,
          quantity: item.quantity,
        })),
        notes: "",
      };

      await orderService.createOrder(payload);
      showToast("Order placed successfully!", "success");
      setCart([]);
    } catch (error: any) {
      console.error("Error creating order:", error);
      showToast(
        error.response?.data?.message || "Failed to place order",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAssets = assets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-accent" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-text-secondary text-sm">Loading assets...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Order Assets</h1>
          <p className="text-sm text-text-secondary mt-1">
            Browse available assets and place orders
          </p>
        </div>
        {cart.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-secondary">
              {totalCartItems} items in cart
            </span>
            <Button variant="accent" onClick={submitOrder} loading={submitting}>
              Place Order
            </Button>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`px-4 py-3 rounded-lg text-sm animate-slide-up ${
            toast.type === "success"
              ? "bg-success/10 border border-success/30 text-success"
              : "bg-danger/10 border border-danger/30 text-danger"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search assets by name or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-bg-surface border border-border rounded-lg text-text-primary placeholder-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
        />
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="bg-bg-surface border border-accent/30 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-accent mb-3">Order Cart</h3>
          <div className="space-y-2">
            {cart.map((item) => (
              <div
                key={item.asset._id}
                className="flex items-center justify-between py-2 px-3 bg-bg-dark/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm text-text-primary font-medium">
                    {item.asset.name}
                  </span>
                  <Badge variant="info">{item.asset.type}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateCartQuantity(item.asset._id, item.quantity - 1)
                    }
                    className="w-7 h-7 rounded-md bg-bg-hover text-text-primary flex items-center justify-center hover:bg-border transition-colors cursor-pointer"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-mono text-text-primary">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateCartQuantity(
                        item.asset._id,
                        Math.min(item.quantity + 1, item.asset.quantity)
                      )
                    }
                    className="w-7 h-7 rounded-md bg-bg-hover text-text-primary flex items-center justify-center hover:bg-border transition-colors cursor-pointer"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.asset._id)}
                    className="ml-2 text-danger hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Asset Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.map((asset) => {
          const inCart = cart.find((item) => item.asset._id === asset._id);
          return (
            <Card key={asset._id} className="animate-fade-in">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-text-primary">
                      {asset.name}
                    </h3>
                    <p className="text-xs text-text-muted mt-0.5">
                      {asset.description || "No description"}
                    </p>
                  </div>
                  <Badge variant={getAssetStatusVariant(asset.status)}>
                    {asset.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-xs text-text-secondary">
                  <span className="flex items-center gap-1">
                    <span className="text-text-muted">Type:</span>
                    {asset.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-text-muted">Stock:</span>
                    <span className="font-mono font-medium text-text-primary">
                      {asset.quantity}
                    </span>
                  </span>
                </div>

                <Button
                  variant={inCart ? "secondary" : "primary"}
                  size="sm"
                  fullWidth
                  onClick={() => addToCart(asset)}
                  disabled={asset.quantity <= 0}
                >
                  {inCart
                    ? `In Cart (${inCart.quantity})`
                    : "Add to Order"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredAssets.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <p>No assets found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default OrderAssets;
