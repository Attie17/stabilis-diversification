// Project Data
const projectData = {
    name: "Stabilis Diversification",
    startDate: "2025-11-17",
    endDate: "2027-03-30",
    targetRevenue: 6169500,
    currentRevenue: 0,

    phases: [
        {
            id: "P1",
            name: "Phase 1 – Mobilisation",
            startDate: "2025-11-17",
            endDate: "2025-12-15",
            revenue: 0,
            milestones: [
                {
                    id: "P1-M1",
                    title: "Kick-off Meeting",
                    owner: "CEO",
                    due: "2025-11-17",
                    status: "planned",
                    description: "Convene all staff; present objectives, timelines, expectations"
                },
                {
                    id: "P1-M2",
                    title: "Appoint Leads",
                    owner: "CEO",
                    due: "2025-11-20",
                    status: "planned",
                    description: "Appoint Adult Clinical Lead, Youth Lead, Finance Officer, Admin Coordinator, Comms Officer"
                },
                {
                    id: "P1-M3",
                    title: "Operational Mapping",
                    owner: "Clinical Manager",
                    due: "2025-11-25",
                    status: "planned",
                    description: "Map rooms, rosters, group slots, referral flow, bed capacity"
                },
                {
                    id: "P1-M4",
                    title: "Pricing & Billing Policy",
                    owner: "Finance & Admin",
                    due: "2025-11-28",
                    status: "planned",
                    description: "Confirm tariffs for all services; embed deposit and pre-auth rules"
                },
                {
                    id: "P1-M5",
                    title: "Compliance Check",
                    owner: "Medical Manager",
                    due: "2025-12-08",
                    status: "planned",
                    description: "Verify registrations/licences; confirm medical-aid panel docs"
                },
                {
                    id: "P1-M6",
                    title: "Finalize Implementation Calendar",
                    owner: "Project Manager",
                    due: "2025-12-15",
                    status: "planned",
                    description: "Publish 15-month calendar covering Phases 2–5"
                }
            ]
        },
        {
            id: "P2",
            name: "Phase 2 – Pilot Launch",
            startDate: "2025-12-16",
            endDate: "2026-01-31",
            revenue: 510000,
            milestones: [
                {
                    id: "P2-M1",
                    title: "Adult Outpatient Pilot",
                    owner: "Adult Clinical Lead",
                    due: "2026-01-01",
                    status: "planned"
                },
                {
                    id: "P2-M2",
                    title: "28-Day Admissions Optimisation",
                    owner: "Admissions Officer",
                    due: "2026-01-01",
                    status: "planned"
                },
                {
                    id: "P2-M3",
                    title: "Adolescent Outpatient Prep",
                    owner: "Youth Clinical Lead",
                    due: "2026-01-10",
                    status: "planned"
                },
                {
                    id: "P2-M4",
                    title: "Aftercare Structure",
                    owner: "Clinical Manager",
                    due: "2026-01-15",
                    status: "planned"
                },
                {
                    id: "P2-M5",
                    title: "Data Tracking Setup",
                    owner: "Finance/IT",
                    due: "2026-01-25",
                    status: "planned"
                },
                {
                    id: "P2-M6",
                    title: "Pilot Review",
                    owner: "Project Manager",
                    due: "2026-01-31",
                    status: "planned"
                }
            ]
        },
        {
            id: "P3",
            name: "Phase 3 – Full Rollout",
            startDate: "2026-02-01",
            endDate: "2026-06-15",
            revenue: 1877000,
            milestones: [
                {
                    id: "P3-M1",
                    title: "Adolescent Outpatient Launch",
                    owner: "Youth Lead",
                    due: "2026-02-01",
                    status: "planned"
                },
                {
                    id: "P3-M2",
                    title: "Aftercare Launch",
                    owner: "Aftercare Coordinator",
                    due: "2026-02-15",
                    status: "planned"
                },
                {
                    id: "P3-M3",
                    title: "School Outreach Pilot",
                    owner: "Outreach Facilitator",
                    due: "2026-03-01",
                    status: "planned"
                },
                {
                    id: "P3-M4",
                    title: "Marketing Expansion",
                    owner: "Comms Officer",
                    due: "2026-03-15",
                    status: "planned"
                },
                {
                    id: "P3-M5",
                    title: "Financial Review #1",
                    owner: "Finance Officer",
                    due: "2026-04-30",
                    status: "planned"
                },
                {
                    id: "P3-M6",
                    title: "Governance Check",
                    owner: "CEO/Board",
                    due: "2026-06-15",
                    status: "planned"
                }
            ]
        },
        {
            id: "P4",
            name: "Phase 4 – Optimisation & Scaling",
            startDate: "2026-07-01",
            endDate: "2026-12-30",
            revenue: 2501000,
            milestones: [
                {
                    id: "P4-M1",
                    title: "Pricing Adjustment",
                    owner: "Finance",
                    due: "2026-07-01",
                    status: "planned"
                },
                {
                    id: "P4-M2",
                    title: "Medical-Aid Panel Expansion",
                    owner: "Admin",
                    due: "2026-07-15",
                    status: "planned"
                },
                {
                    id: "P4-M3",
                    title: "Corporate Partnerships",
                    owner: "CEO/Comms",
                    due: "2026-09-01",
                    status: "planned"
                },
                {
                    id: "P4-M4",
                    title: "Quality Audit",
                    owner: "Medical Manager",
                    due: "2026-10-01",
                    status: "planned"
                },
                {
                    id: "P4-M5",
                    title: "Financial Review #2",
                    owner: "Finance",
                    due: "2026-11-15",
                    status: "planned"
                },
                {
                    id: "P4-M6",
                    title: "2027 Scaling Plan",
                    owner: "Board Committee",
                    due: "2026-12-30",
                    status: "planned"
                }
            ]
        },
        {
            id: "P5",
            name: "Phase 5 – Consolidation & Impact",
            startDate: "2027-01-01",
            endDate: "2027-03-30",
            revenue: 1281500,
            milestones: [
                {
                    id: "P5-M1",
                    title: "Comprehensive Impact Review",
                    owner: "Monitoring Team",
                    due: "2027-01-31",
                    status: "planned"
                },
                {
                    id: "P5-M2",
                    title: "Strategic Planning Workshop",
                    owner: "Board & Exec",
                    due: "2027-02-15",
                    status: "planned"
                },
                {
                    id: "P5-M3",
                    title: "Final Report & Sustainability Plan",
                    owner: "CEO/Finance",
                    due: "2027-03-30",
                    status: "planned"
                }
            ]
        }
    ],

    risks: [
        {
            id: "R-001",
            title: "Revenue Targets Not Achieved",
            severity: "high",
            impact: "High",
            likelihood: "Medium",
            description: "Actual revenue falls significantly short of R6.169m target",
            owner: "Finance Officer",
            status: "open"
        },
        {
            id: "R-002",
            title: "Staff Capacity Constraints",
            severity: "high",
            impact: "High",
            likelihood: "Medium",
            description: "Existing staff unable to deliver new programmes alongside current workload",
            owner: "CEO / Clinical Manager",
            status: "open"
        },
        {
            id: "R-003",
            title: "Medical-Aid Claim Delays/Rejections",
            severity: "high",
            impact: "High",
            likelihood: "Medium",
            description: "Cash flow strain from slow payment or rejected claims",
            owner: "Admin Coordinator",
            status: "open"
        },
        {
            id: "R-004",
            title: "Quality Compromised by Growth",
            severity: "high",
            impact: "High",
            likelihood: "Low",
            description: "Rapid scaling leads to quality lapses or compliance breaches",
            owner: "Clinical Manager",
            status: "open"
        },
        {
            id: "R-005",
            title: "Market Resistance to New Services",
            severity: "medium",
            impact: "Medium",
            likelihood: "Medium",
            description: "Target clients unwilling to pay for OP/aftercare/school programmes",
            owner: "Comms Officer",
            status: "open"
        }
    ],

    team: [
        {
            role: "CEO & Project Manager",
            name: "Attie Nel",
            responsibilities: "Strategic oversight, project governance, cross-project coordination, board liaison"
        },
        {
            role: "Adult Clinical Lead",
            name: "Berno Paul",
            responsibilities: "Adult OP design, delivery, outcomes"
        },
        {
            role: "Medical Manager",
            name: "Lydia Gittens",
            responsibilities: "Oversee patient care plans, coordinate substance testing, ensure medication adherence and admissions compliance"
        },
        {
            role: "Youth Lead",
            name: "Sne Khonyane",
            responsibilities: "Adolescent OP, school outreach, safeguarding"
        },
        {
            role: "Finance Officer",
            name: "Nastasha Jacobs",
            responsibilities: "Pricing, billing, financial tracking"
        },
        {
            role: "Admin Coordinator",
            name: "Bertha Vorster",
            responsibilities: "Admissions, compliance, medical-aid liaison"
        },
        {
            role: "Comms Officer",
            name: "Karin Weideman",
            responsibilities: "Marketing, referral development, brand"
        },
        {
            role: "Aftercare Coordinator",
            name: "TBD",
            responsibilities: "Alumni engagement, relapse prevention"
        }
    ]
};

if (typeof window !== 'undefined') {
    window.projectData = projectData;
}

// Export for Node.js environment (server-side)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = projectData;
}
