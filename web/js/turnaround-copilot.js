// AI Copilot for Turnaround Project - Contextual Help & Guidance
// Simple, clear explanations for crisis management

const turnaroundCopilotData = {
    // Milestone-specific guidance
    milestones: {
        "T1-M1": {
            title: "File Outstanding VAT Returns",
            simpleExplanation: "Submit every missed VAT return this week so SARS penalties stop and compliance is back on track.",
            whatYouNeed: [
                "📂 Invoice and receipt packs for each overdue VAT period",
                "📊 Reconciled VAT liability worksheet (current balance R313,930)",
                "🔐 SARS eFiling credentials and OTP device",
                "🧾 Submission checklist plus proof-of-filing log",
                "📨 Template update for CEO once each return is submitted"
            ],
            tips: [
                "Block two uninterrupted hours per return — partial work leads to mistakes.",
                "Use the SARS statement of account to confirm every outstanding period before you start.",
                "Upload supporting PDFs (invoices, reconciliations) before submitting the return.",
                "Capture confirmation numbers + screenshots the moment a return is accepted.",
                "Set the next VAT deadline reminder while eFiling is open so this never slips again."
            ],
            commonQuestions: [
                {
                    q: "What if source documents are missing?",
                    a: "Use bank exports + prior management accounts to estimate, then note which periods need later correction. SARS prefers an honest estimate over silence."
                },
                {
                    q: "Can we wait until cash is available?",
                    a: "No. Filing and payment are separate. File now to freeze penalties, then manage the payment via Milestone T1-M2."
                }
            ]
        },
        "T1-M2": {
            title: "SARS Payment Plan Agreement",
            simpleExplanation: "Negotiate and sign a realistic repayment arrangement for VAT + PAYE so SARS confidence returns and interest stops compounding.",
            whatYouNeed: [
                "📉 13-week cash forecast showing what you can afford monthly",
                "📑 Consolidated statement of VAT (R313,930) + PAYE (R82,273) debt",
                "☎️ SARS debt-management contact details and case/reference numbers",
                "📝 Draft proposal letter with repayment amount, date, and debit-order instructions",
                "✍️ Executive signatory ready to authorise the agreement"
            ],
            tips: [
                "Lead with numbers, not panic — show the forecast and the offer you can keep.",
                "Offer an amount you can honour every month; defaulting kills credibility.",
                "Ask for penalty relief or interest pause once you prove commitment.",
                "Set debit orders for the day after your biggest AR inflow to avoid bounced payments.",
                "Record the name, time, and escalation path for every SARS call — you will reference it later."
            ],
            commonQuestions: [
                {
                    q: "What if SARS demands more than we can pay?",
                    a: "Escalate with your written cash forecast and explain payroll risk. Offer to review after 60 days of clean payments."
                },
                {
                    q: "Do we need a tax practitioner present?",
                    a: "Not always, but bring one in immediately if SARS stops responding or threatens enforcement."
                }
            ]
        },
        "T1-M3": {
            title: "Implement Maintenance Spending Cap",
            simpleExplanation: "Drop maintenance spend from 8.1% to <=3% of revenue by freezing non-essential work and approving only safety/compliance issues.",
            whatYouNeed: [
                "🗒️ List of all maintenance contracts, invoices, and expiry dates",
                "📉 Snapshot of current monthly spend vs target R30k cap",
                "✋ CEO memo announcing the freeze + exception process",
                "🧰 Basic in-house task list (what staff can fix vs what needs contractors)",
                "📅 Tracker showing requests, approvals, and spend vs cap"
            ],
            tips: [
                "Cancel or pause any cosmetic/non-safety work today — cash first, aesthetics later.",
                "Require CEO approval for any job above R20k and document the reason.",
                "Get three quotes for necessary jobs so you know the real price point.",
                "Retrain facilities staff to handle small fixes to avoid call-out fees.",
                "Review the tracker weekly; if you bust the cap one week, cut the next."
            ],
            commonQuestions: [
                {
                    q: "What qualifies as an exception?",
                    a: "Anything tied to safety, licensing, or operations coming to a halt. Comfort upgrades do not qualify."
                },
                {
                    q: "How do we keep the facility presentable?",
                    a: "Focus on cleanliness, signage, and organisation. Those have impact without capex."
                }
            ]
        },
        "T1-M4": {
            title: "Build 13-Week Rolling Cash Forecast",
            simpleExplanation: "Create a weekly cash view (13 weeks) so leadership knows exactly when the balance dips and which levers to pull before money runs out.",
            whatYouNeed: [
                "💻 Forecast template with weekly columns for receipts and payments",
                "📅 Payroll calendar, supplier commitments, and SARS plan dates",
                "📈 AR pipeline by week (expected collections and probability)",
                "🏦 Opening cash balance per bank account",
                "📎 Standing meeting slot with CEO/Finance to review variances"
            ],
            tips: [
                "Populate last week's actuals first, then extend forward so the forecast stays grounded in reality.",
                "Flag any week that dips below zero in red and list the mitigation (delay spend, accelerate AR, investor draw).",
                "Assign one owner per data source (AR, AP, payroll) to avoid version wars.",
                "Store each week's snapshot so you can show variance vs actual later (target <10%).",
                "Add best-case and worst-case scenarios if cash is extremely tight."
            ],
            commonQuestions: [
                {
                    q: "Do we include possible donations or grants?",
                    a: "Only if they are signed and dated. Hopes do not pay bills."
                },
                {
                    q: "How often do we update the forecast?",
                    a: "Weekly, immediately after actual bank balances are confirmed."
                }
            ]
        },
        "T1-M5": {
            title: "Launch AR Collections Blitz",
            simpleExplanation: "Run a 2-4 week sprint to unlock R200k+ of stuck receivables and push DSO back to <=30 days.",
            whatYouNeed: [
                "📋 Full aged AR report highlighting >30/>60/>90 days",
                "📞 Contact list for top 20 debtors (patients + medical aids)",
                "📝 Claims rejection log with documentation gaps",
                "💬 Call scripts + escalation templates",
                "👥 Dedicated follow-up squad (finance + admin + clinical input)"
            ],
            tips: [
                "Start with invoices >90 days — they are hardest to recover later.",
                "Sit next to clinical/admin teammates so documentation fixes happen while the payer is still on the line.",
                "Offer quick-settlement discounts only if cash is received within 48 hours.",
                "Track DSO daily during the blitz so the team sees progress.",
                "Log every promise-to-pay with a due date and chase it the minute it slips."
            ],
            commonQuestions: [
                {
                    q: "What if a medical aid still delays payment?",
                    a: "Escalate to their provider relations desk with claim proof, authorisation letter, and clinical notes. Keep the CEO in copy for leverage."
                },
                {
                    q: "Do we write off very old balances?",
                    a: "Not during the blitz. Exhaust calls, resubmissions, and settlement offers before considering a write-off."
                },
                {
                    q: "How do we measure success?",
                    a: "Cash collected >=R200k within 30 days and DSO trending back to <=30 days."
                }
            ]
        },
        "T1-M6": {
            title: "Enforce Pre-Admission Deposits",
            simpleExplanation: "No admission without either a paid deposit or written medical-aid authorisation — this prevents fresh bad debt.",
            whatYouNeed: [
                "📄 Deposit policy (R10k or 50% of estimated stay) approved by CEO",
                "📝 Updated admission contract with deposit clause highlighted",
                "✅ Pre-authorisation checklist + contact directory",
                "🧾 POS/EFT proof capture process",
                "📊 Weekly compliance tracker shared with Finance"
            ],
            tips: [
                "Train admissions and clinical leads together so no one promises exceptions the policy cannot honour.",
                "Collect deposits the moment a bed is reserved, not at arrival.",
                "Use one script for referrers: \"Deposit or pre-auth before we confirm admission.\"",
                "Escalate requests for exceptions daily to the CEO/Medical Manager with data on cash impact.",
                "Report compliance every Friday so Finance can link it to cash collections."
            ],
            commonQuestions: [
                {
                    q: "What if a patient can’t pay the full deposit?",
                    a: "Offer a split (e.g., 50% upfront, balance within 48 hours) only with CEO/Medical Manager approval in writing."
                },
                {
                    q: "Do we ever waive deposits?",
                    a: "Only when a written medical-aid authorisation covers the stay. Otherwise, no deposit = no admission."
                },
                {
                    q: "Who reports compliance?",
                    a: "Admissions logs proof, Finance reconciles daily, Medical Manager escalates misses."
                }
            ]
        },
        "T1-M7": {
            title: "Freeze Headcount & Redeploy Admin",
            simpleExplanation: "Implement an immediate hiring freeze and move spare admin hours to AR, documentation, and admissions so payroll % drops without harming clinical throughput.",
            whatYouNeed: [
                "📋 Headcount + vacancies list (incl. contractors and agency staff)",
                "✋ CEO memo stating replacement hires require written approval",
                "🧠 Skills matrix showing which admins can support AR/admissions",
                "📆 Redeployment roster reallocating >=50% of admin hours to cash-linked tasks",
                "📊 Weekly utilisation + payroll % dashboard"
            ],
            tips: [
                "Communicate the freeze and redeployment reason candidly so rumours do not fill the gap.",
                "Pair redeployed admins with finance/clinical buddies for rapid upskilling.",
                "Protect clinical FTE — if someone resigns, redeploy admin support before touching clinicians.",
                "Report wins (collections closed, admissions accelerated) so the team sees the payoff.",
                "Review the roster weekly; if a redeployment is not delivering value, swap quickly."
            ],
            commonQuestions: [
                {
                    q: "What about critical clinical resignations?",
                    a: "CEO must sign off. Consider locums/contractors first so payroll stays flexible."
                },
                {
                    q: "How do we manage morale?",
                    a: "Be transparent, provide coaching, and recognise teams who keep the organisation alive."
                },
                {
                    q: "When does the freeze lift?",
                    a: "Once payroll % stabilises and cash runway exceeds 60 days — reviewed monthly by CEO."
                }
            ]
        },
        "T2-M1": {
            title: "Align Tariffs to Payer Authorizations",
            simpleExplanation: "Match lengths of stay, package pricing, and coding to what medical aids actually approve so claims pay on the first submission.",
            whatYouNeed: [
                "📑 90-day claims vs authorisations export with denial reasons",
                "📊 Length-of-stay vs funded-days analysis",
                "📘 Medical-aid tariff guides (Discovery, Momentum, Bonitas)",
                "🧮 Updated rate card + package descriptions",
                "📝 Sign-off deck for Clinical + Finance leadership"
            ],
            tips: [
                "Group offerings into standard programmes that mirror common authorisation windows (e.g., 21/28/90 days).",
                "Stop unfunded extensions unless a written motivation is approved before the limit is reached.",
                "Train clinicians on how tariff mismatches create denials so they plan discharges accordingly.",
                "Update admission/referral scripts so sales teams stop promising care the payer won’t fund.",
                "Re-run denial reports weekly for the first month to prove the fix is working."
            ],
            commonQuestions: [
                {
                    q: "What if clinical need exceeds the funded days?",
                    a: "Submit a motivation with clinical evidence before the limit, or shift patients to a self-pay agreement."
                },
                {
                    q: "Can we charge above the medical-aid guideline?",
                    a: "Only if the client signs for the top-up. Otherwise align to payer limits so claims are paid in full."
                }
            ]
        },
        "T2-M2": {
            title: "Establish Weekly AR Clinic",
            simpleExplanation: "Create a standing Monday AR war-room that clears the top 20 problem accounts every week until aging >60 days is below 15%.",
            whatYouNeed: [
                "📅 Recurring calendar invite (e.g., Monday 09:00) with mandatory attendees",
                "📄 Aged AR report segmented by >30/>60/>90 days",
                "🧑‍🤝‍🧑 Named action owners (Finance Officer, Admin Officer, Clinical Admin)",
                "📓 Tracker for commitments, documentation gaps, and due dates",
                "📞 Escalation contacts for each payer/patient"
            ],
            tips: [
                "Close out last week’s promises before adding new accounts to the list.",
                "Bring documentation (notes, auth letters) into the room so fixes happen immediately.",
                "Limit the agenda to the top 20 balances to keep the meeting fast and focused.",
                "Celebrate same-week cash wins publicly — momentum matters.",
                "Update the tracker live so nothing disappears after the meeting."
            ],
            commonQuestions: [
                {
                    q: "Who chairs the clinic?",
                    a: "Finance Officer owns the number, but Admin or CEO can chair if they keep the pace tight."
                },
                {
                    q: "What about disputes outside our control?",
                    a: "Log the dispute, assign an owner, set a next escalation date, and keep it red until resolution."
                }
            ]
        },
        "T2-M3": {
            title: "Implement 12-Month Maintenance Plan",
            simpleExplanation: "Move from reactive fixes to a planned, quarterly-capped maintenance schedule that stays within R360k for the year.",
            whatYouNeed: [
                "🧾 Facility audit with risk rating (safety/compliance vs cosmetic)",
                "📅 12-month maintenance calendar split by quarter",
                "📑 Three quotes for any job >R20k",
                "💸 Budget tracker aligned to 3% of revenue (≈R360k annual)",
                "✍️ CEO approval workflow for any over-cap request"
            ],
            tips: [
                "Schedule safety/compliance jobs first; cosmetic work only if budget remains.",
                "Bundle similar tasks to reduce contractor call-out fees.",
                "Track actual vs plan monthly and reallocate within the quarter if something slips.",
                "Keep maintenance vendors informed about the cap so expectations are set upfront.",
                "Update the facilities board weekly so everyone sees what is planned and approved."
            ],
            commonQuestions: [
                {
                    q: "What if an emergency exceeds the cap?",
                    a: "Log it as an exception, get CEO approval, and offset by delaying another job in the same quarter."
                },
                {
                    q: "Who owns the calendar?",
                    a: "Clinical Manager keeps it updated, Finance validates spend against budget."
                }
            ]
        },
        "T2-M4": {
            title: "Renegotiate Supplier Terms",
            simpleExplanation: "Segment suppliers by criticality and push for 45-day terms (or discounts for early payment) so creditor days normalise without straining relationships.",
            whatYouNeed: [
                "📊 Spend analysis ranking suppliers by annual value",
                "📞 Contact list + negotiation script for each supplier tier",
                "📗 Proposed term sheet (45 days for non-critical, structured plan for arrears)",
                "🧾 Proof of SARS payment plan to demonstrate credibility",
                "🗂️ Tracker capturing offers, agreements, and follow-up dates"
            ],
            tips: [
                "Open with transparency: share that a turnaround is underway and cash discipline protects everyone.",
                "Offer prompt-payment discounts (e.g., 2% for <14 days) only to suppliers where it truly saves money.",
                "Separate critical suppliers (medical, food, utilities) — keep them current and negotiate gently.",
                "Document every commitment immediately; handshakes are not enough in a turnaround.",
                "Monitor creditor days weekly until <=45 (ex-SARS) is sustained."
            ],
            commonQuestions: [
                {
                    q: "What if a supplier refuses new terms?",
                    a: "Escalate with CFO/CEO, offer partial upfront plus structured arrears, or switch only if quality and reliability are guaranteed."
                },
                {
                    q: "Do we share financial statements?",
                    a: "Share only what supports the negotiation (e.g., SARS plan, board-approved turnaround). Keep sensitive data controlled."
                }
            ]
        },
        "T2-M5": {
            title: "Ring-Fence Lotto Grants for Capex Only",
            simpleExplanation: "Ensure Lotto funding is used purely for approved capital items so compliance is airtight and operating expenses stay honest.",
            whatYouNeed: [
                "📂 Audit of past Lotto spend vs approved categories",
                "🏷️ Separate accounting codes/cost centres for grant-funded capex",
                "📝 Draft policy stating grants cannot cover payroll or consumables",
                "📄 Communication plan for board, finance, and project leads",
                "📈 Reporting template to update Lotto on utilisation"
            ],
            tips: [
                "Reverse any misclassified operating spend immediately and document the correction.",
                "Keep supplier invoices + proof of payment linked to the specific grant code for audit readiness.",
                "Brief every manager so no one accidentally routes OPEX through the grant line.",
                "Report quarterly even if Lotto only requires annually — transparency builds trust.",
                "Highlight compliant solar or other capex projects to reinforce that funds are being used as promised."
            ],
            commonQuestions: [
                {
                    q: "Can we temporarily cover operating costs and repay later?",
                    a: "No. That breaches grant conditions and risks clawback."
                },
                {
                    q: "How do we prove compliance?",
                    a: "Maintain a grant file with approvals, invoices, payment proofs, and photos/completion certificates for each capex item."
                }
            ]
        },
        "T2-M6": {
            title: "Establish Board Dashboard",
            simpleExplanation: "Deliver an 8-KPI dashboard (occupancy, tariff, DSO, denial rate, creditor days, payroll %, maintenance %, operating margin) for monthly board oversight.",
            whatYouNeed: [
                "📋 Final list of KPIs with definitions and data owners",
                "📊 Data connections (admissions, billing, finance, HR)",
                "📈 Dashboard template in Excel/PowerBI with traffic-light rules",
                "🟢 Threshold library (what counts as green/amber/red)",
                "📅 Board calendar slot where the dashboard will be reviewed"
            ],
            tips: [
                "Automate data pulls where possible so updates take <1 hour per month.",
                "Highlight trend lines, not just snapshots — boards care about direction.",
                "Add short commentary per KPI explaining the driver of any red flag.",
                "Store each month’s pack so you can evidence progress at the 180-day review.",
                "Circulate the dashboard 48 hours before the meeting so directors come prepared."
            ],
            commonQuestions: [
                {
                    q: "Who owns the dashboard?",
                    a: "Finance Officer curates it, but each KPI owner must certify their data monthly."
                },
                {
                    q: "What if data sources conflict?",
                    a: "Pick one authoritative source per metric and document it in the definitions. Consistency beats perfection."
                }
            ]
        },
        "T3-M1": {
            title: "Achieve 5% Operating Margin",
            simpleExplanation: "Prove the turnaround is working by sustaining >=5% operating margin for two consecutive months without emergency cuts.",
            whatYouNeed: [
                "📊 Monthly P&L with granular cost drivers",
                "📈 Cost lever tracker (payroll %, maintenance %, procurement savings)",
                "🤝 Weekly finance/CEO review slot focused on variance",
                "📌 Action log for any line item drifting below target",
                "🎉 Communication plan to recognise the team once margin holds"
            ],
            tips: [
                "Attack margin from both ends: lock in revenue discipline while keeping fixed costs flat.",
                "Translate 5% margin into rands so teams feel the stakes (e.g., R250k surplus/month).",
                "If margin dips <3%, trigger a rapid response (collections blitz, expense pause) the same week.",
                "Protect clinical throughput — cancellations eat revenue faster than cost cuts save it.",
                "Bank the win publicly once achieved to reinforce the behaviour."
            ],
            commonQuestions: [
                {
                    q: "Do once-off gains count?",
                    a: "Only if they repeat. Margin must be from sustainable operations, not asset sales."
                },
                {
                    q: "What if inflation pushes costs up mid-target?",
                    a: "Update the plan immediately and show the board which counter-measures keep margin intact."
                }
            ]
        },
        "T3-M2": {
            title: "Stabilise Investment Reserves",
            simpleExplanation: "Stop drawing down investments for at least 90 days and begin rebuilding reserves toward the R6m target.",
            whatYouNeed: [
                "💳 Latest reserve statements (opening balance R3.4m)",
                "🗂️ Register of past drawdowns with reasons",
                "📄 Draft reserve policy covering minimum balances and rebuild plan",
                "📈 Cash-flow model proving operations can fund the surplus",
                "📅 Monthly board report highlighting reserve status"
            ],
            tips: [
                "Freeze discretionary capex until operating cash flow comfortably covers it.",
                "Label any request to tap reserves as an exception requiring CEO + Board approval.",
                "Automate a monthly transfer to reserves once surplus appears so rebuilding is habitual.",
                "Track days cash on hand to show stakeholders the buffer increasing.",
                "Communicate progress to lenders/funders — confidence improves when reserves grow."
            ],
            commonQuestions: [
                {
                    q: "What if we face an emergency expense?",
                    a: "Use the forecast to cut elsewhere first; only touch reserves if governance approves and a replenishment plan exists."
                },
                {
                    q: "How do we reach the R6m target?",
                    a: "Commit a fixed rand amount (e.g., R50k/month) once margin is positive, review quarterly, and increase when possible."
                }
            ]
        },
        "T3-M3": {
            title: "Normalise Creditor Relationships",
            simpleExplanation: "Bring every supplier back to <=45 creditor days (ex-SARS) so no one is on hold and service reliability returns.",
            whatYouNeed: [
                "🧾 Aged payables report split by 30/60/90+ days",
                "📋 Priority list of suppliers over 45 days with contact owners",
                "📞 Escalation log for any account on stop-supply",
                "📝 Standard repayment-plan template",
                "📈 Creditor days dashboard shared weekly"
            ],
            tips: [
                "Clear the worst accounts first — anything >90 days needs a plan today.",
                "Keep critical suppliers current even if it means delaying lower-tier vendors.",
                "Send reconciliations monthly so statements and ledgers match (prevents disputes).",
                "Tie payment promises to the 13-week forecast so Finance knows cash impact.",
                "Log compliments/escalations to prove improvement to the board."
            ],
            commonQuestions: [
                {
                    q: "How do we handle suppliers still in arrears after a plan?",
                    a: "Review volume, renegotiate terms, or replace only if a vetted alternative exists — and inform the board first."
                },
                {
                    q: "Do SARS balances count in creditor days?",
                    a: "Track separately. The payment plan sits under T1-M2; creditor days should exclude SARS to show true supplier health."
                }
            ]
        },
        "T3-M4": {
            title: "Embed Payer-Aligned Care Pathways",
            simpleExplanation: "Standardise treatment plans (21/28/90 days) to match funder authorisations so denials drop and revenue becomes predictable.",
            whatYouNeed: [
                "📚 Clinical pathway templates mapped to funder rules",
                "🧑‍⚕️ Training pack for clinicians on length-of-stay discipline",
                "📄 Extension justification template for exceptions",
                "📊 Dashboard showing planned vs actual length of stay",
                "📝 Readmission + outcome tracker to monitor quality"
            ],
            tips: [
                "Review every new admission against the pathway during MDT so expectations are set on day one.",
                "If care must extend, motivate before the funded day count ends.",
                "Hold weekly variance reviews: why did a patient stay longer and who approved it?",
                "Share payer feedback with the clinical team so they understand how documentation drives authorisation.",
                "Link pathway compliance to denial-rate KPIs to show financial impact."
            ],
            commonQuestions: [
                {
                    q: "What if a clinician insists on longer stays for clinical reasons?",
                    a: "Support them with a documented motivation and ensure Finance knows about the pending cost before approval."
                },
                {
                    q: "How do we keep care person-centred if pathways are standardised?",
                    a: "Use the pathway as the baseline, then document justified variances per patient with explicit approvals."
                }
            ]
        },
        "T3-M5": {
            title: "Complete 180-Day Turnaround Review",
            simpleExplanation: "Compile the six-month results, prove controls are embedded, and secure board approval that the turnaround is complete.",
            whatYouNeed: [
                "📊 KPI pack covering margin, cash, reserves, AR, creditors, compliance",
                "📁 Evidence files (SARS plan status, supplier letters, audit trails)",
                "📝 Board presentation + narrative highlighting lessons learned",
                "📅 Agenda + minutes template for the review meeting",
                "🎖️ Recognition plan acknowledging teams that delivered the turnaround"
            ],
            tips: [
                "Tell the story in three chapters: crisis, actions, proof of stability.",
                "Show before/after visuals for each KPI — boards love clear comparisons.",
                "Document which controls continue post-turnaround (cash forecast cadence, AR clinic, dashboard).",
                "Highlight remaining risks honestly with mitigation owners.",
                "Use the meeting to agree on BAU governance (monthly KPI reviews, quarterly audits)."
            ],
            commonQuestions: [
                {
                    q: "What if some KPIs are still amber?",
                    a: "Explain the plan, timeline, and owner. The goal is transparency with credible next steps."
                },
                {
                    q: "Who signs off that the turnaround is complete?",
                    a: "The Board/Steering Committee does, based on evidence presented and agreement that controls are embedded."
                }
            ]
        }
    },

    // Revenue/Financial calculator
    financialScenarios: {
        currentState: {
            label: "Current Crisis",
            operatingMargin: -15.5,
            monthlyBurnRate: 250000,
            cashRunway: "2-3 months"
        },
        stabilized: {
            label: "Stabilized (90 days)",
            operatingMargin: -5,
            monthlyBurnRate: 100000,
            cashRunway: "6+ months"
        },
        breakeven: {
            label: "Break-even (180 days)",
            operatingMargin: 0,
            monthlyBurnRate: 0,
            cashRunway: "Sustainable"
        },
        target: {
            label: "Target State",
            operatingMargin: 5,
            monthlyBurnRate: -50000,
            cashRunway: "Building reserves"
        }
    },

    // General guidance for turnaround
    generalHelp: {
        "What is a turnaround project?": "A turnaround is an emergency rescue plan. Your organization is losing money fast. This plan stops the bleeding and gets you back to financial health in 180 days.",

        "Why 180 days?": "That's how long your cash reserves will last if nothing changes. We must fix this before the money runs out.",

        "What if we don't do this?": "Without this plan: SARS could close you down, suppliers will stop delivering, staff won't get paid. This is survival.",

        "Who is responsible?": "Everyone. This is an all-hands crisis. Check your role in the Team tab. Ask if unclear.",

        "What does 'operating margin' mean?": "Simple: Are you making or losing money? Negative = losing money each month. We need to get to positive (making money).",

        "What is DSO?": "Days Sales Outstanding - how long it takes to collect payment after treatment. Lower is better. 28 days means patients pay within a month.",

        "What are 'creditor days'?": "How long you take to pay suppliers. We need to get this to 45 days - pay on time but not too early (you need the cash!).",

        "Why focus on pre-admission deposits?": "Cash up front = guaranteed payment. No deposit = risk of non-payment. In a crisis, you can't afford bad debts.",

        "Can I add my own milestones?": "Yes, but talk to project manager first. Don't distract from the critical path - every day counts.",

        "What if I see a problem?": "Report it IMMEDIATELY to your phase lead. In a turnaround, small problems become disasters if ignored."
    }
};

// Turnaround-specific functions
function showTurnaroundCopilot(milestoneId) {
    const guidance = turnaroundCopilotData.milestones[milestoneId];

    if (!guidance) {
        return `
            <div class="copilot-panel">
                <div class="copilot-header">
                    <span class="copilot-icon">🤖</span>
                    <h3>AI Copilot</h3>
                </div>
                <p>No specific guidance available for this milestone yet.</p>
                <button onclick="showTurnaroundGeneralHelp()" class="copilot-btn">Ask Me Anything</button>
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
                <h4>⚡ Quick Summary</h4>
                <p class="copilot-simple">${guidance.simpleExplanation}</p>
            </div>
            
            <div class="copilot-section">
                <h4>✅ What You Need</h4>
                <ul class="copilot-list">
                    ${guidance.whatYouNeed.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            
            <div class="copilot-section">
                <h4>💡 Action Steps</h4>
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
            
            <button onclick="showTurnaroundGeneralHelp()" class="copilot-btn">Ask Me Anything</button>
        </div>
    `;
}

function showFinancialCalculator() {
    return `
        <div class="copilot-panel">
            <div class="copilot-header">
                <span class="copilot-icon">📊</span>
                <h3>Financial Health Calculator</h3>
            </div>
            
            <div class="copilot-section">
                <p><strong>Track your progress from crisis to stability:</strong></p>
            </div>
            
            <div class="revenue-scenarios">
                ${Object.entries(turnaroundCopilotData.financialScenarios).map(([key, scenario]) => `
                    <div class="scenario-card scenario-${key}">
                        <div class="scenario-label">${scenario.label}</div>
                        <div class="scenario-metric">
                            <span class="metric-label">Operating Margin:</span>
                            <span class="metric-value ${scenario.operatingMargin < 0 ? 'negative' : 'positive'}">
                                ${scenario.operatingMargin}%
                            </span>
                        </div>
                        <div class="scenario-detail">Cash Runway: ${scenario.cashRunway}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="copilot-section">
                <h4>📈 What These Numbers Mean</h4>
                <p><strong>Operating Margin:</strong> Negative = losing money. Zero = break-even. Positive = making profit.</p>
                <p><strong>Cash Runway:</strong> How long until you run out of money if nothing changes.</p>
                <p><strong>Monthly Burn Rate:</strong> How much cash you're losing (or gaining) each month.</p>
            </div>
            
            <div class="copilot-section">
                <h4>🎯 Your Goal</h4>
                <p>Get to <strong>5% operating margin</strong> within 180 days. That means the facility is financially healthy and building reserves.</p>
            </div>
        </div>
    `;
}

function showTurnaroundGeneralHelp() {
    const helpHTML = Object.entries(turnaroundCopilotData.generalHelp)
        .map(([question, answer]) => `
            <div class="copilot-qa">
                <p class="copilot-question"><strong>Q:</strong> ${question}</p>
                <p class="copilot-answer"><strong>A:</strong> ${answer}</p>
            </div>
        `).join('');

    showModal('Crisis Management Help - AI Copilot', `
        <div class="copilot-panel">
            <div class="copilot-header">
                <span class="copilot-icon">🤖</span>
                <h3>Turnaround Project - Common Questions</h3>
            </div>
            
            <div class="copilot-section">
                <p style="margin-bottom: 1.5rem;"><strong>⚠️ This is a crisis.</strong> These answers are direct and urgent. Ask your team lead immediately if something is unclear.</p>
                ${helpHTML}
            </div>
            
            <div class="copilot-section">
                <h4>🆘 Emergency Contacts</h4>
                <p><strong>Financial Crisis:</strong> Finance Officer + CEO immediately</p>
                <p><strong>SARS Issues:</strong> Escalate to tax practitioner/attorney</p>
                <p><strong>Staff Concerns:</strong> Clinical Manager or HR</p>
                <p><strong>Supplier Problems:</strong> Admin Coordinator + Finance Officer</p>
            </div>
        </div>
    `);
}

function showFinancialCalculatorModal() {
    showModal('📊 Financial Health Tracker', showFinancialCalculator());
}

// Export functions
window.turnaroundCopilotData = turnaroundCopilotData;
window.showTurnaroundCopilot = showTurnaroundCopilot;
window.showFinancialCalculator = showFinancialCalculator;
window.showFinancialCalculatorModal = showFinancialCalculatorModal;
window.showTurnaroundGeneralHelp = showTurnaroundGeneralHelp;
