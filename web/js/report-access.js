(function () {
    const DEFAULT_EDITABLE_SELECTORS = [
        '.report-header',
        '.stat-card',
        '.report-section',
        '.project-card',
        '.milestone-item',
        '.roi-card',
        '.investment-card',
        '.summary-item',
        '.key-insights',
        '.report-note'
    ];
    let stylesInjected = false;
    let authStarted = false;
    let editMode = false;
    let handledAutoAction = false;

    function injectStyles() {
        if (stylesInjected) return;
        const style = document.createElement('style');
        style.textContent = `
            .report-action-bar {
                position: sticky;
                top: 0;
                z-index: 50;
                background: #0f172a;
                color: #f8fafc;
                padding: 0.75rem 1.25rem;
                border-radius: 0 0 1rem 1rem;
                box-shadow: 0 10px 25px rgba(15, 23, 42, 0.35);
                margin-bottom: 1.25rem;
                display: flex;
                flex-wrap: wrap;
                gap: 0.75rem;
                align-items: center;
            }
            .report-action-bar .report-title {
                font-weight: 600;
                font-size: 1rem;
            }
            .report-action-bar button,
            .report-action-bar a {
                border: none;
                border-radius: 0.5rem;
                padding: 0.55rem 0.95rem;
                font-weight: 600;
                cursor: pointer;
                background: rgba(248, 250, 252, 0.1);
                color: inherit;
                text-decoration: none;
                display: inline-flex;
                gap: 0.4rem;
                align-items: center;
            }
            .report-action-bar button.primary {
                background: #38bdf8;
                color: #0f172a;
            }
            .report-action-bar button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            .report-edit-mode [data-editable="true"] {
                outline: 2px dashed #38bdf8;
                outline-offset: 2px;
                background: rgba(56, 189, 248, 0.05);
            }
            .report-edit-indicator {
                font-size: 0.85rem;
                color: #94a3b8;
            }
            #report-access-overlay {
                position: fixed;
                inset: 0;
                background: rgba(15, 23, 42, 0.92);
                color: #f8fafc;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                padding: 2rem;
                z-index: 100;
            }
            #report-access-overlay.hidden {
                display: none;
            }
            #report-access-overlay h2 {
                margin-bottom: 0.75rem;
                font-size: 1.5rem;
            }
            #report-access-overlay p {
                margin: 0.5rem 0;
                max-width: 28rem;
                line-height: 1.5;
            }
            #report-access-overlay button {
                margin-top: 1rem;
                background: #38bdf8;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 0.5rem;
                color: #0f172a;
                font-weight: 700;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
        stylesInjected = true;
    }

    function ensureAuthInitialized() {
        if (authStarted) return;
        authStarted = true;
        if (typeof initAuth === 'function') {
            initAuth();
        }
    }

    function getStoredUser() {
        try {
            return window.currentUser || JSON.parse(localStorage.getItem('stabilis-user') || 'null');
        } catch (error) {
            console.warn('Unable to read stored user', error);
            return null;
        }
    }

    function isDeveloper(user) {
        return user?.name === 'Developer';
    }

    function hasSteeringAccess(user) {
        if (!user) return false;
        const steering = window.STEERING_COMMITTEE || ['Attie Nel', 'Nastasha Jacobs', 'Lydia Gittens', 'Berno Paul'];
        return steering.includes(user.name) || isDeveloper(user);
    }

    function createOverlay(reportTitle) {
        let overlay = document.getElementById('report-access-overlay');
        if (overlay) return overlay;
        overlay = document.createElement('div');
        overlay.id = 'report-access-overlay';
        overlay.innerHTML = `
            <h2>Restricted Report</h2>
            <p data-report-access-message>This ${reportTitle} is reserved for the Steering Committee.</p>
            <p data-report-access-help>Please sign in with a steering account to continue.</p>
            <button type="button" id="report-login-btn">Sign In</button>
        `;
        document.body.appendChild(overlay);
        overlay.querySelector('#report-login-btn').addEventListener('click', () => {
            ensureAuthInitialized();
        });
        return overlay;
    }

    function setButtonsDisabled(disabled) {
        document.querySelectorAll('.report-action-bar button').forEach(btn => {
            if (!btn.dataset.skipDisable) {
                btn.disabled = disabled;
            }
        });
    }

    function setEditableState(enabled, selectors = DEFAULT_EDITABLE_SELECTORS) {
        const elements = selectors.flatMap(selector => Array.from(document.querySelectorAll(selector)));
        elements.forEach(el => {
            if (!el) return;
            el.contentEditable = enabled ? 'true' : 'false';
            el.dataset.editable = enabled ? 'true' : 'false';
        });
        document.body.classList.toggle('report-edit-mode', enabled);
    }

    function exportReportToExcel(reportTitle) {
        const container = document.querySelector('.report-container');
        if (!container) return;
        const clone = container.cloneNode(true);
        const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>${clone.innerHTML}</body></html>`;
        const blob = new Blob(['\ufeff' + html], { type: 'application/vnd.ms-excel' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const safeTitle = reportTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        link.href = url;
        link.download = `${safeTitle}-report.xls`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
    }

    function initReportPage(options = {}) {
        injectStyles();
        const container = document.querySelector('.report-container');
        if (!container) return;

        const config = {
            reportKey: options.reportKey || 'custom-report',
            reportTitle: options.reportTitle || document.title || 'Report',
            editableSelectors: options.editableSelectors || DEFAULT_EDITABLE_SELECTORS
        };

        const params = new URLSearchParams(window.location.search);
        const pendingAction = params.get('action');

        ensureAuthInitialized();
        const overlay = createOverlay(config.reportTitle);

        const actionBar = document.createElement('div');
        actionBar.className = 'report-action-bar';
        actionBar.innerHTML = `
            <span class="report-title">${config.reportTitle}</span>
            <a href="../executive-dashboard.html" class="primary" data-skip-disable="true">🏛 Executive Command</a>
            <button type="button" id="report-export-btn">⬇️ Export (.xlsx)</button>
            <button type="button" id="report-print-btn">🖨 Print</button>
            <button type="button" id="report-edit-btn">✏️ Edit Report</button>
            <span class="report-edit-indicator" id="report-edit-indicator"></span>
        `;
        container.parentNode.insertBefore(actionBar, container);
        setButtonsDisabled(true);

        const exportBtn = document.getElementById('report-export-btn');
        const printBtn = document.getElementById('report-print-btn');
        const editBtn = document.getElementById('report-edit-btn');
        const editIndicator = document.getElementById('report-edit-indicator');

        function updateEditIndicator() {
            if (editIndicator) {
                editIndicator.textContent = editMode ? 'Edit mode is active (local draft only)' : '';
            }
            if (editBtn) {
                editBtn.textContent = editMode ? '✅ Finish Editing' : '✏️ Edit Report';
            }
        }

        function toggleEditMode(forceValue) {
            editMode = typeof forceValue === 'boolean' ? forceValue : !editMode;
            setEditableState(editMode, config.editableSelectors);
            updateEditIndicator();
        }

        exportBtn?.addEventListener('click', () => exportReportToExcel(config.reportTitle));
        printBtn?.addEventListener('click', () => window.print());
        editBtn?.addEventListener('click', () => toggleEditMode());

        function handleAuthorizationChange() {
            const user = getStoredUser();
            const messageEl = overlay.querySelector('[data-report-access-message]');
            const helpEl = overlay.querySelector('[data-report-access-help]');
            if (!user) {
                overlay.classList.remove('hidden');
                if (messageEl) messageEl.textContent = `This ${config.reportTitle} is reserved for the Steering Committee.`;
                if (helpEl) helpEl.textContent = 'Please sign in with a steering account to continue.';
                setButtonsDisabled(true);
                toggleEditMode(false);
                return;
            }
            if (!hasSteeringAccess(user)) {
                overlay.classList.remove('hidden');
                if (messageEl) messageEl.textContent = 'Only the Steering Committee may open or edit this report.';
                if (helpEl) helpEl.textContent = 'Contact the project office if you require access.';
                setButtonsDisabled(true);
                toggleEditMode(false);
                return;
            }
            overlay.classList.add('hidden');
            setButtonsDisabled(false);
            if (pendingAction && !handledAutoAction) {
                handledAutoAction = true;
                setTimeout(() => {
                    if (pendingAction === 'export') {
                        exportReportToExcel(config.reportTitle);
                    } else if (pendingAction === 'print') {
                        window.print();
                    } else if (pendingAction === 'edit') {
                        toggleEditMode(true);
                    }
                }, 400);
            }
        }

        handleAuthorizationChange();
        window.addEventListener('stabilis-user-changed', handleAuthorizationChange);
    }

    window.initReportPage = initReportPage;
})();
