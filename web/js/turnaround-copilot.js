// AI Copilot for Turnaround Project - Contextual Help & Guidance
// Simple, clear explanations for crisis management

const turnaroundCopilotData = {
    // Milestone-specific guidance
    milestones: {
        "T1-M1": {
            title: "File VAT Returns",
            simpleExplanation: "Submit your VAT paperwork to SARS immediately. This is urgent - you owe money and penalties are adding up daily.",
            whatYouNeed: [
                "📋 All invoices from the period",
                "💰 Bank statements showing VAT collected",
                "📝 VAT calculation worksheet",
                "🔐 SARS eFiling login credentials",
                "☎️ SARS contact number if you need help"
            ],
            tips: [
                "Do this TODAY - every day late = more penalties",
                "If you don't know how, hire a bookkeeper or accountant NOW",
                "Keep proof that you submitted (confirmation email/reference number)",
                "Set a reminder for next VAT deadline - don't let this happen again"
            ],
            commonQuestions: [
                {
                    q: "What if I don't have all the paperwork?",
                    a: "File your best estimate based on what you have. It's better to file something than nothing. You can amend later."
                },
                {
                    q: "Can I pay the VAT later?",
                    a: "You must FILE now. Then negotiate a payment plan with SARS (see Milestone T1-M2)."
                }
            ]
        },
        "T1-M2": {
            title: "SARS Payment Plan",
            simpleExplanation: "Arrange monthly payments with SARS so they don't shut you down. This stops the debt from getting worse.",
            whatYouNeed: [
                "📊 Cash flow forecast showing what you can afford monthly",
                "📋 List of all SARS debts (VAT, PAYE, penalties)",
                "📞 SARS debt management contact details",
                "📝 Written payment plan proposal",
                "🤝 Senior manager to sign agreements"
            ],
            tips: [
                "Be realistic - don't promise payments you can't afford",
                "SARS prefers smaller, consistent payments over big promises",
                "Get everything in writing - emails, reference numbers",
                "Stick to the plan - missing payments makes things worse",
                "Set up debit orders so you don't forget"
            ],
            commonQuestions: [
                {
                    q: "What if SARS refuses the payment plan?",
                    a: "Escalate to a tax practitioner or attorney. SARS must be reasonable if you're making genuine efforts."
                },
                {
                    q: "How long can we stretch the payments?",
                    a: "SARS typically allows 6-12 months, sometimes up to 24 months for genuine hardship."
                }
            ]
        },
        "T1-M5": {
            title: "Launch AR Collections Blitz",
            simpleExplanation: "'AR' means Accounts Receivable - the money owed to you by clients, patients, or medical aids for services already delivered. This is a 2-4 week intensive campaign to collect outstanding debts and free up cash flow.",
            whatYouNeed: [
                "📋 List of all outstanding invoices (who owes what)",
                "📞 Contact details for medical aids and patients",
                "💰 Aging report (30 days, 60 days, 90+ days overdue)",
                "📝 Claims rejected or pending with documentation gaps",
                "👥 Team dedicated to making calls and following up"
            ],
            tips: [
                "Focus on oldest debts first (90+ days) - these are hardest to collect later",
                "Call medical aids daily - don't wait for them to pay",
                "Identify rejected claims and resubmit with correct documentation",
                "Offer payment plans to patients who can't pay in full",
                "Track DSO (Days Sales Outstanding) - goal is to shorten it",
                "Document every call, email, and promise - follow up relentlessly"
            ],
            commonQuestions: [
                {
                    q: "What is DSO and why does it matter?",
                    a: "DSO = Days Sales Outstanding. It's how long it takes to get paid after providing service. Lower is better. If DSO is 60 days, you're waiting 2 months for your money - that kills cash flow!"
                },
                {
                    q: "What if medical aids won't pay?",
                    a: "1) Check if claim was submitted correctly. 2) Verify patient had active cover. 3) Escalate to medical aid's dispute department. 4) Get everything in writing."
                },
                {
                    q: "Should we write off old debts?",
                    a: "Not yet! During the blitz, try everything. Only write off after exhausting all options. Even 50% of an old debt is better than zero."
                }
            ]
        },
        "T1-M3": {
            title: "Maintenance Cap at 3%",
            simpleExplanation: "Stop spending 8.1% on maintenance - limit it to 3% immediately. This frees up cash you desperately need.",
            whatYouNeed: [
                "📋 List of all maintenance contracts",
                "💰 What you're paying each contractor monthly",
                "🔧 Urgent repairs vs nice-to-have repairs list",
                "📝 New maintenance policy document",
                "👥 Staff to handle basic fixes in-house"
            ],
            tips: [
                "Cancel non-essential contracts TODAY",
                "Train staff to do basic maintenance (changing lightbulbs, minor fixes)",
                "Create approval process - director must sign off on all maintenance over R500",
                "Negotiate better rates with remaining contractors",
                "Only fix what's broken - postpone upgrades and cosmetic work"
            ],
            commonQuestions: [
                {
                    q: "What if something breaks?",
                    a: "Fix critical safety issues immediately. Everything else waits unless it stops operations."
                },
                {
                    q: "Won't this make the facility look bad?",
                    a: "Clean and organized beats expensive and bankrupt. Focus on cleanliness, not fancy repairs."
                }
            ]
        },
        "T1-M4": {
            title: "Cash Position & Burn Rate Diagnosis",
            simpleExplanation: "Get a brutally honest picture of how much cash Stabilis has, how long it will last, and which expenses are burning through money the fastest. No guesses. No smoothing. Pure reality.",
            whatYouNeed: [
                "💰 Bank balances across all accounts",
                "🧾 List of all scheduled payments for next 60 days",
                "📉 Age analysis for money owed TO Stabilis (AR)",
                "📊 Last 3 months' actual expenses (not budgeted)",
                "📅 Payroll details + dates"
            ],
            tips: [
                "Use actuals, not budget projections — budgets lie, statements don't.",
                "Sort expenses by size — the top 5 usually explain 80% of the burn.",
                "Flag all non-essential spending for immediate pause.",
                "Report cash runway as: *days to zero* — executives understand that instantly."
            ],
            commonQuestions: [
                {
                    q: "What if the cash position looks worse than expected?",
                    a: "Then we face it early. Turnaround fails when teams soften the numbers. The earlier we know the truth, the faster we can act."
                },
                {
                    q: "Should we include expected donations or subsidies?",
                    a: "Only if already approved in writing. Hopes and promises are not cash."
                }
            ]
        },
        "T1-M6": {
            title: "Emergency Expense Controls",
            simpleExplanation: "Freeze or slow non-essential spending immediately. The goal is simple: stop the bleeding long enough to stabilise operations and buy time for the turnaround plan.",
            whatYouNeed: [
                "📄 Prioritised expense list (essential vs optional)",
                "🛑 Freeze/hold list for immediate implementation",
                "📧 Template message to staff and suppliers explaining temporary measures",
                "📊 Weekly review process to monitor spending"
            ],
            tips: [
                "Cut quickly but not blindly — protect clinical quality and compliance.",
                "Communicate clearly so staff don't panic or guess where cuts are happening.",
                "Review supplier contracts — many are negotiable.",
                "Shift payments, don't avoid them — preserve long-term credibility."
            ],
            commonQuestions: [
                {
                    q: "What counts as essential?",
                    a: "Payroll, food, utilities, medical supplies, transport for clients, and regulatory obligations. Everything else is negotiable or deferrable."
                },
                {
                    q: "How long should controls stay in place?",
                    a: "Until Phase 3 of the turnaround shows stable cash flow. Usually 3–6 months."
                }
            ]
        },
        "T1-M7": {
            title: "AR Collections Blitz",
            simpleExplanation: "Aggressively collect all money owed to Stabilis. This is not routine admin — it's a concentrated sprint to pull cash into the organisation fast.",
            whatYouNeed: [
                "📋 Full AR age analysis (sorted oldest → newest)",
                "📞 Contact list for all overdue accounts (people, numbers, scheme reps)",
                "🧾 Script for follow-up calls and emails",
                "📈 Daily tracking sheet for promises-to-pay and receipts"
            ],
            tips: [
                "Start with the largest overdue amounts — big wins first.",
                "Call before emailing. Calls move money; emails rarely do.",
                "Escalate medical-aid claim denials within 24 hours.",
                "Log every interaction — it prevents duplication and confusion."
            ],
            commonQuestions: [
                {
                    q: "How aggressive is 'aggressive'?",
                    a: "Professional but persistent. Daily follow-ups, same-day responses, clear deadlines, and no silent periods."
                },
                {
                    q: "What if we can't collect everything?",
                    a: "You won't. Aim to recover 60–70% of overdue AR during a blitz. Anything above that is exceptional."
                },
                {
                    q: "Should we offer settlements?",
                    a: "Only if approved by CEO/Finance and only for very old or doubtful debts."
                }
            ]
        },
        "T2-M1": {
            title: "Fix Admissions Workflow",
            simpleExplanation: "Tighten every step of admissions so clients move from enquiry to admission smoothly, with correct documents and pre-authorisations ready. No delays, no confusion.",
            whatYouNeed: [
                "📋 Updated admissions SOP",
                "🧾 Pre-auth + deposit checklist",
                "📞 Referral response script",
                "📮 One shared admissions email/WhatsApp line"
            ],
            tips: [
                "Respond to enquiries within 1 hour during work hours.",
                "Use one clear script for every referrer.",
                "Pre-auth before arrival — not after.",
                "Document every step. Errors cost money."
            ],
            commonQuestions: [
                {
                    q: "What if families arrive without documents?",
                    a: "Have a 'missing documents' pack ready. Complete it immediately before admission."
                },
                {
                    q: "Should we accept walk-ins?",
                    a: "Yes only if clinically safe and a deposit/pre-auth can be secured immediately."
                }
            ]
        },
        "T2-M2": {
            title: "Fix Billing Workflow",
            simpleExplanation: "Make billing clean, fast, and accurate. Every session, every day, every claim must be captured correctly the first time to prevent denials.",
            whatYouNeed: [
                "🧾 Billing SOP (updated)",
                "📊 Daily billing tracker",
                "📞 Medical-aid escalation list",
                "🗂️ Folder structure for claims + notes"
            ],
            tips: [
                "Bill daily — never weekly or monthly.",
                "Match case notes to claims the same day.",
                "Fix denials within 24 hours.",
                "Double-check ICD-10 and procedure codes for consistency."
            ],
            commonQuestions: [
                {
                    q: "What causes most denials?",
                    a: "Missing notes, expired authorisations, incorrect coding, or late submissions."
                },
                {
                    q: "How fast must we resubmit?",
                    a: "Within 24 hours. Speed directly affects cash flow."
                }
            ]
        },
        "T2-M3": {
            title: "Fix Clinical Scheduling",
            simpleExplanation: "Stabilise group and 1:1 schedules so staff, clients, and admissions all know exactly what happens when. No more cancelled groups or last-minute reshuffles.",
            whatYouNeed: [
                "📅 Master timetable for all programmes",
                "🧑‍⚕️ Staff roster with backups",
                "📄 Group size limits per programme",
                "📞 Communication plan for schedule changes"
            ],
            tips: [
                "Plan one month ahead, review weekly.",
                "If one clinician is absent, have a backup ready.",
                "Lock session times — consistency builds trust.",
                "Avoid overlapping groups for the same staff member."
            ],
            commonQuestions: [
                {
                    q: "What if a clinician is suddenly unavailable?",
                    a: "Use pre-assigned backups. Never cancel unless clinically necessary."
                },
                {
                    q: "How many clients per group?",
                    a: "8–12 for adult OP; 8–10 for youth; inpatient per-unit standards."
                }
            ]
        },
        "T2-M4": {
            title: "Fix Cash-Handling Rules",
            simpleExplanation: "Put strict controls on deposits, receipts, and how money is moved. Cash leaks destroy turnarounds — this closes the gaps.",
            whatYouNeed: [
                "💳 Updated deposit policy",
                "🧾 Receipt books or POS logs",
                "📄 Bank reconciliation template",
                "📝 Staff training notes"
            ],
            tips: [
                "All payments receipted immediately — no exceptions.",
                "Daily banking before 14:00.",
                "Two-person oversight on cash counts.",
                "Never mix personal and organisational payments."
            ],
            commonQuestions: [
                {
                    q: "Can staff handle client cash?",
                    a: "Only designated staff trained in the procedure. Others must not accept payments."
                },
                {
                    q: "When do we issue refunds?",
                    a: "Only after Finance signs off, and only via EFT — never cash."
                }
            ]
        },
        "T2-M5": {
            title: "Clinical Quality Triage",
            simpleExplanation: "Identify immediate clinical risks and fix the most urgent ones first. This is not a full audit — it is a triage to stabilise care quickly.",
            whatYouNeed: [
                "📄 Incident + complaints summary (last 3 months)",
                "📊 Attendance + completion trends",
                "🧠 Staff feedback on pressure points",
                "📝 List of urgent clinical risks"
            ],
            tips: [
                "Handle the top 3 risks first — don't try to fix everything at once.",
                "Look for patterns causing harm or burnout.",
                "Correct unsafe practices immediately and document it.",
                "Communicate fixes to the team so everyone feels safer."
            ],
            commonQuestions: [
                {
                    q: "What if clinicians resist changes?",
                    a: "Keep it about safety and stability. Changes are temporary until the system strengthens."
                },
                {
                    q: "Do we involve the Board?",
                    a: "Only for major clinical risk issues. Keep daily triage inside the clinical leadership."
                }
            ]
        },
        "T2-M6": {
            title: "Staff Communication Reset",
            simpleExplanation: "Reset how the team communicates: clear updates, clear decisions, and no mixed messages. Stabilisation requires honesty, consistency, and structure.",
            whatYouNeed: [
                "📢 Weekly staff update format",
                "📆 Set meeting rhythms (daily huddles, weekly ops, monthly review)",
                "📄 One source-of-truth message channel",
                "🗣️ Space for staff questions/concerns"
            ],
            tips: [
                "Communicate early — silence creates panic.",
                "Keep updates short and factual.",
                "End every meeting with who-does-what-by-when.",
                "Model the behaviour you want: clarity, calm, and accountability."
            ],
            commonQuestions: [
                {
                    q: "How honest should we be about financial strain?",
                    a: "Honest, but not alarmist. Staff need clarity without feeling doomed."
                },
                {
                    q: "How do we reduce gossip and misinformation?",
                    a: "Provide one official update channel and discourage parallel message groups."
                }
            ]
        },
        "T3-M1": {
            title: "Rebuild Referral Pathways",
            simpleExplanation: "Reconnect with key referrers (hospitals, psychiatrists, psychologists, EAPs, schools) with a clear message that Stabilis is stabilised, structured, and ready for predictable admissions again.",
            whatYouNeed: [
                "📇 Updated referral brochure + programme summaries",
                "📞 Contact list of top referrers (priority tiering)",
                "📨 Email + WhatsApp templates for re-introduction",
                "📋 Tracking sheet for referrals, responses, and follow-ups"
            ],
            tips: [
                "Lead with clarity: what we offer, who we help, how to refer.",
                "Be consistent — one voice, one message, across all communication.",
                "Follow-up 7–10 days after initial outreach.",
                "Request referral feedback so you can fix friction points quickly."
            ],
            commonQuestions: [
                {
                    q: "What if referrers say they 'stopped referring'?",
                    a: "Acknowledge past gaps, explain what is now fixed, and offer a direct point-of-contact to rebuild trust."
                },
                {
                    q: "How do we measure success?",
                    a: "Track: new enquiries, referral source accuracy, and conversion-to-admission rate."
                }
            ]
        },
        "T3-M2": {
            title: "Stabilise Staffing & Rotas",
            simpleExplanation: "Lock down a fair, predictable, and sustainable staffing schedule. No chaos, no last-minute swaps, no burnout spirals.",
            whatYouNeed: [
                "📅 Master rota (3-month horizon)",
                "🧑‍⚕️ Clear clinical coverage per programme",
                "📄 Backup clinician plan for sickness/leave",
                "📢 Communication plan for rota updates"
            ],
            tips: [
                "Review workloads weekly to catch early signs of burnout.",
                "Keep rotas visible and central — no private versions.",
                "Make sure every programme has a backup clinician identified.",
                "Normalise early communication: staff should flag issues as soon as they know."
            ],
            commonQuestions: [
                {
                    q: "What if someone frequently calls in sick?",
                    a: "Document patterns, have a supportive conversation, and update workload or support as needed. Escalate only if patterns persist."
                },
                {
                    q: "How far ahead must rotas be published?",
                    a: "At least 30 days — stability requires predictability."
                }
            ]
        },
        "T3-M3": {
            title: "Fix Documentation & Case Notes",
            simpleExplanation: "Standardise clinical documentation so billing, audits, and continuity of care run without chaos. Documentation errors are a major source of denials — this fixes that leak.",
            whatYouNeed: [
                "📄 Standard templates for group notes, 1:1 notes, and assessments",
                "🧾 Quick-check rules for medical-aid compliance",
                "📚 Refresher training session for all clinicians",
                "📊 Weekly documentation completeness audit"
            ],
            tips: [
                "Document the same day as the session — not later.",
                "Use short, clear, structured notes; avoid long narratives.",
                "Double-check ICD-10 codes and authorisation notes.",
                "Reward consistency — highlight clinicians who keep clean records."
            ],
            commonQuestions: [
                {
                    q: "What if a clinician's notes are always late?",
                    a: "Start with coaching, then set clear expectations with deadlines. Escalate only if the risk continues."
                },
                {
                    q: "How long should notes be?",
                    a: "Short, factual, structured — enough to show clinical reasoning and justify billing, nothing more."
                }
            ]
        },
        "T3-M4": {
            title: "Fix Reporting & KPI Dashboard",
            simpleExplanation: "Create one central dashboard showing the real health of operations: occupancy, DSO, revenue, referrals, completion rates. No more guessing. One source of truth.",
            whatYouNeed: [
                "📊 KPI definitions (occupancy, DSO, AR, programme volumes)",
                "🔗 Data feeds from admissions, billing, and clinical teams",
                "📈 Dashboard template (Excel/BI tool)",
                "📅 Weekly snapshot cycle (same time, same day)"
            ],
            tips: [
                "Keep KPIs few and meaningful — don't drown in numbers.",
                "Use traffic-light colours so issues stand out instantly.",
                "Discuss the dashboard in weekly ops — not once a month.",
                "Protect data accuracy: one owner per KPI."
            ],
            commonQuestions: [
                {
                    q: "Who updates the dashboard?",
                    a: "Preferably Finance/IT — the team closest to numbers. Clinicians contribute data but do not maintain the dashboard."
                },
                {
                    q: "What if data sources conflict?",
                    a: "Choose one primary system per metric and standardise immediately."
                }
            ]
        },
        "T3-M5": {
            title: "Stabilise Supplier & Contract Management",
            simpleExplanation: "Rebuild trust and structure with suppliers. Clear terms, predictable payments, no surprises. This protects operations and reputation.",
            whatYouNeed: [
                "📄 List of all active suppliers + contracts",
                "🧾 Priority ranking (critical → non-critical)",
                "📅 Payment plan for arrears",
                "📨 Supplier communication templates"
            ],
            tips: [
                "Be honest: 'We're in turnaround, here's the plan, here's the payment schedule.'",
                "Pay critical suppliers first (food, medical supplies, utilities).",
                "Renegotiate where possible — many suppliers accept structured repayment.",
                "Review contracts annually to avoid creeping costs."
            ],
            commonQuestions: [
                {
                    q: "What if a supplier threatens to stop service?",
                    a: "Escalate immediately. Negotiate a partial payment and a structured plan. Keep clinical operations protected at all costs."
                },
                {
                    q: "Should we switch suppliers?",
                    a: "Only if the alternative is reliable, affordable, and clinically safe. Don't swap cheaply and risk quality."
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
window.showTurnaroundCopilot = showTurnaroundCopilot;
window.showFinancialCalculator = showFinancialCalculator;
window.showFinancialCalculatorModal = showFinancialCalculatorModal;
window.showTurnaroundGeneralHelp = showTurnaroundGeneralHelp;
