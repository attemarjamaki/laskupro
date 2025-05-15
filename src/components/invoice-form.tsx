"use client";

// SECTION: Imports
import { useState, FormEvent } from "react";
import { Invoice, InvoiceItem } from "@/types/invoice";

// SECTION: Component
export default function InvoiceForm({
  onSubmit,
}: {
  onSubmit: (data: Invoice) => void;
}) {
  // SECTION: State Management
  // Initialize form state with default values matching the Invoice type
  const [formData, setFormData] = useState<Invoice>({
    sender: { name: "" },
    recipient: { name: "" },
    details: { invoiceNumber: "" },
    items: [
      {
        id: "1",
        description: "",
        quantity: 1,
        price: 0,
        taxRate: 0,
        taxIncluded: false,
      },
    ],
  });

  // State for tracking validation errors
  const [errors, setErrors] = useState<{
    senderName?: string;
    recipientName?: string;
    invoiceNumber?: string;
    items?: {
      description?: string;
      quantity?: string;
      price?: string;
      taxRate?: string;
    }[];
  }>({});

  // SECTION: Handler Functions
  // Update top-level fields (sender.name, recipient.name, details.invoiceNumber)
  const handleInputChange = (
    field: "sender.name" | "recipient.name" | "details.invoiceNumber",
    value: string
  ) => {
    const [parent, child] = field.split(".");
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent as keyof Invoice], [child]: value },
    }));
  };

  // Update item fields (description, quantity, price, taxRate, taxIncluded)
  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number | boolean
  ) => {
    setFormData((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  // Add a new item with an incremented ID
  const handleAddItem = () => {
    const nextId = formData.items.length
      ? (
          Math.max(...formData.items.map((item) => parseInt(item.id, 10))) + 1
        ).toString()
      : "1";
    const newItem: InvoiceItem = {
      id: nextId,
      description: "",
      quantity: 1,
      price: 0,
      taxRate: 0,
      taxIncluded: false,
    };
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  // Remove an item by index
  const handleRemoveItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // SECTION: Form Submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Basic validation
    const newErrors: typeof errors = { items: [] };
    if (!formData.sender.name) newErrors.senderName = "Sender name is required";
    if (!formData.recipient.name)
      newErrors.recipientName = "Recipient name is required";
    if (!formData.details.invoiceNumber)
      newErrors.invoiceNumber = "Invoice number is required";

    formData.items.forEach((item, index) => {
      const itemErrors: {
        description?: string;
        quantity?: string;
        price?: string;
        taxRate?: string;
      } = {};
      if (!item.description) itemErrors.description = "Description is required";
      if (item.quantity < 1)
        itemErrors.quantity = "Quantity must be at least 1";
      if (item.price < 0) itemErrors.price = "Price cannot be negative";
      newErrors.items![index] = itemErrors;
    });

    setErrors(newErrors);

    // If there are errors, stop submission
    if (
      newErrors.senderName ||
      newErrors.recipientName ||
      newErrors.invoiceNumber ||
      //@ts-ignore
      newErrors.items.some((item) => Object.keys(item).length > 0)
    ) {
      return;
    }

    // Submit valid data
    onSubmit(formData);
  };

  // SECTION: Render
  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      {/* SECTION: Form Header */}
      <h2 className="text-xl font-bold mb-4">Create Invoice</h2>

      {/* SECTION: Sender Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Sender Name</label>
        <input
          value={formData.sender.name}
          onChange={(e) => handleInputChange("sender.name", e.target.value)}
          placeholder="Sender Name"
          className="w-full p-2 border rounded"
        />
        {errors.senderName && (
          <p className="text-red-500 text-sm">{errors.senderName}</p>
        )}
      </div>

      {/* SECTION: Recipient Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Recipient Name</label>
        <input
          value={formData.recipient.name}
          onChange={(e) => handleInputChange("recipient.name", e.target.value)}
          placeholder="Recipient Name"
          className="w-full p-2 border rounded"
        />
        {errors.recipientName && (
          <p className="text-red-500 text-sm">{errors.recipientName}</p>
        )}
      </div>

      {/* SECTION: Invoice Number */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Invoice Number</label>
        <input
          value={formData.details.invoiceNumber}
          onChange={(e) =>
            handleInputChange("details.invoiceNumber", e.target.value)
          }
          placeholder="Invoice Number"
          className="w-full p-2 border rounded"
        />
        {errors.invoiceNumber && (
          <p className="text-red-500 text-sm">{errors.invoiceNumber}</p>
        )}
      </div>

      {/* SECTION: Items */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Items</h3>
        {formData.items.map((item, index) => (
          <div key={item.id} className="mb-4 p-4 border rounded">
            {/* Item Description */}
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <input
                value={item.description}
                onChange={(e) =>
                  handleItemChange(index, "description", e.target.value)
                }
                placeholder="Description"
                className="w-full p-2 border rounded"
              />
              {errors.items?.[index]?.description && (
                <p className="text-red-500 text-sm">
                  {errors.items[index].description}
                </p>
              )}
            </div>

            {/* Item Quantity */}
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(
                    index,
                    "quantity",
                    parseInt(e.target.value, 10)
                  )
                }
                placeholder="Quantity"
                className="w-full p-2 border rounded"
                min="1"
              />
              {errors.items?.[index]?.quantity && (
                <p className="text-red-500 text-sm">
                  {errors.items[index].quantity}
                </p>
              )}
            </div>

            {/* Item Price */}
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                step="0.01"
                value={item.price}
                onChange={(e) =>
                  handleItemChange(index, "price", parseFloat(e.target.value))
                }
                placeholder="Price"
                className="w-full p-2 border rounded"
                min="0"
              />
              {errors.items?.[index]?.price && (
                <p className="text-red-500 text-sm">
                  {errors.items[index].price}
                </p>
              )}
            </div>

            {/* Item Tax Rate */}
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Tax Rate (%)
              </label>
              <select
                value={item.taxRate}
                onChange={(e) =>
                  handleItemChange(
                    index,
                    "taxRate",
                    parseInt(e.target.value, 10)
                  )
                }
                className="w-full p-2 border rounded"
              >
                <option value={0}>0%</option>
                <option value={10}>10%</option>
                <option value={14}>14%</option>
                <option value={24}>24%</option>
              </select>
              {errors.items?.[index]?.taxRate && (
                <p className="text-red-500 text-sm">
                  {errors.items[index].taxRate}
                </p>
              )}
            </div>

            {/* Item Tax Included */}
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                <input
                  type="checkbox"
                  checked={item.taxIncluded}
                  onChange={(e) =>
                    handleItemChange(index, "taxIncluded", e.target.checked)
                  }
                  className="mr-2"
                />
                Tax Included
              </label>
            </div>

            {/* Remove Item Button */}
            <button
              type="button"
              onClick={() => handleRemoveItem(index)}
              className="text-red-500 hover:text-red-700"
            >
              Remove Item
            </button>
          </div>
        ))}

        {/* Add Item Button */}
        <button
          type="button"
          onClick={handleAddItem}
          className="text-blue-500 hover:text-blue-700"
        >
          Add Item
        </button>
      </div>

      {/* SECTION: Submit Button */}
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Preview PDF
      </button>
    </form>
  );
}
