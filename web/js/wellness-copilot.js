// Wellness Centre AI Copilot - Contextual Help & Guidance
// Simple, clear explanations for non-technical users

const wellnessCopilotData = {
    // Milestone-specific guidance
    milestones: {
        "W1-M1": {
            title: "Operational Setup",
            simpleExplanation: "Set up the physical and administrative infrastructure so therapy sessions, bookings, and payments can start immediately.",
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
            ],
            commonQuestions: [
                {
                    q: "Can we start before everything is perfect?",
                    a: "Yes — don't delay launch for cosmetic issues. Focus on functionality first."
                },
                {
                    q: "How many rooms do we need to launch?",
                    a: "Minimum: 1–2 rooms. You can expand as caseload increases."
                }
            ]
        },
        "W1-M2": {
            title: "Practitioner Onboarding",
            simpleExplanation: "Bring internal and external therapists onboard with clear contracts, expectations, and systems.",
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
            ],
            commonQuestions: [
                {
                    q: "How many practitioners should we start with?",
                    a: "Start with 1–2 core practitioners to build stable processes before scaling."
                },
                {
                    q: "Can practitioners use their own notes?",
                    a: "Only if aligned to Stabilis standards and billing requirements."
                }
            ]
        },
        "W1-M3": {
            title: "Adult Wellness OP Launch",
            simpleExplanation: "Launch a standalone private Adult Outpatient programme focused on emotional regulation, stress, trauma-lite, relapse prevention, and wellbeing.",
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
            ],
            commonQuestions: [
                {
                    q: "How do we avoid overlap with the addiction OP?",
                    a: "Different branding, different content, and wellbeing-focused marketing."
                },
                {
                    q: "Can clients join without a diagnosis?",
                    a: "Yes — this programme is prevention and wellbeing oriented."
                }
            ]
        },
        "W1-M4": {
            title: "Adolescent Wellness OP Launch",
            simpleExplanation: "Start a private youth outpatient programme offering skills, emotional support, family guidance, and school-linked referrals.",
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
            ],
            commonQuestions: [
                {
                    q: "How do we handle high-risk teens?",
                    a: "Escalate to clinical management and adjust level of care case-by-case."
                },
                {
                    q: "Can teens from inpatient move here?",
                    a: "Yes — this is ideal for continuity of care."
                }
            ]
        },
        "W1-M5": {
            title: "School & Corporate Package Development",
            simpleExplanation: "Build sellable skill-based workshops for schools and employers to diversify revenue and increase referrals.",
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
            ],
            commonQuestions: [
                {
                    q: "Should we offer sessions free at first?",
                    a: "Free pilots are fine, but always show the normal price."
                },
                {
                    q: "What do corporates want most?",
                    a: "Stress management, emotional regulation, trauma debriefing."
                }
            ]
        },
        "W1-M6": {
            title: "Online/Hybrid Therapy Setup",
            simpleExplanation: "Enable clients to join therapy online for convenience, geographical reach, and evening scheduling.",
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
            ],
            commonQuestions: [
                {
                    q: "Is telehealth clinically safe for teens?",
                    a: "Yes with safeguards: parent presence, identity verification, clear boundaries."
                },
                {
                    q: "Should pricing differ for online?",
                    a: "No — keep pricing equal to simplify admin."
                }
            ]
        },
        "W1-M7": {
            title: "Launch Marketing & Referral Campaign",
            simpleExplanation: "Announce the Wellness Centre publicly and privately to referrers, schools, families, doctors, and partners.",
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
            ],
            commonQuestions: [
                {
                    q: "How do we avoid overselling?",
                    a: "Keep your language factual: support, skills, improvement — not guarantees."
                },
                {
                    q: "Can we market inside schools?",
                    a: "Only with permission. Approach principals respectfully and professionally."
                }
            ]
        },
        "W1-M8": {
            title: "First 90-Day Review",
            simpleExplanation: "Evaluate caseloads, revenue, practitioner performance, and service uptake to guide expansion decisions.",
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
            ],
            commonQuestions: [
                {
                    q: "What if uptake is slower than expected?",
                    a: "Strengthen marketing and refine pricing — early months are always slow."
                },
                {
                    q: "Should we hire more practitioners?",
                    a: "Only if rooms are full and waiting lists appear."
                }
            ]
        },

        // PHASE 1B: Behavioural Addictions Launch
        "W1B-M1": {
            title: "Programme Framework & Curriculum Build",
            simpleExplanation: "Create the structure, tools, and therapeutic flow for each behavioural addiction track so clinicians can start running groups and sessions confidently.",
            whatYouNeed: [
                "📚 8-10 week curriculum for each behavioural addiction",
                "📋 Screening tools (Gambling, Pornography, Gaming, Social Media, Vape)",
                "🧾 Consent + behaviour assessment forms",
                "🧠 Crisis/risk escalation protocol"
            ],
            tips: [
                "Use the same skeleton across programmes to simplify training.",
                "Focus on skills: regulation, impulse control, triggers, shame cycles.",
                "Keep sessions practical — no long lectures.",
                "Build family involvement options for youth cases."
            ],
            commonQuestions: [
                {
                    q: "Do all programmes need separate materials?",
                    a: "Core structure can be shared; customise only the examples and behaviour patterns."
                },
                {
                    q: "What about sexual behaviour ethics?",
                    a: "Use professional guidelines: confidentiality, boundaries, supervision, and clinical sign-off."
                }
            ]
        },

        "W1B-M2": {
            title: "Practitioner Training & Assignment",
            simpleExplanation: "Train internal and contracted practitioners to deliver behavioural addiction programmes safely, ethically, and confidently.",
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
            ],
            commonQuestions: [
                {
                    q: "Do we need specialists?",
                    a: "Not necessarily. A skilled therapist using structured processes can safely deliver these programmes."
                },
                {
                    q: "What about practitioner discomfort?",
                    a: "Normal. Supervision and structure reduce discomfort significantly."
                }
            ]
        },

        "W1B-M3": {
            title: "Launch Behavioural Addictions OP Tracks",
            simpleExplanation: "Start running weekly group and individual sessions for each behavioural addiction. This is the operational launch of the new service line.",
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
            ],
            commonQuestions: [
                {
                    q: "Should we offer free intro sessions?",
                    a: "Yes, 1 free introductory psychoeducation session improves uptake dramatically."
                },
                {
                    q: "What if group numbers are low?",
                    a: "Run smaller groups initially; as referrals grow, expand capacity."
                }
            ]
        },

        "W1B-M4": {
            title: "Develop Teen & Parent Companion Modules",
            simpleExplanation: "Build the parent support content that makes youth programmes safer, more effective, and easier for families to manage.",
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
            ],
            commonQuestions: [
                {
                    q: "Do parents attend every week?",
                    a: "No — only scheduled parent sessions plus optional check-ins."
                },
                {
                    q: "Can divorced families join separately?",
                    a: "Yes, with clear boundaries and identical information."
                }
            ]
        },

        "W1B-M5": {
            title: "School & Professional Referral Activation",
            simpleExplanation: "Launch the referral pathways specifically for behavioural addictions — highly relevant in schools, churches, and psychologist networks.",
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
            ],
            commonQuestions: [
                {
                    q: "What if schools want us to diagnose?",
                    a: "Clarify: Stabilis offers support, skills, and treatment — not school-based diagnosis."
                },
                {
                    q: "How do we handle confidentiality?",
                    a: "Use clear consent forms and only share summary info with schools."
                }
            ]
        },

        "W1B-M6": {
            title: "Behavioural Addictions Marketing & Awareness Campaign",
            simpleExplanation: "Increase visibility of these new programmes through parent-friendly, non-stigmatising, educational content.",
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
            ],
            commonQuestions: [
                {
                    q: "Can we market directly to teens?",
                    a: "No. Focus on parents and schools for ethical and practical reasons."
                },
                {
                    q: "What language should we avoid?",
                    a: "Avoid shame-based or moralistic phrasing. Stick to behaviour, not moral judgement."
                }
            ]
        },

        // PHASE 2: Growth & Integration
        "W2-M1": {
            title: "Scale Practitioner Capacity",
            simpleExplanation: "Add 1-2 more practitioners to increase therapy room utilisation from 25-35% to 60-70% and handle rising demand.",
            whatYouNeed: [
                "👥 1-2 new practitioners (internal or contracted)",
                "📅 Predictable schedules (after school, evenings, Saturdays)",
                "📊 Room utilisation tracking system",
                "📝 Updated practitioner contracts"
            ],
            tips: [
                "Prioritize practitioners with after-hours availability.",
                "Track room utilisation weekly to identify bottlenecks.",
                "Ensure new practitioners align with Wellness Centre values.",
                "Build waiting time into revenue forecasts initially."
            ],
            commonQuestions: [
                {
                    q: "How do we know when we need more practitioners?",
                    a: "When rooms are 60%+ booked and clients wait more than 2 weeks for appointments."
                },
                {
                    q: "Should we hire full-time or contract?",
                    a: "Start with contractors — it's lower risk while demand stabilizes."
                }
            ]
        },

        "W2-M2": {
            title: "Strengthen Referral Pipelines",
            simpleExplanation: "Build stable client inflow through monthly school visits, GP/psychologist networks, EAPs, and parent-friendly referral processes.",
            whatYouNeed: [
                "🏫 Monthly school visit schedule",
                "👨‍⚕️ GP/psychologist network presentations",
                "💼 EAP and HR manager relationships",
                "📋 Parent-friendly adolescent referral flow",
                "📊 Referral tracking dashboard"
            ],
            tips: [
                "Don't just present — build relationships over time.",
                "Provide referrers with simple one-page referral forms.",
                "Follow up with referrers on client outcomes (with consent).",
                "Track which sources produce actual bookings, not just inquiries."
            ],
            commonQuestions: [
                {
                    q: "How many referral sources do we need?",
                    a: "Start with 5-10 quality sources rather than 50 weak ones."
                },
                {
                    q: "What if referrals don't convert to bookings?",
                    a: "Simplify the booking process and reduce initial cost barriers."
                }
            ]
        },

        "W2-M3": {
            title: "Launch Specialty Groups",
            simpleExplanation: "Introduce higher-value group work: Emotional Regulation, Trauma-Lite Skills, Teen Resilience, and Parent Guidance groups.",
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
            ],
            commonQuestions: [
                {
                    q: "How do we fill groups quickly?",
                    a: "Offer early-bird discounts and require minimum 4-5 commitments before starting."
                },
                {
                    q: "What if someone disrupts the group?",
                    a: "Have clear group rules and offer individual sessions as alternative."
                }
            ]
        },

        "W2-M4": {
            title: "Add Multi-Modal Services",
            simpleExplanation: "Expand to genuine multidisciplinary hub with occupational therapy, speech therapy, educational psychology, and dietetics.",
            whatYouNeed: [
                "🧑‍⚕️ Occupational therapist (contracted)",
                "🗣️ Speech therapist for emotional regulation",
                "📚 Educational psychologist",
                "🥗 Dietitian for wellbeing cases",
                "📋 Multidisciplinary assessment protocols"
            ],
            tips: [
                "Start with part-time contracted specialists.",
                "Create clear referral pathways between disciplines.",
                "Position as 'whole-person wellness' in marketing.",
                "Track which services drive highest client satisfaction."
            ],
            commonQuestions: [
                {
                    q: "Do we need all these specialists from day one?",
                    a: "No — add them as demand shows. Start with one and scale."
                },
                {
                    q: "How do we coordinate multidisciplinary cases?",
                    a: "Weekly case review meetings and shared client notes (with consent)."
                }
            ]
        },

        "W2-M5": {
            title: "Corporate Wellbeing Programme",
            simpleExplanation: "Launch corporate contracts offering trauma debriefing, stress/burnout intervention, leadership briefings, and employee OP packages.",
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
            ],
            commonQuestions: [
                {
                    q: "How do we price corporate packages?",
                    a: "Per-employee rates or flat package fees. Research competitors first."
                },
                {
                    q: "What if employees don't use the service?",
                    a: "Promote confidentiality heavily and make booking super easy."
                }
            ]
        },

        "W2-M6": {
            title: "Digital Presence & Client Experience Upgrade",
            simpleExplanation: "Build professional client-facing identity with dedicated webpage, online booking, WhatsApp line, and social media content.",
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
            ],
            commonQuestions: [
                {
                    q: "Do we need a separate website?",
                    a: "At minimum, a dedicated section on your main site with clear navigation."
                },
                {
                    q: "How often should we post on social media?",
                    a: "2-3 times per week — quality over quantity."
                }
            ]
        },

        "W2-M7": {
            title: "Clinical Audit & Documentation Review",
            simpleExplanation: "Ensure ethical compliance, note quality, billing documentation, privacy and safeguarding are audit-ready.",
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
            ],
            commonQuestions: [
                {
                    q: "How often should we audit?",
                    a: "Quarterly internal audits, annual external review."
                },
                {
                    q: "What if we find compliance issues?",
                    a: "Document them, fix them, and implement preventative measures."
                }
            ]
        },

        "W2-M8": {
            title: "Financial Review & Pricing Adjustment",
            simpleExplanation: "Review utilisation, revenue, therapist ratios; adjust pricing; introduce package-based pricing like family and group bundles.",
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
            ],
            commonQuestions: [
                {
                    q: "How much should we increase prices?",
                    a: "5-10% annually is standard. More if you've added significant value."
                },
                {
                    q: "Will price increases lose us clients?",
                    a: "Some, yes. But higher-value clients stay and new clients replace budget-focused ones."
                }
            ]
        },

        "W2-M9": {
            title: "Annual Strategy Review",
            simpleExplanation: "Make clear decisions for 2027 — what to scale, what to remove, what to strengthen based on full year data.",
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
            ],
            commonQuestions: [
                {
                    q: "What if nothing is working as planned?",
                    a: "Identify what IS working, even if small, and build from there."
                },
                {
                    q: "Should we keep all services?",
                    a: "No — cut low-performers to focus resources on high-impact services."
                }
            ]
        },

        // PHASE 3: Consolidation & Expansion
        "W3-M1": {
            title: "Expand Physical Footprint",
            simpleExplanation: "Add therapy rooms, youth-friendly space, and small group room to match demand and eliminate waiting list bottlenecks.",
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
            ],
            commonQuestions: [
                {
                    q: "How do we know when we need more space?",
                    a: "When rooms are 75%+ booked and waiting lists exceed 3 weeks."
                },
                {
                    q: "Should we renovate or lease additional space?",
                    a: "Renovate existing if possible — it's cheaper and maintains brand continuity."
                }
            ]
        },

        "W3-M2": {
            title: "Open Regional School Partnerships",
            simpleExplanation: "Secure 5-10 school contracts with tiered pricing for consistent adolescent referrals and paid prevention services.",
            whatYouNeed: [
                "🏫 5-10 school contracts",
                "💳 Tiered pricing model (private/semi-private/government)",
                "📋 School partnership agreement templates",
                "📊 Prevention service packages",
                "🎯 Referral pathway protocols"
            ],
            tips: [
                "Start with schools that already send private referrals.",
                "Offer preventative workshops as entry point to contracts.",
                "Government schools need different pricing — build that in.",
                "Position as 'early intervention' not 'treatment' for schools."
            ],
            commonQuestions: [
                {
                    q: "How do we approach schools?",
                    a: "Target school counselors and principals with outcome-focused proposals."
                },
                {
                    q: "What if schools can't afford our services?",
                    a: "Create subsidized tiers or offer free workshops to build relationships."
                }
            ]
        },

        "W3-M3": {
            title: "Launch Family Services Unit",
            simpleExplanation: "Create family therapy, parenting programmes, conflict support, and post-discharge family alignment packages.",
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
            ],
            commonQuestions: [
                {
                    q: "Should family therapy be mandatory for youth clients?",
                    a: "No, but strongly encouraged and incentivized through bundled pricing."
                },
                {
                    q: "How do we handle high-conflict families?",
                    a: "Set ground rules upfront and offer separate sessions if needed."
                }
            ]
        },

        "W3-M4": {
            title: "Develop Online Courses / Digital Products",
            simpleExplanation: "Create low-cost, high-margin digital revenue streams covering teen emotional storms, boundaries, relapse prevention, and stress toolkits.",
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
            ],
            commonQuestions: [
                {
                    q: "How do we price digital courses?",
                    a: "R300-800 per course. Lower than in-person, but accessible to more people."
                },
                {
                    q: "What platform should we use?",
                    a: "Start with Teachable, Thinkific, or Kajabi — they're beginner-friendly."
                }
            ]
        },

        "W3-M5": {
            title: "External Accreditation & Partner Recognition",
            simpleExplanation: "Obtain CPD provider status, school partner endorsements, and corporate wellbeing compliance badges for market trust.",
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
            ],
            commonQuestions: [
                {
                    q: "How long does CPD provider status take?",
                    a: "6-12 months typically. Start application early."
                },
                {
                    q: "Is accreditation worth the cost?",
                    a: "Yes — it significantly increases credibility and opens B2B opportunities."
                }
            ]
        },

        "W3-M6": {
            title: "18-Month Impact Report",
            simpleExplanation: "Comprehensive report on outcomes, revenue, demographics, referral patterns, cost-benefit, and practitioner performance.",
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
            ],
            commonQuestions: [
                {
                    q: "Who should see this report?",
                    a: "Board, investors, potential partners, and strategic funders."
                },
                {
                    q: "What if results aren't impressive?",
                    a: "Be honest about challenges, but highlight learning and improvements made."
                }
            ]
        }
    },

    // General project guidance
    generalHelp: {
        "What is the Wellness Centre?": "A new multidisciplinary private practice offering therapy, outpatient programmes, and wellbeing services separate from addiction treatment. It runs across three phases over 19 months.",
        
        "Why three phases?": "Phase 1 (4 months) launches core services. Phase 2 (9 months) scales capacity and partnerships. Phase 3 (6 months) consolidates as a revenue engine with digital products and regional reach.",
        
        "Why are we launching this?": "To diversify income, reach more clients, and offer broader mental health support beyond substance abuse treatment. This creates sustainable private revenue streams.",
        
        "Who can use the Wellness Centre?": "Anyone seeking therapy, emotional support, or wellbeing skills — adults, teens, families, schools, or employers. We serve both clinical and preventative needs.",
        
        "How is this different from the addiction programmes?": "Wellness Centre focuses on general mental health, stress, trauma, relationships, and skills — not just addiction recovery. It's broader and more accessible.",
        
        "Can Stabilis clients transition here?": "Yes — this is perfect for aftercare or clients who complete addiction treatment. We also offer post-discharge family alignment packages.",
        
        "What's the total investment?": "R2.5 million over 19 months. Phase 1 is R850k, with phases 2 & 3 scaling based on proven demand.",
        
        "What if Phase 1 doesn't work?": "The 90-day review (W1-M8) evaluates performance. We adjust, pivot, or pause before committing to Phase 2 investment.",
        
        "What if I need help?": "Contact the Wellness Coordinator or use this AI helper for guidance on any milestone. Each phase has detailed support built in."
    }
};

// Wellness Copilot Functions
function showWellnessCopilot(milestoneId) {
    const guidance = wellnessCopilotData.milestones[milestoneId];
    
    if (!guidance) {
        return `
            <div class="copilot-panel">
                <div class="copilot-header">
                    <span class="copilot-icon">🤖</span>
                    <h3>AI Copilot</h3>
                </div>
                <p>No specific guidance available for this milestone yet.</p>
                <button onclick="showWellnessGeneralHelp()" class="copilot-btn">Ask Me Anything</button>
            </div>
        `;
    }
    
    return `
        <div class="copilot-panel">
            <div class="copilot-header">
                <span class="copilot-icon">🤖</span>
                <h3>AI Copilot: ${guidance.title}</h3>
            </div>
            
            <div class="copilot-section">
                <h4>📖 In Simple Terms</h4>
                <p class="copilot-simple">${guidance.simpleExplanation}</p>
            </div>
            
            <div class="copilot-section">
                <h4>✅ What You Need</h4>
                <ul class="copilot-list">
                    ${guidance.whatYouNeed.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            
            <div class="copilot-section">
                <h4>💡 Tips for Success</h4>
                <ul class="copilot-list">
                    ${guidance.tips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
            
            <div class="copilot-section">
                <h4>❓ Common Questions</h4>
                ${guidance.commonQuestions.map(qa => `
                    <div class="copilot-qa">
                        <p class="copilot-question"><strong>Q:</strong> ${qa.q}</p>
                        <p class="copilot-answer"><strong>A:</strong> ${qa.a}</p>
                    </div>
                `).join('')}
            </div>
            
            <button onclick="showWellnessGeneralHelp()" class="copilot-btn-secondary">General Help</button>
        </div>
    `;
}

function showWellnessGeneralHelp() {
    const helpEntries = Object.entries(wellnessCopilotData.generalHelp);
    
    return `
        <div class="copilot-panel">
            <div class="copilot-header">
                <span class="copilot-icon">🤖</span>
                <h3>General Help</h3>
            </div>
            
            <div class="copilot-section">
                <h4>Frequently Asked Questions</h4>
                ${helpEntries.map(([question, answer]) => `
                    <div class="copilot-qa">
                        <p class="copilot-question"><strong>Q:</strong> ${question}</p>
                        <p class="copilot-answer"><strong>A:</strong> ${answer}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Export functions
window.wellnessCopilotData = wellnessCopilotData;
window.showWellnessCopilot = showWellnessCopilot;
window.showWellnessGeneralHelp = showWellnessGeneralHelp;
