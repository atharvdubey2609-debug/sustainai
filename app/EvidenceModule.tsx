
"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { materials } from "../data/materials";
import {
  deleteEvidenceRecord,
  downloadEvidenceFile,
  getEvidenceRecords,
  saveEvidenceRecord,
  type EvidenceRecord,
  type EvidenceStatus,
} from "./evidence-store";

const statuses: EvidenceStatus[] = [
  "Pending Review",
  "Partially Verified",
  "Verified",
  "Rejected",
];

const documentTypes = [
  "Laboratory Test Report",
  "Technical Datasheet",
  "BIS Certificate / Licence",
  "Manufacturer Declaration",
  "Product Specification",
  "Environmental Product Declaration",
  "Other Supporting Document",
];

const inputClass =
  "w-full rounded-xl border border-[#e3e8df] bg-white px-4 py-3 text-sm text-[#263b2e] outline-none focus:border-[#78a27d]";

const labelClass = "mb-2 block text-xs font-semibold text-[#647666]";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function StatusPill({ status }: { status: EvidenceStatus }) {
  const styles: Record<EvidenceStatus, string> = {
    "Pending Review": "bg-amber-100 text-amber-800",
    "Partially Verified": "bg-blue-100 text-blue-800",
    Verified: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
  };

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}

export default function EvidenceModule() {
  const [records, setRecords] = useState<EvidenceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Statuses");
  const [filterMaterial, setFilterMaterial] = useState("All Materials");

  const [materialId, setMaterialId] = useState("");
  const [title, setTitle] = useState("");
  const [documentType, setDocumentType] = useState(documentTypes[0]);
  const [issuer, setIssuer] = useState("");
  const [reportNumber, setReportNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [editing, setEditing] = useState<EvidenceRecord | null>(null);
  const [editStatus, setEditStatus] =
    useState<EvidenceStatus>("Pending Review");
  const [editNotes, setEditNotes] = useState("");

  async function refresh() {
    try {
      setError("");
      setRecords(await getEvidenceRecords());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load evidence records."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  const counts = useMemo(
    () => ({
      total: records.length,
      pending: records.filter((r) => r.status === "Pending Review").length,
      partial: records.filter((r) => r.status === "Partially Verified").length,
      verified: records.filter((r) => r.status === "Verified").length,
      rejected: records.filter((r) => r.status === "Rejected").length,
    }),
    [records]
  );

  const filteredRecords = useMemo(() => {
    const query = search.toLowerCase().trim();

    return records.filter((record) => {
      const material = materials.find((m) => m.id === record.materialId);

      const searchable = [
        record.title,
        record.issuer,
        record.reportNumber,
        record.documentType,
        material?.name ?? record.materialId,
        record.fileName,
      ]
        .join(" ")
        .toLowerCase();

      return (
        searchable.includes(query) &&
        (filterStatus === "All Statuses" ||
          record.status === filterStatus) &&
        (filterMaterial === "All Materials" ||
          record.materialId === filterMaterial)
      );
    });
  }, [records, search, filterStatus, filterMaterial]);

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!materialId || !title.trim() || !file) {
      setError("Select a material, enter a title and attach a file.");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError("Please choose a file smaller than 20 MB.");
      return;
    }

    const allowedExtensions = /\.(pdf|csv|xlsx|xls|jpg|jpeg|png)$/i;

    if (!allowedExtensions.test(file.name)) {
      setError("Supported formats: PDF, CSV, XLSX, XLS, JPG and PNG.");
      return;
    }

    setSaving(true);

    const now = new Date().toISOString();

    const record: EvidenceRecord = {
      id: crypto.randomUUID(),
      materialId,
      title: title.trim(),
      documentType,
      issuer: issuer.trim(),
      reportNumber: reportNumber.trim(),
      issueDate,
      sourceUrl: sourceUrl.trim(),
      status: "Pending Review",
      reviewerNotes: "",
      fileName: file.name,
      fileType: file.type || "application/octet-stream",
      fileSize: file.size,
      createdAt: now,
      updatedAt: now,
      fileBlob: file,
    };

    try {
      await saveEvidenceRecord(record);
      await refresh();

      setTitle("");
      setIssuer("");
      setReportNumber("");
      setIssueDate("");
      setSourceUrl("");
      setFile(null);

      const input = document.getElementById(
        "evidence-file"
      ) as HTMLInputElement | null;

      if (input) input.value = "";

      setNotice("Document saved successfully as Pending Review.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save the document."
      );
    } finally {
      setSaving(false);
    }
  }

  function startReview(record: EvidenceRecord) {
    setEditing(record);
    setEditStatus(record.status);
    setEditNotes(record.reviewerNotes);
  }

  async function saveReview() {
    if (!editing) return;

    try {
      await saveEvidenceRecord({
        ...editing,
        status: editStatus,
        reviewerNotes: editNotes.trim(),
        updatedAt: new Date().toISOString(),
      });

      setEditing(null);
      await refresh();
      setNotice("Review record updated.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update the review."
      );
    }
  }

  async function removeRecord(record: EvidenceRecord) {
    if (!window.confirm(`Delete "${record.title}" and its stored file?`)) {
      return;
    }

    try {
      await deleteEvidenceRecord(record.id);
      await refresh();
      setNotice("Evidence record deleted.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not delete the record."
      );
    }
  }

  function exportCsv() {
    const headers = [
      "Material ID",
      "Material",
      "Title",
      "Document Type",
      "Issuer",
      "Report Number",
      "Issue Date",
      "Source URL",
      "Status",
      "Reviewer Notes",
      "File Name",
      "File Size",
    ];

    const rows = records.map((r) => [
      r.materialId,
      materials.find((m) => m.id === r.materialId)?.name ?? r.materialId,
      r.title,
      r.documentType,
      r.issuer,
      r.reportNumber,
      r.issueDate,
      r.sourceUrl,
      r.status,
      r.reviewerNotes,
      r.fileName,
      r.fileSize,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "SustainAI_Evidence_Register.csv";
    anchor.click();

    URL.revokeObjectURL(url);
  }

  return (
    <section className="space-y-7">
      <div>
        <p className="text-[10px] font-bold tracking-[2px] text-[#8a9b8b]">
          TECHNICAL VALIDATION
        </p>
        <h1 className="mt-2 text-2xl font-semibold">Evidence & Verification</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#849184]">
          Upload and maintain material-specific laboratory reports, certificates,
          datasheets and reviewer decisions. Every new document starts as
          Pending Review.
        </p>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {notice && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          {notice}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ["Total Documents", counts.total],
          ["Pending Review", counts.pending],
          ["Partially Verified", counts.partial],
          ["Verified", counts.verified],
          ["Rejected", counts.rejected],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-2xl border border-[#e5e9df] bg-white p-5">
            <p className="text-xs text-[#829084]">{label}</p>
            <p className="mt-3 text-3xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#e5e9df] bg-white p-6">
        <h2 className="text-lg font-semibold">Upload supporting evidence</h2>
        <p className="mt-1 text-xs leading-5 text-[#829084]">
          Attach a document to a catalogue material. Maximum file size: 20 MB.
        </p>

        <form onSubmit={handleUpload} className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Material *</label>
            <select required value={materialId} onChange={(e) => setMaterialId(e.target.value)} className={inputClass}>
              <option value="">Select material</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>{m.id} — {m.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Document title *</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Compressive strength test report" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Document type</label>
            <select value={documentType} onChange={(e) => setDocumentType(e.target.value)} className={inputClass}>
              {documentTypes.map((type) => <option key={type}>{type}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass}>Issuing laboratory / organisation</label>
            <input value={issuer} onChange={(e) => setIssuer(e.target.value)} placeholder="Issuing organisation" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Report / certificate number</label>
            <input value={reportNumber} onChange={(e) => setReportNumber(e.target.value)} placeholder="Document reference number" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Issue date</label>
            <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className={inputClass} />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Original source URL (optional)</label>
            <input type="url" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="https://" className={inputClass} />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Attach file *</label>
            <input
              id="evidence-file"
              required
              type="file"
              accept=".pdf,.csv,.xlsx,.xls,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full rounded-xl border border-dashed border-[#cbd8ca] bg-[#fafbf8] p-4 text-xs"
            />
            {file && <p className="mt-2 text-xs text-[#718174]">{file.name} · {formatBytes(file.size)}</p>}
          </div>

          <div className="md:col-span-2">
            <button type="submit" disabled={saving} className="rounded-xl bg-[#174c37] px-6 py-3 text-xs font-semibold text-white hover:bg-[#286448] disabled:opacity-50">
              {saving ? "Saving..." : "Upload Evidence"}
            </button>
          </div>
        </form>
      </div>

      {editing && (
        <div className="rounded-2xl border border-[#a7c4ae] bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Review evidence</h2>
            <button type="button" onClick={() => setEditing(null)} className="text-xs text-[#829084]">Cancel</button>
          </div>

          <p className="mt-2 text-sm font-medium">{editing.title}</p>
          <p className="mt-1 text-xs text-[#829084]">{editing.fileName} · {editing.reportNumber || "No report number"}</p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Review status</label>
              <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as EvidenceStatus)} className={inputClass}>
                {statuses.map((status) => <option key={status}>{status}</option>)}
              </select>
            </div>

            <div>
              <label className={labelClass}>Reviewer notes</label>
              <textarea rows={3} value={editNotes} onChange={(e) => setEditNotes(e.target.value)} placeholder="Record checks performed, missing details and limitations..." className={inputClass} />
            </div>
          </div>

          <p className="mt-3 text-[11px] leading-5 text-[#829084]">
            Mark Verified only after checking authenticity, material identity,
            test method, sample or batch details, dates and applicable acceptance
            criteria.
          </p>

          <button type="button" onClick={() => void saveReview()} className="mt-4 rounded-xl bg-[#174c37] px-5 py-3 text-xs font-semibold text-white">
            Save Review
          </button>
        </div>
      )}

      <div className="rounded-2xl border border-[#e5e9df] bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Evidence register</h2>
            <p className="mt-1 text-xs text-[#829084]">{filteredRecords.length} of {records.length} documents</p>
          </div>

          <button type="button" onClick={exportCsv} disabled={!records.length} className="rounded-lg border border-[#dfe7dc] px-4 py-2.5 text-xs font-semibold text-[#47734f] disabled:opacity-40">
            Export CSV
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search documents or materials..." className={inputClass} />

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={inputClass}>
            <option>All Statuses</option>
            {statuses.map((status) => <option key={status}>{status}</option>)}
          </select>

          <select value={filterMaterial} onChange={(e) => setFilterMaterial(e.target.value)} className={inputClass}>
            <option value="All Materials">All Materials</option>
            {materials.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>

        {loading ? (
          <p className="py-10 text-center text-sm text-[#829084]">Loading evidence...</p>
        ) : filteredRecords.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-[#cbd8ca] p-10 text-center">
            <p className="font-semibold">No evidence records found</p>
            <p className="mt-2 text-xs text-[#829084]">Upload a report or change the filters.</p>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {filteredRecords.map((record) => {
              const material = materials.find((m) => m.id === record.materialId);

              return (
                <article key={record.id} className="rounded-xl border border-[#edf0ea] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{record.title}</h3>
                        <StatusPill status={record.status} />
                      </div>

                      <p className="mt-2 text-xs text-[#829084]">
                        {material?.name ?? record.materialId} · {record.documentType}
                      </p>
                      <p className="mt-1 text-xs text-[#829084]">
                        {record.issuer || "Issuer not recorded"} · {record.reportNumber || "No reference number"}
                      </p>
                      <p className="mt-1 text-[11px] text-[#9aa69a]">
                        {record.fileName} · {formatBytes(record.fileSize)}
                      </p>

                      {record.reviewerNotes && (
                        <p className="mt-3 rounded-lg bg-[#f5f7f2] p-3 text-xs leading-5 text-[#718174]">
                          Reviewer note: {record.reviewerNotes}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => {
                        try {
                          downloadEvidenceFile(record);
                        } catch (err) {
                          setError(err instanceof Error ? err.message : "Download failed.");
                        }
                      }} className="rounded-lg border border-[#dfe7dc] px-3 py-2 text-xs font-semibold text-[#47734f]">
                        Download
                      </button>

                      <button type="button" onClick={() => startReview(record)} className="rounded-lg bg-[#edf4ec] px-3 py-2 text-xs font-semibold text-[#315e40]">
                        Review
                      </button>

                      <button type="button" onClick={() => void removeRecord(record)} className="rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600">
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
        <h3 className="text-sm font-semibold text-amber-900">Verification is a review process</h3>
        <p className="mt-2 text-xs leading-6 text-amber-800">
          SustainAI stores the uploaded file and the review decision entered
          here. It does not authenticate the issuing laboratory, inspect
          signatures, validate test calculations or independently confirm BIS
          compliance. Verified is a reviewer-entered status, not automated
          certification.
        </p>
      </div>
    </section>
  );
}
