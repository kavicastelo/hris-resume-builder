import { Injectable } from '@angular/core';
// @ts-ignore
import html2pdf from 'html2pdf.js';

@Injectable({
    providedIn: 'root'
})
export class PdfExportService {

    constructor() { }

    /**
     * Exports a specific HTML element to a PDF file using html2pdf.js.
     * @param elementId The ID of the HTML element to export.
     * @param fileName The desired filename for the PDF.
     */
    public exportToPdf(elementId: string, fileName: string): void {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error(`Element with id ${elementId} not found`);
            return;
        }

        const opt = {
            margin: [10, 10, 10, 10], // top, left, bottom, right
            filename: fileName,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2, // High resolution
                useCORS: true,
                letterRendering: true,
                logging: false,
                backgroundColor: '#ffffff'
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
                compress: true
            },
            pagebreak: {
                mode: ['avoid-all', 'css', 'legacy'], // Avoid breaking lines and elements
                before: '.page-break-before',
                after: '.page-break-after',
                avoid: [
                    'h1', 'h2', 'h3', 'h4',
                    '.cv-section', '.timeline-item', '.grid-item',
                    '.skill-item', '.ref-item', '.cert-item',
                    '.main-section', '.sidebar-item', '.content-item',
                    '.project-card', '.ref-card', '.timeline-entry',
                    '.skill-tag', '.misc-group', '.ref-mini', '.intro-section'
                ]
            }
        };

        // Use promise-based API for better control
        html2pdf().set(opt).from(element).save().catch((err: any) => {
            console.error('Error exporting PDF:', err);
        });
    }
}
