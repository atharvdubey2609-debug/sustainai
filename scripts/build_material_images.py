
#!/usr/bin/env python3

"""
SustainAI Material Image Builder

Reads the catalogue from data/materials.ts.

For each material:
1. Searches Wikimedia Commons.
2. Downloads a photograph when a suitable result is found.
3. Records source, attribution and licence information.
4. Generates a local SVG illustration if no photograph is found.

Outputs:
- public/materials/
- public/materials/image-manifest.json
- data/material-images.ts

Usage:
    python scripts/build_material_images.py --limit 5
    python scripts/build_material_images.py --limit 5 --force
    python scripts/build_material_images.py --force
    python scripts/build_material_images.py --commons-only
"""

from __future__ import annotations

import argparse
import html
import json
import re
import ssl
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

from pathlib import Path
from typing import Any


# =========================================================
# PATHS
# =========================================================

ROOT = Path(__file__).resolve().parent.parent

MATERIALS_FILE = ROOT / "data" / "materials.ts"
IMAGE_MAP_FILE = ROOT / "data" / "material-images.ts"

IMAGE_DIR = ROOT / "public" / "materials"
MANIFEST_FILE = IMAGE_DIR / "image-manifest.json"


# =========================================================
# NETWORK SETTINGS
# =========================================================

USER_AGENT = (
    "SustainAI-MaterialImageBuilder/1.0 "
    "(educational civil engineering project)"
)

COMMONS_API = "https://commons.wikimedia.org/w/api.php"

REQUEST_DELAY = 1.0

try:
    import certifi

    SSL_CONTEXT = ssl.create_default_context(
        cafile=certifi.where()
    )

except ImportError:
    print(
        "\nERROR: certifi is not installed.\n"
        "Activate your virtual environment and run:\n\n"
        "python -m pip install certifi\n"
    )
    sys.exit(1)


# =========================================================
# CATEGORY SEARCH TERMS
# =========================================================

CATEGORY_KEYWORDS = {
    "Cementitious Materials": [
        "cement concrete construction material",
        "cementitious building material",
    ],
    "Aggregates": [
        "construction aggregate stone gravel",
        "recycled construction aggregate",
    ],
    "Masonry Materials": [
        "brick masonry construction",
        "building blocks construction material",
    ],
    "Reinforcement Materials": [
        "steel reinforcement rebar construction",
        "fiber reinforced polymer construction",
    ],
    "Timber & Natural Materials": [
        "timber bamboo construction material",
        "natural building materials",
    ],
    "Roofing & Insulation": [
        "roofing insulation building material",
        "roof construction material",
    ],
    "Finishes & Flooring": [
        "flooring construction material",
        "building wall finish material",
    ],
    "Roads & Pavements": [
        "road pavement construction material",
        "asphalt road construction",
    ],
    "Construction Systems": [
        "modular construction building system",
        "prefabricated construction system",
    ],
}


# =========================================================
# GENERAL HELPERS
# =========================================================

def ensure_directories() -> None:
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    IMAGE_MAP_FILE.parent.mkdir(parents=True, exist_ok=True)


def decode_ts_string(value: str) -> str:
    try:
        return json.loads(value)
    except json.JSONDecodeError:
        return value[1:-1]


def extract_field(block: str, field: str) -> str:
    pattern = (
        rf"\b{re.escape(field)}\s*:\s*"
        r'("(?:\\.|[^"\\])*")'
    )

    match = re.search(pattern, block, re.DOTALL)

    if not match:
        return ""

    return decode_ts_string(match.group(1))


# =========================================================
# TYPESCRIPT PARSER
# Supports the user's actual structure:
#
# const catalogue: Record<string, MaterialSeed[]> = {
#   "Cementitious Materials": [
#       { name: "...", type: "...", description: "..." }
#   ],
#   "Aggregates": [...]
# };
# =========================================================

def find_matching_delimiter(
    source: str,
    start: int,
    opening: str,
    closing: str,
) -> int | None:

    depth = 0
    in_string = False
    escaped = False

    for index in range(start, len(source)):
        char = source[index]

        if in_string:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == '"':
                in_string = False

            continue

        if char == '"':
            in_string = True

        elif char == opening:
            depth += 1

        elif char == closing:
            depth -= 1

            if depth == 0:
                return index

    return None


def extract_object_blocks(source: str) -> list[str]:

    blocks = []

    index = 0
    in_string = False
    escaped = False

    while index < len(source):

        char = source[index]

        if in_string:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == '"':
                in_string = False

            index += 1
            continue

        if char == '"':
            in_string = True
            index += 1
            continue

        if char == "{":

            end = find_matching_delimiter(
                source,
                index,
                "{",
                "}",
            )

            if end is None:
                raise ValueError(
                    "An object in the catalogue is not closed."
                )

            blocks.append(source[index + 1:end])
            index = end + 1
            continue

        index += 1

    return blocks


def read_materials() -> list[dict[str, str]]:

    if not MATERIALS_FILE.exists():
        raise FileNotFoundError(
            f"Materials file not found: {MATERIALS_FILE}"
        )

    source = MATERIALS_FILE.read_text(
        encoding="utf-8"
    )

    # Find the catalogue declaration.
    catalogue_match = re.search(
        r"\bconst\s+catalogue\s*"
        r"(?::[^=]+)?=\s*\{",
        source,
    )

    if not catalogue_match:
        raise ValueError(
            "Could not find 'const catalogue' in data/materials.ts."
        )

    catalogue_start = catalogue_match.end() - 1

    catalogue_end = find_matching_delimiter(
        source,
        catalogue_start,
        "{",
        "}",
    )

    if catalogue_end is None:
        raise ValueError(
            "Could not find the closing brace of catalogue."
        )

    catalogue_source = source[
        catalogue_start + 1:catalogue_end
    ]

    # Find category declarations.
    category_pattern = re.compile(
        r'^\s*("(?:\\.|[^"\\])*")\s*:\s*\[',
        re.MULTILINE,
    )

    category_matches = list(
        category_pattern.finditer(catalogue_source)
    )

    if not category_matches:
        raise ValueError(
            "No material categories were found inside catalogue."
        )

    materials = []

    for category_match in category_matches:

        category = decode_ts_string(
            category_match.group(1)
        )

        array_start = (
            category_match.end() - 1
        )

        array_end = find_matching_delimiter(
            catalogue_source,
            array_start,
            "[",
            "]",
        )

        if array_end is None:
            raise ValueError(
                f"Could not find closing array for {category}."
            )

        category_content = catalogue_source[
            array_start + 1:array_end
        ]

        object_blocks = extract_object_blocks(
            category_content
        )

        for block in object_blocks:

            name = extract_field(block, "name")
            material_type = extract_field(block, "type")
            description = extract_field(block, "description")

            if not name:
                continue

            materials.append({
                "id": f"MAT{len(materials) + 1:03d}",
                "name": name,
                "category": category,
                "type": material_type or "alternative",
                "description": description,
            })

    if not materials:
        raise ValueError(
            "No materials could be extracted from catalogue."
        )

    return materials


# =========================================================
# HTTP REQUESTS WITH CERTIFI SSL
# =========================================================

def make_request(
    url: str,
    timeout: int = 30,
) -> bytes:

    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "*/*",
        },
    )

    with urllib.request.urlopen(
        request,
        timeout=timeout,
        context=SSL_CONTEXT,
    ) as response:

        return response.read()


def http_get_json(
    params: dict[str, Any],
) -> dict[str, Any]:

    query = urllib.parse.urlencode(params)

    url = f"{COMMONS_API}?{query}"

    raw = make_request(url)

    return json.loads(
        raw.decode("utf-8")
    )


# =========================================================
# SEARCH QUERY GENERATION
# =========================================================

def build_search_queries(
    material: dict[str, str],
) -> list[str]:

    name = material["name"]
    category = material["category"]

    queries = [
        f'"{name}" construction',
        f"{name} building material",
        f"{name} civil engineering",
    ]

    queries.extend(
        CATEGORY_KEYWORDS.get(category, [])
    )

    unique = []

    for query in queries:
        if query not in unique:
            unique.append(query)

    return unique[:5]


# =========================================================
# WIKIMEDIA COMMONS SEARCH
# =========================================================

def search_commons(
    search_query: str,
) -> list[dict[str, Any]]:

    params = {
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrsearch": search_query,
        "gsrnamespace": 6,
        "gsrlimit": 10,
        "prop": "imageinfo",
        "iiprop": "url|extmetadata|mime|size",
        "iiurlwidth": 1200,
    }

    data = http_get_json(params)

    pages = (
        data.get("query", {})
        .get("pages", {})
    )

    results = []

    for page in pages.values():

        image_info = page.get("imageinfo", [])

        if not image_info:
            continue

        info = image_info[0]

        mime = info.get("mime", "")

        if mime not in (
            "image/jpeg",
            "image/png",
            "image/webp",
        ):
            continue

        metadata = info.get("extmetadata", {})

        def metadata_value(key: str) -> str:
            item = metadata.get(key, {})
            return (
                item.get("value", "")
                if isinstance(item, dict)
                else ""
            )

        image_url = (
            info.get("thumburl")
            or info.get("url")
        )

        if not image_url:
            continue

        results.append({
            "title": page.get("title", ""),
            "image_url": image_url,
            "original_url": info.get(
                "descriptionurl",
                "",
            ),
            "licence": metadata_value(
                "LicenseShortName"
            ),
            "artist": metadata_value("Artist"),
            "credit": metadata_value("Credit"),
            "description": metadata_value(
                "ImageDescription"
            ),
            "mime": mime,
        })

    return results


# =========================================================
# IMAGE RELEVANCE
# =========================================================

def is_relevant(
    material: dict[str, str],
    candidate: dict[str, Any],
) -> bool:

    material_text = " ".join([
        material["name"],
        material["category"],
    ]).lower()

    candidate_text = " ".join([
        candidate.get("title", ""),
        candidate.get("description", ""),
    ]).lower()

    ignored = {
        "and",
        "for",
        "the",
        "with",
        "from",
        "material",
        "construction",
        "building",
        "image",
        "file",
        "photo",
    }

    material_words = set(
        re.findall(r"[a-z0-9]+", material_text)
    ) - ignored

    candidate_words = set(
        re.findall(r"[a-z0-9]+", candidate_text)
    ) - ignored

    return bool(
        material_words.intersection(candidate_words)
    )


# =========================================================
# DOWNLOAD IMAGE
# =========================================================

def download_image(
    image_url: str,
    destination: Path,
) -> Path | None:

    try:

        image_data = make_request(
            image_url,
            timeout=45,
        )

        if len(image_data) < 1000:
            return None

        if image_data.startswith(b"\xff\xd8\xff"):
            extension = ".jpg"

        elif image_data.startswith(
            b"\x89PNG\r\n\x1a\n"
        ):
            extension = ".png"

        elif (
            image_data.startswith(b"RIFF")
            and image_data[8:12] == b"WEBP"
        ):
            extension = ".webp"

        else:
            return None

        output_path = destination.with_suffix(
            extension
        )

        output_path.write_bytes(image_data)

        return output_path

    except Exception as error:

        print(f"      Download error: {error}")

        return None


# =========================================================
# GENERATE SVG ILLUSTRATION
# =========================================================

def generate_svg(
    material: dict[str, str],
    destination: Path,
) -> None:

    name = html.escape(material["name"])
    category = html.escape(material["category"])
    material_id = material["id"]

    seed = sum(
        ord(char) for char in material_id
    )

    shift = seed % 40

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg"
    width="1000"
    height="700"
    viewBox="0 0 1000 700">

    <defs>
      <linearGradient id="background"
        x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#eaf2ec"/>
        <stop offset="100%" stop-color="#cbdccf"/>
      </linearGradient>

      <linearGradient id="block"
        x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#91ad99"/>
        <stop offset="100%" stop-color="#4d6c57"/>
      </linearGradient>
    </defs>

    <rect width="1000" height="700"
      fill="url(#background)"/>

    <circle cx="830" cy="130" r="150"
      fill="#ffffff" opacity="0.3"/>

    <circle cx="150" cy="520" r="180"
      fill="#ffffff" opacity="0.25"/>

    <g transform="translate(0,15)">

      <path d="M {150 + shift} 390
        L 340 250 L 690 390
        L 500 530 Z"
        fill="#b9c9bc"/>

      <path d="M {150 + shift} 390
        L 500 530 L 500 585
        L {150 + shift} 445 Z"
        fill="#718e79"/>

      <path d="M 500 530
        L 690 390 L 690 445
        L 500 585 Z"
        fill="#506d58"/>

      <path d="M 330 340
        L 510 260 L 700 340
        L 520 420 Z"
        fill="url(#block)"/>

      <path d="M 330 340
        L 520 420 L 520 490
        L 330 410 Z"
        fill="#698672"/>

      <path d="M 520 420
        L 700 340 L 700 410
        L 520 490 Z"
        fill="#496752"/>

      <path d="M 610 445
        L 790 365 L 900 415
        L 720 495 Z"
        fill="#d1ded3"/>

      <path d="M 610 445
        L 720 495 L 720 555
        L 610 505 Z"
        fill="#829d88"/>

      <path d="M 720 495
        L 900 415 L 900 475
        L 720 555 Z"
        fill="#526e59"/>

    </g>

    <rect x="40" y="570"
      width="920" height="100"
      rx="18"
      fill="#ffffff"
      opacity="0.92"/>

    <text x="75" y="615"
      font-family="Arial, sans-serif"
      font-size="29"
      font-weight="bold"
      fill="#294332">{name}</text>

    <text x="75" y="645"
      font-family="Arial, sans-serif"
      font-size="18"
      fill="#637968">{category}</text>

    <text x="920" y="645"
      text-anchor="end"
      font-family="Arial, sans-serif"
      font-size="16"
      fill="#718276">{material_id}</text>

    </svg>'''

    destination.write_text(
        svg,
        encoding="utf-8",
    )


# =========================================================
# FIND PHOTOGRAPH
# =========================================================

def find_material_photo(
    material: dict[str, str],
) -> dict[str, Any] | None:

    for query in build_search_queries(material):

        print(f"      Searching: {query}")

        try:

            candidates = search_commons(query)

        except Exception as error:

            print(f"      Search failed: {error}")

            time.sleep(REQUEST_DELAY)

            continue

        for candidate in candidates:

            if not candidate.get("licence"):
                continue

            if not is_relevant(
                material,
                candidate,
            ):
                continue

            print(
                "      Candidate: "
                + candidate.get("title", "Unknown")
            )

            return candidate

        time.sleep(REQUEST_DELAY)

    return None


# =========================================================
# PROCESS MATERIAL
# =========================================================

def process_material(
    material: dict[str, str],
    force: bool,
    commons_only: bool,
) -> dict[str, Any]:

    material_id = material["id"]

    base_path = IMAGE_DIR / material_id

    print(
        f"\n[{material_id}] {material['name']}"
    )

    # Reuse existing image if force is disabled.
    if not force:

        for extension in (
            ".jpg",
            ".png",
            ".webp",
            ".svg",
        ):

            existing = base_path.with_suffix(
                extension
            )

            if existing.exists():

                image_type = (
                    "illustration"
                    if extension == ".svg"
                    else "photograph"
                )

                print("      Existing image reused.")

                return {
                    "id": material_id,
                    "name": material["name"],
                    "category": material["category"],
                    "localPath": (
                        f"/materials/{existing.name}"
                    ),
                    "imageType": image_type,
                    "attribution": (
                        "See image manifest for source details."
                    ),
                    "sourceUrl": "",
                    "licence": "",
                    "status": "reused",
                }

    # Search for a photograph.
    candidate = find_material_photo(material)

    if candidate:

        downloaded = download_image(
            candidate["image_url"],
            base_path,
        )

        if downloaded:

            attribution = (
                candidate.get("artist")
                or candidate.get("credit")
                or "Author not listed"
            )

            print("      Photograph downloaded.")

            return {
                "id": material_id,
                "name": material["name"],
                "category": material["category"],
                "localPath": (
                    f"/materials/{downloaded.name}"
                ),
                "imageType": "photograph",
                "attribution": attribution,
                "sourceUrl": candidate.get(
                    "original_url",
                    "",
                ),
                "licence": candidate.get(
                    "licence",
                    "",
                ),
                "title": candidate.get(
                    "title",
                    "",
                ),
                "status": "downloaded",
            }

    # No photograph found.
    if commons_only:

        print("      No suitable photograph found.")

        return {
            "id": material_id,
            "name": material["name"],
            "category": material["category"],
            "localPath": "",
            "imageType": "none",
            "attribution": "",
            "sourceUrl": "",
            "licence": "",
            "status": "not_found",
        }

    # Generate local SVG.
    svg_path = base_path.with_suffix(".svg")

    generate_svg(
        material,
        svg_path,
    )

    print("      SVG illustration generated.")

    return {
        "id": material_id,
        "name": material["name"],
        "category": material["category"],
        "localPath": (
            f"/materials/{svg_path.name}"
        ),
        "imageType": "illustration",
        "attribution": "Original generated SVG illustration.",
        "sourceUrl": "",
        "licence": "Original generated artwork",
        "status": "generated",
    }


# =========================================================
# WRITE TYPESCRIPT IMAGE MAP
# =========================================================

def write_image_map(
    manifest: list[dict[str, Any]],
) -> None:

    lines = [
        "/**",
        " * Automatically generated by build_material_images.py",
        " * Do not edit manually.",
        " */",
        "",
        "export const materialImageMap: Record<string, string> = {",
    ]

    for item in manifest:

        if not item["localPath"]:
            continue

        lines.append(
            f'  "{item["id"]}": "{item["localPath"]}",'
        )

    lines.extend([
        "};",
        "",
    ])

    IMAGE_MAP_FILE.write_text(
        "\n".join(lines),
        encoding="utf-8",
    )


# =========================================================
# MAIN
# =========================================================

def main() -> None:

    parser = argparse.ArgumentParser(
        description="Build SustainAI material images."
    )

    parser.add_argument(
        "--limit",
        type=int,
        default=0,
        help="Process only the first N materials.",
    )

    parser.add_argument(
        "--force",
        action="store_true",
        help="Regenerate existing images and retry Commons.",
    )

    parser.add_argument(
        "--commons-only",
        action="store_true",
        help="Do not generate SVG fallback illustrations.",
    )

    args = parser.parse_args()

    ensure_directories()

    print("\n======================================")
    print("       SUSTAINAI IMAGE BUILDER")
    print("======================================")

    print("\nReading materials catalogue...")

    materials = read_materials()

    print(
        f"Successfully read {len(materials)} materials."
    )

    categories = sorted({
        item["category"] for item in materials
    })

    print(
        f"Found {len(categories)} material categories."
    )

    for category in categories:
        count = sum(
            1 for item in materials
            if item["category"] == category
        )

        print(f"  - {category}: {count}")

    if args.limit > 0:

        materials = materials[:args.limit]

        print(
            f"\nProcessing first {len(materials)} materials."
        )

    manifest = []

    for index, material in enumerate(
        materials,
        start=1,
    ):

        print(
            f"\nProgress: {index}/{len(materials)}"
        )

        result = process_material(
            material,
            force=args.force,
            commons_only=args.commons_only,
        )

        manifest.append(result)

        time.sleep(REQUEST_DELAY)

    # Write image manifest.
    MANIFEST_FILE.write_text(
        json.dumps(
            manifest,
            indent=2,
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )

    # Write TypeScript map.
    write_image_map(manifest)

    photographs = sum(
        1 for item in manifest
        if item["imageType"] == "photograph"
    )

    illustrations = sum(
        1 for item in manifest
        if item["imageType"] == "illustration"
    )

    missing = sum(
        1 for item in manifest
        if item["imageType"] == "none"
    )

    print("\n======================================")
    print("          BUILD COMPLETE")
    print("======================================")

    print(f"Processed:      {len(manifest)}")
    print(f"Photographs:    {photographs}")
    print(f"Illustrations:  {illustrations}")
    print(f"Not found:      {missing}")

    print("\nFiles created:")

    print(f"Images:         {IMAGE_DIR}")
    print(f"Manifest:       {MANIFEST_FILE}")
    print(f"TypeScript map: {IMAGE_MAP_FILE}")

    print("\nNext step:")
    print("    npm run dev")

    print("======================================")


if __name__ == "__main__":
    main()
