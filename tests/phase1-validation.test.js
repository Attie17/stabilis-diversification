// Phase 1 Rollback & Download Button Tests
const fs = require('fs');
const path = require('path');

describe('Phase 1: Excel Download Implementation', () => {
    
    test('Excel workbook file exists', () => {
        const excelPath = path.join(__dirname, '../data/stabilis-data.xlsx');
        expect(fs.existsSync(excelPath)).toBe(true);
        
        const stats = fs.statSync(excelPath);
        expect(stats.size).toBeGreaterThan(10000);
        expect(stats.size).toBeLessThan(5000000);
    });
    
    test('Untested Excel loader file removed', () => {
        const loaderPath = path.join(__dirname, '../web/js/budget-data-loader.js');
        expect(fs.existsSync(loaderPath)).toBe(false);
    });
    
    test('Budget report has Excel download button', () => {
        const reportPath = path.join(__dirname, '../web/reports/budget-q1-2026.html');
        const html = fs.readFileSync(reportPath, 'utf8');
        
        expect(html).toContain('Download Excel Workbook');
        expect(html).toContain('href="../data/stabilis-data.xlsx"');
        expect(html).toContain('download=');
    });
    
    test('Budget report does not load SheetJS library', () => {
        const reportPath = path.join(__dirname, '../web/reports/budget-q1-2026.html');
        const html = fs.readFileSync(reportPath, 'utf8');
        
        expect(html).not.toContain('cdn.sheetjs.com');
        expect(html).not.toContain('budget-data-loader.js');
    });
    
    test('Budget report contains static hardcoded values', () => {
        const reportPath = path.join(__dirname, '../web/reports/budget-q1-2026.html');
        const html = fs.readFileSync(reportPath, 'utf8');
        
        expect(html).toContain('R2.46M');
        expect(html).toContain('R470k');
        expect(html).toContain('R895,000');
    });
    
    test('Other reports remain unchanged', () => {
        const reportFiles = [
            'revenue-projection.html',
            'cost-analysis.html',
            'cashflow-projection.html',
            'budget-actual.html',
            'phase-progress.html'
        ];
        
        reportFiles.forEach(filename => {
            const reportPath = path.join(__dirname, `../web/reports/${filename}`);
            expect(fs.existsSync(reportPath)).toBe(true);
            
            const html = fs.readFileSync(reportPath, 'utf8');
            expect(html).not.toContain('budget-data-loader.js');
        });
    });
    
    test('Report initializes access control', () => {
        const reportPath = path.join(__dirname, '../web/reports/budget-q1-2026.html');
        const html = fs.readFileSync(reportPath, 'utf8');
        
        expect(html).toContain('initializeReportAccess');
        expect(html).toContain("reportKey: 'budget-q1-2026'");
    });
    
    test('DOMContentLoaded handler is not async', () => {
        const reportPath = path.join(__dirname, '../web/reports/budget-q1-2026.html');
        const html = fs.readFileSync(reportPath, 'utf8');
        
        const match = html.match(/addEventListener\('DOMContentLoaded',\s*(async\s+)?function/);
        if (match) {
            expect(match[1]).toBeUndefined();
        }
    });
    
    test('server.js has static file middleware', () => {
        const serverPath = path.join(__dirname, '../server.js');
        const serverCode = fs.readFileSync(serverPath, 'utf8');
        
        expect(serverCode).toContain("express.static('web')");
    });
    
    test('Excel workbook has Budget Q1 2026 sheet', () => {
        const XLSX = require('xlsx');
        const excelPath = path.join(__dirname, '../data/stabilis-data.xlsx');
        const workbook = XLSX.readFile(excelPath);
        
        expect(workbook.SheetNames).toContain('Budget Q1 2026');
    });
    
    test('Executive dashboard has budget report link', () => {
        const dashboardPath = path.join(__dirname, '../web/js/executive-dashboard.js');
        const code = fs.readFileSync(dashboardPath, 'utf8');
        
        expect(code).toContain('budget-q1-2026');
        expect(code).toContain('reports/budget-q1-2026.html');
    });
});
