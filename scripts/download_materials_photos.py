
#!/usr/bin/env python3

import json
import re
import time
import hashlib
import urllib.parse
import urllib.request
from pathlib import Path

# ==========================================
# SUSTAINAI - OPENVERSE PHOTO DOWNLOADER
# ==========================================

ROOT = Path(__file__).resolve().parents[1]

SOURCE_FILE = ROOT / "data" / "materials.ts"
OUTPUT_DIR = ROOT / "public" / "materials"
MANIFEST_FILE = OUTPUT_DIR / "image-manifest.json"

API_URL = "https://api.openverse.org/v1/images/"

USER_AGENT = "SustainAI/1.0 educational material catalogue"

USED_HASHES = set()
USED_URLS = set()

DELAY = 0.7


# ==========================================
# API REQUEST
# ==========================================

def api_get(url):

    request = urllib.request.Request(
        url,
        headers={"User-Agent": USER_AGENT}
    )

    with urllib.request.urlopen(request, timeout=45) as response:
        return json.loads(response.read().decode("utf-8"))


# ==========================================
# READ 120 MATERIALS
# ==========================================

def read_materials():

    content = SOURCE_FILE.read_text(encoding="utf-8")

    start = content.find("const catalogue:")
    end = content.find("const categoryApplications:")

    if start == -1 or end == -1:
        raise ValueError("Catalogue not found in materials.ts")

    block = content[start:end]

    materials = []
    category = None

    for line in block.splitlines():

        category_match = re.match(
            r'\s*"([^"]+)":\s*\[\s*$',
            line
        )

        if category_match:
            category = category_match.group(1)

        name_match = re.search(
            r'name:\s*"((?:[^"\\]|\\.)*)"',
            line
        )

        if name_match and category:

            materials.append({
                "id": f"MAT{len(materials) + 1:03d}",
                "name": name_match.group(1),
                "category": category
            })

    if len(materials) != 120:
        raise ValueError(
            f"Expected 120 materials, found {len(materials)}"
        )

    return materials


# ==========================================
# SEARCH OPENVERSE
# ==========================================

def search_openverse(query):

    params = {
        "q": query,
        "page_size": 30,
        "license": "by,by-sa,cc0,pdm",
        "license_type": "commercial",
        "category": "photograph",
        "extension": "jpg,jpeg,png,webp",
        "filter_dead": "true",
        "mature": "false"
    }

    url = API_URL + "?" + urllib.parse.urlencode(params)

    data = api_get(url)

    return data.get("results", [])


# ==========================================
# IMAGE CANDIDATE
# ==========================================

def select_image(results):

    for result in results:

        image_url = result.get("url", "")
        licence = result.get("license", "").lower()

        if not image_url:
            continue

        if image_url in USED_URLS:
            continue

        if licence not in ("by", "by-sa", "cc0", "pdm"):
            continue

        if result.get("width", 0) < 500:
            continue

        if result.get("height", 0) < 300:
            continue

        return result

    return None


# ==========================================
# DOWNLOAD IMAGE
# ==========================================

def download_image(result, material_id):

    image_url = result["url"]

    request = urllib.request.Request(
        image_url,
        headers={"User-Agent": USER_AGENT}
    )

    with urllib.request.urlopen(request, timeout=60) as response:
        data = response.read()

        content_type = response.headers.get(
            "Content-Type", ""
        ).split(";")[0].lower()

    extensions = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp"
    }

    extension = extensions.get(content_type)

    if not extension:
        raise ValueError(
            f"Unsupported image content type: {content_type}"
        )

    if len(data) < 10000:
        raise ValueError("Image download too small")

    image_hash = hashlib.sha256(data).hexdigest()

    if image_hash in USED_HASHES:
        raise ValueError("Duplicate image detected")

    filename = material_id + extension

    destination = OUTPUT_DIR / filename

    destination.write_bytes(data)

    USED_HASHES.add(image_hash)
    USED_URLS.add(image_url)

    return filename, image_hash, len(data)


# ==========================================
# SEARCH TERMS
# ==========================================

def get_search_terms(material):

    name = material["name"]
    category = material["category"]

    terms = [
        name + " construction material",
        name + " building material photograph",
        name + " construction site product"
    ]

    # More useful searches for selected material types.
    extra_terms = {
        "GGBS": "ground granulated blast furnace slag powder",
        "M-Sand": "manufactured sand quarry",
        "AAC": "autoclaved aerated concrete blocks",
        "GFRP": "glass fibre reinforced polymer rebar",
        "CFRP": "carbon fibre reinforcement bars",
        "CSEB": "compressed stabilized earth blocks",
        "CLT": "cross laminated timber panels",
        "GGBS": "ground granulated blast furnace slag",
        "RAP": "reclaimed asphalt pavement",
        "EPS": "expanded polystyrene insulation board",
        "XPS": "extruded polystyrene insulation board",
        "GFRP Bar": "fibreglass rebar construction"
    }

    for key, value in extra_terms.items():
        if key.lower() in name.lower():
            terms.insert(0, value)

    return terms


# ==========================================
# MAIN
# ==========================================

def main():

    OUTPUT_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    materials = read_materials()

    manifest = []

    print("\n====================================")
    print(" SUSTAINAI OPENVERSE PHOTO DOWNLOADER")
    print("====================================")

    print("Materials:", len(materials))
    print("Output:", OUTPUT_DIR)

    for index, material in enumerate(materials, start=1):

        material_id = material["id"]
        name = material["name"]
        category = material["category"]

        print(f"\n[{index}/120] {name}")

        selected = None

        for query in get_search_terms(material):

            try:

                results = search_openverse(query)

                print(
                    f"  Search: {query} "
                    f"({len(results)} results)"
                )

                selected = select_image(results)

                if selected:
                    break

            except Exception as error:

                print("  Search error:", error)

            time.sleep(DELAY)

        if not selected:

            print("  No suitable photograph found.")

            manifest.append({
                "id": material_id,
                "name": name,
                "category": category,
                "status": "not_found"
            })

            continue

        try:

            filename, image_hash, size = download_image(
                selected,
                material_id
            )

            entry = {
                "id": material_id,
                "name": name,
                "category": category,
                "status": "downloaded",
                "filename": filename,
                "local_path": f"/materials/{filename}",
                "source": selected.get("source"),
                "source_page": selected.get("foreign_landing_url"),
                "title": selected.get("title"),
                "creator": selected.get("creator"),
                "creator_url": selected.get("creator_url"),
                "license": selected.get("license"),
                "license_version": selected.get("license_version"),
                "license_url": selected.get("license_url"),
                "attribution": selected.get("attribution"),
                "sha256": image_hash,
                "file_size": size,
                "review_required": True
            }

            manifest.append(entry)

            print("  Downloaded:", filename)
            print("  Creator:", entry["creator"])
            print("  Licence:", entry["license"])

        except Exception as error:

            print("  Download error:", error)

            manifest.append({
                "id": material_id,
                "name": name,
                "category": category,
                "status": "error",
                "error": str(error)
            })

        time.sleep(DELAY)

    MANIFEST_FILE.write_text(
        json.dumps(
            manifest,
            indent=2,
            ensure_ascii=False
        ),
        encoding="utf-8"
    )

    downloaded = sum(
        1 for item in manifest
        if item["status"] == "downloaded"
    )

    print("\n====================================")
    print(" DOWNLOAD COMPLETE")
    print("====================================")

    print("Total materials:", len(materials))
    print("Downloaded:", downloaded)
    print("Not downloaded:", len(materials) - downloaded)

    print("Images:", OUTPUT_DIR)
    print("Manifest:", MANIFEST_FILE)

    print("\nReview every photograph before publication.")


if __name__ == "__main__":
    main()