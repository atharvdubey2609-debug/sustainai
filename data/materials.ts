
import { materialImageMap } from "./material-images";

export type Material = {
  id: string;
  name: string;
  category: string;
  type: "conventional" | "sustainable" | "alternative";
  description: string;
  applications: string[];
  properties: {
    property: string;
    value: string;
    unit: string;
    source?: string;
  }[];
  advantages: string[];
  limitations: string[];
  testingRequirements: string[];
  standards: {
    code: string;
    description: string;
    verified: boolean;
    source?: string;
  }[];
  conventionalAlternative?: string;
  image: {
    url: string;
    attribution: string;
    sourceUrl: string;
  } | null;
  evidence: {
    title: string;
    url: string;
    type: string;
  }[];
  verificationStatus: "verified" | "partially-verified" | "pending";
};

type MaterialSeed = {
  name: string;
  type: Material["type"];
  description: string;
};

const catalogue: Record<string, MaterialSeed[]> = {
  "Cementitious Materials": [
    { name: "Ordinary Portland Cement (OPC)", type: "conventional", description: "Hydraulic cement manufactured primarily from Portland cement clinker and gypsum." },
    { name: "Fly Ash Based Portland Pozzolana Cement", type: "sustainable", description: "Blended cement incorporating fly ash as a pozzolanic constituent." },
    { name: "Calcined Clay Based Portland Pozzolana Cement", type: "sustainable", description: "Blended cement incorporating calcined clay as a pozzolanic constituent." },
    { name: "Portland Slag Cement", type: "sustainable", description: "Blended hydraulic cement incorporating granulated blast furnace slag." },
    { name: "Composite Cement", type: "sustainable", description: "Blended cement incorporating multiple permitted cementitious constituents." },
    { name: "Portland Calcined Clay Limestone Cement (LC3)", type: "sustainable", description: "Blended binder combining clinker, calcined clay and limestone." },
    { name: "Ground Granulated Blast Furnace Slag (GGBS)", type: "alternative", description: "Ground slag used as a supplementary cementitious material." },
    { name: "Fly Ash", type: "alternative", description: "Fine residue from coal combustion used in suitable pozzolanic applications." },
    { name: "Silica Fume", type: "alternative", description: "Silica-rich by-product used in high-performance cementitious mixtures." },
    { name: "Metakaolin", type: "alternative", description: "Reactive aluminosilicate pozzolan produced by calcining suitable kaolin clay." },
    { name: "Rice Husk Ash", type: "alternative", description: "Silica-rich agricultural residue ash investigated for pozzolanic applications." },
    { name: "Lime-Pozzolana Binder", type: "alternative", description: "Binder combining lime and suitable reactive pozzolanic material." },
    { name: "Geopolymer Binder", type: "alternative", description: "Alkali-activated aluminosilicate binder system." },
    { name: "Supersulphated Cement", type: "alternative", description: "Special hydraulic cement primarily based on granulated blast furnace slag." },
    { name: "Building Lime", type: "alternative", description: "Lime-based binder used in compatible masonry, plaster and conservation applications." }
  ],

  "Aggregates": [
    { name: "Natural River Sand", type: "conventional", description: "Naturally occurring fine aggregate obtained from suitable river deposits." },
    { name: "Crushed Stone Aggregate", type: "conventional", description: "Coarse aggregate produced by crushing suitable natural rock." },
    { name: "Manufactured Sand (M-Sand)", type: "sustainable", description: "Processed fine aggregate manufactured by crushing and grading suitable rock." },
    { name: "Recycled Concrete Aggregate", type: "sustainable", description: "Aggregate produced by processing suitable demolished concrete." },
    { name: "Recycled Masonry Aggregate", type: "sustainable", description: "Processed aggregate made from suitable brick and masonry demolition waste." },
    { name: "Recycled Asphalt Pavement Aggregate", type: "sustainable", description: "Reclaimed asphalt pavement material processed for reuse." },
    { name: "Steel Slag Aggregate", type: "sustainable", description: "Processed steelmaking slag investigated for road and construction applications." },
    { name: "Copper Slag Aggregate", type: "alternative", description: "Copper smelting by-product investigated as a partial aggregate replacement." },
    { name: "Expanded Clay Aggregate", type: "alternative", description: "Lightweight porous aggregate produced by heating suitable clay." },
    { name: "Sintered Fly Ash Aggregate", type: "sustainable", description: "Artificial lightweight aggregate manufactured using processed fly ash." },
    { name: "Pumice Aggregate", type: "alternative", description: "Naturally occurring porous volcanic lightweight aggregate." },
    { name: "Recycled Glass Aggregate", type: "sustainable", description: "Processed waste glass used in selected construction applications." },
    { name: "Crushed Brick Aggregate", type: "sustainable", description: "Aggregate produced from suitable rejected or demolished bricks." },
    { name: "Recycled Ceramic Aggregate", type: "sustainable", description: "Processed aggregate made from suitable ceramic production and demolition waste." },
    { name: "Laterite Aggregate", type: "alternative", description: "Naturally occurring lateritic material used in selected regional construction applications." }
  ],

  "Masonry Materials": [
    { name: "Burnt Clay Brick", type: "conventional", description: "Masonry unit manufactured by moulding and firing suitable clay." },
    { name: "Fly Ash Brick", type: "sustainable", description: "Masonry unit manufactured using fly ash and suitable binding constituents." },
    { name: "Autoclaved Aerated Concrete Block (AAC)", type: "sustainable", description: "Lightweight cellular concrete masonry unit produced by autoclaving." },
    { name: "Concrete Hollow Block", type: "conventional", description: "Hollow concrete masonry unit used in wall construction." },
    { name: "Concrete Solid Block", type: "conventional", description: "Solid precast concrete masonry unit." },
    { name: "Compressed Stabilized Earth Block (CSEB)", type: "sustainable", description: "Compacted earth masonry unit stabilized with a suitable binder." },
    { name: "Unstabilized Compressed Earth Block", type: "alternative", description: "Compacted earth masonry unit without added cementitious stabilization." },
    { name: "Interlocking Earth Block", type: "sustainable", description: "Earth-based masonry unit shaped to interlock with adjacent units." },
    { name: "Laterite Stone Block", type: "alternative", description: "Locally quarried lateritic stone used as a masonry unit." },
    { name: "Lime-Sand Brick", type: "alternative", description: "Masonry unit manufactured from sand and lime through controlled curing." },
    { name: "Hempcrete Block", type: "sustainable", description: "Hemp shiv and binder composite used primarily as non-load-bearing infill or insulation." },
    { name: "Recycled Plastic Masonry Block", type: "alternative", description: "Masonry-like unit manufactured using processed recycled plastics." },
    { name: "Geopolymer Concrete Block", type: "alternative", description: "Concrete masonry unit using an alkali-activated binder system." },
    { name: "Recycled Aggregate Concrete Block", type: "sustainable", description: "Concrete masonry unit incorporating suitable recycled aggregates." },
    { name: "Straw-Clay Masonry Unit", type: "alternative", description: "Earth-based masonry unit incorporating agricultural straw fibres." }
  ],

  "Reinforcement Materials": [
    { name: "Mild Steel Reinforcement", type: "conventional", description: "Plain carbon steel reinforcement used in concrete construction." },
    { name: "High Strength Deformed Steel Bar", type: "conventional", description: "Ribbed high-strength steel reinforcement for reinforced concrete." },
    { name: "Thermo-Mechanically Treated (TMT) Bar", type: "conventional", description: "Steel reinforcement processed through controlled thermal and mechanical treatment." },
    { name: "Corrosion-Resistant Reinforcement Steel", type: "alternative", description: "Reinforcement steel designed to improve corrosion resistance." },
    { name: "Stainless Steel Reinforcement", type: "alternative", description: "Stainless steel reinforcement for applications requiring enhanced corrosion resistance." },
    { name: "Galvanized Steel Reinforcement", type: "alternative", description: "Steel reinforcement protected by a zinc coating." },
    { name: "Epoxy-Coated Reinforcement", type: "alternative", description: "Steel reinforcement protected by a specified epoxy coating." },
    { name: "Glass Fibre Reinforced Polymer (GFRP) Bar", type: "alternative", description: "Non-metallic reinforcement made using glass fibres and polymer resin." },
    { name: "Carbon Fibre Reinforced Polymer (CFRP) Bar", type: "alternative", description: "High-strength non-metallic reinforcement made using carbon fibres." },
    { name: "Basalt Fibre Reinforced Polymer Bar", type: "alternative", description: "Non-metallic reinforcement manufactured using basalt fibres and polymer resin." },
    { name: "Fibre Reinforced Concrete Reinforcement", type: "alternative", description: "Discrete fibres incorporated into concrete to modify its cracking and post-cracking behaviour." },
    { name: "Recycled Steel Reinforcement", type: "sustainable", description: "Steel reinforcement produced using recycled steel feedstock and controlled manufacturing." }
  ],

  "Timber & Natural Materials": [
    { name: "Structural Timber", type: "conventional", description: "Graded timber used for structural building applications." },
    { name: "Bamboo Reinforcement", type: "alternative", description: "Treated bamboo investigated as reinforcement in selected applications." },
    { name: "Engineered Bamboo", type: "sustainable", description: "Processed bamboo assembled into engineered structural or architectural products." },
    { name: "Cross Laminated Timber (CLT)", type: "sustainable", description: "Engineered timber panels formed by bonding layers of timber crosswise." },
    { name: "Laminated Veneer Lumber (LVL)", type: "sustainable", description: "Engineered wood product made by bonding thin wood veneers." },
    { name: "Glulam", type: "sustainable", description: "Structural timber product made by bonding multiple timber laminations." },
    { name: "Reclaimed Timber", type: "sustainable", description: "Recovered timber prepared for reuse after condition assessment." },
    { name: "Coconut Timber", type: "alternative", description: "Timber obtained from coconut palm trunks for suitable applications." },
    { name: "Cork Insulation", type: "sustainable", description: "Natural cork material used for thermal and acoustic insulation." },
    { name: "Hemp Fibre Board", type: "sustainable", description: "Board product made using hemp fibres and suitable binders." },
    { name: "Straw Bale", type: "sustainable", description: "Compressed agricultural straw used as building infill or insulation." },
    { name: "Coir Fibre Composite", type: "alternative", description: "Composite material incorporating coconut coir fibres." }
  ],

  "Roofing & Insulation": [
    { name: "Galvanized Iron Roofing Sheet", type: "conventional", description: "Zinc-coated steel sheet used for roofing." },
    { name: "Colour-Coated Steel Roofing Sheet", type: "conventional", description: "Coated steel roofing sheet with a protective and decorative finish." },
    { name: "Fibre Cement Roofing Sheet", type: "conventional", description: "Fibre-reinforced cement sheet used in roofing applications." },
    { name: "Recycled Plastic Roofing Sheet", type: "sustainable", description: "Roofing product manufactured using processed recycled plastic." },
    { name: "Recycled Tetra Pak Roofing Panel", type: "alternative", description: "Panel made using recovered multilayer packaging waste." },
    { name: "Clay Roof Tile", type: "conventional", description: "Fired clay roofing unit used for pitched roofs." },
    { name: "Concrete Roof Tile", type: "conventional", description: "Precast concrete roofing unit." },
    { name: "Green Roof System", type: "sustainable", description: "Roof assembly incorporating vegetation, growing medium and drainage layers." },
    { name: "Expanded Polystyrene (EPS) Insulation", type: "conventional", description: "Rigid cellular polymer insulation board." },
    { name: "Extruded Polystyrene (XPS) Insulation", type: "conventional", description: "Rigid closed-cell polymer insulation board." },
    { name: "Mineral Wool Insulation", type: "alternative", description: "Fibrous mineral insulation used for thermal and acoustic performance." },
    { name: "Cellulose Fibre Insulation", type: "sustainable", description: "Insulation made using processed recycled paper fibres." }
  ],

  "Finishes & Flooring": [
    { name: "Ceramic Floor Tile", type: "conventional", description: "Fired ceramic tile used as a floor or wall finish." },
    { name: "Vitrified Tile", type: "conventional", description: "Dense, low-porosity ceramic tile used for flooring and cladding." },
    { name: "Natural Stone Flooring", type: "conventional", description: "Floor finish produced from cut natural stone." },
    { name: "Terrazzo Flooring", type: "alternative", description: "Composite finish made using aggregate chips embedded in a binder." },
    { name: "Recycled Glass Terrazzo", type: "sustainable", description: "Terrazzo finish incorporating recycled glass chips." },
    { name: "Recycled Rubber Flooring", type: "sustainable", description: "Flooring manufactured using recovered rubber material." },
    { name: "Bamboo Flooring", type: "sustainable", description: "Flooring product manufactured from processed bamboo." },
    { name: "Cork Flooring", type: "sustainable", description: "Floor finish manufactured using natural cork." },
    { name: "Linoleum Flooring", type: "alternative", description: "Resilient flooring made using linseed oil and other natural constituents." },
    { name: "Polished Concrete Flooring", type: "conventional", description: "Concrete floor surface mechanically ground and polished." },
    { name: "Lime Plaster", type: "alternative", description: "Plaster based on lime binder for suitable interior and exterior applications." },
    { name: "Clay Plaster", type: "sustainable", description: "Earth-based plaster using suitable clay and natural aggregates." },
    { name: "Gypsum Plaster", type: "conventional", description: "Interior plaster based on gypsum binder." },
    { name: "Recycled Plastic Composite Decking", type: "sustainable", description: "Decking product incorporating recycled polymer material." },
    { name: "Reclaimed Wood Finish", type: "sustainable", description: "Interior or exterior finish made using recovered timber." }
  ],

  "Roads & Pavements": [
    { name: "Dense Bituminous Macadam", type: "conventional", description: "Bituminous base or binder course used in flexible pavements." },
    { name: "Bituminous Concrete", type: "conventional", description: "Bituminous wearing course used in flexible pavement construction." },
    { name: "Warm Mix Asphalt", type: "sustainable", description: "Asphalt mixture produced at reduced temperatures compared with conventional hot mix." },
    { name: "Cold Mix Asphalt", type: "alternative", description: "Bituminous mixture produced without conventional high-temperature mixing." },
    { name: "Reclaimed Asphalt Pavement Mix", type: "sustainable", description: "Pavement mixture incorporating processed reclaimed asphalt material." },
    { name: "Plastic Waste Modified Bitumen Mix", type: "alternative", description: "Bituminous mixture incorporating suitably processed waste plastic." },
    { name: "Rubberized Bitumen Mix", type: "alternative", description: "Bituminous mixture incorporating processed crumb rubber." },
    { name: "Roller Compacted Concrete Pavement", type: "alternative", description: "Low-slump concrete pavement compacted using rollers." },
    { name: "Permeable Concrete Pavement", type: "sustainable", description: "Concrete pavement designed with interconnected voids to allow water infiltration." },
    { name: "Interlocking Concrete Paver", type: "conventional", description: "Precast concrete paving unit installed in an interlocking arrangement." },
    { name: "Recycled Aggregate Sub-base", type: "sustainable", description: "Pavement sub-base incorporating suitable recycled aggregate." },
    { name: "Soil-Cement Stabilized Base", type: "alternative", description: "Pavement layer formed by mixing soil with cement and compacting it." }
  ],

  "Construction Systems": [
    { name: "Conventional Cast-in-Situ RCC", type: "conventional", description: "Reinforced concrete structural system cast and cured at the construction site." },
    { name: "Precast Concrete Construction", type: "alternative", description: "Building components manufactured before transportation and installation." },
    { name: "Precast Wall Panel System", type: "alternative", description: "Building envelope or structural wall system using factory-produced panels." },
    { name: "Modular Construction", type: "alternative", description: "Construction method using volumetric or panelized modules manufactured off-site." },
    { name: "Light Gauge Steel Framing", type: "alternative", description: "Building system using cold-formed steel framing members." },
    { name: "Structural Steel Framing", type: "conventional", description: "Structural system using fabricated steel members." },
    { name: "Timber Frame Construction", type: "sustainable", description: "Building structure using timber framing members." },
    { name: "Bamboo Frame Construction", type: "sustainable", description: "Building system using treated and engineered bamboo members." },
    { name: "Rammed Earth Construction", type: "sustainable", description: "Construction technique using compacted earth within formwork." },
    { name: "Ferrocement Construction", type: "alternative", description: "Thin cement mortar composite reinforced with closely spaced wire mesh." },
    { name: "3D Concrete Printing", type: "alternative", description: "Automated construction process depositing concrete material layer by layer." },
    { name: "Insulated Concrete Formwork (ICF)", type: "alternative", description: "Construction system using permanent insulating forms filled with reinforced concrete." }
  ]
};

// General category-level fallback applications.
const categoryApplications: Record<string, string[]> = {
  "Cementitious Materials": ["Concrete and mortar", "Building construction", "Cementitious products"],
  "Aggregates": ["Concrete production", "Road construction", "Pavement and civil works"],
  "Masonry Materials": ["Wall construction", "Partitions", "Building envelopes"],
  "Reinforcement Materials": ["Reinforced concrete", "Structural strengthening", "Specialized composite applications"],
  "Timber & Natural Materials": ["Building structures", "Interior construction", "Insulation and finishes"],
  "Roofing & Insulation": ["Roofing", "Thermal insulation", "Building envelope"],
  "Finishes & Flooring": ["Flooring", "Wall finishes", "Interior and exterior finishes"],
  "Roads & Pavements": ["Road construction", "Pavement layers", "Transport infrastructure"],
  "Construction Systems": ["Building construction", "Structural systems", "Infrastructure applications"]
};

// Material-specific applications for MAT001–MAT120.
const materialApplications: Record<string, string[]> = {
  // Cementitious Materials: MAT001–MAT015
  MAT001: ["Structural concrete", "Reinforced concrete", "Concrete foundations", "Mortar and general construction"],
  MAT002: ["Blended cement concrete", "Mass concrete", "Reinforced concrete", "Mortar"],
  MAT003: ["Blended cement concrete", "Concrete production", "Masonry mortar"],
  MAT004: ["Concrete in suitable exposure conditions", "Mass concrete", "Marine and underground concrete subject to design verification"],
  MAT005: ["Blended cement concrete", "General concrete construction", "Mortar"],
  MAT006: ["Blended cement concrete", "Concrete production", "Masonry mortar"],
  MAT007: ["Supplementary cementitious material", "Concrete mix design", "Cement replacement trials", "Grout and mortar"],
  MAT008: ["Supplementary cementitious material", "Pozzolanic concrete", "Cement and lime-based products", "Fly ash bricks"],
  MAT009: ["High-performance concrete", "High-strength concrete", "Durable concrete mix design", "Repair mortar"],
  MAT010: ["Pozzolanic concrete", "Blended binder systems", "Mortar", "Specialized repair materials"],
  MAT011: ["Pozzolanic binder research", "Cementitious mixes", "Mortar trials", "Agricultural-waste-based construction research"],
  MAT012: ["Lime-pozzolana mortar", "Masonry construction", "Heritage building conservation", "Compatible plaster systems"],
  MAT013: ["Alkali-activated concrete research", "Precast components", "Masonry units", "Specialized binder systems"],
  MAT014: ["Specialized concrete", "Sulfate-exposure applications subject to verification", "Cementitious construction"],
  MAT015: ["Lime mortar", "Lime plaster", "Masonry restoration", "Traditional building construction"],

  // Aggregates: MAT016–MAT030
  MAT016: ["Concrete fine aggregate", "Cement mortar", "Plaster mortar", "Masonry work"],
  MAT017: ["Concrete coarse aggregate", "Reinforced concrete", "Pavement construction", "Concrete foundations"],
  MAT018: ["Concrete fine aggregate", "Masonry mortar", "Plaster mortar", "Pavement applications"],
  MAT019: ["Recycled aggregate concrete", "Non-structural concrete trials", "Pavement sub-base", "Precast concrete products"],
  MAT020: ["Recycled aggregate concrete", "Road sub-base", "Non-structural concrete products", "Backfilling"],
  MAT021: ["Reclaimed asphalt mixtures", "Road pavement recycling", "Pavement base and sub-base subject to specifications"],
  MAT022: ["Road pavement aggregate", "Pavement base layers", "Selected concrete applications subject to testing"],
  MAT023: ["Partial aggregate replacement trials", "Concrete mixtures", "Specialized construction products"],
  MAT024: ["Lightweight concrete", "Lightweight blocks", "Roof screeds", "Thermal insulation layers"],
  MAT025: ["Lightweight concrete", "Precast lightweight blocks", "Non-structural concrete products"],
  MAT026: ["Lightweight concrete", "Lightweight masonry units", "Thermal insulation applications"],
  MAT027: ["Selected concrete applications", "Pavement and landscaping products", "Terrazzo and decorative finishes"],
  MAT028: ["Lightweight concrete trials", "Non-structural concrete products", "Road sub-base subject to testing"],
  MAT029: ["Concrete aggregate trials", "Pavement construction", "Landscaping and paving products"],
  MAT030: ["Road sub-base", "Road base layers", "Selected regional pavement works"],

  // Masonry Materials: MAT031–MAT045
  MAT031: ["Load-bearing masonry subject to design", "Non-load-bearing walls", "Partition walls", "Building envelopes"],
  MAT032: ["Masonry walls", "Partition walls", "Building envelopes", "Non-load-bearing wall construction"],
  MAT033: ["Non-load-bearing walls", "Partition walls", "Infill walls", "Building envelopes"],
  MAT034: ["Load-bearing masonry subject to design", "Non-load-bearing walls", "Partition walls"],
  MAT035: ["Load-bearing masonry subject to design", "Non-load-bearing walls", "Partition walls"],
  MAT036: ["Masonry walls", "Low-rise building construction subject to structural design", "Partition walls"],
  MAT037: ["Non-load-bearing walls", "Low-rise earthen construction subject to verification", "Traditional building construction"],
  MAT038: ["Masonry walls", "Partition walls", "Low-rise earthen construction subject to verification"],
  MAT039: ["Masonry walls", "Building facades", "Traditional regional construction"],
  MAT040: ["Masonry walls", "Partition walls", "Building construction"],
  MAT041: ["Non-load-bearing infill", "Wall insulation", "Thermal envelope systems"],
  MAT042: ["Non-load-bearing partition products subject to testing", "Landscape and site products", "Experimental masonry applications"],
  MAT043: ["Masonry units", "Precast building components", "Non-load-bearing walls subject to testing"],
  MAT044: ["Masonry walls", "Partition walls", "Non-load-bearing concrete masonry"],
  MAT045: ["Non-load-bearing earthen walls", "Interior partitions", "Traditional building construction"],

  // Reinforcement Materials: MAT046–MAT057
  MAT046: ["Reinforced concrete", "Concrete foundations", "Structural concrete subject to design"],
  MAT047: ["Reinforced concrete", "Beams and columns", "Slabs and foundations subject to design"],
  MAT048: ["Reinforced concrete", "Beams and columns", "Slabs and foundations subject to design"],
  MAT049: ["Reinforced concrete in corrosive environments subject to design", "Marine and industrial structures"],
  MAT050: ["Reinforced concrete in aggressive environments subject to design", "Specialized structural applications"],
  MAT051: ["Corrosion-protected reinforced concrete", "Structures exposed to atmospheric conditions subject to design"],
  MAT052: ["Corrosion-protected reinforced concrete", "Repair and rehabilitation applications subject to design"],
  MAT053: ["Specialized composite reinforcement", "Concrete strengthening systems", "Non-magnetic applications subject to design"],
  MAT054: ["Specialized composite reinforcement", "Structural strengthening systems", "Concrete reinforcement subject to design"],
  MAT055: ["Specialized composite reinforcement", "Concrete strengthening systems", "Corrosion-sensitive applications subject to design"],
  MAT056: ["Fibre-reinforced concrete", "Crack-control applications", "Industrial floors and pavements subject to mix design"],
  MAT057: ["Reinforced concrete", "Structural steel reinforcement", "Concrete construction using recycled steel feedstock"],

  // Timber & Natural Materials: MAT058–MAT069
  MAT058: ["Timber structural framing", "Roof structures", "Floor systems subject to grading and design"],
  MAT059: ["Experimental concrete reinforcement", "Non-critical applications subject to testing and structural approval"],
  MAT060: ["Engineered bamboo structures", "Roof framing", "Wall and floor systems subject to design"],
  MAT061: ["Timber wall panels", "Floor panels", "Roof panels", "Engineered building systems"],
  MAT062: ["Structural timber members", "Beams and headers", "Engineered timber framing"],
  MAT063: ["Timber beams", "Roof structures", "Long-span engineered timber systems"],
  MAT064: ["Timber reuse", "Flooring", "Interior finishes", "Structural reuse subject to grading"],
  MAT065: ["Interior timber products", "Furniture and joinery", "Selected building components"],
  MAT066: ["Thermal insulation", "Acoustic insulation", "Building envelope systems"],
  MAT067: ["Interior insulation boards", "Acoustic panels", "Partition systems"],
  MAT068: ["Wall infill", "Thermal insulation", "Non-load-bearing building envelopes"],
  MAT069: ["Composite boards", "Interior panels", "Selected non-structural building products"],

  // Roofing & Insulation: MAT070–MAT081
  MAT070: ["Metal roofing", "Roof cladding", "Canopies and sheds"],
  MAT071: ["Metal roofing", "Roof cladding", "Industrial sheds and canopies"],
  MAT072: ["Roof covering", "Building envelope", "Roofing for suitable building types"],
  MAT073: ["Roofing panels", "Canopies", "Selected lightweight roof coverings subject to fire and weather testing"],
  MAT074: ["Roofing panels", "Temporary structures", "Selected non-structural roof applications subject to testing"],
  MAT075: ["Pitched roof covering", "Residential roofing", "Traditional roof construction"],
  MAT076: ["Pitched roof covering", "Building roofing", "Roofing systems"],
  MAT077: ["Vegetated roof systems", "Roof stormwater management", "Building envelope and roof landscaping"],
  MAT078: ["Thermal insulation", "Roof insulation", "Wall insulation"],
  MAT079: ["Thermal insulation", "Below-grade insulation", "Roof and floor insulation"],
  MAT080: ["Thermal insulation", "Acoustic insulation", "Fire-rated building assemblies subject to system testing"],
  MAT081: ["Thermal insulation", "Acoustic insulation", "Wall and roof cavity insulation"],

  // Finishes & Flooring: MAT082–MAT096
  MAT082: ["Floor finishes", "Wall tiling", "Wet-area finishes"],
  MAT083: ["Floor finishes", "Wall cladding", "Wet-area finishes"],
  MAT084: ["Floor finishes", "Wall cladding", "Stair finishes", "Paving"],
  MAT085: ["Decorative flooring", "Interior floor finishes", "Public-space finishes"],
  MAT086: ["Decorative flooring", "Interior floor finishes", "Public-space finishes"],
  MAT087: ["Indoor flooring", "Sports flooring", "Commercial floor finishes"],
  MAT088: ["Interior flooring", "Decorative floor finishes", "Residential finishes"],
  MAT089: ["Interior flooring", "Acoustic floor finishes", "Residential and commercial finishes"],
  MAT090: ["Resilient flooring", "Interior floor finishes", "Commercial flooring"],
  MAT091: ["Interior flooring", "Industrial flooring", "Commercial floor finishes"],
  MAT092: ["Interior plaster", "Exterior plaster subject to exposure suitability", "Masonry restoration"],
  MAT093: ["Interior plaster", "Wall finishes", "Earthen building finishes"],
  MAT094: ["Interior plaster", "Wall finishing", "Ceiling finishing"],
  MAT095: ["Decking", "Outdoor flooring", "Terraces and walkways"],
  MAT096: ["Interior wall finishes", "Floor finishes", "Joinery and decorative applications"],

  // Roads & Pavements: MAT097–MAT108
  MAT097: ["Flexible pavement binder course", "Bituminous base course", "Road construction"],
  MAT098: ["Flexible pavement wearing course", "Road surfacing", "Highway construction"],
  MAT099: ["Flexible pavement construction", "Road surfacing", "Urban road construction"],
  MAT100: ["Road maintenance", "Pothole repair", "Low-volume road applications subject to specifications"],
  MAT101: ["Recycled asphalt mixtures", "Flexible pavement layers", "Pavement rehabilitation"],
  MAT102: ["Modified bituminous mixtures", "Road surfacing", "Pavement construction subject to applicable specifications"],
  MAT103: ["Modified bituminous mixtures", "Road surfacing", "Pavement construction subject to testing"],
  MAT104: ["Concrete pavement", "Industrial yards", "Heavy-duty pavement subject to design"],
  MAT105: ["Permeable paving", "Stormwater management", "Parking areas and walkways"],
  MAT106: ["Footpaths", "Pedestrian plazas", "Parking areas and paved surfaces"],
  MAT107: ["Road sub-base", "Pavement base layers", "Road rehabilitation"],
  MAT108: ["Stabilized pavement base", "Road subgrade improvement", "Pavement construction"],

  // Construction Systems: MAT109–MAT120
  MAT109: ["Reinforced concrete frames", "Beams and columns", "Slabs and foundations"],
  MAT110: ["Precast beams and columns", "Precast slabs", "Industrial and building components"],
  MAT111: ["Precast wall panels", "Building envelopes", "Partition and structural wall systems subject to design"],
  MAT112: ["Modular buildings", "Off-site construction", "Panelized and volumetric building systems"],
  MAT113: ["Non-load-bearing partitions", "Building framing", "Lightweight wall systems subject to design"],
  MAT114: ["Steel building frames", "Industrial structures", "Long-span structural systems"],
  MAT115: ["Timber building frames", "Roof structures", "Low-rise building systems subject to design"],
  MAT116: ["Bamboo building frames", "Roof structures", "Low-rise building systems subject to design"],
  MAT117: ["Earthen walls", "Low-rise building construction", "Thermal mass building systems subject to design"],
  MAT118: ["Thin-shell components", "Water tanks", "Roofing and cladding components subject to design"],
  MAT119: ["Printed wall systems", "Non-conventional building components", "Experimental construction systems"],
  MAT120: ["Insulated wall systems", "Building envelopes", "Thermal insulation and reinforced concrete wall construction"]
};

const categoryTesting: Record<string, string[]> = {
  "Cementitious Materials": [
    "Chemical composition",
    "Fineness",
    "Setting time",
    "Soundness",
    "Compressive strength",
    "Application-specific durability testing"
  ],
  "Aggregates": [
    "Particle size distribution",
    "Specific gravity",
    "Water absorption",
    "Strength or abrasion assessment",
    "Contamination assessment"
  ],
  "Masonry Materials": [
    "Compressive strength",
    "Water absorption",
    "Dimensional tolerance",
    "Efflorescence where applicable",
    "Durability assessment"
  ],
  "Reinforcement Materials": [
    "Tensile strength",
    "Yield strength",
    "Elongation",
    "Bond assessment",
    "Corrosion or coating assessment where applicable"
  ],
  "Timber & Natural Materials": [
    "Moisture content",
    "Density",
    "Strength grading",
    "Durability assessment",
    "Fire performance where required"
  ],
  "Roofing & Insulation": [
    "Thermal performance",
    "Water absorption",
    "Weather resistance",
    "Fire performance",
    "Dimensional stability"
  ],
  "Finishes & Flooring": [
    "Abrasion resistance",
    "Water absorption",
    "Slip resistance",
    "Surface durability",
    "Dimensional stability"
  ],
  "Roads & Pavements": [
    "Gradation",
    "Compaction",
    "Strength assessment",
    "Moisture susceptibility",
    "Field performance testing"
  ],
  "Construction Systems": [
    "Structural design verification",
    "Connection testing",
    "Load testing where required",
    "Fire assessment",
    "Durability assessment"
  ]
};

const categoryAdvantages: Record<string, string[]> = {
  "Cementitious Materials": [
    "Potential to optimize binder composition",
    "Some alternatives use industrial or agricultural by-products"
  ],
  "Aggregates": [
    "Potential to conserve natural resources",
    "Some alternatives reuse construction or industrial waste"
  ],
  "Masonry Materials": [
    "Can support efficient wall construction",
    "Some alternatives use recycled or locally available resources"
  ],
  "Reinforcement Materials": [
    "Different reinforcement systems can address specific exposure and design needs",
    "Some alternatives offer corrosion resistance"
  ],
  "Timber & Natural Materials": [
    "Can use renewable or recovered resources",
    "Some products provide thermal or acoustic benefits"
  ],
  "Roofing & Insulation": [
    "Can improve building envelope performance",
    "Some alternatives use recycled or renewable resources"
  ],
  "Finishes & Flooring": [
    "Wide range of surface and performance options",
    "Some alternatives incorporate recovered materials"
  ],
  "Roads & Pavements": [
    "Can support resource-efficient infrastructure",
    "Some alternatives reuse reclaimed pavement materials"
  ],
  "Construction Systems": [
    "Can improve construction planning and productivity",
    "Some systems reduce site waste"
  ]
};

const categoryLimitations: Record<string, string[]> = {
  "Cementitious Materials": [
    "Performance depends on constituent quality and mix design",
    "Project-specific testing and curing requirements must be considered"
  ],
  "Aggregates": [
    "Properties vary by source and processing",
    "Suitability must be confirmed for the intended application"
  ],
  "Masonry Materials": [
    "Strength and durability vary by product and manufacturing quality",
    "Wall design and installation requirements must be checked"
  ],
  "Reinforcement Materials": [
    "Design properties and bond behaviour differ between systems",
    "Structural approval and design verification are essential"
  ],
  "Timber & Natural Materials": [
    "Moisture, biological durability and fire performance require attention",
    "Grading and connection design are important"
  ],
  "Roofing & Insulation": [
    "Weathering, fire and installation performance need evaluation",
    "Suitability depends on local climate and building design"
  ],
  "Finishes & Flooring": [
    "Wear, maintenance and slip performance vary by product",
    "Installation and substrate preparation affect performance"
  ],
  "Roads & Pavements": [
    "Performance depends on traffic, climate, design and construction quality",
    "Field trials and pavement design verification may be necessary"
  ],
  "Construction Systems": [
    "Connections, workmanship and sequencing affect performance",
    "Structural and regulatory verification is required"
  ]
};

const conventionalAlternatives: Record<string, string> = {
  "Cementitious Materials": "Conventional Portland cement-based binder",
  "Aggregates": "Natural sand or crushed stone aggregate",
  "Masonry Materials": "Conventional burnt clay brick or concrete block",
  "Reinforcement Materials": "Conventional steel reinforcement",
  "Timber & Natural Materials": "Conventional structural timber or mineral-based products",
  "Roofing & Insulation": "Conventional steel roofing and standard insulation products",
  "Finishes & Flooring": "Conventional ceramic tile or cement-based finish",
  "Roads & Pavements": "Conventional hot mix asphalt or natural aggregate pavement",
  "Construction Systems": "Conventional cast-in-situ reinforced concrete construction"
};

// Build the material catalogue and attach local photographs where available.
const materials: Material[] = [];

let nextId = 1;

for (const [category, entries] of Object.entries(catalogue)) {
  for (const entry of entries) {
    const id = `MAT${String(nextId).padStart(3, "0")}`;

    const imageData = materialImageMap[id];

    materials.push({
      id,
      name: entry.name,
      category,
      type: entry.type,
      description: entry.description,

      // Use material-specific applications, with category fallback.
      applications:
        materialApplications[id] ??
        categoryApplications[category] ??
        [],

      // Product-specific measured values are not yet populated.
      properties: [],

      advantages: categoryAdvantages[category] ?? [],
      limitations: categoryLimitations[category] ?? [],
      testingRequirements: categoryTesting[category] ?? [],

      // Standards must be verified for the specific product and application.
      standards: [],

      conventionalAlternative: conventionalAlternatives[category],

      image: imageData ?? null,

      evidence: [],
      verificationStatus: "pending"
    });

    nextId++;
  }
}

export { materials };

export const materialCategories = Object.keys(catalogue);

export const getMaterialById = (id: string) =>
  materials.find((material) => material.id === id);

export const getMaterialsByCategory = (category: string) =>
  materials.filter((material) => material.category === category);

export const searchMaterials = (query: string) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return materials;

  return materials.filter((material) =>
    [
      material.name,
      material.category,
      material.description,
      ...material.applications
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery)
  );
};
