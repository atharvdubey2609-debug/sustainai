
"use client";

import { useEffect, useMemo, useState } from "react";
import { materials, type Material } from "../data/materials";
import {
  getEvidenceRecords,
  type EvidenceRecord,
} from "./evidence-store";

const inputClass =
  "w-full rounded-xl border border-[#e3e8df] bg-white px-4 py-3 text-sm outline-none focus:border-[#78a27d]";

function escapeHtml(value: unknown): string {
  return String(value ?? "Not specified")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function makeList(items: string[]): string {
  if (!items.length) {
    return "<li>Not recorded in the current catalogue.</li>";
  }

  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function getPropertyLines(material: Material): string[] {
  return (material.properties ?? []).map((item) =>
    [
      item.property,
      item.value,
      item.unit,
      item.source ? `Source: ${item.source}` : "",
    ]
      .filter(Boolean)
      .join(" — ")
  );
}

function getStandardLines(material: Material): string[] {
  return (material.standards ?? []).map((item) =>
    [
      item.code,
      item.description,
      item.verified ? "Catalogue marked verified" : "Not verified",
    ]
      .filter(Boolean)
      .join(" — ")
  );
}

function getEvidenceTable(
  records: EvidenceRecord[]
): string {
  if (!records.length) {
    return "<tr><td colspan='6'>No evidence documents are registered for this material.</td></tr>";
  }

  return records
    .map(
      (record) => `
        <tr>
          <td>${escapeHtml(record.title)}</td>
          <td>${escapeHtml(record.documentType)}</td>
          <td>${escapeHtml(record.issuer || "Not recorded")}</td>
          <td>${escapeHtml(record.reportNumber || "Not recorded")}</td>
          <td>${escapeHtml(record.status)}</td>
          <td>${escapeHtml(record.reviewerNotes || "No reviewer notes")}</td>
        </tr>`
    )
    .join("");
}

function createReportHtml(
  selected: Material[],
  evidence: EvidenceRecord[],
  reportTitle: string,
  projectName: string,
  intendedUse: string,
  preparedBy: string,
  notes: string
): string {
  const generatedAt = new Date().toLocaleString();

  const materialSections = selected
    .map((material) => {
      const records = evidence.filter(
        (record) => record.materialId === material.id
      );

      return `
        <section class="material">
          <h2>${escapeHtml(material.name)}</h2>
          <p class="meta">${escapeHtml(material.id)} · ${escapeHtml(material.category)} · ${escapeHtml(material.type)}</p>

          <h3>Description</h3>
          <p>${escapeHtml(material.description)}</p>

          <h3>Applications recorded in catalogue</h3>
          <ul>${makeList(material.applications ?? [])}</ul>

          <h3>Properties recorded in catalogue</h3>
          <ul>${makeList(getPropertyLines(material))}</ul>

          <h3>Advantages</h3>
          <ul>${makeList(material.advantages ?? [])}</ul>

          <h3>Limitations</h3>
          <ul>${makeList(material.limitations ?? [])}</ul>

          <h3>Testing requirements</h3>
          <ul>${makeList(material.testingRequirements ?? [])}</ul>

          <h3>Standards references in catalogue</h3>
          <ul>${makeList(getStandardLines(material))}</ul>

          <h3>Evidence register</h3>
          <table>
            <thead>
              <tr>
                <th>Document</th>
                <th>Type</th>
                <th>Issuer</th>
                <th>Reference</th>
                <th>Status</th>
                <th>Reviewer notes</th>
              </tr>
            </thead>
            <tbody>${getEvidenceTable(records)}</tbody>
          </table>

          <p><strong>Catalogue verification status:</strong> ${escapeHtml(material.verificationStatus)}</p>
          <p><strong>Conventional alternative:</strong> ${escapeHtml(material.conventionalAlternative || "Not specified")}</p>
        </section>`;
    })
    .join("");

  const comparisonRows = [
    ["Category", (m: Material) => m.category],
    ["Material type", (m: Material) => m.type],
    ["Verification status", (m: Material) => m.verificationStatus],
    ["Conventional alternative", (m: Material) => m.conventionalAlternative || "Not specified"],
  ];

  const comparisonSection =
    selected.length > 1
      ? `
        <section>
          <h2>Side-by-side catalogue comparison</h2>
          <table>
            <thead>
              <tr>
                <th>Parameter</th>
                ${selected.map((m) => `<th>${escapeHtml(m.name)}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${comparisonRows
                .map(
                  ([label, getter]) => `
                    <tr>
                      <th>${escapeHtml(label)}</th>
                      ${selected
                        .map((m) => `<td>${escapeHtml((getter as (m: Material) => string)(m))}</td>`)
                        .join("")}
                    </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </section>`
      : "";

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>${escapeHtml(reportTitle)}</title>
      <style>
        * { box-sizing: border-box; }
        body {
          font-family: Arial, Helvetica, sans-serif;
          color: #263b2e;
          line-height: 1.55;
          margin: 32px auto;
          max-width: 900px;
          padding: 0 24px;
        }
        h1 { color: #174c37; font-size: 26px; margin-bottom: 6px; }
        h2 { color: #174c37; font-size: 19px; margin-top: 26px; }
        h3 { color: #315e40; font-size: 13px; margin: 18px 0 5px; }
        p, li { font-size: 11px; }
        .meta { color: #718174; font-size: 10px; }
        .cover { border-bottom: 3px solid #174c37; padding-bottom: 18px; margin-bottom: 22px; }
        .info { background: #f4f7f1; padding: 14px 18px; border-radius: 8px; margin: 16px 0; }
        .material { border-top: 1px solid #dfe7dc; margin-top: 28px; padding-top: 12px; }
        table { border-collapse: collapse; width: 100%; margin-top: 10px; font-size: 9px; }
        th, td { border: 1px solid #dfe7dc; padding: 7px; text-align: left; vertical-align: top; }
        th { background: #edf4ec; }
        .notice { background: #fff7e6; border: 1px solid #f1d69b; padding: 14px; border-radius: 8px; margin-top: 24px; font-size: 10px; }
        .footer { margin-top: 32px; border-top: 1px solid #dfe7dc; padding-top: 12px; color: #829084; font-size: 9px; }
        @media print {
          body { margin: 0; max-width: none; padding: 0; }
          .material { page-break-inside: auto; }
        }
      </style>
    </head>
    <body>
      <div class="cover">
        <p style="letter-spacing:3px;color:#77917b;font-size:9px;font-weight:bold">SUSTAINAI · ENGINEERING DOCUMENTATION</p>
        <h1>${escapeHtml(reportTitle)}</h1>
        <p class="meta">Generated ${escapeHtml(generatedAt)}</p>
      </div>

      <section class="info">
        <p><strong>Project:</strong> ${escapeHtml(projectName || "Not specified")}</p>
        <p><strong>Intended application:</strong> ${escapeHtml(intendedUse || "Not specified")}</p>
        <p><strong>Prepared by:</strong> ${escapeHtml(preparedBy || "Not specified")}</p>
        <p><strong>Materials covered:</strong> ${selected.length}</p>
      </section>

      <section>
        <h2>Purpose and scope</h2>
        <p>This report compiles catalogue information and evidence records currently available in SustainAI. It is a preliminary information and screening report, not a design approval or certification.</p>
        <p><strong>Project notes:</strong> ${escapeHtml(notes || "None supplied.")}</p>
      </section>

      ${comparisonSection}
      ${materialSections}

      <section class="notice">
        <strong>Engineering and verification disclaimer</strong><br />
        Catalogue entries, standards references and uploaded documents do not
        by themselves establish product compliance, equivalence or project
        suitability. A document's review status is entered by a reviewer;
        SustainAI does not independently authenticate laboratories,
        certificates, signatures, test data or BIS licences. Confirm current
        applicable standards and editions, project specifications, test
        methods, acceptance criteria and design requirements with competent
        professionals before use.
      </section>

      <div class="footer">
        SustainAI · Explore. Compare. Verify. Build. · Generated ${escapeHtml(generatedAt)}
      </div>
    </body>
    </html>`;
}

export default function TechnicalReportsModule() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [evidence, setEvidence] = useState<EvidenceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [reportTitle, setReportTitle] = useState("Material Assessment Report");
  const [projectName, setProjectName] = useState("");
  const [intendedUse, setIntendedUse] = useState("");
  const [preparedBy, setPreparedBy] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    getEvidenceRecords()
      .then(setEvidence)
      .catch(() => setEvidence([]))
      .finally(() => setLoading(false));
  }, []);

  const selectedMaterials = useMemo(
    () => materials.filter((m) => selectedIds.includes(m.id)),
    [selectedIds]
  );

  const selectedEvidence = evidence.filter((record) =>
    selectedIds.includes(record.materialId)
  );

  function toggleMaterial(id: string) {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  }

  function generateReport() {
    if (!selectedMaterials.length) {
      window.alert("Select at least one material before generating a report.");
      return;
    }

    const reportWindow = window.open("", "_blank");

    if (!reportWindow) {
      window.alert("Your browser blocked the report window. Allow pop-ups and try again.");
      return;
    }

    const html = createReportHtml(
      selectedMaterials,
      evidence,
      reportTitle,
      projectName,
      intendedUse,
      preparedBy,
      notes
    );

    reportWindow.document.open();
    reportWindow.document.write(html);
    reportWindow.document.close();

    reportWindow.onload = () => {
      reportWindow.focus();
      reportWindow.print();
    };
  }

  function downloadJson() {
    if (!selectedMaterials.length) {
      window.alert("Select at least one material first.");
      return;
    }

    const payload = {
      reportTitle,
      projectName,
      intendedUse,
      preparedBy,
      notes,
      generatedAt: new Date().toISOString(),
      materials: selectedMaterials,
      evidence: selectedEvidence.map(({ fileBlob, ...record }) => record),
      disclaimer:
        "Preliminary catalogue and evidence summary. Not a compliance certificate or engineering approval.",
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "SustainAI_Material_Assessment.json";
    anchor.click();

    URL.revokeObjectURL(url);
  }

  return (
    <section className="space-y-7">
      <div>
        <p className="text-[10px] font-bold tracking-[2px] text-[#8a9b8b]">
          ENGINEERING DOCUMENTATION
        </p>
        <h1 className="mt-2 text-2xl font-semibold">Technical Reports</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#849184]">
          Prepare material assessment and comparison reports using catalogue
          information and the evidence register.
        </p>
      </div>

      <div className="rounded-2xl border border-[#e5e9df] bg-white p-6">
        <h2 className="text-lg font-semibold">1. Report information</h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold text-[#647666]">Report title</label>
            <input value={reportTitle} onChange={(e) => setReportTitle(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-[#647666]">Project name</label>
            <input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Enter project name" className={inputClass} />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-[#647666]">Intended application</label>
            <input value={intendedUse} onChange={(e) => setIntendedUse(e.target.value)} placeholder="e.g. Non-load-bearing wall" className={inputClass} />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-[#647666]">Prepared by</label>
            <input value={preparedBy} onChange={(e) => setPreparedBy(e.target.value)} placeholder="Name / organisation" className={inputClass} />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-xs font-semibold text-[#647666]">Project notes and assessment scope</label>
            <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Record project conditions, assumptions or additional checks required..." className={inputClass} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#e5e9df] bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">2. Select materials</h2>
            <p className="mt-1 text-xs text-[#829084]">
              Select one material for an assessment or multiple materials for comparison.
            </p>
          </div>
          <span className="rounded-full bg-[#edf4ec] px-3 py-1.5 text-xs font-semibold text-[#47734f]">
            {selectedIds.length} selected
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {materials.map((material) => {
            const selected = selectedIds.includes(material.id);

            return (
              <button
                key={material.id}
                type="button"
                onClick={() => toggleMaterial(material.id)}
                className={`rounded-xl border p-4 text-left transition ${
                  selected
                    ? "border-[#5d956b] bg-[#edf4ec]"
                    : "border-[#e5e9df] bg-white hover:border-[#a7c4ae]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{material.name}</p>
                    <p className="mt-1 text-[10px] text-[#829084]">
                      {material.id} · {material.category}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-[#47734f]">{selected ? "✓" : "+"}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={() => setSelectedIds([])} className="rounded-lg border border-[#dfe7dc] px-4 py-2.5 text-xs font-semibold text-[#718174]">
            Clear selection
          </button>
          <button type="button" onClick={() => setSelectedIds(materials.map((m) => m.id))} className="rounded-lg border border-[#dfe7dc] px-4 py-2.5 text-xs font-semibold text-[#47734f]">
            Select all materials
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-[#e5e9df] bg-white p-6">
        <h2 className="text-lg font-semibold">3. Evidence coverage</h2>
        <p className="mt-1 text-xs text-[#829084]">Evidence records linked to selected materials.</p>

        {loading ? (
          <p className="mt-4 text-xs text-[#829084]">Loading evidence records...</p>
        ) : selectedMaterials.length === 0 ? (
          <p className="mt-4 text-xs text-[#829084]">Select materials to view their evidence coverage.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {selectedMaterials.map((material) => {
              const rows = evidence.filter((record) => record.materialId === material.id);
              const verified = rows.filter((record) => record.status === "Verified").length;

              return (
                <div key={material.id} className="rounded-xl border border-[#edf0ea] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{material.name}</p>
                      <p className="mt-1 text-xs text-[#829084]">
                        {rows.length} document(s) · {verified} marked Verified
                      </p>
                    </div>
                    <span className="rounded-full bg-[#f5f7f2] px-3 py-1 text-xs text-[#718174]">
                      Catalogue: {material.verificationStatus}
                    </span>
                  </div>

                  {rows.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {rows.map((record) => (
                        <li key={record.id} className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className="text-[#718174]">{record.title}</span>
                          <span className="font-medium">{record.status}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-[#cbdcca] bg-[#edf4ec] p-6">
        <h2 className="text-lg font-semibold text-[#315e40]">4. Generate report</h2>
        <p className="mt-2 text-xs leading-6 text-[#718174]">
          The report includes material profiles, recorded properties,
          applications, advantages, limitations, testing requirements,
          catalogue standards references and linked evidence records. Missing
          catalogue information is explicitly identified.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={generateReport}
            disabled={!selectedMaterials.length}
            className="rounded-xl bg-[#174c37] px-5 py-3 text-xs font-semibold text-white hover:bg-[#286448] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Generate / Print PDF
          </button>

          <button
            type="button"
            onClick={downloadJson}
            disabled={!selectedMaterials.length}
            className="rounded-xl border border-[#b9cdb9] bg-white px-5 py-3 text-xs font-semibold text-[#315e40] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Download JSON Report
          </button>
        </div>

        <p className="mt-4 text-[10px] leading-5 text-[#829084]">
          To save a PDF, select “Save as PDF” in the browser print dialog.
          Allow pop-ups for localhost if the report window does not open.
        </p>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
        <h3 className="text-sm font-semibold text-amber-900">Report limitations</h3>
        <p className="mt-2 text-xs leading-6 text-amber-800">
          This report compiles information currently stored in the catalogue.
          It does not perform structural design, laboratory testing, life-cycle
          assessment, code-compliance checking or professional approval.
          Standards references and evidence status must be independently
          checked against current project requirements.
        </p>
      </div>
    </section>
  );
}
