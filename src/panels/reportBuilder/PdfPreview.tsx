import { useMemo } from "react";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import type { ReportSection } from "@/store/slices/reportSlice";
import { Element as SlateElement, Text as SlateText } from "slate";

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

const PdfPreview = ({ reportSections }: { reportSections: ReportSection[] }) => {
  const documentKey = reportSections.map((s) => s.id).join(",");
  const getSection = (section: ReportSection) => {
    switch (section.type) {
      case "text":
        return (
          <View key={section.id} style={{ ...styles.section, ...section.styles }} wrap={true}>
            {section.content?.map((node, i) => {
              if (SlateElement.isElement(node)) {
                return (
                  <Text key={i} wrap={true}>
                    {node.children
                      .map((child, j) => {
                        if (SlateText.isText(child)) {
                          return child.text;
                        }
                        return "";
                      })
                      .join("")}
                  </Text>
                );
              }

              return null;
            })}
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
          {reportSections.map((section) => getSection(section))}
        </Page>
      </Document>
    ),
    [documentKey],
  );

  return document;
};

export default PdfPreview;
