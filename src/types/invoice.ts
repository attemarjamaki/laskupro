export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  taxRate: number;
  taxIncluded: boolean;
}

export interface Invoice {
  sender: {
    name: string;
  };
  recipient: {
    name: string;
  };
  details: {
    invoiceNumber: string;
  };
  items: InvoiceItem[];
}
