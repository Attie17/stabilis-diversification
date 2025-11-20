// AI Copilot - Contextual Help & Guidance
// Simple, clear explanations for non-technical users

const copilotData = {
    // Milestone-specific guidance
    milestones: {
        "P1-M1": {
            title: "Kick-off Meeting",
            simpleExplanation: "This is your first team meeting to start the project. Everyone needs to understand what we're doing and why.",
            whatYouNeed: [
                "📋 Agenda showing project goals",
                "📅 Timeline poster or slides",
                "👥 All staff present (or online)",
                "📝 Note-taker to record decisions"
            ],
            tips: [
                "Keep it simple - use pictures and examples",
                "Allow time for questions in everyone's home language",
                "Make sure everyone knows their role",
                "End with clear next steps"
            ],
            commonQuestions: [
                {
                    q: "How long should this meeting be?",
                    a: "Plan for 1-2 hours. Better to have time for questions than rush through."
                },
                {
                    q: "What if some staff don't understand English well?",
                    a: "Use visuals, translate key points, and encourage questions in any language. Have someone help translate."
                }
            ]
        },
        "P1-M2": {
            title: "Appoint Leads",
            simpleExplanation: "Choose the right people to lead different parts of the project. These are your team captains.",
            whatYouNeed: [
                "📋 List of roles needed (Adult Lead, Youth Lead, Finance Officer, Admin Coordinator, Comms Officer)",
                "👥 Staff skills and experience assessment",
                "💬 Individual conversations with potential leads",
                "📝 Written role descriptions"
            ],
            tips: [
                "Choose people who communicate well, not just experts",
                "Make sure they have time to lead (reduce other duties if needed)",
                "Pair experienced staff with newer staff for mentoring",
                "Give leads authority to make decisions"
            ],
            commonQuestions: [
                {
                    q: "What if someone doesn't want to be a lead?",
                    a: "Don't force it. Leading takes energy and time. Find someone who is excited about the opportunity."
                },
                {
                    q: "Can one person have multiple roles?",
                    a: "Only if you're short-staffed. It's better to share the load - leading is hard work!"
                }
            ]
        },
        "P1-M3": {
            title: "Operational Mapping",
            simpleExplanation: "Draw a picture of how your clinic works today. Where are rooms? When do staff work? How do patients move through your facility?",
            whatYouNeed: [
                "🏢 Floor plan or building map",
                "📅 Current staff roster (who works when)",
                "👥 Patient flow diagram (how patients move through intake, therapy, discharge)",
                "🛏️ Bed capacity numbers (how many patients you can handle)",
                "📋 List of all therapy groups and when they happen"
            ],
            tips: [
                "Walk through the facility with pen and paper - draw what you see",
                "Ask staff: 'Where do YOU spend most of your day?'",
                "Count everything: rooms, beds, therapy slots, staff shifts",
                "Look for empty rooms or unused time - that's opportunity!"
            ],
            commonQuestions: [
                {
                    q: "What is 'operational mapping' in simple terms?",
                    a: "It means: Draw a map of how things work now. Like a treasure map, but for your clinic's daily operations."
                },
                {
                    q: "Why do we need this?",
                    a: "You can't improve what you don't understand. This map shows you where you have space for new services."
                },
                {
                    q: "How detailed should this be?",
                    a: "Enough to answer: How many patients can we see? When? Where? Who will help them?"
                }
            ]
        },
        "P1-M4": {
            title: "Pricing & Billing Policy",
            simpleExplanation: "Decide what to charge for your services and how to collect payment. Make rules that are fair and clear.",
            whatYouNeed: [
                "💰 List of all services you offer",
                "📋 Medical aid rates (what funders pay)",
                "💳 Deposit policy (pay upfront)",
                "📝 Pre-authorization rules (getting approval before treatment)",
                "📄 Written pricing list for patients"
            ],
            tips: [
                "Check what competitors charge - don't price too high or too low",
                "Require deposits - it protects your cash flow",
                "Get pre-authorization in writing - it prevents claim rejections",
                "Train ALL staff on pricing - everyone must know the rules"
            ],
            commonQuestions: [
                {
                    q: "What if a patient can't afford the deposit?",
                    a: "Have a clear policy: payment plans, reduced rates for genuine hardship, or refer to subsidized facilities."
                },
                {
                    q: "What is pre-authorization?",
                    a: "Getting written approval from the medical aid BEFORE treatment starts. It confirms they will pay."
                }
            ]
        },
        "P1-M5": {
            title: "Compliance Check",
            simpleExplanation: "Make sure all your licenses, registrations, and legal paperwork are up to date and correct.",
            whatYouNeed: [
                "📄 Facility license/registration certificate",
                "👨‍⚕️ Staff professional registrations (HPCSA, SANC, etc.)",
                "📋 Medical aid panel membership documents",
                "🏥 Health Department approvals",
                "📝 Insurance certificates"
            ],
            tips: [
                "Create a checklist - tick off each document as you check it",
                "Check expiry dates - renew anything expiring in next 6 months",
                "Make copies and keep them in a safe place (physical + digital)",
                "Assign one person to track all compliance deadlines"
            ],
            commonQuestions: [
                {
                    q: "What happens if our license expired?",
                    a: "Stop operations immediately and renew it. Operating without a license is illegal and medical aids won't pay claims."
                },
                {
                    q: "How do I check if we're on medical aid panels?",
                    a: "Call each medical aid's provider relations department and ask for confirmation in writing."
                }
            ]
        },
        "P1-M6": {
            title: "Finalize Implementation Calendar",
            simpleExplanation: "Create a big calendar showing all your project activities for the next 15 months. When will each phase start? When are deadlines?",
            whatYouNeed: [
                "📅 Master timeline for all 5 phases",
                "📋 List of all milestones with due dates",
                "👥 Staff holiday schedule",
                "🎯 Key dates (audits, board meetings, funding deadlines)",
                "🖨️ Large printed calendar for the wall"
            ],
            tips: [
                "Use a big wall calendar everyone can see",
                "Color-code different phases or work streams",
                "Mark holidays and busy seasons (e.g., December closures)",
                "Review monthly and update as needed - plans change!",
                "Share digital copy with everyone via email or WhatsApp"
            ],
            commonQuestions: [
                {
                    q: "What if we fall behind schedule?",
                    a: "Normal! Review the calendar, adjust deadlines, and communicate changes to the team immediately."
                },
                {
                    q: "How detailed should this calendar be?",
                    a: "Show major milestones and deadlines. Don't list every small task - that's too much detail."
                }
            ]
        },
        "P2-M1": {
            title: "Adult Outpatient Pilot",
            simpleExplanation: "Kick off the first 8-week Adult Outpatient (OP) group. Keep it lean, documented, and billable. Capture attendance, sessions delivered, and outcomes so claims go out cleanly.",
            whatYouNeed: [
                "🗂️ Approved pricing & admissions SOP (deposits, pre-auth rules)",
                "📅 Final timetable + therapist roster",
                "📝 Intake pack (consent, clinical history, ICD-10, release of info)",
                "💻 Session templates + attendance sheets",
                "🧾 Billing sheet linked to medical-aid codes"
            ],
            tips: [
                "Start with max 9 clients to protect quality and measurement.",
                "Pre-brief clients on attendance and payment rules before session 1.",
                "Record outcomes (e.g., craving scores, days sober) at weeks 1, 4, 8.",
                "Send claims weekly, not end-of-cycle, to keep cash moving."
            ],
            commonQuestions: [
                {
                    q: "What if a client misses session 1?",
                    a: "Offer one catch-up within the first week; document it and keep the roster accurate for billing."
                },
                {
                    q: "How many clinicians do we need?",
                    a: "One lead therapist + one relief/observer for continuity and QA is sufficient for a 9-person group."
                },
                {
                    q: "When do we bill?",
                    a: "Submit weekly batches with complete notes and authorisations; don't wait for the full 8 weeks."
                }
            ]
        },
        "P2-M2": {
            title: "28-Day Admissions Optimisation",
            simpleExplanation: "Tighten inpatient admissions: deposits and pre-auths in place before admission, daily occupancy tracked, denials cleared fast. This stabilises bed use and cash conversion.",
            whatYouNeed: [
                "✅ Deposit & pre-auth checklist",
                "📞 Payer contact list + escalation emails",
                "📊 Daily occupancy + denial log template",
                "🧾 Standard script for missing docs"
            ],
            tips: [
                "Don't admit without pre-auth or deposit unless CEO waives in writing.",
                "Call payers the same day a denial lands; log name/time/outcome.",
                "Share a 16:00 daily snapshot (beds, denials, docs outstanding).",
                "Close documentation gaps within 24 hours to avoid rebills."
            ],
            commonQuestions: [
                {
                    q: "Client can't pay the full deposit today—what then?",
                    a: "Offer a split deposit only with CEO approval; document terms and update billing immediately."
                },
                {
                    q: "Pre-auth delayed by payer?",
                    a: "Escalate within 24 hours (team lead email + call); record reference number and person spoken to."
                }
            ]
        },
        "P2-M3": {
            title: "Adolescent Outpatient Prep",
            simpleExplanation: "Set up the youth OP pipeline: school referrals, timetable, safeguarding, and parental consent. Have the first cohort identified and ready to start next phase.",
            whatYouNeed: [
                "🏫 School + counsellor referral pack",
                "👪 Parent consent & safeguarding forms",
                "📅 Youth timetable + family session slots",
                "🧠 Age-appropriate worksheets/outcomes forms"
            ],
            tips: [
                "Limit group size to 10 for safety and engagement.",
                "Include at least two family sessions to improve retention.",
                "Use simple language; send parent info notes up front.",
                "Pre-screen for risk (self-harm, acute withdrawal) and triage."
            ],
            commonQuestions: [
                {
                    q: "What if a learner needs inpatient care instead?",
                    a: "Escalate to Clinical Manager for rapid assessment; move them to the appropriate pathway and brief the family."
                },
                {
                    q: "Can we run evening groups?",
                    a: "Yes—early evening improves attendance; ensure transport and safety plans are covered."
                }
            ]
        },
        "P2-M4": {
            title: "Aftercare Structure",
            simpleExplanation: "Define a 6-month relapse-prevention track with clear frequency, topics, pricing, and sign-up process at discharge. This protects outcomes and adds predictable income.",
            whatYouNeed: [
                "🗓️ 6-month session plan (group + optional 1:1)",
                "💬 Discharge sign-up script + brochure",
                "💳 Payment/subscription details",
                "📈 Simple outcomes tracker (relapse events, attendance)"
            ],
            tips: [
                "Enroll clients before discharge while motivation is high.",
                "Offer a bundled fee; allow monthly payments with auto-reminders.",
                "Link clients to peer/alumni groups for added accountability.",
                "Flag no-shows within 24 hours and re-engage quickly."
            ],
            commonQuestions: [
                {
                    q: "How many sessions per month?",
                    a: "Baseline 4 group sessions + optional 1:1 check-in; adjust by risk."
                },
                {
                    q: "What if someone relapses?",
                    a: "Non-punitive re-entry; intensify frequency temporarily and update the care plan."
                }
            ]
        },
        "P2-M5": {
            title: "Data Tracking Setup",
            simpleExplanation: "Stand up a basic dashboard to see clients served, revenue by line, DSO, and occupancy. Weekly snapshots drive decisions and board reporting.",
            whatYouNeed: [
                "📊 Spreadsheet or BI tool template",
                "🔗 Data feeds from admissions, OP groups, billing",
                "🕒 Weekly snapshot cadence (every Friday 12:00)",
                "📮 Share link for all leads"
            ],
            tips: [
                "Keep KPIs few and consistent: clients, revenue, DSO, occupancy.",
                "Lock definitions (e.g., what counts as 'active client').",
                "Automate totals; keep manual entry minimal and auditable.",
                "Export one-page PDF for board updates."
            ],
            commonQuestions: [
                {
                    q: "Which KPIs matter most right now?",
                    a: "Clients served, billed revenue by line, DSO trend, and bed occupancy. Add denial rate for inpatient authorisations."
                },
                {
                    q: "How do we avoid double counting?",
                    a: "Use unique client IDs and a single source of truth per data point (admissions vs. finance)."
                }
            ]
        },
        "P2-M6": {
            title: "Pilot Review",
            simpleExplanation: "Run a retrospective on clinical results, attendance, billing flow, and referrals. Capture changes to SOPs and pricing before full rollout.",
            whatYouNeed: [
                "🧾 Attendance + outcomes summary",
                "💡 List of friction points (clinical + admin + billing)",
                "📈 Pilot financials vs. target",
                "🗒️ Proposed changes (SOP/pricing/scheduling)"
            ],
            tips: [
                "Keep the meeting to 60–90 minutes; decide, don't debate.",
                "Categorise issues: must-fix now vs. monitor later.",
                "Assign owners and deadlines on the spot.",
                "Share a one-page 'What changes from Monday' to all staff."
            ],
            commonQuestions: [
                {
                    q: "What if we missed targets?",
                    a: "Adjust inputs (group size, schedule, pricing, referral tactics) and set a 30-day recheck—don't scrap the model."
                },
                {
                    q: "Who signs off changes?",
                    a: "Clinical/Finance leads sign off their domains; CEO approves any policy or tariff shifts."
                }
            ]
        },
        "P3-M1": {
            title: "Adolescent Outpatient Launch",
            simpleExplanation: "Start the first full adolescent outpatient (OP) programme with real learners and their families. This is the first proper 'youth track' in the new Stabilis model, so we need it safe, structured, and do-able for schools and parents.",
            whatYouNeed: [
                "🏫 Confirmed list of learners for Cohort 1 (with referral source noted)",
                "👪 Signed parent/guardian consent + safeguarding forms",
                "📅 Final youth programme timetable (sessions + family slots)",
                "📂 Youth-specific group materials (age-appropriate, non-lecturing)",
                "📞 Clear contact channel for parents and schools (phone/WhatsApp/email)"
            ],
            tips: [
                "Keep the first cohort slightly smaller (8–10 learners) so the team can learn and refine.",
                "Communicate expectations clearly to parents: time, transport, participation.",
                "Use simple, visual tools with adolescents – less talking AT them, more activities.",
                "Schedule a midpoint check-in with each family to keep them engaged and informed."
            ],
            commonQuestions: [
                {
                    q: "What if a learner starts missing sessions early?",
                    a: "Contact the parent quickly (after the first no-show), explore barriers (transport, fear, schedule), and offer one reasonable adjustment. Don't let it drift for 3–4 missed sessions."
                },
                {
                    q: "How do we handle high-risk teens in the group?",
                    a: "Flag them privately to the Clinical Manager, adjust their individual care plan, and consider extra 1:1 support. If risk is very high, discuss stepping them up to a different level of care."
                },
                {
                    q: "Do schools get feedback on progress?",
                    a: "Yes, but only with proper consent and at a summary level. Agree upfront what will be shared, in what format, and how often."
                }
            ]
        },
        "P3-M2": {
            title: "Aftercare Launch",
            simpleExplanation: "Switch on the new structured aftercare service for adults who completed treatment. The goal is simple: keep people connected, reduce relapse risk, and create a predictable, stable stream of follow-up work.",
            whatYouNeed: [
                "🗓️ 6-month aftercare calendar (group sessions + 1:1 options)",
                "📄 Clear enrolment script for discharge planners",
                "💳 Fee structure + payment rules (e.g. monthly debit / EFT)",
                "📊 Attendance and relapse-tracking template",
                "📞 Standard follow-up procedure for missed sessions"
            ],
            tips: [
                "Enroll patients before discharge – don't wait for them to 'come back when ready'.",
                "Make aftercare practical: focus on triggers, routines, relationships, work stress.",
                "Combine group support with short, focused 1:1 check-ins for higher-risk clients.",
                "Use a simple traffic-light system (green/amber/red) to identify who needs more support."
            ],
            commonQuestions: [
                {
                    q: "How many aftercare clients should we aim for?",
                    a: "Initially aim to retain at least 50% of discharges. As systems stabilise, push higher, but protect quality over raw numbers."
                },
                {
                    q: "What if a client relapses during aftercare?",
                    a: "Do not shame or discharge them. Treat it as data: review what broke down, increase support intensity, and, if necessary, consider re-admission in a clinically sound way."
                },
                {
                    q: "Can aftercare be online?",
                    a: "Yes, especially for clients further away. Just make sure privacy, confidentiality, and tech access are properly handled."
                }
            ]
        },
        "P3-M3": {
            title: "School Outreach Pilot",
            simpleExplanation: "Deliver the first paid or contracted prevention/skills workshops in schools. This is both community service and a pipeline for future adolescent OP clients.",
            whatYouNeed: [
                "📜 Signed agreements or written confirmations with 1–2 pilot schools",
                "📚 Session plans for 3–6-part skills programme (not just one-off talks)",
                "📋 Attendance registers + short feedback forms for learners and staff",
                "📮 Simple referral pathway from school to Stabilis (with consent forms)",
                "📈 Basic log for tracking reach, engagement, and any follow-up calls"
            ],
            tips: [
                "Focus on practical skills: coping, peer pressure, decision-making — not moralising or scare tactics.",
                "Keep sessions interactive (small group discussions, scenarios, role-plays).",
                "Brief school staff beforehand so they know what you will and will not do.",
                "End every session with a clear message: how to ask for help and where to go."
            ],
            commonQuestions: [
                {
                    q: "Do we charge schools for the pilot?",
                    a: "For the very first pilot, you can discount or part-subsidise, but always frame it as a professional service with a real value and a normal price."
                },
                {
                    q: "What if a learner discloses something serious?",
                    a: "Follow the safeguarding protocol: listen, document, don't promise secrecy, and escalate to the designated safeguarding lead at the school and within Stabilis."
                },
                {
                    q: "How do we turn outreach into paying clients?",
                    a: "Make the referral route simple and visible: a short info leaflet for parents, a direct contact point at Stabilis, and clear criteria for when to refer."
                }
            ]
        },
        "P3-M4": {
            title: "Marketing Expansion",
            simpleExplanation: "Move from 'quiet clinical work' to proactive, ethical marketing. Make sure psychiatrists, psychologists, doctors, EAPs, HR managers, and churches know these programmes exist and trust referring to them.",
            whatYouNeed: [
                "📇 Updated referral brochure (inpatient, OP, adolescent, aftercare)",
                "📨 Intro email templates for professionals and HR/EAP contacts",
                "🌐 Basic, up-to-date web and social media info on new services",
                "📋 List of key referrers and organisations to target in the first 3 months"
            ],
            tips: [
                "Lead with outcomes and clarity (what you do, who it's for, how to refer), not with slogans.",
                "Make it easy for referrers: 1-page summary + a direct 'referral line' phone/email.",
                "Follow up initial contact with one short check-in call 1–2 weeks later.",
                "Show that you respect referrers' time: no spam, no emotional blackmail."
            ],
            commonQuestions: [
                {
                    q: "Is it ethical for a treatment centre to 'market' itself?",
                    a: "Yes, if done honestly, transparently, and with patient welfare first. You're telling people what help is available, not manipulating them."
                },
                {
                    q: "What marketing should we avoid?",
                    a: "Avoid promising guaranteed cures, playing on fear, or criticising other services. Don't use patient stories without consent and proper anonymisation."
                },
                {
                    q: "How do we measure if marketing works?",
                    a: "Track referral source for every new enquiry, and review monthly which channels bring actual admissions or OP enrolments."
                }
            ]
        },
        "P3-M5": {
            title: "Financial Review #1",
            simpleExplanation: "Do the first serious check: are the new services actually bringing in income at the scale and timing we planned? Use real numbers, not hopes, and adjust accordingly.",
            whatYouNeed: [
                "📊 Income by service line (inpatient, adult OP, adolescent OP, aftercare, outreach/skills) since Jan 2026",
                "📉 DSO trends and denial rates from medical aids",
                "📋 Volume data (clients per programme, completion rates)",
                "📝 Comparison to projected cash flow and targets"
            ],
            tips: [
                "Look for patterns, not just totals: which lines are growing, which are flat, which are draining admin time.",
                "Separate 'one-off' issues (e.g. a payer glitch) from structural problems (e.g. pricing too low).",
                "Don't be romantic about underperforming services; be willing to tweak or scale back.",
                "Translate the analysis into 3–5 clear decisions, not a 20-page report."
            ],
            commonQuestions: [
                {
                    q: "What if we're behind on income?",
                    a: "Identify exactly why: volume too low, pricing wrong, delays in billing, or high denial rates. Then choose 1–2 levers to pull in the next quarter (e.g. better marketing, tighter billing, adjusting fees)."
                },
                {
                    q: "Do we cut programmes if they underperform?",
                    a: "Not immediately. First try to fix referral, structure, or pricing. If after a fair trial period they still drag the system down, then consider restructuring or phasing out."
                },
                {
                    q: "How much detail does the Board need?",
                    a: "Give them a clear headline: 'On track / slightly behind / materially behind', why, and what you're changing next. They don't need every spreadsheet cell."
                }
            ]
        },
        "P3-M6": {
            title: "Governance Check",
            simpleExplanation: "Ensure the growth is clinically safe, ethically sound, and legally compliant. This is not just about money; it's about whether Stabilis is still practising what it stands for while diversifying.",
            whatYouNeed: [
                "📑 Summary of clinical outcomes + adverse incidents (if any)",
                "📄 Compliance report (licences, panels, professional registrations)",
                "📣 Patient and family feedback summary",
                "💰 High-level financial snapshot from new services",
                "📝 List of key risks and how they're being managed"
            ],
            tips: [
                "Frame the discussion around both 'mission' and 'margin' — they must hold together.",
                "Invite honest clinical input, not just financial applause.",
                "Flag any early warning signs (staff burnout, ethical discomfort, quality slips).",
                "End with clear Board decisions: priorities, boundaries, and support needed."
            ],
            commonQuestions: [
                {
                    q: "What if governance flags serious concerns?",
                    a: "Don't bury it. Document the concern, agree on corrective steps, assign owners and deadlines, and make sure it is visibly followed up at the next meeting."
                },
                {
                    q: "How often do we repeat this governance review?",
                    a: "At least annually for big-picture governance, but key indicators (complaints, incidents, financials) should be watched monthly by management."
                },
                {
                    q: "Who should be in the room?",
                    a: "CEO, Clinical Lead, Finance, at least one Board member with governance experience, and, where appropriate, a representative voice that can speak to patient perspective or community impact."
                }
            ]
        },
        "P4-M1": {
            title: "Pricing Adjustment",
            simpleExplanation: "Review what each service truly costs and adjust prices so Stabilis can sustain the growth from the rollout phase. The goal is fairness, clarity, and a stable margin.",
            whatYouNeed: [
                "📊 Cost-to-serve breakdown for each service line",
                "📈 Revenue per programme vs. original projections",
                "📄 Updated market comparison (local & national)",
                "🧾 Proposed new tariffs + justification notes"
            ],
            tips: [
                "Base pricing on real data, not fear of losing clients.",
                "Explain changes clearly to staff before announcing them externally.",
                "Adjust only what makes sense — not everything needs a price change.",
                "Test new pricing with a few trusted referrers for early feedback."
            ],
            commonQuestions: [
                {
                    q: "Will clients push back on new prices?",
                    a: "Some may, but clear communication and showing the value helps. Make sure staff know how to explain the change confidently."
                },
                {
                    q: "How often should we adjust pricing?",
                    a: "Once a year is typical, but mid-year adjustments are valid if costs shift significantly."
                }
            ]
        },
        "P4-M2": {
            title: "Medical-Aid Panel Expansion",
            simpleExplanation: "Apply to additional medical schemes so more clients can access treatment with their benefits. This strengthens cash flow and reduces financial barriers.",
            whatYouNeed: [
                "📑 Updated accreditation documents",
                "🧾 Professional registrations for clinicians",
                "📄 Updated programme descriptions",
                "📞 Contact list for scheme provider-relations teams"
            ],
            tips: [
                "Follow each scheme's exact documentation format — they differ.",
                "Track every application in one sheet with dates and contact names.",
                "Expect delays; keep weekly follow-ups polite but firm.",
                "Store all confirmations in a shared drive for easy access."
            ],
            commonQuestions: [
                {
                    q: "How long do approvals take?",
                    a: "Typically 4–12 weeks. Some schemes are much faster if documents are complete the first time."
                },
                {
                    q: "What if a scheme rejects the application?",
                    a: "Ask for the reason in writing, fix the gap, and re-apply. Rejections are often admin issues, not quality problems."
                }
            ]
        },
        "P4-M3": {
            title: "Corporate Partnerships",
            simpleExplanation: "Secure agreements with employers and EAPs for aftercare, prevention, and referral pathways. These partnerships create reliable streams of clients and community trust.",
            whatYouNeed: [
                "🏢 Short corporate pitch deck",
                "📃 One-page offer sheet (aftercare, OP, skills training)",
                "📈 Evidence and outcomes from Phase 2 & 3",
                "📞 List of HR/EAP contacts"
            ],
            tips: [
                "Lead with outcomes and reliability, not desperation.",
                "Keep the pitch short — employers want clarity, not long presentations.",
                "Show how Stabilis reduces absenteeism, improves wellbeing, and supports return-to-work.",
                "After the meeting, send a summarised follow-up within 24 hours."
            ],
            commonQuestions: [
                {
                    q: "What do corporates care about most?",
                    a: "Reliability, confidentiality, predictable pricing, and clear referral pathways. Show that you are organised and consistent."
                },
                {
                    q: "Do we need long contracts?",
                    a: "No. Start with small pilot agreements or per-employee pricing to build trust."
                }
            ]
        },
        "P4-M4": {
            title: "Quality Audit",
            simpleExplanation: "Review clinical quality, safety, and outcomes after the full rollout. Identify what's working, what's slipping, and what needs strengthening.",
            whatYouNeed: [
                "📄 Outcome data (completion rates, relapse reports, attendance)",
                "📝 Patient feedback summary",
                "📊 Incident reports + resolutions",
                "📂 Updated policies and SOPs"
            ],
            tips: [
                "Don't hide problems — they are opportunities for improvement.",
                "Focus on themes, not isolated incidents.",
                "Ask clinicians what slows them down; many quality issues start operationally.",
                "Update SOPs immediately where practice and policy diverge."
            ],
            commonQuestions: [
                {
                    q: "What if clinical staff feel defensive?",
                    a: "Frame the audit as learning, not punishment. Celebrate strengths first, then explore improvements with curiosity."
                },
                {
                    q: "Do we share audit results with staff?",
                    a: "Yes — summarise the key wins and focuses. Transparency builds trust and motivation."
                }
            ]
        },
        "P4-M5": {
            title: "Financial Review #2",
            simpleExplanation: "Re-check profitability and sustainability of every service. Decide what needs scaling, tweaking, or repositioning before 2027 planning.",
            whatYouNeed: [
                "📊 Updated revenue and DSO report",
                "📈 Costs per service line (actual vs projected)",
                "🧾 Payer trends (denials, delays, high-volume schemes)",
                "📋 Performance summary from Phase 3 & 4"
            ],
            tips: [
                "Focus on contribution margin, not vanity metrics.",
                "Note which programmes require heavy admin — these can drain real value.",
                "Highlight services that produce strong, predictable income.",
                "Convert insights into clear decisions — scale, refine, or discontinue."
            ],
            commonQuestions: [
                {
                    q: "What if a service is still financially weak?",
                    a: "Check whether the issue is volume, pricing, admin, or clinical structure. Fix the root cause before considering cuts."
                },
                {
                    q: "Should we raise prices again?",
                    a: "Only if backed by data and communicated carefully. Frequent changes cause confusion, so be strategic."
                }
            ]
        },
        "P4-M6": {
            title: "2027 Scaling Plan",
            simpleExplanation: "Build the plan for the next year of growth, based on what we've learned. This includes staffing, marketing, partnerships, and income priorities.",
            whatYouNeed: [
                "📈 Data from all 2026 income streams",
                "👥 Staffing capacity & workload reality check",
                "📊 Marketing results (channels that actually worked)",
                "📂 Risks and mitigation ideas",
                "📝 Draft plan for 2027"
            ],
            tips: [
                "Keep the plan realistic — scale only what the team can deliver well.",
                "Look at what truly worked, not what we hoped would work.",
                "Strengthen your best-performing services first before adding new ones.",
                "Use clear metrics: volume targets, revenue targets, and referral expectations."
            ],
            commonQuestions: [
                {
                    q: "What's the most important part of scaling?",
                    a: "Consistency. It's better to deliver a few services extremely well than many services poorly."
                },
                {
                    q: "Should we expand the team?",
                    a: "Only where workload data shows pressure. Hiring should follow clear demand, not optimism."
                }
            ]
        },
        "P5-M1": {
            title: "Comprehensive Impact Review",
            simpleExplanation: "Do a full assessment of the entire diversification journey. Capture what worked, what failed, who benefited, and how the financial and clinical outcomes compare to expectations.",
            whatYouNeed: [
                "📊 All programme data (inpatient, OP, adolescent, aftercare, outreach)",
                "📈 Revenue vs projections for each service line",
                "🗣️ Patient, family, and referrer feedback summaries",
                "📄 Clinical outcomes (completion, relapse trends, attendance)",
                "📝 Key lessons learned from staff"
            ],
            tips: [
                "Look for trends, not isolated incidents — patterns show real impact.",
                "Be honest about what didn't work. This phase is about learning, not blame.",
                "Highlight unexpected wins or strengths that emerged during the year.",
                "Summarise findings in simple graphs and short bullets — avoid long reports."
            ],
            commonQuestions: [
                {
                    q: "What if some programmes underperformed?",
                    a: "Capture why — poor referrals, pricing issues, operational friction — and propose a fix. Underperformance is only dangerous when ignored."
                },
                {
                    q: "Who is the audience of this review?",
                    a: "Internal leadership, Board members, funders, and partners. It should be high-level but honest."
                },
                {
                    q: "How detailed should the data be?",
                    a: "Use summary-level data but make sure detailed backup exists if the board asks."
                }
            ]
        },
        "P5-M2": {
            title: "Strategic Planning Workshop",
            simpleExplanation: "Use the findings from Phase 5-M1 to shape Stabilis' direction for 2027–2029. Set priorities, decide what to scale, and agree on what to stop.",
            whatYouNeed: [
                "📄 Summary of Phase 5-M1 insights",
                "📊 Pros/cons for each service line",
                "📈 Capacity and staffing projections",
                "💰 Financial performance trends",
                "📝 Strategic questions to guide discussion"
            ],
            tips: [
                "Limit the session to the 3–5 biggest decisions — avoid trying to fix everything.",
                "Balance mission and money: the best strategy supports both.",
                "Encourage honest debate; avoid giving in to 'we always did it this way'.",
                "End with concrete commitments: owners + timelines."
            ],
            commonQuestions: [
                {
                    q: "How do we choose what to prioritise?",
                    a: "Look at alignment with mission, financial sustainability, impact, and capacity to deliver well."
                },
                {
                    q: "Do we need a facilitator?",
                    a: "It can help, but not required. What matters is keeping the session structured and focused."
                }
            ]
        },
        "P5-M3": {
            title: "Final Report & Sustainability Plan",
            simpleExplanation: "Compile the official closing report documenting the diversification journey. This becomes the organisation's proof of progress for funders, partners, and future planning.",
            whatYouNeed: [
                "📘 Full impact review summary",
                "📊 Final financial performance (2026–2027)",
                "📈 Charts showing service growth over time",
                "🧭 Sustainability plan (staffing, marketing, partnerships)",
                "📄 Appendix: updated policies, SOPs, and key decisions"
            ],
            tips: [
                "Make the report visually clear — graphs over paragraphs.",
                "Highlight stories or quotes that show real human impact (with consent).",
                "Include the lessons learned and how they shape the next plan.",
                "Have both a 'full report' and a 2–3 page executive summary."
            ],
            commonQuestions: [
                {
                    q: "Who is the report for?",
                    a: "Board, funders, partners, accreditation bodies, and internal leadership."
                },
                {
                    q: "How long should it be?",
                    a: "Aim for 12–20 pages. Enough to show depth, not so long that nobody reads it."
                },
                {
                    q: "What makes a sustainability plan strong?",
                    a: "Clear priorities, realistic staffing, funding sources, measurable targets, and awareness of risks."
                }
            ]
        }
    },

    // Revenue calculator scenarios
    revenueScenarios: {
        optimistic: { percent: 100, label: "Full Target (100%)", amount: 6169500 },
        realistic: { percent: 85, label: "Realistic (85%)", amount: 5244075 },
        conservative: { percent: 60, label: "Conservative (60%)", amount: 3701700 },
        minimum: { percent: 40, label: "Break-even (40%)", amount: 2467800 }
    },

    // General project guidance
    generalHelp: {
        "What is this project about?": "Stabilis is growing by adding new services (adult outpatients, youth programs, aftercare). This will bring in R6.2 million in new revenue over 16 months.",

        "Why are we doing this?": "To help more patients, create more jobs, and make the organization financially stronger. Growth = stability.",

        "What's my role?": "Check the Team tab to see your specific responsibilities. Ask your manager if anything is unclear.",

        "What if I need help?": "Talk to your phase lead or project manager. Also use this AI helper - ask any question!",

        "What if something goes wrong?": "Check the Risks tab to see common problems and solutions. Report issues immediately to your lead.",

        "How do I mark a milestone complete?": "Click the checkbox next to the milestone when all tasks are done. Your manager will verify.",

        "Can I add notes to tasks?": "Yes! Click any milestone, then click 'Notes & Attachments' to add progress updates, decisions, or upload documents.",

        "What does 'progressive disclosure' mean?": "It's how this app works - click to open details, click X to close. Only see what you need, when you need it.",

        "How do I use this on my phone?": "This app works on any device. Just open the web address in your phone's browser. Bookmark it for quick access.",

        "What language can I use?": "The app is in English, but your notes can be in any language. The AI understands context even if English isn't perfect."
    }
};

// AI Copilot Functions
function showCopilot(milestoneId) {
    const guidance = copilotData.milestones[milestoneId];

    if (!guidance) {
        return `
            <div class="copilot-panel">
                <div class="copilot-header">
                    <span class="copilot-icon">🤖</span>
                    <h3>AI Copilot</h3>
                </div>
                <p>No specific guidance available for this milestone yet.</p>
                <button onclick="showGeneralHelp()" class="copilot-btn">Ask Me Anything</button>
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
            
            <button onclick="showGeneralHelp()" class="copilot-btn">Ask Me Anything</button>
        </div>
    `;
}

function showRevenueCalculator() {
    return `
        <div class="copilot-panel">
            <div class="copilot-header">
                <span class="copilot-icon">💰</span>
                <h3>Revenue Calculator</h3>
            </div>
            
            <div class="copilot-section">
                <p><strong>Project Target:</strong> R6,169,500 over 16 months</p>
                <p>Use this calculator to see what different success levels mean for your revenue:</p>
            </div>
            
            <div class="revenue-scenarios">
                ${Object.entries(copilotData.revenueScenarios).map(([key, scenario]) => `
                    <div class="scenario-card scenario-${key}">
                        <div class="scenario-percent">${scenario.percent}%</div>
                        <div class="scenario-label">${scenario.label}</div>
                        <div class="scenario-amount">R${scenario.amount.toLocaleString()}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="copilot-section">
                <h4>🧮 Custom Calculator</h4>
                <label for="custom-percent">Enter your target percentage:</label>
                <div class="calculator-input-group">
                    <input type="number" id="custom-percent" min="0" max="100" value="60" 
                           onchange="calculateCustomRevenue()" class="calculator-input">
                    <span class="calculator-symbol">%</span>
                </div>
                <div class="calculator-result" id="custom-result">
                    <strong>60% of target =</strong> R3,701,700
                </div>
            </div>
            
            <div class="copilot-section">
                <h4>📊 What This Means</h4>
                <p><strong>100%:</strong> You achieved everything! All services launched successfully.</p>
                <p><strong>85%:</strong> Very good! Most services working, minor delays or lower uptake.</p>
                <p><strong>60%:</strong> Acceptable start. Core services launched, still building momentum.</p>
                <p><strong>40%:</strong> Minimum to break even. Review strategy and address blockers urgently.</p>
            </div>
        </div>
    `;
}

function calculateCustomRevenue() {
    const percent = parseFloat(document.getElementById('custom-percent').value) || 0;
    const targetRevenue = 6169500;
    const customAmount = Math.round((percent / 100) * targetRevenue);

    document.getElementById('custom-result').innerHTML = `
        <strong>${percent}% of target =</strong> R${customAmount.toLocaleString()}
    `;
}

function showGeneralHelp() {
    const helpHTML = Object.entries(copilotData.generalHelp)
        .map(([question, answer]) => `
            <div class="copilot-qa">
                <p class="copilot-question"><strong>Q:</strong> ${question}</p>
                <p class="copilot-answer"><strong>A:</strong> ${answer}</p>
            </div>
        `).join('');

    showModal('Ask Me Anything - AI Copilot', `
        <div class="copilot-panel">
            <div class="copilot-header">
                <span class="copilot-icon">🤖</span>
                <h3>Common Questions & Answers</h3>
            </div>
            
            <div class="copilot-section">
                <p style="margin-bottom: 1.5rem;">Here are answers to common questions. Can't find what you need? Ask your team lead or project manager.</p>
                ${helpHTML}
            </div>
            
            <div class="copilot-section">
                <h4>💬 Need More Help?</h4>
                <p><strong>Project Manager:</strong> Check your project documentation</p>
                <p><strong>Technical Issues:</strong> Contact IT support</p>
                <p><strong>Clinical Questions:</strong> Ask your Clinical Lead</p>
                <p><strong>Finance Questions:</strong> Contact Finance Officer</p>
            </div>
        </div>
    `);
}

function showRevenueCalculatorModal() {
    showModal('💰 Revenue Calculator', showRevenueCalculator());
}

// Export copilotData globally for access from other scripts
window.copilotData = copilotData;

// Export functions
window.showCopilot = showCopilot;
window.showRevenueCalculator = showRevenueCalculator;
window.showRevenueCalculatorModal = showRevenueCalculatorModal;
window.showGeneralHelp = showGeneralHelp;
window.calculateCustomRevenue = calculateCustomRevenue;

// Generate Copilot button (role-based access)
function getCopilotButton(milestoneId, projectType = 'diversification') {
    const user = window.currentUser || JSON.parse(localStorage.getItem('stabilis-user') || 'null');

    if (!user) {
        return ''; // No button for non-logged-in users
    }

    // Check if user has access: admin users or milestone owners
    const hasAdminAccess = user.access === "all";
    const owners = window.milestoneOwners && window.milestoneOwners[milestoneId] || [];
    const isMilestoneOwner = owners.includes(user.name);

    if (!hasAdminAccess && !isMilestoneOwner) {
        return ''; // No access
    }

    // Check if guidance exists for this milestone
    let copilotData;
    if (projectType === 'turnaround') {
        copilotData = window.turnaroundCopilotData;
    } else if (projectType === 'wellness') {
        copilotData = window.wellnessCopilotData || window.copilotData;
    } else {
        copilotData = window.copilotData;
    }

    const hasGuidance = copilotData && copilotData.milestones && copilotData.milestones[milestoneId];
    const buttonClass = hasGuidance ? 'copilot-btn-available' : 'copilot-btn-unavailable';
    const buttonText = hasGuidance ? '🤖 AI Copilot Help' : '🤖 AI Copilot (Coming Soon)';

    return `
        <button class="copilot-toggle-btn ${buttonClass}" 
                onclick="toggleCopilot('${milestoneId}')" 
                ${!hasGuidance ? 'disabled' : ''}>
            ${buttonText}
        </button>
    `;
}

// Toggle copilot visibility
function toggleCopilot(milestoneId) {
    const copilotContent = document.getElementById(`copilot-${milestoneId}`);
    if (copilotContent) {
        const isVisible = copilotContent.style.display !== 'none';
        copilotContent.style.display = isVisible ? 'none' : 'block';

        // Update button text
        const button = event.target;
        if (button) {
            button.textContent = isVisible ? '🤖 AI Copilot Help' : '🤖 Hide Copilot';
        }
    }
}

window.getCopilotButton = getCopilotButton;
window.toggleCopilot = toggleCopilot;
