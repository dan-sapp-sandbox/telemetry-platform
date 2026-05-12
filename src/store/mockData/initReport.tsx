import type { ReportSection } from "../slices/reportSlice";

export const initReportSections: ReportSection[] = [
  {
    id: "title",
    type: "text",
    styles: {
      fontSize: 22,
      fontWeight: "bold",
    },
    content: [{ type: "paragraph", children: [{ text: "Weekly Report on Persian Gulf" }] }],
  },
  {
    id: "date",
    styles: {
      fontSize: 14,
    },
    type: "text",
    content: [{ type: "paragraph", children: [{ text: "April 4, 2026" }] }],
  },
  {
    id: "2",
    type: "text",
    content: [
      {
        type: "paragraph",
        children: [
          {
            text: `Following U.S. and Israeli strikes, Iran has effectively restricted or halted shipping through the Strait of Hormuz, using threats, mines, and attacks on vessels—causing tanker traffic to collapse and disrupting roughly 20% of global oil supply. This has triggered a sharp spike in oil prices, stranded ships, and rising global economic concerns, while international disagreements over how to respond have complicated efforts to reopen the critical waterway.`,
          },
        ],
      },
    ],
  },
  {
    id: "4",
    type: "image",
    imageUrl: "/persian-gulf.png",
  },
  {
    id: "5",
    type: "text",
    content: [
      {
        type: "paragraph",
        children: [
          {
            text: `The U.S. airstrikes hit over 90 Iranian military targets on Kharg Island—such as missile sites and naval facilities—while deliberately avoiding the critical oil export infrastructure that handles most of Iran’s crude shipments. Since then, the island has remained operational but highly tense, with ongoing threats of furtherstrikes or even a possible U.S. attempt to seize or blockade it, given its importance to both Iran’s economy and global oil markets.`,
          },
        ],
      },
    ],
  },
  {
    id: "6",
    type: "image",
    imageUrl: "/light-chart.png",
  },
  {
    id: "7",
    type: "text",
    content: [
      {
        type: "paragraph",
        children: [
          {
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse quis massa vitae justo laoreet suscipit. Aliquam erat volutpat. Curabitur ac lorem eget velit fermentum consectetur. Fusce id risus at nunc vehicula volutpat. Quisque at ligula a nibh tincidunt luctus. Sed dignissim, purus vel gravida pharetra, nisl nisl malesuada urna, in malesuada nisi purus sit amet quam.",
          },
        ],
      },
    ],
  },
];
