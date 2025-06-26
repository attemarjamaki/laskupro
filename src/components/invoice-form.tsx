"use client";

// SECTION: Imports
import { useState, FormEvent } from "react";
import { Invoice, InvoiceItem } from "@/types/invoice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "./ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { Ubuntu } from "next/font/google";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-ubuntu",
});

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
      website: "",
      iban: "",
      bic: "",
      bank: "",
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
      message: "",
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

  // Update Sender Details fields (Laskuttaja)
  const updateSender = (field: string, value: string) => {
    setInvoice({
      ...invoice,
      sender: {
        ...invoice.sender,
        [field]: value,
      },
    });
  };

  // Update Details fields (Laskun tiedot)
  const updateDetails = (field: string, value: string | number) => {
    setInvoice({
      ...invoice,
      details: {
        ...invoice.details,
        [field]: value,
      },
    });
  };

  // Update Recipient fields (Vastaanottajan tiedot)
  const updateRecipient = (field: string, value: string) => {
    setInvoice({
      ...invoice,
      recipient: {
        ...invoice.recipient,
        [field]: value,
      },
    });
  };

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number | boolean
  ) => {
    setInvoice((prev) => {
      const newItems = [...prev.items];
      newItems[index] = {
        ...newItems[index],
        [field]: field === "taxRate" ? parseFloat(value as string) : value,
      };
      return { ...prev, items: newItems };
    });
  };

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
  // this also
  const handleRemoveItem = (index: number) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // Helper function calculations

  const calculateItemNetPrice = (item: InvoiceItem) => {
    if (item.taxIncluded) {
      // If tax is included, we need to extract it
      return (item.price * item.quantity) / (1 + item.taxRate / 100);
    }
    return item.price * item.quantity;
  };

  const calculateItemTaxAmount = (item: InvoiceItem) => {
    if (item.taxIncluded) {
      // If tax is included, calculate the tax portion
      const netAmount = calculateItemNetPrice(item);
      return item.price * item.quantity - netAmount;
    } else {
      // If tax is not included, calculate the tax to be added
      return (item.price * item.quantity * item.taxRate) / 100;
    }
  };

  const calculateItemTotalPrice = (item: InvoiceItem) => {
    if (item.taxIncluded) {
      // If tax is included, the total is simply price * quantity
      return item.price * item.quantity;
    } else {
      // If tax is not included, add the tax to the price * quantity
      return item.price * item.quantity + calculateItemTaxAmount(item);
    }
  };

  const calculateSubtotal = () => {
    return invoice.items.reduce(
      (sum, item) => sum + calculateItemNetPrice(item),
      0
    );
  };

  const calculateTaxAmount = () => {
    return invoice.items.reduce(
      (sum, item) => sum + calculateItemTaxAmount(item),
      0
    );
  };

  const calculateTotal = () => {
    return invoice.items.reduce(
      (sum, item) => sum + calculateItemTotalPrice(item),
      0
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat("fi-FI", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  // SECTION: Form Submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Basic validation
    const newErrors: typeof errors = { items: [] };

    if (!invoice.sender.name) newErrors.senderName = "Sender name is required";
    if (!invoice.recipient.name)
      newErrors.recipientName = "Recipient name is required";

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
      //@ts-expect-error
      newErrors.items.some((item) => Object.keys(item).length > 0)
    ) {
      return;
    }
    // Submit valid data
    onSubmit(invoice);
  };

  // SECTION: Render
  return (
    <form onSubmit={handleSubmit} className={`${ubuntu.variable} mx-auto`}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <h2 className="text-2xl font-medium font-ubuntu">Luo lasku</h2>
        </div>
        <div>
          <Button type="submit" variant="default">
            Esikatsele PDF
          </Button>
        </div>
      </div>

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
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: Message (optional) */}

      <div className="pt-4">
        <div>
          <Label htmlFor="message" className="mb-2">
            Laskuviesti
          </Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Kirjoita mahdollinen laskuviesti"
            value={invoice.details.message}
            onChange={(e) => updateDetails("message", e.target.value)}
            className="text-sm"
          />
        </div>
      </div>

      {/* SECTION: Items for invoice */}

      <div className="py-4 border-b">
        <h2 className="text-lg font-semibold mb-4">Laskun rivit</h2>
        <div className="space-y-4">
          {invoice.items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-12 md:col-span-6 space-y-2">
                <Label htmlFor={`item-description-${index}`}>Selite</Label>
                <Input
                  id={`item-description-${index}`}
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange(index, "description", e.target.value)
                  }
                  className="h-8"
                  required
                />
              </div>
              <div className="col-span-2 md:col-span-1 space-y-2">
                <Label htmlFor={`item-quantity-${index}`}>Määrä</Label>
                <Input
                  id={`item-quantity-${index}`}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", e.target.value)
                  }
                  className="h-8"
                  required
                />
              </div>
              <div className="col-span-4 md:col-span-2 space-y-2">
                <Label htmlFor={`item-price-${index}`}>Hinta €</Label>
                <Input
                  id={`item-price-${index}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.price}
                  onChange={(e) =>
                    handleItemChange(index, "price", parseFloat(e.target.value))
                  }
                  className="h-8"
                  required
                />
              </div>

              <div className="col-span-4 md:col-span-2 space-y-2">
                <Label htmlFor={`item-tax-${index}`}>ALV %</Label>
                <Select
                  value={item.taxRate.toString()}
                  onValueChange={(value) =>
                    handleItemChange(index, "taxRate", parseFloat(value))
                  }
                >
                  <SelectTrigger
                    className="h-8 mb-0 w-full"
                    id={`item-tax-${index}`}
                  >
                    <SelectValue placeholder="ALV %" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0%</SelectItem>
                    <SelectItem value="10">10%</SelectItem>
                    <SelectItem value="14">14%</SelectItem>
                    <SelectItem value="24">24%</SelectItem>
                    <SelectItem value="25.5">25,5%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 md:col-span-1 flex items-center justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem(index)}
                  disabled={invoice.items.length <= 1}
                  className="bg-red-200 hover:bg-red-300"
                >
                  <Trash2 />
                </Button>
              </div>

              <div className="col-span-12 flex items-center space-x-2 mt-1">
                <Checkbox
                  id={`tax-included-${index}`}
                  checked={item.taxIncluded}
                  onCheckedChange={(checked) =>
                    handleItemChange(index, "taxIncluded", checked)
                  }
                />
                <Label htmlFor={`tax-included-${index}`} className="text-sm">
                  ALV sisältyy hintaan ({formatCurrency(item.price)}{" "}
                  {item.taxIncluded
                    ? `sis. ALV ${formatCurrency(calculateItemTaxAmount(item))}`
                    : `+ ALV ${formatCurrency(
                        calculateItemTaxAmount(item)
                      )} = ${formatCurrency(calculateItemTotalPrice(item))}`}
                  )
                </Label>
              </div>
            </div>
          ))}
          <Button
            onClick={handleAddItem}
            variant="outline"
            className="w-full rounded-sm"
          >
            <Plus className="h-4 w-4 mr-2" /> Lisää rivi
          </Button>
        </div>
        <div className="flex flex-col w-full lg:w-96 lg:ml-auto mt-4 space-y-1">
          <div className="flex justify-between">
            <p className="font-medium">Veroton summa</p>
            <span>{formatCurrency(calculateSubtotal())} </span>
          </div>
          <div className="flex justify-between">
            <p className="font-medium">Arvonlisävero</p>
            <span>{formatCurrency(calculateTaxAmount())} </span>
          </div>
          <div className="flex justify-between font-bold">
            <p>Yhteensä</p>
            <span>{formatCurrency(calculateTotal())} </span>
          </div>
        </div>
      </div>

      {/* SECTION: Sender Information */}
      <div className="py-4 mx-auto">
        <h2 className="text-lg font-medium mb-4">Omat tiedot</h2>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {/* Left column - Company Information */}
          <div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Label
                  htmlFor="company-name"
                  className="w-39 flex-row-reverse pr-2"
                >
                  Nimi
                </Label>
                <Input
                  type="text"
                  id="company-name"
                  name="name"
                  value={invoice.sender.name}
                  onChange={(e) => updateSender("name", e.target.value)}
                  className="flex-1 text-sm"
                  required
                />
              </div>

              <div className="flex items-center">
                <Label
                  htmlFor="business-id"
                  className="w-39 flex-row-reverse pr-2"
                >
                  Y-tunnus
                </Label>
                <Input
                  type="text"
                  id="business-id"
                  name="business-id"
                  value={invoice.sender.buisnessId}
                  onChange={(e) => updateSender("buisnessId", e.target.value)}
                  className="flex-1 text-sm"
                  required
                />
              </div>

              <div className="flex items-center">
                <Label
                  htmlFor="company-address"
                  className="w-39 flex-row-reverse pr-2"
                >
                  Postiosoite
                </Label>
                <Input
                  type="text"
                  id="company-address"
                  name="address"
                  value={invoice.sender.address}
                  onChange={(e) => updateSender("address", e.target.value)}
                  className="flex-1 text-sm"
                  required
                />
              </div>

              <div className="flex items-center">
                <Label
                  htmlFor="company-post-code-and-city"
                  className="w-39 flex-row-reverse pr-2"
                >
                  Postinro ja -toimipaikka
                </Label>
                <Input
                  type="text"
                  id="company-post-code-and-city"
                  name="post-code-and-city"
                  value={invoice.sender.postCodeAndCity}
                  onChange={(e) =>
                    updateSender("postCodeAndCity", e.target.value)
                  }
                  className="flex-1 text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Middle column - Contact Information */}
          <div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="email" className="w-20 flex-row-reverse pr-2">
                  Sähköposti
                </Label>
                <Input
                  type="text"
                  id="email"
                  name="email"
                  value={invoice.sender.email}
                  onChange={(e) => updateSender("email", e.target.value)}
                  className="flex-1 text-sm"
                />
              </div>

              <div className="flex items-center">
                <Label htmlFor="phone" className="w-20 flex-row-reverse pr-2">
                  Puhelin
                </Label>
                <Input
                  type="text"
                  id="phone"
                  name="phone"
                  value={invoice.sender.phone}
                  onChange={(e) => updateSender("phone", e.target.value)}
                  className="flex-1 text-sm"
                />
              </div>

              <div className="flex items-center">
                <Label htmlFor="website" className="w-20 flex-row-reverse pr-2">
                  Nettisivusto
                </Label>
                <Input
                  type="text"
                  id="website"
                  name="website"
                  value={invoice.sender.website}
                  onChange={(e) => updateSender("website", e.target.value)}
                  className="flex-1 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Right column - VAT and Domicile Information */}
          <div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="bank" className="w-16 flex-row-reverse pr-2">
                  Pankki
                </Label>
                <Input
                  type="text"
                  id="bank"
                  name="bank"
                  value={invoice.sender.bank}
                  onChange={(e) => updateSender("bank", e.target.value)}
                  className="flex-1 text-sm"
                />
              </div>
              <div className="flex items-center">
                <Label htmlFor="iban" className="w-16 flex-row-reverse pr-2">
                  IBAN
                </Label>
                <Input
                  type="text"
                  id="iban"
                  name="iban"
                  value={invoice.sender.iban}
                  onChange={(e) => updateSender("iban", e.target.value)}
                  className="flex-1 text-sm"
                  required
                />
              </div>

              <div className="flex items-center">
                <Label htmlFor="bic" className="w-16 flex-row-reverse pr-2">
                  BIC
                </Label>
                <Input
                  type="text"
                  id="bic"
                  name="bic"
                  value={invoice.sender.bic}
                  onChange={(e) => updateSender("bic", e.target.value)}
                  className="flex-1 text-sm"
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
