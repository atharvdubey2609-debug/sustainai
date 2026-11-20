
"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";

import {
  standards,
  standardCategories,
  type StandardRecord,
} from "../data/standards";

import { materials } from "../data/materials";

const applicabilityLabel: Record<StandardRecord["applicability"], string> = {
  direct: "Direct standard",
  related: "Related reference",
  guidance: "Guidelines",
};

const applicabilityStyle: Record<StandardRecord["applicability"], string> = {
  direct:
    "bg-emerald-100 text-emerald-900",
  related:
    "bg-amber-100 text-amber-950",
  guidance:
    "bg-blue-100 text-blue-950",
};

const inputStyle =
  "w-full rounded-xl border border-[#d7ded3] bg-[#fffefa] px-4 py-3 text-sm font-medium text-[#1d3028] placeholder:text-slate-500 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20";

const cardStyle =
  "rounded-2xl border border-[#e1e5dc] bg-[#fffefa] shadow-sm";

const headingStyle = "font-bold text-[#1d3028]";

const bodyTextStyle = "text-[#42584a]";

const mutedTextStyle = "text-[#66766b]";

export default function StandardsModule() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All Categories");
  const [selectedApplicability, setSelectedApplicability] = useState("All");
  const [selectedMaterial, setSelectedMaterial] =
    useState("All Materials");
  const [selectedStandard, setSelectedStandard] =
    useState<StandardRecord | null>(null);

  const materialNames = useMemo(
    () =>
      Array.from(
        new Set(
          materials
            .map((material) => material.name)
            .filter(Boolean)
        )
      ).sort(),
    []
  );

  const filteredStandards = useMemo(() => {
    const query = search.toLowerCase().trim();

    return standards.filter((standard) => {
      const matchesSearch =
        !query ||
        standard.code.toLowerCase().includes(query) ||
        standard.title.toLowerCase().includes(query) ||
        standard.description.toLowerCase().includes(query) ||
        standard.category.toLowerCase().includes(query) ||
        standard.applicableMaterials.some((name) =>
          name.toLowerCase().includes(query)
        );

      const matchesCategory =
        selectedCategory === "All Categories" ||
        standard.category === selectedCategory;

      const matchesApplicability =
        selectedApplicability === "All" ||
        standard.applicability === selectedApplicability;

      const matchesMaterial =
        selectedMaterial === "All Materials" ||
        standard.applicableMaterials.includes(selectedMaterial);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesApplicability &&
        matchesMaterial
      );
    });
  }, [search, selectedCategory, selectedApplicability, selectedMaterial]);

  const directCount = standards.filter(
    (item) => item.applicability === "direct"
  ).length;

  const relatedCount = standards.filter(
    (item) => item.applicability === "related"
  ).length;

  const guidanceCount = standards.filter(
    (item) => item.applicability === "guidance"
  ).length;

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("All Categories");
    setSelectedApplicability("All");
    setSelectedMaterial("All Materials");
  };

  return (
    <div className="space-y-7 text-[#1d3028]">
      {/* HEADER */}
      <header>
        <p className="text-sm font-bold uppercase tracking-wider text-[#286044]">
          SustainAI / Technical Database
        </p>

        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#1d3028]">
          IS Standards & Guidelines
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#42584a]">
          Explore Indian Standards, related technical references and
          engineering guidelines associated with sustainable and
          conventional construction materials.
        </p>
      </header>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total References"
          value={standards.length}
          description="Available in the current database"
          color="gray"
        />

        <SummaryCard
          title="Direct Standards"
          value={directCount}
          description="Product or material-specific references"
          color="green"
        />

        <SummaryCard
          title="Related References"
          value={relatedCount}
          description="Testing or design-related references"
          color="amber"
        />

        <SummaryCard
          title="Guidelines"
          value={guidanceCount}
          description="Engineering guidance references"
          color="blue"
        />
      </div>

      {/* FILTERS */}
      <section className={`${cardStyle} p-5`}>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className={`text-lg ${headingStyle}`}>
              Find Applicable Standards
            </h2>
            <p className={`mt-1 text-sm ${mutedTextStyle}`}>
              Search and filter the technical reference database.
            </p>
          </div>

          <button
            onClick={resetFilters}
            className="rounded-lg border border-emerald-700 px-4 py-2 text-sm font-bold text-[#20553e] transition hover:bg-emerald-50"
          >
            Reset filters
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search IS code, material or keyword..."
            className={inputStyle}
          />

          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className={inputStyle}
          >
            <option value="All Categories">All Categories</option>
            {standardCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={selectedMaterial}
            onChange={(event) => setSelectedMaterial(event.target.value)}
            className={inputStyle}
          >
            <option value="All Materials">All Materials</option>
            {materialNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <select
            value={selectedApplicability}
            onChange={(event) =>
              setSelectedApplicability(event.target.value)
            }
            className={inputStyle}
          >
            <option value="All">All Reference Types</option>
            <option value="direct">Direct Standards</option>
            <option value="related">Related References</option>
            <option value="guidance">Guidelines</option>
          </select>
        </div>

        <p className={`mt-4 text-sm font-medium ${mutedTextStyle}`}>
          Showing{" "}
          <span className="font-bold text-[#1d3028]">
            {filteredStandards.length}
          </span>{" "}
          of {standards.length} references
        </p>
      </section>

      {/* STANDARDS LIST */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className={`text-xl ${headingStyle}`}>
            Standards Database
          </h2>

          <span className="rounded-lg bg-[#edf1e9] px-3 py-1.5 text-sm font-bold text-[#30483b]">
            {filteredStandards.length} results
          </span>
        </div>

        {filteredStandards.length === 0 ? (
          <div className={`${cardStyle} border-dashed p-10 text-center`}>
            <h3 className={`font-bold ${headingStyle}`}>
              No matching standards found
            </h3>

            <p className={`mt-2 text-sm ${mutedTextStyle}`}>
              Try another search term or reset the filters.
            </p>

            <button
              onClick={resetFilters}
              className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filteredStandards.map((standard) => (
              <button
                key={standard.id}
                onClick={() => setSelectedStandard(standard)}
                className={`${cardStyle} group p-5 text-left transition hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-lg`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-[#286044]">
                      {standard.category}
                    </p>

                    <h3 className="mt-2 text-xl font-extrabold text-[#1d3028]">
                      {standard.code}
                    </h3>

                    <p className="mt-2 text-sm font-semibold leading-6 text-[#30483b]">
                      {standard.title}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${
                      applicabilityStyle[standard.applicability]
                    }`}
                  >
                    {applicabilityLabel[standard.applicability]}
                  </span>
                </div>

                <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#42584a]">
                  {standard.description}
                </p>

                <div className="mt-5">
                  <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-[#66766b]">
                    Applicable materials
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {standard.applicableMaterials
                      .slice(0, 3)
                      .map((name) => (
                        <span
                          key={name}
                          className="rounded-lg bg-[#edf1e9] px-2.5 py-1.5 text-xs font-semibold text-[#30483b]"
                        >
                          {name}
                        </span>
                      ))}

                    {standard.applicableMaterials.length > 3 && (
                      <span className="rounded-lg bg-[#edf1e9] px-2.5 py-1.5 text-xs font-bold text-[#42584a]">
                        +{standard.applicableMaterials.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#e1e5dc] pt-4">
                  <span className="text-xs font-semibold text-[#66766b]">
                    Edition: {standard.year}
                  </span>

                  <span className="text-sm font-extrabold text-[#286044] group-hover:text-[#20553e]">
                    View details →
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* DETAIL MODAL */}
      {selectedStandard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/75 p-3 sm:p-5"
          onClick={() => setSelectedStandard(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="standard-modal-title"
            className="my-6 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#e1e5dc] bg-[#fffefa] p-5 text-[#1d3028] shadow-2xl sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#286044]">
                  {selectedStandard.category}
                </p>

                <h2
                  id="standard-modal-title"
                  className="mt-2 break-words text-2xl font-extrabold text-[#1d3028]"
                >
                  {selectedStandard.code}
                </h2>

                <p className="mt-2 text-sm font-semibold leading-6 text-[#42584a]">
                  {selectedStandard.title}
                </p>
              </div>

              <button
                onClick={() => setSelectedStandard(null)}
                aria-label="Close details"
                className="shrink-0 rounded-lg border border-[#d7ded3] px-3 py-2 text-xl font-bold text-[#42584a] hover:bg-[#edf1e9]"
              >
                ×
              </button>
            </div>

            <div className="mt-5">
              <span
                className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${
                  applicabilityStyle[selectedStandard.applicability]
                }`}
              >
                {applicabilityLabel[selectedStandard.applicability]}
              </span>
            </div>

            <DetailSection title="Overview">
              <p>{selectedStandard.description}</p>
            </DetailSection>

            <DetailSection title="Applicable Materials">
              <div className="flex flex-wrap gap-2">
                {selectedStandard.applicableMaterials.length > 0 ? (
                  selectedStandard.applicableMaterials.map((name) => (
                    <span
                      key={name}
                      className="rounded-lg bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-950"
                    >
                      {name}
                    </span>
                  ))
                ) : (
                  <p>No material mapping has been provided.</p>
                )}
              </div>
            </DetailSection>

            <DetailSection title="Relevant Testing / Assessment">
              {selectedStandard.testingRequirements.length > 0 ? (
                <ul className="list-disc space-y-2 pl-5">
                  {selectedStandard.testingRequirements.map((test) => (
                    <li key={test}>{test}</li>
                  ))}
                </ul>
              ) : (
                <p>No testing details are currently listed.</p>
              )}
            </DetailSection>

            <DetailSection title="Verification Note">
              <p>{selectedStandard.verificationNote}</p>
            </DetailSection>

            <div className="mt-6 rounded-xl border border-[#e1e5dc] bg-[#f7f7f1] p-4">
              <p className="text-xs font-extrabold uppercase tracking-wide text-[#66766b]">
                Reference edition
              </p>

              <p className="mt-1 text-sm font-bold text-[#1d3028]">
                {selectedStandard.year}
              </p>

              <p className="mt-4 text-xs font-extrabold uppercase tracking-wide text-[#66766b]">
                Source
              </p>

              <p className="mt-1 text-sm font-semibold text-[#30483b]">
                {selectedStandard.sourceLabel}
              </p>

              {selectedStandard.source ? (
                <a
                  href={selectedStandard.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex rounded-lg text-sm font-extrabold text-[#20553e] underline underline-offset-4 hover:text-emerald-950"
                >
                  Open reference source ↗
                </a>
              ) : (
                <p className="mt-2 text-sm font-semibold text-amber-800">
                  No source link provided.
                </p>
              )}
            </div>

            <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-7 text-amber-950">
              <strong>Engineering verification notice:</strong> A reference
              to an IS code or guideline does not itself establish product
              compliance. Confirm the current edition, amendments, scope,
              product test reports and project-specific requirements before
              making a conformity or structural-suitability claim.
            </div>

            <button
              onClick={() => setSelectedStandard(null)}
              className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Close details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  title,
  value,
  description,
  color = "gray",
}: {
  title: string;
  value: number;
  description: string;
  color?: "gray" | "green" | "amber" | "blue";
}) {
  const colors = {
    gray: "border-[#e1e5dc]",
    green: "border-emerald-200",
    amber: "border-amber-200",
    blue: "border-blue-200",
  };

  return (
    <div
      className={`rounded-2xl border bg-[#fffefa] p-5 shadow-sm ${colors[color]}`}
    >
      <p className="text-sm font-bold text-[#42584a]">
        {title}
      </p>

      <p className="mt-2 text-3xl font-extrabold text-[#1d3028]">
        {value}
      </p>

      <p className="mt-2 text-xs font-medium leading-5 text-[#66766b]">
        {description}
      </p>
    </div>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-6">
      <h3 className="mb-2 text-sm font-extrabold text-[#1d3028]">
        {title}
      </h3>

      <div className="text-sm font-medium leading-7 text-[#42584a]">
        {children}
      </div>
    </section>
  );
}
