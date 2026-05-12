import { useMemo } from "react";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import type { ReportSection } from "@/store/slices/reportSlice";
import { Element as SlateElement, Text as SlateText } from "slate";
import { type CustomElement } from "@/components/textEditor";
import type { Descendant } from "slate";

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
  const slateToPdfNodes = (nodes: Descendant[], keyPrefix = "node"): React.ReactNode[] => {
    return nodes.map((node, index) => {
      const key = `${keyPrefix}-${index}`;

      if ("text" in node) {
        let style: any = {};
        if (node.bold) style.fontWeight = "bold";
        if (node.italic) style.fontStyle = "italic";
        if (node.underline) style.textDecoration = "underline";

        return (
          <Text key={key} style={style}>
            {node.text}
          </Text>
        );
      }
      const element = node as CustomElement;

      switch (element.type) {
        case "paragraph":
          return (
            <View key={key} style={{ marginBottom: 4 }}>
              {slateToPdfNodes(element.children, `${key}-child`)}
            </View>
          );

        case "heading":
          return (
            <Text key={key} style={{ fontSize: 18, fontWeight: "bold", marginBottom: 4 }}>
              {element.children.map((child, i) => (
                <Text key={`${key}-child-${i}`}>{"text" in child ? child.text : ""}</Text>
              ))}
            </Text>
          );

        case "list-item":
          return (
            <View key={key} style={{ flexDirection: "row", marginBottom: 2 }}>
              <Text>{"• "}</Text>
              <View style={{ flex: 1 }}>{slateToPdfNodes(element.children, `${key}-child`)}</View>
            </View>
          );

        default:
          return <View key={key} />;
      }
    });
  };
  const getSection = (section: ReportSection) => {
    switch (section.type) {
      case "text":
        return (
          <View key={section.id} style={{ ...styles.section, ...section.styles }}>
            {section.content && slateToPdfNodes(section.content)}
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
