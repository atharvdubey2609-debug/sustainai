
"use client";

import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { materials, type Material } from "../data/materials";

const projectTypes = [
  "Residential Building",
  "Commercial Building",
  "Industrial Building",
  "Road Construction",
  "Bridge Construction",
  "Institutional Building",
  "Infrastructure Project",
  "Other",
];

const applications = [
  "Foundation",
  "Columns and Beams",
  "Slabs",
  "Load-bearing Walls",
  "Non-load-bearing Walls",
  "Road Pavement",
  "Sub-base and Base Course",
  "Roofing",
  "Flooring",
  "Insulation",
  "Plastering and Finishing",
  "Drainage and Landscaping",
  "Other",
];

const exposureOptions = [
  "Normal / Indoor",
  "Outdoor / Weather Exposure",
  "High Rainfall / Moisture",
  "Coastal / Marine Environment",
  "High Temperature",
  "Chemical Exposure",
  "Underground / Soil Contact",
];

const structuralOptions = [
  "Structural / Load-bearing",
  "Non-structural",
  "Both",
  "Not sure",
];

const priorities = [
  "Recycled content",
  "Locally available materials",
  "Low-carbon alternatives",
  "Natural materials",
  "Industrial by-products",
  "Cost effectiveness",
  "Balanced sustainability",
];

type ProjectDetails = {
  projectName: string;
  projectType: string;
  location: string;
  application: string;
  exposure: string;
  structuralRole: string;
  strengthRequirement: string;
  budget: string;
  priority: string;
  notes: string;
};

const initialForm: ProjectDetails = {
  projectName: "",
  projectType: "Residential Building",
  location: "",
  application: "Non-load-bearing Walls",
  exposure: "Normal / Indoor",
  structuralRole: "Non-structural",
  strengthRequirement: "",
  budget: "Moderate",
  priority: "Balanced sustainability",
  notes: "",
};

type Recommendation = {
  material: Material;
  score: number;
  reasons: string[];
  cautions: string[];
};

// Broad catalogue categories used for discovery.
// These are candidate filters, not engineering suitability approvals.
const applicationCategories: Record<string, string[]> = {
  Foundation: [
    "Cementitious Materials",
    "Aggregates",
    "Reinforcement Materials",
    "Construction Systems",
  ],
  "Columns and Beams": [
    "Cementitious Materials",
    "Aggregates",
    "Reinforcement Materials",
    "Construction Systems",
  ],
  Slabs: [
    "Cementitious Materials",
    "Aggregates",
    "Reinforcement Materials",
    "Construction Systems",
  ],
  "Load-bearing Walls": [
    "Masonry Materials",
    "Cementitious Materials",
    "Construction Systems",
  ],
  "Non-load-bearing Walls": [
    "Masonry Materials",
    "Cementitious Materials",
    "Timber & Natural Materials",
    "Construction Systems",
  ],
  "Road Pavement": [
    "Roads & Pavements",
    "Aggregates",
    "Cementitious Materials",
  ],
  "Sub-base and Base Course": [
    "Roads & Pavements",
    "Aggregates",
  ],
  Roofing: [
    "Roofing & Insulation",
    "Timber & Natural Materials",
    "Construction Systems",
  ],
  Flooring: [
    "Finishes & Flooring",
    "Aggregates",
    "Construction Systems",
  ],
  Insulation: [
    "Roofing & Insulation",
    "Timber & Natural Materials",
  ],
  "Plastering and Finishing": [
    "Finishes & Flooring",
    "Cementitious Materials",
  ],
  "Drainage and Landscaping": [
    "Aggregates",
    "Construction Systems",
    "Roads & Pavements",
  ],
  Other: [],
};

const applicationKeywords: Record<string, string[]> = {
  Foundation: [
    "foundation",
    "footing",
    "substructure",
    "cement",
    "aggregate",
  ],
  "Columns and Beams": [
    "column",
    "beam",
    "concrete",
    "cement",
    "reinforcement",
    "steel",
    "aggregate",
  ],
  Slabs: [
    "slab",
    "floor slab",
    "roof slab",
    "concrete",
    "cement",
    "reinforcement",
  ],
  "Load-bearing Walls": [
    "load bearing",
    "load-bearing",
    "brick",
    "block",
    "masonry",
    "stone",
    "wall",
  ],
  "Non-load-bearing Walls": [
    "non-load-bearing",
    "non load bearing",
    "aac",
    "block",
    "brick",
    "partition",
    "masonry",
    "bamboo",
    "timber",
    "wall",
  ],
  "Road Pavement": [
    "asphalt",
    "bitumen",
    "pavement",
    "road",
    "wearing course",
    "recycled asphalt",
  ],
  "Sub-base and Base Course": [
    "sub-base",
    "subbase",
    "base course",
    "aggregate",
    "crushed stone",
    "granular",
    "road",
    "recycled",
  ],
  Roofing: [
    "roof",
    "roofing",
    "sheet",
    "tile",
    "bamboo",
    "timber",
    "insulation",
  ],
  Flooring: [
    "floor",
    "flooring",
    "tile",
    "stone",
    "terrazzo",
    "paver",
  ],
  Insulation: [
    "insulation",
    "thermal",
    "acoustic",
    "hemp",
    "cork",
    "fibre",
  ],
  "Plastering and Finishing": [
    "plaster",
    "plastering",
    "lime",
    "mortar",
    "finish",
    "coating",
  ],
  "Drainage and Landscaping": [
    "drainage",
    "permeable",
    "aggregate",
    "paver",
    "landscape",
    "stormwater",
  ],
  Other: [],
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[_–—]/g, "-")
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getMaterialSearchText(material: Material) {
  const propertyText = (material.properties ?? [])
    .map((property) =>
      [
        property.property,
        property.value,
        property.unit,
      ]
        .filter(Boolean)
        .join(" ")
    )
    .join(" ");

  return normalize(
    [
      material.name,
      material.category,
      material.type,
      material.description,
      ...(material.applications ?? []),
      ...(material.advantages ?? []),
      ...(material.limitations ?? []),
      ...(material.testingRequirements ?? []),
      propertyText,
    ]
      .filter(Boolean)
      .join(" ")
  );
}

function hasAny(text: string, keywords: string[]) {
  return keywords.some((keyword) =>
    text.includes(normalize(keyword))
  );
}

function getRecommendations(
  form: ProjectDetails
): Recommendation[] {
  const targetCategories =
    applicationCategories[form.application] ?? [];

  const keywords =
    applicationKeywords[form.application] ?? [];

  return materials
    .map((material) => {
      const materialText = getMaterialSearchText(material);
      const category = normalize(material.category);

      let score = 0;
      const reasons: string[] = [];
      const cautions: string[] = [];

      // 1. Match the material's catalogue category.
      const categoryMatch = targetCategories.some(
        (target) => normalize(target) === category
      );

      if (categoryMatch) {
        score += 5;
        reasons.push(
          `Belongs to a catalogue category associated with ${form.application.toLowerCase()}.`
        );
      }

      // 2. Match material names, descriptions and recorded applications.
      const matchedKeywords = keywords.filter((keyword) =>
        materialText.includes(normalize(keyword))
      );

      if (matchedKeywords.length > 0) {
        score += Math.min(matchedKeywords.length, 3);

        reasons.push(
          `Catalogue text contains relevant terms: ${matchedKeywords.join(", ")}.`
        );
      }

      // 3. Project type context.
      if (form.projectType === "Road Construction") {
        if (
          category === normalize("Roads & Pavements") ||
          category === normalize("Aggregates")
        ) {
          score += 2;
          reasons.push(
            "Catalogue category is relevant to road construction research."
          );
        }
      }

      if (form.projectType === "Bridge Construction") {
        if (
          [
            "Cementitious Materials",
            "Reinforcement Materials",
            "Aggregates",
          ].some((item) => category === normalize(item))
        ) {
          score += 2;
          reasons.push(
            "Catalogue category may be relevant to bridge-material research."
          );
        }
      }

      // 4. Sustainability preference.
      if (
        form.priority === "Recycled content" &&
        hasAny(materialText, [
          "recycled",
          "reclaimed",
          "reused",
        ])
      ) {
        score += 2;
        reasons.push(
          "Catalogue text identifies recycled or reclaimed content."
        );
      }

      if (
        form.priority === "Industrial by-products" &&
        hasAny(materialText, [
          "fly ash",
          "slag",
          "industrial by-product",
          "rice husk ash",
        ])
      ) {
        score += 2;
        reasons.push(
          "Catalogue text identifies an industrial by-product connection."
        );
      }

      if (
        form.priority === "Natural materials" &&
        hasAny(materialText, [
          "bamboo",
          "timber",
          "natural",
          "hemp",
          "straw",
          "cork",
        ])
      ) {
        score += 2;
        reasons.push(
          "Catalogue text identifies a natural-material connection."
        );
      }

      if (
        form.priority === "Low-carbon alternatives" &&
        hasAny(materialText, [
          "recycled",
          "fly ash",
          "slag",
          "alternative",
          "rice husk ash",
        ])
      ) {
        score += 1;
        reasons.push(
          "Potential candidate for low-carbon research; carbon performance has not been measured."
        );
      }

      // 5. Exposure and engineering warnings.
      if (
        form.exposure.includes("Moisture") ||
        form.exposure.includes("Rainfall")
      ) {
        cautions.push(
          "Verify water absorption, permeability and durability for the actual exposure."
        );
      }

      if (form.exposure.includes("Coastal")) {
        cautions.push(
          "Verify chloride exposure, corrosion protection and applicable durability requirements."
        );
      }

      if (form.exposure.includes("Chemical")) {
        cautions.push(
          "Verify chemical resistance using product-specific test evidence."
        );
      }

      if (form.exposure.includes("High Temperature")) {
        cautions.push(
          "Verify thermal and fire performance for the intended application."
        );
      }

      if (form.exposure.includes("Outdoor")) {
        cautions.push(
          "Check weathering, UV exposure and durability for outdoor use."
        );
      }

      if (form.exposure.includes("Underground")) {
        cautions.push(
          "Check soil conditions, groundwater exposure and relevant durability requirements."
        );
      }

      if (
        form.structuralRole === "Structural / Load-bearing" ||
        form.structuralRole === "Both"
      ) {
        cautions.push(
          "Structural suitability has not been established. Obtain verified characteristic properties, product test reports, engineering design checks and applicable code compliance."
        );
      }

      if (form.structuralRole === "Not sure") {
        cautions.push(
          "Confirm whether the intended application is structural or non-structural before material selection."
        );
      }

      // 6. Catalogue evidence warnings.
      if (!material.properties?.length) {
        cautions.push(
          "Technical property values are not recorded in the current catalogue."
        );
      }

      if (!material.standards?.length) {
        cautions.push(
          "No standards reference is recorded in this material entry."
        );
      }

      if (material.verificationStatus !== "verified") {
        cautions.push(
          "Material evidence has not been marked as verified."
        );
      }

      // 7. Inputs that cannot yet be evaluated against verified data.
      if (form.strengthRequirement.trim()) {
        cautions.push(
          "The entered strength requirement has not been checked against verified material test values."
        );
      }

      if (form.budget !== "Not decided") {
        cautions.push(
          "Current material prices are unavailable; budget suitability has not been evaluated."
        );
      }

      if (form.location.trim()) {
        cautions.push(
          "Local suppliers and material availability have not been checked."
        );
      }

      if (form.priority === "Locally available materials") {
        cautions.push(
          "Local sourcing information is not available in the current catalogue."
        );
      }

      if (form.notes.trim()) {
        cautions.push(
          "Additional project notes are recorded but not automatically validated as engineering criteria."
        );
      }

      if (reasons.length === 0) {
        reasons.push(
          "Identified through broader catalogue discovery; review the intended application before considering selection."
        );
      }

      return {
        material,
        score,
        reasons,
        cautions: Array.from(new Set(cautions)),
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return a.material.name.localeCompare(b.material.name);
    })
    .slice(0, 12);
}

export default function ProjectRecommendations() {
  const [form, setForm] = useState<ProjectDetails>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const recommendations = useMemo(
    () => getRecommendations(form),
    [form]
  );

  function updateField<K extends keyof ProjectDetails>(
    field: K,
    value: ProjectDetails[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  function resetForm() {
    setForm(initialForm);
    setSubmitted(false);
  }

  function addToComparison(id: string) {
    window.dispatchEvent(
      new CustomEvent("sustainai:add-to-comparison", {
        detail: { id },
      })
    );
  }

  return (
    <section className="space-y-7">
      <div>
        <p className="text-[10px] font-bold tracking-[2px] text-[#8a9b8b]">
          PROJECT-SPECIFIC MATERIAL DISCOVERY
        </p>

        <h1 className="mt-2 text-2xl font-semibold">
          Project-Based Recommendations
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#849184]">
          Describe your project requirements and explore sustainable
          material alternatives that may be relevant to your intended
          construction application.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-[#e5e9df] bg-white p-5 md:p-7"
      >
        <div>
          <h2 className="text-lg font-semibold">
            1. Project Information
          </h2>

          <p className="mt-1 text-xs text-[#829084]">
            Tell us about the project you are planning.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Project Name">
            <input
              value={form.projectName}
              onChange={(e) =>
                updateField("projectName", e.target.value)
              }
              placeholder="e.g. Residential Building Project"
              className="field"
            />
          </Field>

          <Field label="Project Type">
            <select
              value={form.projectType}
              onChange={(e) =>
                updateField("projectType", e.target.value)
              }
              className="field"
            >
              {projectTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Field>

          <Field label="Project Location">
            <input
              value={form.location}
              onChange={(e) =>
                updateField("location", e.target.value)
              }
              placeholder="e.g. Bhopal, Madhya Pradesh"
              className="field"
            />
          </Field>

          <Field label="Intended Application">
            <select
              value={form.application}
              onChange={(e) =>
                updateField("application", e.target.value)
              }
              className="field"
            >
              {applications.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="border-t border-[#edf0ea] pt-6">
          <h2 className="text-lg font-semibold">
            2. Site Conditions
          </h2>

          <p className="mt-1 text-xs text-[#829084]">
            Select the conditions that may affect material performance.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Environmental / Exposure Conditions">
            <select
              value={form.exposure}
              onChange={(e) =>
                updateField("exposure", e.target.value)
              }
              className="field"
            >
              {exposureOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Field>

          <Field label="Intended Structural Role">
            <select
              value={form.structuralRole}
              onChange={(e) =>
                updateField("structuralRole", e.target.value)
              }
              className="field"
            >
              {structuralOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="border-t border-[#edf0ea] pt-6">
          <h2 className="text-lg font-semibold">
            3. Engineering Requirements
          </h2>

          <p className="mt-1 text-xs text-[#829084]">
            Add any known technical requirements. Do not enter estimated
            values as verified design criteria.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Required Strength / Technical Specification">
            <input
              value={form.strengthRequirement}
              onChange={(e) =>
                updateField("strengthRequirement", e.target.value)
              }
              placeholder="e.g. Specified grade or design requirement"
              className="field"
            />
          </Field>

          <Field label="Approximate Budget">
            <select
              value={form.budget}
              onChange={(e) =>
                updateField("budget", e.target.value)
              }
              className="field"
            >
              <option>Low</option>
              <option>Moderate</option>
              <option>Flexible</option>
              <option>Not decided</option>
            </select>
          </Field>

          <Field label="Sustainability Preference">
            <select
              value={form.priority}
              onChange={(e) =>
                updateField("priority", e.target.value)
              }
              className="field"
            >
              {priorities.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Additional Project Details">
          <textarea
            value={form.notes}
            onChange={(e) =>
              updateField("notes", e.target.value)
            }
            placeholder="Describe special requirements, site constraints, construction methods, availability concerns or other relevant details..."
            rows={4}
            className="field"
          />
        </Field>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            className="rounded-xl bg-[#174c37] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#286448]"
          >
            Find Sustainable Materials →
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="rounded-xl border border-[#dfe7dc] px-6 py-3 text-sm font-semibold text-[#58725d]"
          >
            Reset Form
          </button>
        </div>
      </form>

      {submitted && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-[#dce8d9] bg-[#edf4ec] p-5">
            <p className="text-[10px] font-bold tracking-[2px] text-[#47734f]">
              PROJECT ANALYSIS
            </p>

            <h2 className="mt-2 text-xl font-semibold text-[#263b2e]">
              {form.projectName || form.projectType}
            </h2>

            <p className="mt-2 text-xs leading-6 text-[#718174]">
              Application: {form.application} · Exposure: {form.exposure}
            </p>

            <p className="mt-1 text-xs text-[#718174]">
              {recommendations.length} catalogue candidate(s) identified
              for further review.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Suggested Material Candidates
            </h2>

            <p className="mt-1 text-xs leading-5 text-[#829084]">
              Candidates are ranked using catalogue categories,
              names, descriptions and recorded preferences. A higher
              match score does not establish engineering suitability,
              technical performance or code compliance.
            </p>
          </div>

          {recommendations.length > 0 ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {recommendations.map((item) => (
                <article
                  key={item.material.id}
                  className="overflow-hidden rounded-2xl border border-[#e5e9df] bg-white"
                >
                  <div className="flex h-36 items-center justify-center bg-gradient-to-br from-[#eaf1e8] to-[#f7f5ed]">
                    {item.material.image ? (
                      <img
                        src={item.material.image.url}
                        alt={item.material.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-4xl text-[#64876a]">
                        ◈
                      </span>
                    )}
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] text-[#8a9b8b]">
                          {item.material.category} · {item.material.id}
                        </p>

                        <h3 className="mt-1 text-lg font-semibold">
                          {item.material.name}
                        </h3>
                      </div>

                      <span className="rounded-full bg-[#edf4ec] px-3 py-1 text-[10px] font-semibold text-[#47734f]">
                        {item.score} match points
                      </span>
                    </div>

                    <p className="text-xs leading-6 text-[#829084]">
                      {item.material.description}
                    </p>

                    <DetailList
                      title="Why it was identified"
                      items={item.reasons}
                    />

                    <DetailList
                      title="Applications in catalogue"
                      items={item.material.applications}
                    />

                    <DetailList
                      title="Advantages recorded"
                      items={item.material.advantages}
                    />

                    <DetailList
                      title="Limitations"
                      items={item.material.limitations}
                    />

                    <DetailList
                      title="Testing requirements"
                      items={item.material.testingRequirements}
                    />

                    <div>
                      <p className="text-xs font-semibold">
                        Recorded technical properties
                      </p>

                      {item.material.properties?.length ? (
                        <ul className="mt-2 space-y-1 text-xs leading-5 text-[#829084]">
                          {item.material.properties.map(
                            (property, index) => (
                              <li key={`${property.property}-${index}`}>
                                <strong>{property.property}:</strong>{" "}
                                {property.value}
                                {property.unit
                                  ? ` ${property.unit}`
                                  : ""}
                                {property.source
                                  ? ` · Source: ${property.source}`
                                  : ""}
                              </li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p className="mt-2 text-xs text-[#9aa69a]">
                          Technical property values are not recorded.
                        </p>
                      )}
                    </div>

                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <p className="text-xs font-semibold text-amber-900">
                        Verification and engineering checks
                      </p>

                      <ul className="mt-2 space-y-2 text-[11px] leading-5 text-amber-900">
                        {item.cautions.map((caution, index) => (
                          <li key={index}>• {caution}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-xs font-semibold">
                        Relevant catalogue standards
                      </p>

                      {item.material.standards?.length ? (
                        <ul className="mt-2 space-y-2 text-xs leading-5 text-[#829084]">
                          {item.material.standards.map(
                            (standard, index) => (
                              <li key={`${standard.code}-${index}`}>
                                <strong>{standard.code}</strong>
                                {" — "}
                                {standard.description}
                                <span className="ml-2 font-medium">
                                  {standard.verified
                                    ? "Evidence marked verified"
                                    : "Not verified"}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p className="mt-2 text-xs text-[#9aa69a]">
                          No standards reference recorded.
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        addToComparison(item.material.id)
                      }
                      className="rounded-lg bg-[#174c37] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#286448]"
                    >
                      Add to Comparison
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#cbd8ca] bg-white p-10 text-center">
              <h3 className="font-semibold">
                No clear catalogue matches
              </h3>

              <p className="mt-2 text-xs leading-6 text-[#829084]">
                No material received a positive match score for this
                application. Check the material categories in
                data/materials.ts and the application mapping above.
              </p>
            </div>
          )}

          <div className="rounded-xl border border-[#e5e9df] bg-white p-5">
            <h3 className="text-sm font-semibold">
              Important engineering disclaimer
            </h3>

            <p className="mt-2 text-xs leading-6 text-[#829084]">
              This feature provides preliminary material discovery
              based on catalogue information. It does not perform
              structural design, strength calculations, cost analysis,
              local availability checks, code-compliance checks or
              product certification. A standards reference alone
              does not prove compliance. Verify current applicable
              standards, product-specific test reports, exposure
              requirements and project design criteria with a qualified
              engineer before selecting a construction material.
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        .field {
          width: 100%;
          border: 1px solid #e3e8df;
          border-radius: 10px;
          background: #fafbf8;
          padding: 12px 14px;
          font-size: 12px;
          color: #263b2e;
          outline: none;
        }

        .field:focus {
          border-color: #78a27d;
        }
      `}</style>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold text-[#647666]">
        {label}
      </span>
      {children}
    </label>
  );
}

function DetailList({
  title,
  items,
}: {
  title: string;
  items?: string[];
}) {
  return (
    <div>
      <p className="text-xs font-semibold">{title}</p>

      {items && items.length > 0 ? (
        <ul className="mt-2 space-y-1 text-xs leading-5 text-[#829084]">
          {items.map((item, index) => (
            <li key={index}>• {item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs text-[#9aa69a]">
          Not recorded in the current catalogue.
        </p>
      )}
    </div>
  );
}
