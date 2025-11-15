// Wellness Centre Project Data
// Timeline: 4 months (Nov 2025 - Mar 2026)
// Goal: Launch multidisciplinary wellness center

const wellnessProject = {
    title: "Stabilis Wellness Centre",
    subtitle: "Multi-Phase Strategic Launch",
    timeline: "19 months (Nov 2025 – Jun 2027)",
    budget: "R2,800,000",
    description: "A functioning multidisciplinary Wellness Centre offering adult and adolescent outpatient programmes, behavioural addiction tracks, individual therapy, and private-group services, positioned as a new private income stream.",
    
    phases: [
        {
            id: "W1",
            name: "Phase 1 – Immediate Launch",
            timeline: "Nov 2025 – Mar 2026",
            outcome: "Functioning multidisciplinary Wellness Centre offering adult/adolescent OP, therapy, school/corporate packages as new private income stream",
            milestones: [
                {
                    id: "W1-M1",
                    title: "Operational Setup",
                    owner: "Sne Khonyane",
                    due: "2025-11-20",
                    status: "planned",
                    description: "Set up physical and administrative infrastructure for therapy sessions, bookings, and payments",
                    details: {
                        whatYouNeed: [
                            "🚪 Allocated therapy rooms + signage",
                            "📅 Booking system (manual or digital)",
                            "💳 Pricing schedule (private, medical aid, sliding scale)",
                            "🧾 Payment + deposit policies",
                            "📋 Room timetable templates"
                        ],
                        tips: [
                            "Keep the booking process simple — avoid multiple channels.",
                            "Use existing Stabilis infrastructure where possible to save cost.",
                            "Ensure rooms feel private, safe, and professional.",
                            "Set clear boundaries for practitioner room usage."
                        ]
                    }
                },
                {
                    id: "W1-M2",
                    title: "Practitioner Onboarding",
                    owner: "Suzanne Gelderblom",
                    due: "2025-11-30",
                    status: "planned",
                    description: "Bring internal and external therapists onboard with clear contracts, expectations, and systems",
                    details: {
                        whatYouNeed: [
                            "📝 Group practice agreements",
                            "📄 HPCSA + SACSSP + AHPCSA proof of registration",
                            "💼 Professional indemnity documents",
                            "📊 Agreed fee-splitting model",
                            "📚 Documentation templates (notes, consent, telehealth)"
                        ],
                        tips: [
                            "Vet external practitioners thoroughly — quality affects reputation.",
                            "Use standard templates — avoid custom agreements.",
                            "Ensure practitioners know billing and documentation deadlines.",
                            "Start with a small group; scale once stable."
                        ]
                    }
                },
                {
                    id: "W1-M3",
                    title: "Adult Wellness OP Launch",
                    owner: "Suzanne Gelderblom",
                    due: "2025-12-10",
                    status: "planned",
                    description: "Launch standalone private Adult Outpatient programme focused on emotional regulation, stress, trauma-lite, relapse prevention, and wellbeing",
                    details: {
                        whatYouNeed: [
                            "📅 OP timetable (groups + 1:1 sessions)",
                            "📚 Curriculum with 6–8 core modules",
                            "💳 Fee structure (full, sliding scale, medical aid)",
                            "🧾 Consent + wellbeing assessment forms",
                            "📈 Outcome tracking sheet"
                        ],
                        tips: [
                            "Keep groups small at first (8–10 clients).",
                            "Differentiate from the addiction OP — emphasise wellbeing and skills.",
                            "Use practical tools, not heavy theory.",
                            "Integrate individual check-ins for risk cases."
                        ]
                    }
                },
                {
                    id: "W1-M4",
                    title: "Adolescent Wellness OP Launch",
                    owner: "Suzanne Gelderblom",
                    due: "2025-12-20",
                    status: "planned",
                    description: "Start private youth outpatient programme offering skills, emotional support, family guidance, and school-linked referrals",
                    details: {
                        whatYouNeed: [
                            "🏫 School referral templates",
                            "📚 Youth-friendly curriculum (6–10 weeks)",
                            "👨‍👩‍👧 Parent psychoeducation scripts",
                            "📝 Safeguarding + consent process",
                            "🚦 Risk identification protocol"
                        ],
                        tips: [
                            "Make sessions interactive — activities, not lectures.",
                            "Build trust with parents early; they are key to outcomes.",
                            "Offer family sessions as optional add-ons.",
                            "Partner with a few trusted schools first."
                        ]
                    }
                },
                {
                    id: "W1-M5",
                    title: "School & Corporate Package Development",
                    owner: "Wellness Champion + Wellness Coordinator",
                    due: "2026-01-15",
                    status: "planned",
                    description: "Build sellable skill-based workshops for schools and employers to diversify revenue and increase referrals",
                    details: {
                        whatYouNeed: [
                            "📘 3–6 structured workshop modules",
                            "💼 Corporate wellbeing pitch deck",
                            "📑 Pricing + contract templates",
                            "✉️ Outreach communication pack"
                        ],
                        tips: [
                            "Keep packages simple and fixed — avoid custom designs for each school.",
                            "Lead with value: improved behaviour, focus, resilience.",
                            "Use pilot schools to refine content.",
                            "Always link workshops to OP referral pathways."
                        ]
                    }
                },
                {
                    id: "W1-M6",
                    title: "Online/Hybrid Therapy Setup",
                    owner: "Sne Khonyane",
                    due: "2026-01-30",
                    status: "planned",
                    description: "Enable clients to join therapy online for convenience, geographical reach, and evening scheduling",
                    details: {
                        whatYouNeed: [
                            "💻 Secure telehealth platform",
                            "📋 Telehealth consent form",
                            "🕒 Evening/weekend schedule",
                            "🧾 Online billing process"
                        ],
                        tips: [
                            "Ensure confidentiality in online sessions.",
                            "Offer blended packages (in-person + online).",
                            "Youth sessions must have parental safeguards.",
                            "Make joining links simple and consistent."
                        ]
                    }
                },
                {
                    id: "W1-M7",
                    title: "Launch Marketing & Referral Campaign",
                    owner: "Sne Khonyane",
                    due: "2026-02-15",
                    status: "planned",
                    description: "Announce the Wellness Centre publicly and privately to referrers, schools, families, doctors, and partners",
                    details: {
                        whatYouNeed: [
                            "📢 Launch announcement materials",
                            "📧 Email templates for professionals",
                            "🏫 School visit schedule",
                            "📇 Referral cards + brochures"
                        ],
                        tips: [
                            "Keep messaging clear: wellbeing, skills, therapy, family support.",
                            "Start with trusted partners before mass outreach.",
                            "Good visuals increase parent trust; keep branding clean.",
                            "Follow-up after every visit — that's where referrals come from."
                        ]
                    }
                },
                {
                    id: "W1-M8",
                    title: "First 90-Day Review",
                    owner: "Wellness Champion + Wellness Coordinator",
                    due: "2026-03-30",
                    status: "planned",
                    description: "Evaluate caseloads, revenue, practitioner performance, and service uptake to guide expansion decisions",
                    details: {
                        whatYouNeed: [
                            "📊 Caseload report",
                            "💰 Income vs target analysis",
                            "📈 Programme attendance rates",
                            "📝 Practitioner feedback",
                            "📚 Suggested adjustments"
                        ],
                        tips: [
                            "Look at which services filled up fastest.",
                            "Assess practitioner reliability early.",
                            "Adjust timetables — evenings usually outperform daytime.",
                            "Identify referral sources that actually produce clients."
                        ]
                    }
                }
            ]
        },
        {
            id: "W1B",
            name: "Phase 1B – Behavioural Addictions Launch",
            timeline: "Jan – Mar 2026",
            outcome: "Behavioural addictions (gambling, pornography, gaming, social media, vaping) integrated into the Wellness Centre as specialist outpatient tracks with clear referral pathways and trained practitioners",
            milestones: [
                {
                    id: "W1B-M1",
                    title: "Programme Framework & Curriculum Build",
                    owner: "Suzanne Gelderblom",
                    due: "2026-01-15",
                    status: "planned",
                    description: "Create the structure, tools, and therapeutic flow for each behavioural addiction track so clinicians can start running groups and sessions confidently",
                    details: {
                        whatYouNeed: [
                            "📚 8-10 week curriculum for each behavioural addiction",
                            "📋 Screening tools (Gambling, Pornography, Gaming, Social Media, Vape)",
                            "🧾 Consent + behaviour assessment forms",
                            "🧠 Crisis/risk escalation protocol",
                            "📈 Outcome-tracking sheets for each track"
                        ],
                        tips: [
                            "Use the same skeleton across programmes to simplify training.",
                            "Focus on skills: regulation, impulse control, triggers, shame cycles.",
                            "Keep sessions practical — no long lectures.",
                            "Build family involvement options for youth cases."
                        ]
                    }
                },
                {
                    id: "W1B-M2",
                    title: "Practitioner Training & Assignment",
                    owner: "Suzanne Gelderblom",
                    due: "2026-01-25",
                    status: "planned",
                    description: "Train internal and contracted practitioners to deliver behavioural addiction programmes safely, ethically, and confidently",
                    details: {
                        whatYouNeed: [
                            "🎓 1-day training workshop",
                            "📄 Behaviour-specific clinical guidelines",
                            "📝 Practitioner assignment schedule",
                            "🧑‍⚕️ Supervision roster"
                        ],
                        tips: [
                            "Pair new practitioners with experienced clinicians initially.",
                            "Keep supervision weekly during the launch phase.",
                            "Practitioners must follow standard documentation and risk protocols.",
                            "Ensure youth-work clinicians have safeguarding competence."
                        ]
                    }
                },
                {
                    id: "W1B-M3",
                    title: "Launch Behavioural Addictions OP Tracks",
                    owner: "Sne Khonyane",
                    due: "2026-02-10",
                    status: "planned",
                    description: "Start running weekly group and individual sessions for each behavioural addiction. This is the operational launch of the new service line",
                    details: {
                        whatYouNeed: [
                            "📅 Group schedule (adults + youth as needed)",
                            "📑 Programme marketing flyers",
                            "🏫 Referral letters for schools & psychologists",
                            "💳 Pricing structure per track",
                            "📊 Attendance + progress tracking sheet"
                        ],
                        tips: [
                            "Start with 1-2 tracks first (e.g., gambling + porn) before offering all five.",
                            "Use early feedback to adjust structure and pacing.",
                            "Ensure parents understand commitment if youth join.",
                            "Track attendance weekly — early dropout = early intervention."
                        ]
                    }
                },
                {
                    id: "W1B-M4",
                    title: "Develop Teen & Parent Companion Modules",
                    owner: "Sne Khonyane",
                    due: "2026-02-20",
                    status: "planned",
                    description: "Build the parent support content that makes youth programmes safer, more effective, and easier for families to manage",
                    details: {
                        whatYouNeed: [
                            "📘 4-part parent skills module",
                            "🧠 Guidance materials for digital safety",
                            "📄 Boundaries & accountability scripts",
                            "👨‍👩‍👧 Family communication worksheets"
                        ],
                        tips: [
                            "Parents are key to adolescent treatment — don't skip this.",
                            "Keep parent content simple and practical.",
                            "Offer evening sessions to increase attendance.",
                            "Integrate digital-use monitoring tools."
                        ]
                    }
                },
                {
                    id: "W1B-M5",
                    title: "School & Professional Referral Activation",
                    owner: "Sne Khonyane",
                    due: "2026-03-01",
                    status: "planned",
                    description: "Launch the referral pathways specifically for behavioural addictions — highly relevant in schools, churches, and psychologist networks",
                    details: {
                        whatYouNeed: [
                            "🏫 School referral pack",
                            "📧 Email templates for psychologists & GPs",
                            "📢 Behavioural addiction info sessions",
                            "📇 Simple referral link or WhatsApp line"
                        ],
                        tips: [
                            "Schools are desperate for help with screen, vape, and porn issues.",
                            "Run 1-2 free educator workshops to build trust.",
                            "Use case examples (anonymised) to illustrate impact.",
                            "Follow up with schools every 2 weeks."
                        ]
                    }
                },
                {
                    id: "W1B-M6",
                    title: "Behavioural Addictions Marketing & Awareness Campaign",
                    owner: "Sne Khonyane",
                    due: "2026-03-15",
                    status: "planned",
                    description: "Increase visibility of these new programmes through parent-friendly, non-stigmatising, educational content",
                    details: {
                        whatYouNeed: [
                            "🌐 Website section for behavioural addictions",
                            "📣 Social media content series",
                            "🎙️ Parent webinars",
                            "📰 School newsletter inserts"
                        ],
                        tips: [
                            "Avoid rehab language — use 'wellbeing', 'skills', 'support'.",
                            "Highlight stories of improvement, not fear-driven messages.",
                            "Short videos explaining each addiction drive high engagement.",
                            "Focus on parents — they are the real decision-makers."
                        ]
                    }
                }
            ]
        },
        {
            id: "W2",
            name: "Phase 2 – Growth & Integration",
            timeline: "Apr – Dec 2026",
            outcome: "The Wellness Centre moves from 'proof of concept' to a fully operational, high-visibility service arm with consistent caseloads, expanded partnerships, and integrated referral flows across Stabilis",
            milestones: [
                {
                    id: "W2-M1",
                    title: "Scale Practitioner Capacity",
                    owner: "Suzanne Gelderblom",
                    due: "2026-04-30",
                    status: "planned",
                    description: "Add 1-2 more practitioners to increase therapy room utilisation from 25-35% to 60-70%",
                    details: {
                        whatYouNeed: [
                            "👥 1-2 new practitioners (internal or contracted)",
                            "📅 Predictable schedules (after school, evenings, Saturdays)",
                            "📊 Room utilisation tracking system",
                            "📝 Updated practitioner contracts",
                            "🎯 Capacity planning spreadsheet"
                        ],
                        tips: [
                            "Prioritize practitioners with after-hours availability.",
                            "Track room utilisation weekly to identify bottlenecks.",
                            "Ensure new practitioners align with Wellness Centre values.",
                            "Build waiting time into revenue forecasts initially."
                        ]
                    }
                },
                {
                    id: "W2-M2",
                    title: "Strengthen Referral Pipelines",
                    owner: "Sne Khonyane",
                    due: "2026-06-30",
                    status: "planned",
                    description: "Build stable inflow through monthly school visits, GP/psychologist networks, EAPs, and parent-friendly referral flows",
                    details: {
                        whatYouNeed: [
                            "🏫 Monthly school visit schedule",
                            "👨‍⚕️ GP/psychologist network presentations (3-6 networks)",
                            "💼 EAP and HR manager relationships",
                            "📋 Parent-friendly adolescent referral flow",
                            "📊 Referral tracking dashboard"
                        ],
                        tips: [
                            "Don't just present — build relationships over time.",
                            "Provide referrers with simple one-page referral forms.",
                            "Follow up with referrers on client outcomes (with consent).",
                            "Track which sources produce actual bookings, not just inquiries."
                        ]
                    }
                },
                {
                    id: "W2-M3",
                    title: "Launch Specialty Groups",
                    owner: "Suzanne Gelderblom",
                    due: "2026-05-31",
                    status: "planned",
                    description: "Introduce higher-value group work: Emotional Regulation, Trauma-Lite Skills, Teen Resilience, Parent Guidance",
                    details: {
                        whatYouNeed: [
                            "📚 Curricula for 4 specialty groups",
                            "👥 Group facilitator assignments",
                            "💳 Group pricing structure",
                            "📅 Group timetable (6-8 week cycles)",
                            "📊 Outcome measurement tools"
                        ],
                        tips: [
                            "Keep groups between 6-10 participants for quality.",
                            "Market groups as 'programs' not 'therapy' to reduce stigma.",
                            "Offer family groups separately from individual youth groups.",
                            "Use group alumni as referral sources."
                        ]
                    }
                },
                {
                    id: "W2-M4",
                    title: "Add Multi-Modal Services",
                    owner: "Suzanne Gelderblom",
                    due: "2026-08-31",
                    status: "planned",
                    description: "Expand to genuine multidisciplinary hub: occupational therapy, speech therapy, educational psychology, dietetics",
                    details: {
                        whatYouNeed: [
                            "🧑‍⚕️ Occupational therapist (contracted)",
                            "🗣️ Speech therapist for emotional regulation cases",
                            "📚 Educational psychologist",
                            "🥗 Dietitian for wellbeing cases",
                            "📋 Multidisciplinary assessment protocols"
                        ],
                        tips: [
                            "Start with part-time contracted specialists.",
                            "Create clear referral pathways between disciplines.",
                            "Position as 'whole-person wellness' in marketing.",
                            "Track which services drive highest client satisfaction."
                        ]
                    }
                },
                {
                    id: "W2-M5",
                    title: "Corporate Wellbeing Programme",
                    owner: "Sne Khonyane",
                    due: "2026-07-31",
                    status: "planned",
                    description: "Launch corporate contracts: trauma debriefing, stress/burnout intervention, leadership briefings, employee OP packages",
                    details: {
                        whatYouNeed: [
                            "💼 Corporate service menu",
                            "📊 Trauma debriefing protocols",
                            "🎯 Stress & burnout intervention packages",
                            "👔 Leadership mental health briefing decks",
                            "📝 Employee OP package pricing"
                        ],
                        tips: [
                            "Lead with ROI: reduced absenteeism, improved productivity.",
                            "Offer pilot programmes at reduced rates to build case studies.",
                            "Create confidential reporting mechanisms for employee services.",
                            "Target companies with 50+ employees initially."
                        ]
                    }
                },
                {
                    id: "W2-M6",
                    title: "Digital Presence & Client Experience Upgrade",
                    owner: "Sne Khonyane",
                    due: "2026-09-30",
                    status: "planned",
                    description: "Build professional client-facing identity: dedicated webpage, online booking, WhatsApp line, social media content",
                    details: {
                        whatYouNeed: [
                            "🌐 Dedicated Wellness Centre webpage",
                            "📅 Online booking portal",
                            "📱 WhatsApp response line",
                            "📲 Social media content calendar",
                            "✍️ Parent tips & wellbeing advice content"
                        ],
                        tips: [
                            "Keep booking process mobile-friendly — parents book on phones.",
                            "Use testimonials (anonymized) to build trust.",
                            "Post educational content, not just promotions.",
                            "Separate Wellness Centre branding from inpatient centre."
                        ]
                    }
                },
                {
                    id: "W2-M7",
                    title: "Clinical Audit & Documentation Review",
                    owner: "Suzanne Gelderblom",
                    due: "2026-10-31",
                    status: "planned",
                    description: "Ensure ethical compliance, note quality, billing documentation, privacy and safeguarding are audit-ready",
                    details: {
                        whatYouNeed: [
                            "📋 HPCSA/SACSSP compliance checklist",
                            "📝 Clinical note quality audit",
                            "💰 Billing documentation review",
                            "🔒 Privacy & safeguarding protocols",
                            "✅ Audit readiness report"
                        ],
                        tips: [
                            "Conduct internal audits before external ones.",
                            "Fix documentation gaps immediately — they compound over time.",
                            "Train all practitioners on minimum note standards.",
                            "Use audit findings to improve systems, not to punish."
                        ]
                    }
                },
                {
                    id: "W2-M8",
                    title: "Financial Review & Pricing Adjustment",
                    owner: "Wellness Champion + Nastasha Jacobs",
                    due: "2026-11-30",
                    status: "planned",
                    description: "Review utilisation, revenue, therapist ratios; adjust pricing; introduce package-based pricing (family/group bundles)",
                    details: {
                        whatYouNeed: [
                            "📊 Utilisation vs revenue analysis",
                            "💰 Cost-to-serve calculations",
                            "💳 Revised pricing structure",
                            "📦 Family & group bundle pricing",
                            "📈 12-month financial projection"
                        ],
                        tips: [
                            "Price increases should reflect value added, not just cost.",
                            "Bundle pricing encourages commitment and improves outcomes.",
                            "Communicate pricing changes with 60-day notice.",
                            "Offer loyalty discounts for returning clients."
                        ]
                    }
                },
                {
                    id: "W2-M9",
                    title: "Annual Strategy Review",
                    owner: "Wellness Champion + Wellness Coordinator",
                    due: "2026-12-31",
                    status: "planned",
                    description: "Clear decisions for 2027 — what to scale, what to remove, what to strengthen",
                    details: {
                        whatYouNeed: [
                            "📊 Full year performance report",
                            "💰 Revenue vs budget analysis",
                            "👥 Practitioner performance review",
                            "📈 Service utilisation patterns",
                            "🎯 2027 strategic priorities"
                        ],
                        tips: [
                            "Involve team in review — they see operational realities.",
                            "Be willing to discontinue underperforming services.",
                            "Double down on what's working before adding new things.",
                            "Set clear, measurable goals for 2027."
                        ]
                    }
                }
            ]
        },
        {
            id: "W3",
            name: "Phase 3 – Consolidation & Expansion",
            timeline: "Jan – Jun 2027",
            outcome: "Wellness Centre becomes a core revenue engine, with diversified services, stable practitioner base, and regional influence",
            milestones: [
                {
                    id: "W3-M1",
                    title: "Expand Physical Footprint",
                    owner: "Suzanne Gelderblom",
                    due: "2027-02-28",
                    status: "planned",
                    description: "Add therapy rooms, youth-friendly space, small group room to match demand and eliminate waiting list bottlenecks",
                    details: {
                        whatYouNeed: [
                            "🏢 Additional therapy rooms",
                            "🎨 Youth-friendly space design",
                            "👥 Small group room (8-12 capacity)",
                            "📋 Space utilisation forecast",
                            "💰 Renovation budget & timeline"
                        ],
                        tips: [
                            "Design spaces with flexibility for multiple uses.",
                            "Youth spaces should feel different from clinical rooms.",
                            "Ensure soundproofing for confidentiality.",
                            "Plan expansion based on 18-month demand data, not guesses."
                        ]
                    }
                },
                {
                    id: "W3-M2",
                    title: "Open Regional School Partnerships",
                    owner: "Sne Khonyane",
                    due: "2027-03-31",
                    status: "planned",
                    description: "Secure 5-10 school contracts with tiered pricing (private, semi-private, government) for consistent adolescent referrals",
                    details: {
                        whatYouNeed: [
                            "🏫 5-10 school contracts",
                            "💳 Tiered pricing model",
                            "📋 School partnership agreement templates",
                            "📊 Prevention service packages",
                            "🎯 Referral pathway protocols"
                        ],
                        tips: [
                            "Start with schools that already send private referrals.",
                            "Offer preventative workshops as entry point to contracts.",
                            "Government schools need different pricing — build that in.",
                            "Position as 'early intervention' not 'treatment' for schools."
                        ]
                    }
                },
                {
                    id: "W3-M3",
                    title: "Launch Family Services Unit",
                    owner: "Suzanne Gelderblom",
                    due: "2027-03-31",
                    status: "planned",
                    description: "Create family therapy, parenting programmes, conflict support, and post-discharge family alignment packages",
                    details: {
                        whatYouNeed: [
                            "👨‍👩‍👧 Family therapy protocols",
                            "📚 Parenting programme curriculum",
                            "🤝 Conflict support framework",
                            "🔄 Post-discharge family alignment package",
                            "💳 Family service pricing structure"
                        ],
                        tips: [
                            "Market family services as 'alignment' not 'therapy' to reduce resistance.",
                            "Offer post-discharge packages to inpatient families at discount.",
                            "Create clear boundaries between couple vs family vs parenting work.",
                            "Track family outcomes — they're often better than individual work alone."
                        ]
                    }
                },
                {
                    id: "W3-M4",
                    title: "Develop Online Courses / Digital Products",
                    owner: "Suzanne Gelderblom",
                    due: "2027-05-31",
                    status: "planned",
                    description: "Create low-cost, high-margin digital revenue streams: teen emotional storms, boundaries, relapse prevention, stress toolkit",
                    details: {
                        whatYouNeed: [
                            "🎥 Video course platform",
                            "📚 4-6 course curricula",
                            "💻 E-learning delivery system",
                            "💳 Digital payment infrastructure",
                            "📊 User engagement analytics"
                        ],
                        tips: [
                            "Start with content you already teach in groups.",
                            "Keep courses short (4-6 modules max) for completion rates.",
                            "Offer free preview modules to build trust.",
                            "Digital products scale infinitely — invest in quality upfront."
                        ]
                    }
                },
                {
                    id: "W3-M5",
                    title: "External Accreditation & Partner Recognition",
                    owner: "Suzanne Gelderblom",
                    due: "2027-06-30",
                    status: "planned",
                    description: "Obtain CPD provider status, school partner endorsements, corporate wellbeing compliance badges for market trust",
                    details: {
                        whatYouNeed: [
                            "✅ CPD provider status application",
                            "🏫 School partner endorsement letters",
                            "💼 Corporate wellbeing compliance badges",
                            "📋 Quality assurance documentation",
                            "🏆 Professional recognition submissions"
                        ],
                        tips: [
                            "Accreditation opens doors to institutional contracts.",
                            "CPD status makes workshops more attractive to professionals.",
                            "Use endorsements in all marketing materials.",
                            "Build relationships with accrediting bodies early."
                        ]
                    }
                },
                {
                    id: "W3-M6",
                    title: "18-Month Impact Report",
                    owner: "Wellness Champion + Wellness Coordinator",
                    due: "2027-06-30",
                    status: "planned",
                    description: "Comprehensive report on outcomes, revenue, demographics, referral patterns, cost-benefit, practitioner performance",
                    details: {
                        whatYouNeed: [
                            "📊 Outcomes data analysis",
                            "💰 Revenue vs cost analysis",
                            "👥 Demographic reach report",
                            "🔄 Referral pattern analysis",
                            "📈 Cost-benefit calculations",
                            "⭐ Practitioner performance review"
                        ],
                        tips: [
                            "Use this report to attract investors or secure funding.",
                            "Present data visually — graphs tell stories faster than tables.",
                            "Include client testimonials (anonymized) for qualitative impact.",
                            "This report becomes your foundation for 2027-2029 strategy."
                        ]
                    }
                }
            ]
        }
    ],

    risks: [
        {
            id: 'WR-001',
            title: 'Practitioner Recruitment Challenges',
            description: 'Difficulty recruiting qualified therapists and counselors in competitive market',
            severity: 'high',
            impact: 'High',
            likelihood: 'Medium',
            owner: 'Suzanne Gelderblom',
            status: 'active'
        },
        {
            id: 'WR-002',
            title: 'Medical Aid Registration Delays',
            description: 'Delays in HPCSA and medical aid registration could impact revenue timeline',
            severity: 'medium',
            impact: 'Medium',
            likelihood: 'Medium',
            owner: 'Nastasha Jacobs',
            status: 'active'
        },
        {
            id: 'WR-003',
            title: 'Market Awareness',
            description: 'Low awareness of behavioural addiction services in target market',
            severity: 'medium',
            impact: 'High',
            likelihood: 'Medium',
            owner: 'Sne Khonyane',
            status: 'active'
        },
        {
            id: 'WR-004',
            title: 'Facility Readiness',
            description: 'Delays in facility setup, equipment procurement, or compliance approvals',
            severity: 'high',
            impact: 'Very High',
            likelihood: 'Low',
            owner: 'Suzanne Gelderblom',
            status: 'active'
        },
        {
            id: 'WR-005',
            title: 'School Partnership Delays',
            description: 'Slower than expected uptake of school/corporate partnerships',
            severity: 'low',
            impact: 'Medium',
            likelihood: 'Low',
            owner: 'Sne Khonyane',
            status: 'active'
        }
    ],

    team: [
        {
            role: "CEO & Project Manager",
            name: "Attie Nel",
            responsibilities: "Strategic oversight, project governance, cross-project coordination, board liaison"
        },
        {
            role: "Wellness Champion (Senior Therapist)",
            name: "Suzanne Gelderblom",
            responsibilities: "Strategic oversight, clinical supervision, curriculum development, senior therapy sessions, quality assurance, partnership negotiations"
        },
        {
            role: "Wellness Coordinator (Junior Therapist)",
            name: "Sne Khonyane",
            responsibilities: "Day-to-day operations, client bookings, school/corporate outreach, marketing execution, group facilitation, administrative coordination"
        },
        {
            role: "Clinical Supervisor",
            name: "Berno Paul",
            responsibilities: "Clinical oversight, quality assurance, practitioner supervision"
        },
        {
            role: "Finance Officer",
            name: "Nastasha Jacobs",
            responsibilities: "Billing, payments, financial tracking, medical aid claims"
        }
    ],

    keyMetrics: [
        { metric: "Client Sessions per Month", target: "300+", current: "0" },
        { metric: "Monthly Revenue", target: "R250,000", current: "R0" },
        { metric: "Practitioner Utilization", target: "75%", current: "0%" },
        { metric: "School/Corporate Contracts", target: "10+", current: "0" },
        { metric: "Digital Product Revenue", target: "R50,000/month", current: "R0" },
        { metric: "Regional School Partnerships", target: "5-10", current: "0" }
    ]
};
