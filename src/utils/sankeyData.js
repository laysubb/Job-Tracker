/**
 * Computes nodes and links for Sankey diagram from the list of job applications
 */
export function buildSankeyData(jobs) {
  if (!jobs || jobs.length === 0) {
    return { nodes: [], links: [], sankeyMaticText: "" };
  }

  // Count terminal states and progression
  let totalApplications = jobs.length;
  let noAnswer = 0;
  let appliedToAssessment = 0;
  let appliedToFirstInterview = 0;
  let appliedDirectReject = 0;
  
  let assessmentToReject = 0;
  let assessmentToFirstInterview = 0;
  let assessmentPending = 0;

  let firstInterviewToReject = 0;
  let firstInterviewToSecond = 0;
  let firstInterviewPending = 0;

  let secondInterviewToReject = 0;
  let secondInterviewToFinal = 0;
  let secondInterviewPending = 0;

  let finalToReject = 0;
  let finalToOffer = 0;
  let finalPending = 0;

  let offerToAccepted = 0;
  let offerToDeclined = 0;
  let offerPending = 0;

  jobs.forEach((job) => {
    const s = job.status;
    const history = (job.history || []).map(h => h.stage);

    const hadAssessment = history.includes("assessment") || s === "assessment";
    const hadFirst = history.includes("first_interview") || s === "first_interview";
    const hadSecond = history.includes("second_interview") || s === "second_interview";
    const hadFinal = history.includes("final_round") || s === "final_round";
    const hadOffer = history.includes("offer") || history.includes("accepted") || history.includes("declined") || s === "offer" || s === "accepted" || s === "declined";

    if (s === "applied") {
      noAnswer++;
    } else if (s === "ghosted") {
      noAnswer++;
    } else if (s === "rejected") {
      if (hadFinal) {
        finalToReject++;
      } else if (hadSecond) {
        secondInterviewToReject++;
      } else if (hadFirst) {
        firstInterviewToReject++;
      } else if (hadAssessment) {
        assessmentToReject++;
      } else {
        appliedDirectReject++;
      }
    } else if (s === "assessment") {
      appliedToAssessment++;
      assessmentPending++;
    } else if (s === "first_interview") {
      if (hadAssessment) {
        appliedToAssessment++;
        assessmentToFirstInterview++;
      } else {
        appliedToFirstInterview++;
      }
      firstInterviewPending++;
    } else if (s === "second_interview") {
      if (hadAssessment) {
        appliedToAssessment++;
        assessmentToFirstInterview++;
      } else {
        appliedToFirstInterview++;
      }
      firstInterviewToSecond++;
      secondInterviewPending++;
    } else if (s === "final_round") {
      if (hadAssessment) {
        appliedToAssessment++;
        assessmentToFirstInterview++;
      } else {
        appliedToFirstInterview++;
      }
      firstInterviewToSecond++;
      secondInterviewToFinal++;
      finalPending++;
    } else if (s === "offer") {
      if (hadAssessment) {
        appliedToAssessment++;
        assessmentToFirstInterview++;
      } else {
        appliedToFirstInterview++;
      }
      firstInterviewToSecond++;
      secondInterviewToFinal++;
      finalToOffer++;
      offerPending++;
    } else if (s === "accepted") {
      if (hadAssessment) {
        appliedToAssessment++;
        assessmentToFirstInterview++;
      } else {
        appliedToFirstInterview++;
      }
      firstInterviewToSecond++;
      secondInterviewToFinal++;
      finalToOffer++;
      offerToAccepted++;
    } else if (s === "declined") {
      if (hadAssessment) {
        appliedToAssessment++;
        assessmentToFirstInterview++;
      } else {
        appliedToFirstInterview++;
      }
      firstInterviewToSecond++;
      secondInterviewToFinal++;
      finalToOffer++;
      offerToDeclined++;
    }
  });

  // Calculate flow links
  const flows = [];

  const addFlow = (source, target, value) => {
    if (value > 0) {
      flows.push({ source, target, value });
    }
  };

  // Level 1: Applications
  addFlow("Applications", "No Answer", noAnswer);
  addFlow("Applications", "Rejected", appliedDirectReject);
  addFlow("Applications", "Online Assessment", appliedToAssessment);
  addFlow("Applications", "First Interview", appliedToFirstInterview);

  // Level 2: Assessment
  addFlow("Online Assessment", "In Assessment", assessmentPending);
  addFlow("Online Assessment", "Rejected", assessmentToReject);
  addFlow("Online Assessment", "First Interview", assessmentToFirstInterview);

  // Level 3: First Interview
  addFlow("First Interview", "In 1st Interview", firstInterviewPending);
  addFlow("First Interview", "Rejected", firstInterviewToReject);
  addFlow("First Interview", "Second Interview", firstInterviewToSecond);

  // Level 4: Second Interview
  addFlow("Second Interview", "In 2nd Interview", secondInterviewPending);
  addFlow("Second Interview", "Rejected", secondInterviewToReject);
  addFlow("Second Interview", "Final Round", secondInterviewToFinal);

  // Level 5: Final Round
  addFlow("Final Round", "In Final Round", finalPending);
  addFlow("Final Round", "Rejected", finalToReject);
  addFlow("Final Round", "Offers", finalToOffer);

  // Level 6: Offers
  addFlow("Offers", "Decision Pending", offerPending);
  addFlow("Offers", "Accepted", offerToAccepted);
  addFlow("Offers", "Declined", offerToDeclined);

  // Build SankeyMATIC text syntax
  const sankeyMaticLines = [
    `// CareerPulse Job Hunting Pipeline Data`,
    `// Generated on ${new Date().toLocaleDateString()}`,
    `// Paste directly into SankeyMATIC.com (Inputs tab)`,
    ``
  ];

  flows.forEach(f => {
    sankeyMaticLines.push(`${f.source} [${f.value}] ${f.target}`);
  });

  // Custom node colors for SankeyMATIC
  sankeyMaticLines.push(``);
  sankeyMaticLines.push(`// Color Settings (Optional)`);
  sankeyMaticLines.push(`:Applications #6366f1`);
  sankeyMaticLines.push(`:No Answer #f43f5e`);
  sankeyMaticLines.push(`:Online Assessment #38bdf8`);
  sankeyMaticLines.push(`:First Interview #3b82f6`);
  sankeyMaticLines.push(`:Second Interview #eab308`);
  sankeyMaticLines.push(`:Final Round #a855f7`);
  sankeyMaticLines.push(`:Rejected #ef4444`);
  sankeyMaticLines.push(`:Offers #10b981`);
  sankeyMaticLines.push(`:Accepted #22c55e`);
  sankeyMaticLines.push(`:Declined #64748b`);

  // Build D3 node/link structure
  const nodeMap = new Map();
  let nodeIndex = 0;

  function getNodeIndex(name) {
    if (!nodeMap.has(name)) {
      nodeMap.set(name, nodeIndex++);
    }
    return nodeMap.get(name);
  }

  const links = flows.map(f => ({
    source: getNodeIndex(f.source),
    target: getNodeIndex(f.target),
    value: f.value,
    sourceName: f.source,
    targetName: f.target
  }));

  const nodes = Array.from(nodeMap.entries()).map(([name, id]) => ({
    name,
    id
  }));

  return {
    nodes,
    links,
    flows,
    sankeyMaticText: sankeyMaticLines.join("\n"),
    summary: {
      total: totalApplications,
      active: totalApplications - noAnswer - appliedDirectReject - assessmentToReject - firstInterviewToReject - secondInterviewToReject - finalToReject - offerToDeclined,
      interviews: (appliedToFirstInterview + assessmentToFirstInterview + firstInterviewPending + firstInterviewToSecond),
      offers: finalToOffer + offerPending + offerToAccepted + offerToDeclined
    }
  };
}

export const NODE_COLOR_MAP = {
  "Applications": "#6366f1",
  "No Answer": "#f43f5e",
  "Online Assessment": "#38bdf8",
  "In Assessment": "#0284c7",
  "First Interview": "#3b82f6",
  "In 1st Interview": "#2563eb",
  "Second Interview": "#eab308",
  "In 2nd Interview": "#ca8a04",
  "Final Round": "#a855f7",
  "In Final Round": "#9333ea",
  "Rejected": "#ef4444",
  "Offers": "#10b981",
  "Decision Pending": "#059669",
  "Accepted": "#22c55e",
  "Declined": "#64748b"
};
