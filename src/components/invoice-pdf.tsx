import { Document, Page, Text, StyleSheet } from "@react-pdf/renderer";
import { Invoice } from "@/types/invoice";

const styles = StyleSheet.create({
  page: { padding: 30 },
  text: { fontSize: 12, marginBottom: 10 },
  title: { fontSize: 24, marginBottom: 20 },
});

export default function InvoicePDF({ invoice }: { invoice: Invoice }) {
  const totalTaxExcl = invoice.items
    .reduce((sum, item) => {
      const price = item.taxIncluded
        ? item.price / (1 + item.taxRate / 100)
        : item.price;
      return sum + price * item.quantity;
    }, 0)
    .toFixed(2);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          Invoice #{invoice.details.invoiceNumber}
        </Text>
        <Text style={styles.text}>From: {invoice.sender.name}</Text>
        <Text style={styles.text}>To: {invoice.recipient.name}</Text>
        <Text style={styles.text}>Items:</Text>
        {invoice.items.map((item) => (
          <Text key={item.id} style={styles.text}>
            {item.description}: {item.quantity} x ${item.price.toFixed(2)} (Tax:{" "}
            {item.taxRate}%{item.taxIncluded ? ", Included" : ""})
          </Text>
        ))}
        <Text style={styles.text}>Total: ${totalTaxExcl}</Text>
      </Page>
    </Document>
  );
}
