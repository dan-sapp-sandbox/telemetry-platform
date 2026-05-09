import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import type { ReportSection } from "./useReportBuilderState";
import { useMemo } from "react";

const styles = StyleSheet.create({
  page: {
    padding: 40,
  },
  section: {
    marginBottom: 10,
    fontSize: 11,
  },
  image: {
    margin: "0 auto",
    width: "70%",
  },
});

const PdfPreview = ({ reportState }: { reportState: ReportSection[] }) => {
  const documentKey = reportState.map((s) => s.id).join(",");
  const getSection = (section: ReportSection) => {
    switch (section.type) {
      case "text":
        return (
          <View key={section.id} style={{ ...styles.section, ...section.styles }}>
            {section.pdfContent}
          </View>
        );
      case "image":
        return (
          <View key={section.id} style={styles.section}>
            <Image src={section.imageUrl} style={styles.image} />
          </View>
        );
      default:
        return (
          <View key={section.id} style={styles.section}>
            <Text>Oops</Text>
          </View>
        );
    }
  };
  const document = useMemo(
    () => (
      <Document key={documentKey}>
        <Page size="A4" style={styles.page}>
          {reportState.map((section) => getSection(section))}
        </Page>
      </Document>
    ),
    [documentKey],
  );

  return document;
};

export default PdfPreview;
