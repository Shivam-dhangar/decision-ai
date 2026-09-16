'use client';

import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Decision } from '@/types/decision';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { formatDate } from '@/lib/utils/formatters';
import { FileText, Download, Printer, Code, Check } from 'lucide-react';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  decision: Decision;
}

export function ExportReportModal({
  isOpen,
  onClose,
  decision,
}: ExportReportModalProps) {
  const { toast } = useToast();
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  // Generate & Download PDF Report
  const handleExportPDF = () => {
    setIsExportingPDF(true);
    try {
      const doc = new jsPDF();

      // Header Banner
      doc.setFillColor(79, 70, 229); // brand-600 #4f46e5
      doc.rect(0, 0, 210, 24, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('DecisionLens AI — Strategic Decision Intelligence Report', 14, 15);

      // Document Metadata
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated: ${formatDate(new Date().toISOString())} | Platform: DecisionLens AI`, 14, 32);

      // Decision Title & Goal
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(decision.title, 14, 42);

      if (decision.goal) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(71, 85, 105);
        doc.text(`Objective: ${decision.goal}`, 14, 48, { maxWidth: 180 });
      }

      // Winner Section
      let currentY = decision.goal ? 58 : 52;
      const winner = decision.results?.ranking?.[0];

      if (winner) {
        doc.setFillColor(241, 245, 249);
        doc.roundedRect(14, currentY, 182, 20, 2, 2, 'F');

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(79, 70, 229);
        doc.text(`Rank #1 Decision Leader: ${winner.optionName}`, 18, currentY + 8);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        doc.text(
          `Calculated Weighted Score: ${winner.finalScore} / 100 | Stability Index: ${decision.results?.stabilityIndex || 84}%`,
          18,
          currentY + 15
        );

        currentY += 28;
      }

      // Criteria Weights Table
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('1. Evaluated Decision Criteria & Weights', 14, currentY);

      const criteriaTableData = decision.criteria.map((c) => [
        c.name,
        c.description || '—',
        `${c.weight} / 10`,
      ]);

      autoTable(doc, {
        startY: currentY + 4,
        head: [['Criterion Name', 'Description', 'Priority Weight']],
        body: criteriaTableData,
        headStyles: { fillColor: [79, 70, 229] },
        styles: { fontSize: 8 },
        margin: { left: 14, right: 14 },
      });

      currentY = (doc as any).lastAutoTable.finalY + 12;

      // Deterministic Decision Matrix Table
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('2. Deterministic Scoring Matrix & Final Composite Scores', 14, currentY);

      const matrixHead = ['Criterion', ...decision.options.map((o) => o.name)];
      const matrixBody = decision.criteria.map((c) => {
        const row = [c.name];
        decision.options.forEach((opt) => {
          const scoreCell = decision.scores[opt.id]?.[c.id];
          row.push(`${scoreCell?.score ?? 5} / 10`);
        });
        return row;
      });

      // Add Final Score Row
      const finalScoreRow = ['FINAL SCORE (0-100)'];
      decision.options.forEach((opt) => {
        const found = decision.results?.ranking?.find((r) => r.optionId === opt.id);
        finalScoreRow.push(`${found?.finalScore || 0} pts`);
      });
      matrixBody.push(finalScoreRow);

      autoTable(doc, {
        startY: currentY + 4,
        head: [matrixHead],
        body: matrixBody,
        headStyles: { fillColor: [51, 65, 85] },
        styles: { fontSize: 8 },
        margin: { left: 14, right: 14 },
      });

      currentY = (doc as any).lastAutoTable.finalY + 12;

      // Why Winner Wins & Analysis
      if (decision.analysis?.whyWinnerWins) {
        if (currentY > 240) {
          doc.addPage();
          currentY = 20;
        }

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text('3. AI Qualitative Explanation & Key Trade-Offs', 14, currentY);

        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        doc.text(decision.analysis.whyWinnerWins, 14, currentY + 6, { maxWidth: 182 });

        currentY += 24;
      }

      // Final Decision Record if committed
      if (decision.finalDecision) {
        if (currentY > 240) {
          doc.addPage();
          currentY = 20;
        }

        doc.setFillColor(236, 253, 245);
        doc.roundedRect(14, currentY, 182, 22, 2, 2, 'F');

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(5, 150, 105);
        doc.text(`User Final Decision: ${decision.finalDecision.selectedOptionName}`, 18, currentY + 8);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        doc.text(
          `Committed on ${formatDate(decision.finalDecision.decidedAt)}: "${decision.finalDecision.reason}"`,
          18,
          currentY + 15,
          { maxWidth: 174 }
        );
      }

      // Save PDF
      const sanitizedTitle = decision.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      doc.save(`DecisionLens_${sanitizedTitle}.pdf`);
      toast('PDF report downloaded successfully.', { type: 'success' });
    } catch (e: any) {
      toast('Failed to generate PDF: ' + e.message, { type: 'error' });
    } finally {
      setIsExportingPDF(false);
    }
  };

  // Export JSON
  const handleExportJSON = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(decision, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute(
        'download',
        `DecisionLens_${decision.id}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast('Decision exported as JSON file.', { type: 'success' });
    } catch (e) {
      toast('Failed to export JSON file.', { type: 'error' });
    }
  };

  // Trigger Print
  const handlePrint = () => {
    onClose();
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title="Export Decision Analysis"
      description="Download a structured summary report or raw model data."
    >
      <div className="space-y-4">
        {/* PDF Option */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Executive PDF Report
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Complete structured matrix, scores, rankings & AI trade-offs.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleExportPDF}
            isLoading={isExportingPDF}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Download PDF
          </Button>
        </div>

        {/* JSON Option */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Raw JSON Model Data
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Full portable decision data for local backup or sharing.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportJSON}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export JSON
          </Button>
        </div>

        {/* Print Option */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Print Workspace View
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Print-optimized sheet with interactive chrome hidden.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-3.5 h-3.5" />}
          >
            Print
          </Button>
        </div>
      </div>
    </Modal>
  );
}
