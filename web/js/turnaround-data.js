// Turnaround Project Data
const turnaroundData = {
    name: "Financial Health & Turnaround",
    projectType: "turnaround",
    priority: 1,
    startDate: "2025-11-12",
    endDate: "2026-05-11", // 180 days
    description: "Crisis response and operational stabilization to arrest cash bleed, restore compliance, and establish sustainable operating discipline.",

    phases: [
        {
            id: "T1",
            name: "Crisis Response",
            description: "Non-negotiable immediate actions (0-30 days)",
            startDate: "2025-11-12",
            endDate: "2025-12-12",
            targetImpact: "Stop penalties, stabilize cash",
            milestones: [
                {
                    id: "T1-M1",
                    name: "File Outstanding VAT Returns",
                    owner: "Finance Officer",
                    dueDate: "2025-11-15",
                    status: "planned",
                    priority: "critical",
                    description: "Submit outstanding VAT returns for missed periods",
                    checklist: [
                        "Compile VAT documentation for missing periods",
                        "Calculate VAT liability (R313,930 current)",
                        "Submit returns to SARS online portal",
                        "Obtain confirmation of submission",
                        "Document submission evidence for audit"
                    ],
                    expectedOutcome: "VAT compliance restored, penalty clock stopped",
                    kpi: "Zero outstanding VAT periods"
                },
                {
                    id: "T1-M2",
                    name: "SARS Payment Plan Agreement",
                    owner: "Finance Officer",
                    dueDate: "2025-11-20",
                    status: "planned",
                    priority: "critical",
                    description: "Negotiate and formalize payment arrangement for VAT R313,930 + PAYE R82,273",
                    checklist: [
                        "Calculate total SARS liability (R396,203)",
                        "Prepare 13-week cash forecast to support plan",
                        "Contact SARS collections for negotiation",
                        "Propose monthly payment schedule",
                        "Sign formal payment agreement",
                        "Set up auto-debit to prevent defaults"
                    ],
                    expectedOutcome: "Written SARS agreement, penalties frozen, payment schedule active",
                    kpi: "Payment plan signed and first payment made"
                },
                {
                    id: "T1-M3",
                    name: "Implement Maintenance Spending Cap",
                    owner: "CEO",
                    dueDate: "2025-11-18",
                    status: "planned",
                    priority: "high",
                    description: "Freeze non-essential capex and impose monthly maintenance limit",
                    checklist: [
                        "Cancel all non-urgent maintenance projects",
                        "Set monthly cap at R30,000 (vs R84,650 current run-rate)",
                        "Require CEO pre-approval for any >R20,000 spend",
                        "Move to 3-quote policy for all maintenance",
                        "Communicate freeze to all department heads",
                        "Create exception process for safety/compliance only"
                    ],
                    expectedOutcome: "Maintenance spend drops from R1,015,801 annual to <R360k target",
                    kpi: "Monthly maintenance <R30k"
                },
                {
                    id: "T1-M4",
                    name: "Build 13-Week Rolling Cash Forecast",
                    owner: "Finance Officer",
                    dueDate: "2025-11-22",
                    status: "planned",
                    priority: "high",
                    description: "Weekly cash visibility and liquidity management tool",
                    checklist: [
                        "Map all fixed costs (payroll, utilities, rent, insurance)",
                        "Project weekly collections from AR (R955,804 current)",
                        "Schedule creditor payments by priority tier",
                        "Flag weeks with negative cash balance",
                        "Identify investment draw-down triggers",
                        "Update actuals weekly and re-forecast"
                    ],
                    expectedOutcome: "Weekly cash meetings with CEO, proactive liquidity decisions",
                    kpi: "Forecast variance <10%, zero cash surprises"
                },
                {
                    id: "T1-M5",
                    name: "Launch AR Collections Blitz",
                    owner: "Administrative Officer",
                    dueDate: "2025-11-25",
                    status: "planned",
                    priority: "high",
                    description: "Accelerate receivables collection to improve cash position",
                    checklist: [
                        "Pull aged AR report (current R955,804 net)",
                        "Call top 20 debtors (>R10k each) daily",
                        "Resolve documentation gaps blocking payments",
                        "Offer 5% settlement discount for immediate payment",
                        "Escalate medical aid delays to CEO for provider relations",
                        "Target R200k collections in first 30 days"
                    ],
                    expectedOutcome: "DSO maintained ≤30 days, R200k+ cash injection",
                    kpi: "R200k collected in 30 days, DSO ≤30"
                },
                {
                    id: "T1-M6",
                    name: "Enforce Pre-Admission Deposits",
                    owner: "Medical Manager",
                    dueDate: "2025-12-01",
                    status: "planned",
                    priority: "medium",
                    description: "Require upfront deposit or medical aid pre-authorization before admission",
                    checklist: [
                        "Draft deposit policy (R10k or 50% estimated stay)",
                        "Get CEO and Clinical Manager sign-off",
                        "Train admissions staff on new protocol",
                        "Update admission forms and contracts",
                        "Communicate to referral network",
                        "Track deposit compliance rate"
                    ],
                    expectedOutcome: "Cash flow protected, bad debt risk reduced on new admissions",
                    kpi: "100% deposit/pre-auth compliance on new admissions"
                },
                {
                    id: "T1-M7",
                    name: "Freeze Headcount & Redeploy Admin",
                    owner: "CEO",
                    dueDate: "2025-12-05",
                    status: "planned",
                    priority: "medium",
                    description: "Hold headcount flat and shift admin capacity to revenue-adjacent tasks",
                    checklist: [
                        "Suspend all hiring (replacement requires CEO approval)",
                        "Identify admin staff with spare capacity",
                        "Train admin on AR follow-up and documentation",
                        "Reassign 50% admin time to collections support",
                        "Protect all clinical FTE (maintain throughput)",
                        "Monitor utilisation weekly"
                    ],
                    expectedOutcome: "Payroll % of income stabilizes, no clinical capacity lost",
                    kpi: "Zero new hires, clinical utilisation ≥85%"
                }
            ]
        },
        {
            id: "T2",
            name: "Model Reset",
            description: "Structural fixes (30-90 days)",
            startDate: "2025-12-13",
            endDate: "2026-02-11",
            targetImpact: "Align revenue to costs, establish controls",
            milestones: [
                {
                    id: "T2-M1",
                    name: "Align Tariffs to Payer Authorizations",
                    owner: "Finance Officer",
                    dueDate: "2025-12-20",
                    status: "planned",
                    priority: "high",
                    description: "Review and adjust pricing to match medical aid approvals",
                    checklist: [
                        "Audit last 90 days of claims vs authorisations",
                        "Identify length-of-stay vs funding mismatches",
                        "Benchmark tariffs against Discovery, Momentum, Bonitas",
                        "Adjust standard packages to align with typical auth periods",
                        "Stop unfunded extensions without written approval",
                        "Update rate card and train clinical on funding limits"
                    ],
                    expectedOutcome: "Revenue recognised matches cash collectible, denial rate drops",
                    kpi: "Claim denial rate <5%, unfunded days = 0"
                },
                {
                    id: "T2-M2",
                    name: "Establish Weekly AR Clinic",
                    owner: "Administrative Officer",
                    dueDate: "2025-12-27",
                    status: "planned",
                    priority: "high",
                    description: "Weekly top-20 AR review meeting with action owners",
                    checklist: [
                        "Schedule recurring Monday 9am AR meeting",
                        "Invite Finance Officer, Admin Officer, Clinical Admin",
                        "Review aged AR report: >60 days flagged red",
                        "Assign action owner for each top-20 debtor",
                        "Track documentation/authorisation blockers",
                        "Measure week-over-week collection improvement"
                    ],
                    expectedOutcome: "AR aging improves, collection lag addressed systematically",
                    kpi: "AR >60 days <15% of total, weekly closure rate >10 accounts"
                },
                {
                    id: "T2-M3",
                    name: "Implement 12-Month Maintenance Plan",
                    owner: "Clinical Manager",
                    dueDate: "2026-01-10",
                    status: "planned",
                    priority: "medium",
                    description: "Move from reactive to planned maintenance with quarterly budget caps",
                    checklist: [
                        "Audit facility: prioritise safety/compliance only",
                        "Build 12-month maintenance calendar (quarterly caps)",
                        "Get 3 quotes for any job >R20k",
                        "Set annual budget at R360k (vs R1,015k spent last year)",
                        "CEO sign-off required for any over-cap request",
                        "Track actuals vs plan monthly"
                    ],
                    expectedOutcome: "Maintenance cost predictable, emergency spend eliminated",
                    kpi: "Maintenance <3% of revenue annually"
                },
                {
                    id: "T2-M4",
                    name: "Renegotiate Supplier Terms",
                    owner: "Finance Officer",
                    dueDate: "2026-01-20",
                    status: "planned",
                    priority: "medium",
                    description: "Segment suppliers and extend payment terms to normalise creditor days",
                    checklist: [
                        "List all suppliers by spend (top 80% of value)",
                        "Categorise: critical (medical, food), flexible (general)",
                        "Negotiate 45-day terms with non-critical suppliers",
                        "Offer prompt-payment discount (e.g., 2% if paid <14 days)",
                        "Communicate SARS payment plan to restore credibility",
                        "Target creditor days ≤45 (excluding SARS)"
                    ],
                    expectedOutcome: "Supplier relationships stable, payment terms optimised for cash flow",
                    kpi: "Creditor days ≤45 (ex-SARS), zero critical supplier on hold"
                },
                {
                    id: "T2-M5",
                    name: "Ring-Fence Lotto Grants for Capex Only",
                    owner: "CEO",
                    dueDate: "2026-01-31",
                    status: "planned",
                    priority: "medium",
                    description: "Restrict grant funding to capital projects, not operating expenses",
                    checklist: [
                        "Audit prior Lotto spend (R1.98m spent vs R1.9m received)",
                        "Confirm solar capex (R262k) compliant with terms",
                        "Create separate accounting code for grant-funded capex",
                        "Draft policy: no Lotto funds for payroll/consumables",
                        "Communicate to board and finance team",
                        "Report to Lotto on fund usage and compliance"
                    ],
                    expectedOutcome: "Grant compliance maintained, no operating shortfall masked by grants",
                    kpi: "100% Lotto spend on approved capex, zero operating subsidy"
                },
                {
                    id: "T2-M6",
                    name: "Establish Board Dashboard",
                    owner: "Finance Officer",
                    dueDate: "2026-02-10",
                    status: "planned",
                    priority: "high",
                    description: "Monthly KPI report for board oversight and accountability",
                    checklist: [
                        "Define 8 core KPIs: Occupancy, Avg Tariff, DSO, Denial Rate, Creditor Days, Payroll %, Maintenance %, Operating Margin",
                        "Build Excel or PowerBI dashboard template",
                        "Set target thresholds (e.g., DSO ≤30, Margin ≥5%)",
                        "Traffic-light indicators (red/amber/green)",
                        "Present first report to Feb board meeting",
                        "Schedule monthly updates on board agenda"
                    ],
                    expectedOutcome: "Board has visibility, can hold exec accountable to targets",
                    kpi: "Dashboard delivered monthly, board review documented"
                }
            ]
        },
        {
            id: "T3",
            name: "Operating Discipline",
            description: "Embed controls and drive margin (90-180 days)",
            startDate: "2026-02-12",
            endDate: "2026-05-11",
            targetImpact: "Sustainable 5%+ margin, reserves stabilised",
            milestones: [
                {
                    id: "T3-M1",
                    name: "Achieve 5% Operating Margin",
                    owner: "CEO",
                    dueDate: "2026-03-31",
                    status: "planned",
                    priority: "high",
                    description: "Sustain positive operating margin for 2 consecutive months",
                    checklist: [
                        "Track monthly P&L against 5% margin target",
                        "Review variance weekly with Finance Officer",
                        "Adjust cost levers if margin dips <3%",
                        "Protect clinical throughput (occupancy, utilisation)",
                        "Celebrate and communicate milestone to team",
                        "Maintain margin ≥5% into next quarter"
                    ],
                    expectedOutcome: "Operating cash flow positive, investment draw-down stops",
                    kpi: "Operating margin ≥5% for 2 consecutive months"
                },
                {
                    id: "T3-M2",
                    name: "Stabilise Investment Reserves",
                    owner: "Finance Officer",
                    dueDate: "2026-04-15",
                    status: "planned",
                    priority: "high",
                    description: "Stop drawing down investments; begin rebuilding reserves from surplus",
                    checklist: [
                        "Confirm no investment sales for 90 days",
                        "Track reserve balance (target: R3.4m maintained)",
                        "Calculate 6-month operating reserve target (R6m)",
                        "Propose reserve rebuild plan (R50k/month surplus)",
                        "Board approval of reserve policy",
                        "Report reserve status monthly"
                    ],
                    expectedOutcome: "Financial sustainability demonstrated, lender/funder confidence restored",
                    kpi: "Zero investment draw-downs for 90 days, reserves stable"
                },
                {
                    id: "T3-M3",
                    name: "Normalise Creditor Relationships",
                    owner: "Finance Officer",
                    dueDate: "2026-04-30",
                    status: "planned",
                    priority: "medium",
                    description: "All suppliers current (≤45 days), zero accounts on hold",
                    checklist: [
                        "Audit aged payables report",
                        "Clear any >90 day balances via payment plan",
                        "Confirm SARS payment plan on track",
                        "Maintain creditor days ≤45 (ex-SARS) consistently",
                        "Request vendor statements for reconciliation",
                        "Zero supplier escalations or delivery holds"
                    ],
                    expectedOutcome: "Vendor trust restored, supply chain stable",
                    kpi: "Creditor days ≤45, zero critical suppliers on hold"
                },
                {
                    id: "T3-M4",
                    name: "Embed Payer-Aligned Care Pathways",
                    owner: "Medical Manager",
                    dueDate: "2026-05-01",
                    status: "planned",
                    priority: "medium",
                    description: "Standardise treatment programs to match typical medical aid authorisations",
                    checklist: [
                        "Map standard programs: 21-day, 28-day, 90-day",
                        "Align clinical protocols to funder expectations",
                        "Train clinicians on length-of-stay discipline",
                        "Require documented justification for extensions",
                        "Track discharge against plan vs actual",
                        "Monitor readmission rate as quality check"
                    ],
                    expectedOutcome: "Revenue predictable, denial rate low, clinical quality maintained",
                    kpi: "Avg length-of-stay within 10% of plan, denial rate <5%"
                },
                {
                    id: "T3-M5",
                    name: "Complete 180-Day Turnaround Review",
                    owner: "CEO",
                    dueDate: "2026-05-11",
                    status: "planned",
                    priority: "high",
                    description: "Board presentation on turnaround success and sustainability plan",
                    checklist: [
                        "Compile 6-month results: margin, cash, reserves, KPIs",
                        "Document compliance status (SARS, VAT, suppliers)",
                        "Present board dashboard trends and sustainability",
                        "Propose ongoing governance: monthly KPI reviews, quarterly audits",
                        "Celebrate team wins and lessons learned",
                        "Transition to BAU oversight with embedded controls"
                    ],
                    expectedOutcome: "Board confidence restored, turnaround complete, controls embedded",
                    kpi: "Board approval of sustainability plan, controls documented"
                }
            ]
        }
    ],

    risks: [
        {
            id: "TR1",
            name: "SARS Escalation",
            severity: "high",
            impact: "Business closure, asset seizure",
            likelihood: "medium",
            owner: "Finance Officer",
            mitigation: "File VAT immediately, sign payment plan, maintain compliance going forward",
            status: "active"
        },
        {
            id: "TR2",
            name: "Reserve Depletion",
            severity: "high",
            impact: "Unable to meet payroll or critical expenses",
            likelihood: "high",
            owner: "CEO",
            mitigation: "Freeze non-essential spend, accelerate AR collections, achieve operating margin ASAP",
            status: "active"
        },
        {
            id: "TR3",
            name: "Supplier Revolt",
            severity: "medium",
            impact: "Service disruption, inability to operate",
            likelihood: "medium",
            owner: "Finance Officer",
            mitigation: "Prioritise critical suppliers, communicate payment plan progress, negotiate terms",
            status: "active"
        },
        {
            id: "TR4",
            name: "Clinical Throughput Drop",
            severity: "high",
            impact: "Revenue collapse, margin deterioration",
            likelihood: "low",
            owner: "Clinical Manager",
            mitigation: "Protect clinical FTE, maintain referral relationships, monitor occupancy daily",
            status: "active"
        },
        {
            id: "TR5",
            name: "Team Morale Collapse",
            severity: "medium",
            impact: "Turnover, quality issues, culture damage",
            likelihood: "medium",
            owner: "CEO",
            mitigation: "Transparent communication, celebrate wins, protect payroll, involve team in solutions",
            status: "active"
        }
    ],

    team: [
        { role: "CEO & Project Manager", name: "Attie Nel", responsibility: "Overall turnaround leadership, board liaison, strategic decisions, project governance" },
        { role: "Finance Officer", name: "Nastasha Jacobs", responsibility: "Cash management, SARS compliance, AR/AP oversight, KPI reporting" },
        { role: "Clinical Manager", name: "Berno Paul", responsibility: "Protect clinical throughput, payer-aligned pathways, quality maintenance" },
        { role: "Medical Manager", name: "Lydia Gittens", responsibility: "Coordinate patient care plans, enforce admission deposits & authorisations, run clinical audits, escalate non-compliance" },
        { role: "Administrative Officer", name: "Bertha Vorster", responsibility: "AR collections, supplier liaison, admin redeployment" },
        { role: "Clinical Admin", name: "Lizette Botha", responsibility: "Pre-admission deposits, documentation compliance, authorisation tracking" }
    ],

    kpis: [
        { name: "Operating Margin", target: "≥5%", current: "-15.5%", trend: "critical" },
        { name: "DSO (Days Sales Outstanding)", target: "≤30 days", current: "28 days", trend: "ok" },
        { name: "Creditor Days", target: "≤45 days", current: "~60 days", trend: "warning" },
        { name: "Payroll % of Revenue", target: "≤65%", current: "~70%", trend: "warning" },
        { name: "Maintenance % of Revenue", target: "≤3%", current: "8.1%", trend: "critical" },
        { name: "Cash Reserves", target: "R3.4m+", current: "R538k cash + R3.4m investments", trend: "warning" },
        { name: "Claim Denial Rate", target: "<5%", current: "Unknown (high provision)", trend: "critical" },
        { name: "SARS Compliance", target: "100%", current: "VAT overdue", trend: "critical" }
    ]
};

if (typeof window !== 'undefined') {
    window.turnaroundData = turnaroundData;
}

// Export for Node.js environment (server-side)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = turnaroundData;
}
