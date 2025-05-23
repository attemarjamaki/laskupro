"use client";

// SECTION: Imports
import { useState, FormEvent } from "react";
import { Invoice, InvoiceItem } from "@/types/invoice";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

// SECTION: Component
export default function InvoiceForm({
  onSubmit,
}: {
  onSubmit: (data: Invoice) => void;
}) {
  // SECTION: State Management
  // Initialize form state with default values matching the Invoice type
  const [invoice, setInvoice] = useState<Invoice>({
    sender: {
      name: "",
      address: "",
      postCodeAndCity: "",
      buisnessId: "",
      email: "",
      phone: "",
      iban: "",
      bic: "",
    },
    recipient: {
      name: "",
      contactPerson: "",
      address: "",
      postCodeAndCity: "",
    },
    details: {
      invoiceNumber: "",
      date: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      reference: "",
      interestRate: 8,
    },
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
    setInvoice((prev) => ({
      ...prev,
      [parent]: { ...prev[parent as keyof Invoice], [child]: value },
    }));
  };

  // Update Sender Details fields (Laskuttaja)
  const updateSender = (field: any, value: string) => {
    setInvoice({
      ...invoice,
      sender: {
        ...invoice.sender,
        [field]: value,
      },
    });
  };

  // Update Details fields (Laskun tiedot)
  const updateDetails = (field: any, value: string | number) => {
    setInvoice({
      ...invoice,
      details: {
        ...invoice.details,
        [field]: value,
      },
    });
  };

  // Update Recipient fields (Vastaanottajan tiedot)
  const updateRecipient = (field: any, value: string) => {
    setInvoice({
      ...invoice,
      recipient: {
        ...invoice.recipient,
        [field]: value,
      },
    });
  };

  // Update item fields (Selite, Määrä, Hinta...)
  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number | boolean
  ) => {
    setInvoice((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  // Add a new item with an incremented ID
  const handleAddItem = () => {
    const nextId = invoice.items.length
      ? (
          Math.max(...invoice.items.map((item) => parseInt(item.id, 10))) + 1
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
    setInvoice((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  // Remove an item by index
  const handleRemoveItem = (index: number) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // SECTION: Form Submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Basic validation
    const newErrors: typeof errors = { items: [] };
    if (!invoice.sender.name) newErrors.senderName = "Sender name is required";
    if (!invoice.recipient.name)
      newErrors.recipientName = "Recipient name is required";
    if (!invoice.details.invoiceNumber)
      newErrors.invoiceNumber = "Invoice number is required";

    invoice.items.forEach((item, index) => {
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
    onSubmit(invoice);
  };

  // SECTION: Render
  return (
    <form onSubmit={handleSubmit} className="mx-auto p-4">
      {/* SECTION: Form Header */}
      <div className="grid md:grid-cols-2 gap-8 pb-4 border-b">
        {/* Left column - Recipient Information */}
        <div>
          <h2 className="text-lg font-medium mb-4">Vastaanottajan tiedot</h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="name" className="w-48 flex-row-reverse pr-2">
                Nimi
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={invoice.recipient.name}
                onChange={(e) => updateRecipient("name", e.target.value)}
                className="flex-1 text-sm"
                required
              />
            </div>

            <div className="flex items-center">
              <Label
                htmlFor="contact-person"
                className="w-48 flex-row-reverse pr-2"
              >
                Yhteyshenkilö
              </Label>
              <Input
                type="text"
                id="contact-person"
                name="contact-person"
                value={invoice.recipient.contactPerson}
                onChange={(e) =>
                  updateRecipient("contactPerson", e.target.value)
                }
                className="flex-1 text-sm"
              />
            </div>

            <div className="flex items-center">
              <Label htmlFor="address" className="w-48 flex-row-reverse pr-2">
                Postiosoite
              </Label>
              <Input
                type="text"
                id="address"
                name="address"
                value={invoice.recipient.address}
                onChange={(e) => updateRecipient("address", e.target.value)}
                className="flex-1 text-sm"
                required
              />
            </div>

            <div className="flex items-center">
              <Label
                htmlFor="post-code-and-city"
                className="w-48 flex-row-reverse pr-2 text-sm"
              >
                Postinumero ja -toimipaikka
              </Label>
              <Input
                type="text"
                id="post-code-and-city"
                name="post-code-and-city"
                value={invoice.recipient.postCodeAndCity}
                onChange={(e) =>
                  updateRecipient("postCodeAndCity", e.target.value)
                }
                className="flex-1 text-sm"
                required
              />
            </div>
          </div>
        </div>

        {/* Right column - Invoice Information */}
        <div>
          <h2 className="text-lg font-medium mb-4">Laskun tiedot</h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <Label
                htmlFor="invoice-number"
                className="w-48 flex-row-reverse pr-2"
              >
                Laskun numero
              </Label>
              <Input
                type="text"
                id="invoice-number"
                name="invoice-number"
                value={invoice.details.invoiceNumber}
                onChange={(e) => updateDetails("invoiceNumber", e.target.value)}
                className="flex-1 text-sm"
                required
              />
            </div>

            <div className="flex items-center">
              <Label
                htmlFor="invoice-date"
                className="w-48 flex-row-reverse pr-2"
              >
                Päiväys
              </Label>
              <Input
                type="date"
                id="invoice-date"
                name="invoice-date"
                value={invoice.details.date}
                onChange={(e) => updateDetails("date", e.target.value)}
                className="flex-1 text-sm"
                required
              />
            </div>

            <div className="flex items-center">
              <Label
                htmlFor="invoice-due-date"
                className="w-48 flex-row-reverse pr-2"
              >
                Eräpäivä
              </Label>
              <Input
                type="date"
                id="invoice-due-date"
                name="invoice-due-date"
                value={invoice.details.dueDate}
                onChange={(e) => updateDetails("dueDate", e.target.value)}
                className="flex-1 text-sm"
                required
              />
            </div>

            <div className="flex items-center">
              <Label
                htmlFor="interest-rate"
                className="w-48 flex-row-reverse pr-2"
              >
                Viivästyskorko
              </Label>
              <Input
                type="number"
                id="interest-rate"
                name="interest-rate"
                value={invoice.details.interestRate}
                onChange={(e) => updateDetails("interestRate", e.target.value)}
                className="flex-1 text-sm"
                required
              />
            </div>
            <div className="flex items-center">
              <Label
                htmlFor="invoice-reference"
                className="w-48 flex-row-reverse pr-2"
              >
                Viitenumero
              </Label>
              <Input
                type="text"
                id="invoice-reference"
                name="invoice-reference"
                value={invoice.details.reference}
                onChange={(e) => updateDetails("reference", e.target.value)}
                className="flex-1 text-sm"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: Sender Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Sender Name</label>
        <input
          value={invoice.sender.name}
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
          value={invoice.recipient.name}
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
          value={invoice.details.invoiceNumber}
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
        {invoice.items.map((item, index) => (
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
