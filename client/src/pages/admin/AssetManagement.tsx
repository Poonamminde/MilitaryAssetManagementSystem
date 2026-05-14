import React, { useEffect, useState } from "react";
import { IAsset, AssetType, AssetStatus } from "../../types";
import { assetService, ICreateAssetPayload } from "../../services/asset.service";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Modal from "../../components/ui/Modal";
import Badge, { getAssetStatusVariant } from "../../components/ui/Badge";

interface AssetFormData {
  name: string;
  type: AssetType;
  quantity: number;
  description: string;
  manufacturer: string;
  weight: string;
}

const defaultFormData: AssetFormData = {
  name: "",
  type: AssetType.EQUIPMENT,
  quantity: 0,
  description: "",
  manufacturer: "",
  weight: "",
};

const AssetManagement: React.FC = () => {
  const [assets, setAssets] = useState<IAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<IAsset | null>(null);
  const [formData, setFormData] = useState<AssetFormData>(defaultFormData);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const response = await assetService.getAllAssets();
      setAssets(response.data);
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const openCreateModal = () => {
    setEditingAsset(null);
    setFormData(defaultFormData);
    setModalOpen(true);
  };

  const openEditModal = (asset: IAsset) => {
    setEditingAsset(asset);
    setFormData({
      name: asset.name,
      type: asset.type,
      quantity: asset.quantity,
      description: asset.description || "",
      manufacturer: asset.specifications?.manufacturer || "",
      weight: asset.specifications?.weight || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload: ICreateAssetPayload = {
        name: formData.name,
        type: formData.type,
        quantity: formData.quantity,
        description: formData.description,
        specifications: {
          manufacturer: formData.manufacturer,
          weight: formData.weight,
        },
      };

      if (editingAsset) {
        await assetService.updateAsset(editingAsset._id, payload);
        showToast("Asset updated successfully", "success");
      } else {
        await assetService.createAsset(payload);
        showToast("Asset created successfully", "success");
      }

      setModalOpen(false);
      fetchAssets();
    } catch (error) {
      console.error("Error saving asset:", error);
      showToast("Failed to save asset", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (assetId: string) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;

    try {
      await assetService.deleteAsset(assetId);
      showToast("Asset deleted successfully", "success");
      fetchAssets();
    } catch (error) {
      console.error("Error deleting asset:", error);
      showToast("Failed to delete asset", "error");
    }
  };

  const typeOptions = Object.values(AssetType).map((t) => ({
    value: t,
    label: t,
  }));

  const columns = [
    {
      key: "name",
      header: "Asset",
      render: (asset: IAsset) => (
        <div>
          <p className="font-medium text-text-primary">{asset.name}</p>
          <p className="text-xs text-text-muted mt-0.5">{asset.description}</p>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (asset: IAsset) => (
        <Badge variant="info">{asset.type}</Badge>
      ),
    },
    {
      key: "quantity",
      header: "Quantity",
      render: (asset: IAsset) => (
        <span className="font-mono font-medium text-text-primary">
          {asset.quantity}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (asset: IAsset) => (
        <Badge variant={getAssetStatusVariant(asset.status)}>
          {asset.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (asset: IAsset) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => openEditModal(asset)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDelete(asset._id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Asset Management
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Create and manage military assets
          </p>
        </div>
        <Button variant="accent" onClick={openCreateModal}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Asset
        </Button>
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

      {/* Assets Table */}
      <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
        <Table
          columns={columns}
          data={assets}
          keyExtractor={(asset) => asset._id}
          loading={loading}
          emptyMessage="No assets found. Create your first asset."
        />
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingAsset ? "Edit Asset" : "Create New Asset"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="asset-name"
            label="Asset Name"
            placeholder="e.g., M4A1 Carbine, HMMWV"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              id="asset-type"
              label="Asset Type"
              options={typeOptions}
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as AssetType })
              }
            />
            <Input
              id="asset-quantity"
              label="Quantity"
              type="number"
              min="0"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  quantity: parseInt(e.target.value) || 0,
                })
              }
              required
            />
          </div>

          <Input
            id="asset-description"
            label="Description"
            placeholder="Brief description of the asset"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="asset-manufacturer"
              label="Manufacturer"
              placeholder="e.g., Colt, AM General"
              value={formData.manufacturer}
              onChange={(e) =>
                setFormData({ ...formData, manufacturer: e.target.value })
              }
            />
            <Input
              id="asset-weight"
              label="Weight"
              placeholder="e.g., 3.4 kg"
              value={formData.weight}
              onChange={(e) =>
                setFormData({ ...formData, weight: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="accent" type="submit" loading={submitting}>
              {editingAsset ? "Update Asset" : "Create Asset"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AssetManagement;
