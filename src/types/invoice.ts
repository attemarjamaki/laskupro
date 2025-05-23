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
    address: string;
    postCodeAndCity: string;
    buisnessId: string;
    email: string;
    phone: string;
    website: string;
    iban: string;
    bic: string;
    bank: string;
  };
  recipient: {
    name: string;
    contactPerson: string;
    address: string;
    postCodeAndCity: string;
  };
  details: {
    invoiceNumber: string;
    date: string;
    dueDate: string;
    reference: string;
    interestRate: number;
  };
  items: InvoiceItem[];
}
