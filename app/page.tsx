
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  materials,
  materialCategories,
  type Material,
} from "../data/materials";

import StandardsModule from "./StandardsModule";
import ProjectRecommendations from "./ProjectRecommendations";
import EvidenceModule from "./EvidenceModule";
import TechnicalReportsModule from "./TechnicalReportsModule";

type Section =
  | "Overview"
  | "Material Explorer"
  | "Project Recommendations"
  | "Compare Materials"
  | "IS Standards"
  | "Evidence & Verification"
  | "Technical Reports";

const navigation: {
  name: Section;
  icon: string;
  description: string;
}[] = [
  { name: "Overview", icon: "⌂", description: "Project dashboard" },
  { name: "Material Explorer", icon: "▦", description: "Construction material library" },
  {
    name: "Project Recommendations",
    icon: "✳",
    description: "Project brief & alternatives",
  },
  { name: "Compare Materials", icon: "⇄", description: "Shortlist & select materials" },
  { name: "IS Standards", icon: "▤", description: "Codes & specifications" },
  {
    name: "Evidence & Verification",
    icon: "✓",
    description: "Test reports & certificates",
  },
  { name: "Technical Reports", icon: "▧", description: "Project documentation" },
];

function propertyText(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "Not specified";
  }

  if (Array.isArray(value)) {
    return value.map(String).join(", ");
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function getProperties(material: Material): [string, unknown][] {
  const properties = material.properties ?? [];

  // Current catalogue format: [{ property, value, unit, source? }]
  if (Array.isArray(properties)) {
    return properties.map((item) => [
      item.property || "Property",
      [item.value, item.unit].filter(Boolean).join(" ") || "Not specified",
    ]);
  }

  // Backward compatibility for key-value property objects.
  return Object.entries(properties as Record<string, unknown>);
}

function standardText(standard: unknown): string {
  if (typeof standard === "string") return standard;

  if (standard && typeof standard === "object") {
    const item = standard as {
      code?: string;
      description?: string;
      verified?: boolean;
    };

    return [
      item.code,
      item.description,
      item.verified === undefined
        ? ""
        : item.verified
          ? "Catalogue marked verified"
          : "Not verified",
    ]
      .filter(Boolean)
      .join(" — ");
  }

  return propertyText(standard);
}

function StatusBadge({ status }: { status: string }) {
  const normalized = (status || "").toLowerCase();

  if (normalized.includes("verified")) {
    return (
      <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
        Verified
      </span>
    );
  }

  if (normalized.includes("pending")) {
    return (
      <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
        Pending verification
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
      {status || "Not specified"}
    </span>
  );
}

/* MATERIAL IMAGE
   Loads the supplied image directly inside the SustainAI page.
   No external image-opening link is used.
*/
function MaterialImage({
  material,
  className = "",
}: {
  material: Material;
  className?: string;
}) {
  const [imageError, setImageError] = useState(false);

  const imageUrl = material.image?.url;

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#eaf1e8] to-[#f7f5ed] ${className}`}
    >
      {imageUrl && !imageError ? (
        <img
          src={imageUrl}
          alt={`${material.name} reference`}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-[#64876a]">
          <span className="text-4xl">◈</span>
          <span className="mt-2 text-xs text-[#718474]">
            Image unavailable
          </span>
          <span className="mt-1 text-[10px] text-[#9aa69a]">
            {material.id}
          </span>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [active, setActive] = useState<Section>("Overview");

  const [category, setCategory] = useState("All Categories");
  const [type, setType] = useState("All Types");
  const [search, setSearch] = useState("");

  const [selectedMaterial, setSelectedMaterial] =
    useState<Material | null>(null);

  const [compareIds, setCompareIds] = useState<string[]>([]);

  // Receive material selections from Project Recommendations.
  useEffect(() => {
    function handleRecommendationCompare(event: Event) {
      const customEvent = event as CustomEvent<{ id?: string }>;
      const id = customEvent.detail?.id;

      if (!id || !materials.some((material) => material.id === id)) {
        return;
      }

      setCompareIds((previous) => {
        if (previous.includes(id) || previous.length >= 3) {
          return previous;
        }

        return [...previous, id];
      });

      setActive("Compare Materials");
      setSelectedMaterial(null);
    }

    window.addEventListener(
      "sustainai:add-to-comparison",
      handleRecommendationCompare
    );

    return () => {
      window.removeEventListener(
        "sustainai:add-to-comparison",
        handleRecommendationCompare
      );
    };
  }, []);

  const comparedMaterials = materials.filter((material) =>
    compareIds.includes(material.id)
  );

  const types = useMemo(
    () => [
      "All Types",
      ...Array.from(
        new Set(materials.map((material) => material.type).filter(Boolean))
      ),
    ],
    []
  );

  const filteredMaterials = useMemo(() => {
    const query = search.toLowerCase().trim();

    return materials.filter((material) => {
      const matchesCategory =
        category === "All Categories" || material.category === category;

      const matchesType = type === "All Types" || material.type === type;

      const searchableText = [
        material.id,
        material.name,
        material.category,
        material.type,
        material.description,
        ...(material.applications ?? []),
        ...(material.advantages ?? []),
        ...(material.limitations ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesCategory &&
        matchesType &&
        searchableText.includes(query)
      );
    });
  }, [category, type, search]);

  const totalMaterials = materials.length;
  const totalCategories = materialCategories.length;

  const pendingMaterials = materials.filter(
    (material) => material.verificationStatus === "pending"
  ).length;

  const comparisonProperties = Array.from(
    new Set(
      comparedMaterials.flatMap((material) =>
        getProperties(material).map(([key]) => key)
      )
    )
  );

  function toggleCompare(id: string) {
    setCompareIds((previous) => {
      if (previous.includes(id)) {
        return previous.filter((item) => item !== id);
      }

      if (previous.length >= 3) {
        return previous;
      }

      return [...previous, id];
    });
  }

  function navigateTo(section: Section) {
    setActive(section);
    setSelectedMaterial(null);
  }

  function MaterialCard({ material }: { material: Material }) {
    const isCompared = compareIds.includes(material.id);

    return (
      <article className="group overflow-hidden rounded-2xl border border-[#e5e9df] bg-white transition duration-200 hover:-translate-y-1 hover:border-[#9db9a0] hover:shadow-lg">
        <MaterialImage material={material} className="h-44 w-full" />

        <div className="p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#edf4ec] px-3 py-1 text-[10px] font-semibold text-[#47734f]">
              {material.category}
            </span>

            <span className="text-[10px] text-[#9aa69a]">
              {material.id}
            </span>
          </div>

          <h3 className="mt-3 text-base font-semibold text-[#263b2e]">
            {material.name}
          </h3>

          <p className="mt-2 min-h-[60px] text-xs leading-5 text-[#829084]">
            {material.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedMaterial(material)}
              className="flex-1 rounded-lg bg-[#174c37] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#286448]"
            >
              View Details
            </button>

            <button
              type="button"
              onClick={() => toggleCompare(material.id)}
              disabled={!isCompared && compareIds.length >= 3}
              className={`rounded-lg border px-3 py-2.5 text-xs font-semibold transition ${
                isCompared
                  ? "border-[#174c37] bg-[#edf4ec] text-[#174c37]"
                  : "border-[#dfe7dc] text-[#58725d] hover:bg-[#f2f6ef]"
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              {isCompared ? "Added ✓" : "+ Compare"}
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f7f2] text-[#263b2e]">
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <aside className="hidden w-[255px] shrink-0 border-r border-[#e4e9df] bg-[#fffefa] lg:flex lg:flex-col">
          <div className="border-b border-[#e8ece5] px-6 py-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#174c37] text-xl font-bold text-white">
                S
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  SustainAI
                </h1>
                <p className="text-[10px] tracking-[1.5px] text-[#91a091]">
                  SUSTAINABLE CONSTRUCTION
                </p>
              </div>
            </div>
          </div>

          <div className="px-4 py-6">
            <p className="mb-3 px-3 text-[10px] font-bold tracking-[2px] text-[#9aa69a]">
              PROJECT WORKFLOW
            </p>

            <nav className="space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => navigateTo(item.name)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                    active === item.name
                      ? "bg-[#eaf2e9] text-[#174c37]"
                      : "text-[#7c8b7d] hover:bg-[#f3f6f0]"
                  }`}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-lg">
                    {item.icon}
                  </span>

                  <span className="min-w-0">
                    <span className="block text-xs font-semibold">
                      {item.name}
                    </span>
                    <span className="mt-0.5 block text-[10px] text-[#9aa69a]">
                      {item.description}
                    </span>
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-5">
            <div className="rounded-2xl bg-[#edf3e9] p-4">
              <p className="text-xs font-semibold text-[#315e40]">
                Build sustainably.
              </p>
              <p className="mt-2 text-[11px] leading-5 text-[#758b77]">
                Better material decisions begin with reliable engineering
                information.
              </p>
              <p className="mt-4 text-[9px] tracking-wide text-[#91a091]">
                EXPLORE. COMPARE. VERIFY. BUILD.
              </p>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <div className="min-w-0 flex-1">
          {/* TOP BAR */}
          <header className="sticky top-0 z-30 border-b border-[#e5e9df] bg-[#fffefa]/95 px-5 py-4 backdrop-blur md:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold tracking-[2px] text-[#94a092]">
                  CONSTRUCTION MATERIALS & PROJECT PLANNING
                </p>

                <h2 className="mt-1 text-lg font-semibold">{active}</h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden rounded-full bg-[#edf3e9] px-4 py-2 text-[10px] font-medium text-[#47734f] sm:block">
                  Construction Project Workspace
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#174c37] text-sm font-semibold text-white">
                  S
                </div>
              </div>
            </div>

            {/* MOBILE NAVIGATION */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => navigateTo(item.name)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium ${
                    active === item.name
                      ? "bg-[#174c37] text-white"
                      : "border border-[#e0e8dd] bg-white text-[#728174]"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] px-5 py-7 md:px-8 md:py-9">
            {/* OVERVIEW */}
            {active === "Overview" && (
              <div className="space-y-8">
                <section className="relative overflow-hidden rounded-3xl bg-[#174c37] p-7 text-white md:p-10">
                  <div className="relative z-10 max-w-2xl">
                    <p className="text-[10px] font-bold tracking-[3px] text-[#b7d3b7]">
                      YOUR CONSTRUCTION MATERIAL WORKSPACE
                    </p>

                    <h1 className="mt-4 text-3xl font-semibold leading-tight md:text-5xl">
                      Plan smarter. Specify better.
                      <br />
                      Build with evidence.
                    </h1>

                    <p className="mt-5 max-w-xl text-sm leading-7 text-[#d2e1d1]">
                      Discover sustainable construction materials, compare
                      engineering properties and evaluate alternatives using
                      standards and technical evidence.
                    </p>

                    <div className="mt-7 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => navigateTo("Material Explorer")}
                        className="rounded-xl bg-white px-5 py-3 text-xs font-semibold text-[#174c37] transition hover:bg-[#eaf2e9]"
                      >
                        Browse Material Library →
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateTo("Compare Materials")}
                        className="rounded-xl border border-[#7eaa8b] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#286448]"
                      >
                        Build a Material Shortlist
                      </button>
                    </div>
                  </div>

                  <div className="pointer-events-none absolute -right-16 -top-24 h-80 w-80 rounded-full border border-[#6e9c78]/30" />
                  <div className="pointer-events-none absolute -right-4 -top-12 h-60 w-60 rounded-full border border-[#6e9c78]/30" />
                  <div className="pointer-events-none absolute -bottom-32 right-32 h-72 w-72 rounded-full border border-[#6e9c78]/30" />
                </section>

                {/* DASHBOARD STATS */}
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    {
                      label: "Material Catalogue",
                      value: totalMaterials,
                      note: "Catalogue records",
                      icon: "◈",
                    },
                    {
                      label: "Material Categories",
                      value: totalCategories,
                      note: "Construction domains",
                      icon: "▦",
                    },
                    {
                      label: "Selected for Comparison",
                      value: compareIds.length,
                      note: "Maximum 3 materials",
                      icon: "⇄",
                    },
                    {
                      label: "Pending Verification",
                      value: pendingMaterials,
                      note: "Evidence review required",
                      icon: "◷",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-[#e5e9df] bg-white p-5"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-[#829084]">{stat.label}</p>
                        <span className="text-xl text-[#6c9572]">
                          {stat.icon}
                        </span>
                      </div>

                      <p className="mt-4 text-3xl font-semibold">
                        {stat.value}
                      </p>

                      <p className="mt-2 text-[10px] text-[#9aa69a]">
                        {stat.note}
                      </p>
                    </div>
                  ))}
                </section>

                {/* WORKFLOW */}
                <section>
                  <div className="mb-5">
                    <p className="text-[10px] font-bold tracking-[2px] text-[#8a9b8b]">
                      PROJECT DELIVERY WORKFLOW
                    </p>
                    <h2 className="mt-2 text-xl font-semibold">
                      A practical workflow from project brief to specification
                    </h2>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    {[
                      {
                        number: "01",
                        title: "Define the project",
                        text: "Set the building or infrastructure type, use and site requirements.",
                        section: "Project Recommendations" as Section,
                        tag: "PROJECT BRIEF",
                      },
                      {
                        number: "02",
                        title: "Explore materials",
                        text: "Browse conventional, sustainable and alternative construction materials.",
                        section: "Material Explorer" as Section,
                        tag: "MATERIAL TAKE-OFF",
                      },
                      {
                        number: "03",
                        title: "Shortlist & compare",
                        text: "Compare applications, properties, advantages and limitations.",
                        section: "Compare Materials" as Section,
                        tag: "SELECTION",
                      },
                      {
                        number: "04",
                        title: "Check IS standards",
                        text: "Review relevant Indian Standards references for the intended application.",
                        section: "IS Standards" as Section,
                        tag: "SPECIFICATION",
                      },
                      {
                        number: "05",
                        title: "Review site evidence",
                        text: "Organise product-specific test reports, certificates and supporting records.",
                        section: "Evidence & Verification" as Section,
                        tag: "QUALITY CHECK",
                      },
                      {
                        number: "06",
                        title: "Prepare the report",
                        text: "Compile the material review into a technical project report.",
                        section: "Technical Reports" as Section,
                        tag: "DOCUMENTATION",
                      },
                    ].map((step) => (
                      <button
                        key={step.number}
                        type="button"
                        onClick={() => navigateTo(step.section)}
                        className="group rounded-2xl border border-[#ded6ca] bg-[#fffdf8] p-5 text-left transition hover:-translate-y-1 hover:border-[#c47742] hover:shadow-lg"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-[#b65c32]">{step.number}</span>
                          <span className="rounded-full bg-[#eee8dc] px-2.5 py-1 text-[9px] font-bold tracking-wider text-[#6b6258]">{step.tag}</span>
                        </div>
                        <h3 className="mt-5 text-base font-bold text-[#292a2b] group-hover:text-[#a84e2a]">{step.title}</h3>
                        <p className="mt-2 text-xs leading-6 text-[#746f68]">{step.text}</p>
                        <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-[#a6532e]">Open step →</p>
                      </button>
                    ))}
                  </div>
                </section>

                {/* QUICK ACCESS */}
                <section>
                  <div className="mb-5">
                    <p className="text-[10px] font-bold tracking-[2px] text-[#8a9b8b]">
                      QUICK ACCESS
                    </p>
                    <h2 className="mt-2 text-xl font-semibold">
                      Continue your work
                    </h2>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                      {
                        title: "Material Explorer",
                        description: "Browse the construction material catalogue.",
                        icon: "◈",
                        section: "Material Explorer" as Section,
                      },
                      {
                        title: "Project Recommendations",
                        description: "Find alternatives based on project requirements.",
                        icon: "✳",
                        section: "Project Recommendations" as Section,
                      },
                      {
                        title: "IS Standards",
                        description: "Explore relevant Indian Standards references.",
                        icon: "▤",
                        section: "IS Standards" as Section,
                      },
                      {
                        title: "Evidence & Verification",
                        description: "Upload and review supporting documents.",
                        icon: "✓",
                        section: "Evidence & Verification" as Section,
                      },
                    ].map((item) => (
                      <button
                        key={item.title}
                        type="button"
                        onClick={() => navigateTo(item.section)}
                        className="rounded-2xl border border-[#e5e9df] bg-white p-5 text-left transition hover:-translate-y-1 hover:border-[#9db9a0] hover:shadow-md"
                      >
                        <span className="text-2xl text-[#6c9572]">{item.icon}</span>
                        <h3 className="mt-4 text-sm font-semibold">{item.title}</h3>
                        <p className="mt-2 text-xs leading-5 text-[#829084]">
                          {item.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* MATERIAL EXPLORER */}
            {active === "Material Explorer" && (
              <section>
                <div className="mb-7">
                  <p className="text-[10px] font-bold tracking-[2px] text-[#8a9b8b]">
                    CONSTRUCTION MATERIAL CATALOGUE
                  </p>
                  <h1 className="mt-2 text-2xl font-semibold">
                    Explore Materials
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#849184]">
                    Discover conventional, sustainable and alternative
                    construction materials for different project applications.
                  </p>
                </div>

                <div className="mb-6 rounded-2xl border border-[#e5e9df] bg-white p-5">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-[#647666]">
                        Search materials
                      </label>
                      <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by material, use or property..."
                        className="w-full rounded-xl border border-[#e3e8df] px-4 py-3 text-sm outline-none focus:border-[#78a27d]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-[#647666]">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        className="w-full rounded-xl border border-[#e3e8df] bg-white px-4 py-3 text-sm outline-none focus:border-[#78a27d]"
                      >
                        <option>All Categories</option>
                        {materialCategories.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-[#647666]">
                        Material type
                      </label>
                      <select
                        value={type}
                        onChange={(event) => setType(event.target.value)}
                        className="w-full rounded-xl border border-[#e3e8df] bg-white px-4 py-3 text-sm outline-none focus:border-[#78a27d]"
                      >
                        {types.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-[#829084]">
                      Showing {filteredMaterials.length} of {totalMaterials} materials
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setCategory("All Categories");
                        setType("All Types");
                      }}
                      className="text-xs font-semibold text-[#47734f] hover:underline"
                    >
                      Clear filters
                    </button>
                  </div>
                </div>

                {filteredMaterials.length > 0 ? (
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredMaterials.map((material) => (
                      <MaterialCard key={material.id} material={material} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-[#cbd8ca] bg-white p-12 text-center">
                    <div className="text-3xl text-[#80a184]">◈</div>
                    <h3 className="mt-3 font-semibold">No materials found</h3>
                    <p className="mt-2 text-xs text-[#829084]">
                      Try changing your search or category filters.
                    </p>
                  </div>
                )}
              </section>
            )}

            {/* PROJECT RECOMMENDATIONS */}
            {active === "Project Recommendations" && (
              <ProjectRecommendations />
            )}

            {/* COMPARE MATERIALS */}
            {active === "Compare Materials" && (
              <section>
                <div className="mb-7">
                  <p className="text-[10px] font-bold tracking-[2px] text-[#8a9b8b]">
                    MATERIAL ANALYSIS
                  </p>
                  <h1 className="mt-2 text-2xl font-semibold">
                    Compare Materials
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#849184]">
                    Compare catalogue information for up to three materials.
                    This is an initial screening aid, not a design approval.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#e5e9df] bg-white p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">Select materials</h3>
                      <p className="mt-1 text-xs text-[#829084]">
                        You can compare a maximum of three materials.
                      </p>
                    </div>
                    <span className="rounded-full bg-[#edf4ec] px-3 py-1.5 text-xs font-semibold text-[#47734f]">
                      {compareIds.length} / 3 selected
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {materials.map((material) => {
                      const selected = compareIds.includes(material.id);

                      return (
                        <button
                          key={material.id}
                          type="button"
                          onClick={() => toggleCompare(material.id)}
                          disabled={!selected && compareIds.length >= 3}
                          className={`rounded-xl border p-4 text-left transition ${
                            selected
                              ? "border-[#6d9b73] bg-[#edf4ec]"
                              : "border-[#e5e9df] bg-white hover:border-[#a7c4ae]"
                          } disabled:cursor-not-allowed disabled:opacity-40`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold">{material.name}</p>
                              <p className="mt-1 text-[10px] text-[#829084]">
                                {material.category} · {material.id}
                              </p>
                            </div>
                            <span className="font-bold text-[#47734f]">
                              {selected ? "✓" : "+"}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {comparedMaterials.length > 0 ? (
                  <div className="mt-6 rounded-2xl border border-[#e5e9df] bg-white">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5e9df] p-5">
                      <div>
                        <h3 className="font-semibold">Material Comparison</h3>
                        <p className="mt-1 text-xs text-[#829084]">
                          Side-by-side engineering information
                        </p>
                      </div>

                      <span className="text-xs text-[#829084]">
                        {comparedMaterials.length} selected
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[750px] border-collapse text-left">
                        <thead>
                          <tr className="bg-[#f5f7f2]">
                            <th className="w-[190px] p-4 text-xs font-semibold text-[#607462]">
                              Comparison Parameter
                            </th>

                            {comparedMaterials.map((material) => (
                              <th
                                key={material.id}
                                className="min-w-[190px] p-4 text-xs font-semibold text-[#315e40]"
                              >
                                <div>{material.name}</div>

                                <button
                                  type="button"
                                  onClick={() => toggleCompare(material.id)}
                                  className="mt-2 text-[10px] font-medium text-red-600"
                                >
                                  Remove
                                </button>
                              </th>
                            ))}
                          </tr>
                        </thead>

                        <tbody>
                          {[
                            {
                              label: "Category",
                              getValue: (m: Material) => m.category,
                            },
                            {
                              label: "Material Type",
                              getValue: (m: Material) => m.type,
                            },
                            {
                              label: "Description",
                              getValue: (m: Material) => m.description,
                            },
                            {
                              label: "Applications",
                              getValue: (m: Material) => m.applications,
                            },
                            {
                              label: "Advantages",
                              getValue: (m: Material) => m.advantages,
                            },
                            {
                              label: "Limitations",
                              getValue: (m: Material) => m.limitations,
                            },
                            {
                              label: "Testing Requirements",
                              getValue: (m: Material) => m.testingRequirements,
                            },
                            {
                              label: "Relevant Standards",
                              getValue: (m: Material) => m.standards,
                            },
                            {
                              label: "Conventional Alternative",
                              getValue: (m: Material) =>
                                m.conventionalAlternative,
                            },
                            {
                              label: "Verification Status",
                              getValue: (m: Material) => m.verificationStatus,
                            },
                          ].map((row) => (
                            <tr
                              key={row.label}
                              className="border-t border-[#edf0ea] align-top"
                            >
                              <td className="bg-[#fafbf8] p-4 text-xs font-semibold text-[#647666]">
                                {row.label}
                              </td>

                              {comparedMaterials.map((material) => (
                                <td
                                  key={material.id}
                                  className="p-4 text-xs leading-6 text-[#788579]"
                                >
                                  {row.label === "Verification Status" ? (
                                    <StatusBadge
                                      status={propertyText(
                                        row.getValue(material)
                                      )}
                                    />
                                  ) : (
                                    row.label === "Relevant Standards" &&
                                    Array.isArray(row.getValue(material))
                                      ? (row.getValue(material) as unknown[])
                                          .map(standardText)
                                          .join("; ")
                                      : propertyText(row.getValue(material))
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="border-t border-[#e5e9df] p-5">
                      <h3 className="text-sm font-semibold">
                        Material Properties
                      </h3>

                      {comparisonProperties.length > 0 ? (
                        <div className="mt-4 overflow-x-auto">
                          <table className="w-full min-w-[600px] text-left">
                            <thead>
                              <tr className="bg-[#f5f7f2]">
                                <th className="p-3 text-xs">Property</th>
                                {comparedMaterials.map((material) => (
                                  <th key={material.id} className="p-3 text-xs">
                                    {material.name}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {comparisonProperties.map((property) => (
                                <tr key={property} className="border-t border-[#edf0ea]">
                                  <td className="p-3 text-xs font-semibold text-[#647666]">
                                    {property}
                                  </td>
                                  {comparedMaterials.map((material) => {
                                    const value = getProperties(material).find(
                                      ([key]) => key === property
                                    )?.[1];

                                    return (
                                      <td
                                        key={material.id}
                                        className="p-3 text-xs text-[#788579]"
                                      >
                                        {value === undefined
                                          ? "Not recorded"
                                          : propertyText(value)}
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="mt-3 text-xs text-[#9aa69a]">
                          No technical property values are currently recorded
                          for the selected materials.
                        </p>
                      )}

                      <p className="mt-5 text-[10px] leading-5 text-[#9aa69a]">
                        <strong>Engineering note:</strong> This comparison
                        presents catalogue information. It does not establish
                        equivalence, structural suitability or code compliance.
                        Actual project suitability requires relevant design
                        checks, current standards and supporting test evidence.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 rounded-2xl border border-dashed border-[#cbd8ca] bg-white p-12 text-center">
                    <div className="text-3xl text-[#80a184]">⇄</div>
                    <h3 className="mt-3 font-semibold">
                      Start your comparison
                    </h3>
                    <p className="mt-2 text-xs text-[#829084]">
                      Select at least one material above.
                    </p>
                  </div>
                )}
              </section>
            )}

            {/* IS STANDARDS */}
            {active === "IS Standards" && <StandardsModule />}

            {/* EVIDENCE AND VERIFICATION */}
            {active === "Evidence & Verification" && <EvidenceModule />}

            {/* TECHNICAL REPORTS */}
            {active === "Technical Reports" && <TechnicalReportsModule />}

            {/* FOOTER */}
            <footer className="mt-12 border-t border-[#e5e9df] pt-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[10px] text-[#9aa69a]">
                  © 2026 SustainAI · Sustainable Construction Intelligence
                </p>

                <p className="text-[10px] tracking-wide text-[#9aa69a]">
                  EXPLORE · COMPARE · VERIFY · BUILD
                </p>
              </div>
            </footer>
          </div>
        </div>
      </div>

      {/* MATERIAL DETAILS MODAL */}
      {selectedMaterial && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#14251c]/60 p-4"
          onClick={() => setSelectedMaterial(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="material-modal-title"
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 text-[#263b2e] shadow-2xl md:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold tracking-[2px] text-[#709477]">
                  MATERIAL PROFILE · {selectedMaterial.id}
                </p>

                <h2
                  id="material-modal-title"
                  className="mt-2 text-2xl font-semibold"
                >
                  {selectedMaterial.name}
                </h2>

                <p className="mt-2 text-xs text-[#829084]">
                  {selectedMaterial.category} · {selectedMaterial.type}
                </p>
              </div>

              <button
                type="button"
                aria-label="Close material details"
                onClick={() => setSelectedMaterial(null)}
                className="rounded-lg bg-[#f0f4ef] px-4 py-2 text-sm"
              >
                ✕
              </button>
            </div>

            <MaterialImage
              material={selectedMaterial}
              className="mt-6 h-52 w-full rounded-2xl"
            />

            <div className="mt-6 rounded-xl bg-[#f5f7f2] p-5">
              <p className="text-xs font-semibold">Description</p>
              <p className="mt-2 text-sm leading-7 text-[#718174]">
                {selectedMaterial.description}
              </p>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {[
                {
                  title: "Applications",
                  items: selectedMaterial.applications ?? [],
                },
                {
                  title: "Advantages",
                  items: selectedMaterial.advantages ?? [],
                },
                {
                  title: "Limitations",
                  items: selectedMaterial.limitations ?? [],
                },
                {
                  title: "Testing Requirements",
                  items: selectedMaterial.testingRequirements ?? [],
                },
                {
                  title: "Relevant Standards",
                  items: (selectedMaterial.standards ?? []).map(standardText),
                },
              ].map((group) => (
                <div
                  key={group.title}
                  className="rounded-xl border border-[#e7ebe3] p-5"
                >
                  <h3 className="text-sm font-semibold">{group.title}</h3>

                  {group.items.length > 0 ? (
                    <ul className="mt-3 space-y-2 text-xs leading-5 text-[#829084]">
                      {group.items.map((item, index) => (
                        <li key={`${group.title}-${index}`}>• {item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-xs text-[#9aa69a]">
                      Not specified in the current catalogue.
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-[#e7ebe3] p-5">
              <h3 className="text-sm font-semibold">Material Properties</h3>

              {getProperties(selectedMaterial).length > 0 ? (
                <div className="mt-3 space-y-3">
                  {getProperties(selectedMaterial).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex flex-wrap justify-between gap-3 border-b border-[#f0f2ed] pb-2 text-xs"
                    >
                      <span className="text-[#829084]">{key}</span>
                      <span className="font-medium">
                        {propertyText(value)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-xs text-[#9aa69a]">
                  No numerical or technical property values have been
                  recorded for this material yet.
                </p>
              )}
            </div>

            <div className="mt-5 rounded-xl bg-[#f5f7f2] p-5">
              <h3 className="text-sm font-semibold">
                Conventional Alternative
              </h3>

              <p className="mt-2 text-xs text-[#829084]">
                {selectedMaterial.conventionalAlternative || "Not specified"}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold">Verification Status</p>
                  <div className="mt-2">
                    <StatusBadge
                      status={selectedMaterial.verificationStatus}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleCompare(selectedMaterial.id)}
                  disabled={
                    !compareIds.includes(selectedMaterial.id) &&
                    compareIds.length >= 3
                  }
                  className="rounded-lg bg-[#174c37] px-4 py-3 text-xs font-semibold text-white disabled:opacity-40"
                >
                  {compareIds.includes(selectedMaterial.id)
                    ? "Remove from Comparison"
                    : "Add to Comparison"}
                </button>
              </div>
            </div>

            <p className="mt-5 text-[10px] leading-5 text-[#9aa69a]">
              Catalogue information is preliminary. Verify material-specific
              technical specifications, applicable standards, test reports and
              project requirements before engineering approval.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
