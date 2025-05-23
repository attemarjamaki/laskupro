import { Document, Page, Text, StyleSheet, View } from "@react-pdf/renderer";
import { Invoice } from "@/types/invoice";
import { InvoiceItem } from "@/types/invoice";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    padding: 16,
    fontSize: 8,
  },
  container: {
    backgroundColor: "white",
    padding: 32,
    flexGrow: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  column: {
    flexDirection: "column",
    gap: 2,
    marginRight: 32,
  },
  textBold: {
    fontWeight: "bold",
    color: "#1F2937",
    fontSize: 14,
  },
  textRight: {
    textAlign: "right",
  },
  section: {
    marginBottom: 28,
    gap: 2,
    marginTop: 28,
    fontSize: 10,
  },
  table: {
    width: "100%",
    marginBottom: 32,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 4,
  },
  tableHeader: {
    fontWeight: "bold",
  },
  tableCell: {
    flex: 1,
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  tableCellRight: {
    flex: 1,
    paddingVertical: 2,
    paddingHorizontal: 2,
    textAlign: "right",
  },
  summary: {
    width: 200,
    alignSelf: "flex-end",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    fontSize: 10,
    fontWeight: "bold",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#D1D5DB",
    paddingTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  invoiceRight: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  smallText: {
    fontSize: 8,
  },
});

export default function InvoicePDF({ invoice }: { invoice: Invoice }) {
  // Calculate totals
  const calculateItemTaxAmount = (item: InvoiceItem) => {
    const price = item.taxIncluded
      ? item.price / (1 + item.taxRate / 100)
      : item.price;
    return price * (item.taxRate / 100) * item.quantity;
  };

  const calculateItemTotalPrice = (item: InvoiceItem) => {
    const price = item.taxIncluded
      ? item.price / (1 + item.taxRate / 100)
      : item.price;
    return (price + price * (item.taxRate / 100)) * item.quantity;
  };

  const totalTaxExcl = invoice.items
    .reduce((sum, item) => {
      const price = item.taxIncluded
        ? item.price / (1 + item.taxRate / 100)
        : item.price;
      return sum + price * item.quantity;
    }, 0)
    .toFixed(2);

  const totalTax = invoice.items
    .reduce((sum, item) => sum + calculateItemTaxAmount(item), 0)
    .toFixed(2);

  const totalInclTax = invoice.items
    .reduce((sum, item) => sum + calculateItemTotalPrice(item), 0)
    .toFixed(2);

  const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat("fi-FI", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Header Section */}
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.textBold}>{invoice.sender.name}</Text>
              <Text style={styles.smallText}>
                Sender address 69, 00400 Helsinki
              </Text>
              <Text style={styles.smallText}>Y-tunnus: 696969-7</Text>

              {/* Recipient Section */}
              <View style={styles.section}>
                <Text>{invoice.recipient.name}</Text>
                <Text>{invoice.recipient.address}</Text>
                <Text>{invoice.recipient.postCodeAndCity}</Text>
              </View>
            </View>
            <View>
              <Text style={styles.textBold}>LASKU</Text>
              <View
                style={{
                  width: "160px",
                  backgroundColor: "#f5f5f4",
                  padding: 12,
                  borderRadius: 12,
                  marginTop: 8,
                  gap: 4,
                }}
              >
                <View style={styles.invoiceRight}>
                  <Text style={{ fontWeight: "bold" }}>Laskun numero</Text>
                  <Text>{invoice.details.invoiceNumber}</Text>
                </View>
                <View style={styles.invoiceRight}>
                  <Text style={{ fontWeight: "bold" }}>Päiväys</Text>
                  <Text>
                    {new Date(invoice.details.date).toLocaleDateString("fi-FI")}
                  </Text>
                </View>
                <View style={styles.invoiceRight}>
                  <Text style={{ fontWeight: "bold" }}>Eräpäivä</Text>
                  <Text>
                    {new Date(invoice.details.dueDate).toLocaleDateString(
                      "fi-FI"
                    )}
                  </Text>
                </View>
                <View style={styles.invoiceRight}>
                  <Text style={{ fontWeight: "bold" }}>Viivästyskorko</Text>
                  <Text>{invoice.details.interestRate} %</Text>
                </View>
                <View style={styles.invoiceRight}>
                  <Text style={{ fontWeight: "bold" }}>Viitenumero</Text>
                  <Text>{invoice.details.reference}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Table Section */}
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Selite</Text>
              <Text style={styles.tableCellRight}>Määrä</Text>
              <Text style={styles.tableCellRight}>Hinta</Text>
              <Text style={styles.tableCellRight}>Alv-kanta</Text>
              <Text style={styles.tableCellRight}>Alv</Text>
              <Text style={styles.tableCellRight}>Yhteensä</Text>
            </View>
            {invoice.items.map((item) => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.description}</Text>
                <Text style={styles.tableCellRight}>{item.quantity}</Text>
                <Text style={styles.tableCellRight}>
                  {formatCurrency(
                    (item.taxIncluded
                      ? item.price / (1 + item.taxRate / 100)
                      : item.price
                    ).toFixed(2)
                  )}
                </Text>
                <Text style={styles.tableCellRight}>{item.taxRate}%</Text>
                <Text style={styles.tableCellRight}>
                  {formatCurrency(calculateItemTaxAmount(item).toFixed(2))}
                </Text>
                <Text style={styles.tableCellRight}>
                  {formatCurrency(calculateItemTotalPrice(item).toFixed(2))}
                </Text>
              </View>
            ))}
          </View>

          {/* Summary Section */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text>Veroton hinta</Text>
              <Text>{formatCurrency(totalTaxExcl)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>Arvonlisävero</Text>
              <Text>{formatCurrency(totalTax)}</Text>
            </View>
            <View
              style={[
                styles.summaryRow,
                { borderTopWidth: 1, borderTopColor: "#D1D5DB", paddingTop: 8 },
              ]}
            >
              <Text>Yhteensä:</Text>
              <Text>{formatCurrency(totalInclTax)}</Text>
            </View>
          </View>

          {/* Footer Section */}
          <View style={[styles.footer, { marginTop: 40 }]}>
            <View>
              <Text style={[styles.textBold, { marginBottom: 8 }]}>
                Yritystiedot
              </Text>
              <Text>{invoice.sender.name}</Text>
              <Text>Y-tunnus: 696969-7</Text>
              <Text>kallentie 69</Text>
              <Text>00400 Hele</Text>
            </View>
            <View>
              <Text style={[styles.textBold, { marginBottom: 8 }]}>
                Yhteystiedot
              </Text>
              <Text>Puh: 045698732</Text>
              <Text>kallepelle@gmail.com</Text>
            </View>
            <View>
              <Text style={[styles.textBold, { marginBottom: 8 }]}>
                Maksutiedot
              </Text>
              <Text>IBAN: FI00 0000 0000 0000 00</Text>
              <Text>BIC: HODLFL</Text>
              <Text>Viitenumero: RF15 4206 9000</Text>
              <Text>
                Eräpäivä:{" "}
                {new Date(invoice.details.dueDate).toLocaleDateString("fi-FI")}
              </Text>
              <Text>Viivästyskorko: {invoice.details.interestRate}%</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
