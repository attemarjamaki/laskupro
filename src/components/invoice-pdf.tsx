import { Document, Page, Text, StyleSheet, View } from "@react-pdf/renderer";
import { Invoice } from "@/types/invoice";
import { InvoiceItem } from "@/types/invoice";

const styles = StyleSheet.create({
  page: {
    position: "relative",
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
  message: {
    marginBottom: 28,
    gap: 2,
    marginTop: 8,
    fontSize: 10,
  },
  table: {
    width: "100%",
    marginBottom: 20,
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
    width: 160,
    alignSelf: "flex-end",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    borderTopWidth: 1,
    borderTopColor: "#D1D5DB",
    paddingTop: 10,
  },
  companyDetails: {
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
  detachLine: {
    borderTopWidth: 1,
    borderColor: "#999",
    paddingTop: 8,
    marginTop: 12,
    textAlign: "center",
    borderStyle: "dashed",
  },
  paymentSlipContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginTop: 8,
  },
  slipRow: {
    flexDirection: "row",
    gap: 8,
  },
  col: {
    flex: 1,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 6,
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    paddingBottom: 2,
  },
  monoBold: {
    fontFamily: "Courier",
    fontWeight: "bold",
  },
  amountBox: {},
  amount: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#f5f5f4",
    padding: 12,
  },
  bottomNote: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingTop: 6,
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat("fi-FI", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
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
                {invoice.sender.address}, {invoice.sender.postCodeAndCity}
              </Text>
              <Text style={styles.smallText}>{invoice.sender.buisnessId}</Text>

              {/* Recipient Section */}
              <View style={styles.section}>
                <Text>{invoice.recipient.name}</Text>
                <Text>{invoice.recipient.contactPerson}</Text>
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

          {/* Message Section */}

          <View style={styles.message}>
            <Text>{invoice.details.message}</Text>
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
            <View style={[styles.summaryRow, { marginBottom: 2 }]}>
              <Text>Arvonlisävero</Text>
              <Text>{formatCurrency(totalTax)}</Text>
            </View>
            <View
              style={[
                styles.summaryRow,
                { borderTopWidth: 1, borderTopColor: "#D1D5DB" },
              ]}
            >
              <Text>Yhteensä</Text>
              <Text>{formatCurrency(totalInclTax)}</Text>
            </View>
          </View>

          {/* Footer Section */}
          <View style={styles.footer}>
            <View style={styles.companyDetails}>
              <View>
                <Text>{invoice.sender.name}</Text>
                <Text>{invoice.sender.buisnessId}</Text>
                <Text>{invoice.sender.address}</Text>
                <Text>{invoice.sender.postCodeAndCity}</Text>
              </View>
              <View>
                <Text>{invoice.sender.email}</Text>
                <Text>{invoice.sender.phone}</Text>
                <Text>{invoice.sender.website}</Text>
              </View>
              <View>
                <Text>{invoice.sender.bank}</Text>
                <Text>{invoice.sender.iban}</Text>
                <Text>{invoice.sender.bic}</Text>
              </View>
            </View>
            <View style={styles.detachLine}></View>

            <View style={styles.paymentSlipContainer}>
              {/* Top Row - RECIPIENT | PAYER | PAYMENT DETAILS | AMOUNT */}
              <View style={styles.slipRow}>
                {/* Recipient */}
                <View style={styles.col}>
                  <Text style={styles.sectionTitle}>SAAJA</Text>
                  <Text style={{ marginBottom: 2 }}>{invoice.sender.name}</Text>
                  <Text style={{ marginVertical: 2 }}>
                    {invoice.sender.buisnessId}
                  </Text>
                  <Text style={{ marginVertical: 2 }}>
                    {invoice.sender.address}
                  </Text>
                  <Text style={{ marginVertical: 2 }}>
                    {invoice.sender.postCodeAndCity}
                  </Text>
                </View>

                {/* Payer */}
                <View style={styles.col}>
                  <Text style={styles.sectionTitle}>MAKSAJA</Text>

                  <Text style={{ marginBottom: 2 }}>
                    {invoice.recipient.name}
                  </Text>
                  <Text style={{ marginVertical: 2 }}>
                    {invoice.recipient.address}
                  </Text>
                  <Text style={{ marginVertical: 2 }}>
                    {invoice.recipient.postCodeAndCity}
                  </Text>
                </View>

                {/* Payment Details */}
                <View style={styles.col}>
                  <Text style={styles.sectionTitle}>MAKSUTIEDOT</Text>
                  <Text style={{ marginBottom: 2 }}>
                    Viitenro: {invoice.details.reference}
                  </Text>
                  <Text style={{ marginVertical: 2 }}>
                    Eräpäivä: {invoice.details.dueDate}
                  </Text>
                  <Text style={{ marginVertical: 2 }}>
                    Viitekorko: {invoice.details.interestRate} %
                  </Text>
                </View>

                <View style={[styles.col, styles.amountBox]}>
                  <Text style={styles.sectionTitle}>SUMMA</Text>
                  <Text style={styles.amount}>
                    {formatCurrency(totalInclTax)} €
                  </Text>
                </View>
              </View>

              {/* second Bottom row */}
              <View style={{ marginTop: 16, marginBottom: 8 }}>
                <Text>
                  IBAN:{" "}
                  <Text
                    style={{
                      fontFamily: "Courier",
                      fontSize: 10,
                      fontWeight: "medium",
                    }}
                  >
                    {invoice.sender.iban}
                  </Text>{" "}
                </Text>
                <Text>
                  BIC:{" "}
                  <Text
                    style={{
                      fontFamily: "Courier",
                      fontSize: 10,
                      fontWeight: "medium",
                    }}
                  >
                    {invoice.sender.bic}
                  </Text>{" "}
                </Text>
              </View>

              {/* Bottom row */}
              <View style={styles.bottomNote}>
                <Text style={{ fontSize: 8 }}>
                  Laskun numero: {invoice.details.invoiceNumber}
                </Text>
                <Text>
                  Luotu:{" "}
                  {new Date(invoice.details.date).toLocaleDateString("fi-FI")}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
