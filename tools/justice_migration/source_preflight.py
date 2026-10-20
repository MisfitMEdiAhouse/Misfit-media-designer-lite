#!/usr/bin/env python3
"""Offline, read-only inventory of a Base44 ZIP and separate CSV exports.

No network, database connections, uploads, mutations to source, or private row
values in the output. Treat the resulting manifest as PRIVATE because even file
names and table names may contain sensitive case details.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import stat
import sys
import zipfile
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path, PurePosixPath

MAX_FILES = 20000
MAX_TOTAL_UNCOMPRESSED = 4 * 1024**3
MAX_SINGLE_FILE = 1024**3


def sha256_stream(stream):
    digest = hashlib.sha256()
    while True:
        block = stream.read(1024 * 1024)
        if not block:
            break
        digest.update(block)
    return digest.hexdigest()


def safe_zip_name(name):
    """Fail closed on non-portable paths, absolute paths, and traversal."""
    if not name or "\\" in name or "\x00" in name or name.startswith("/"):
        raise ValueError("Unsafe ZIP entry name")
    path = PurePosixPath(name)
    if ".." in path.parts or path.is_absolute() or ":" in path.parts[0]:
        raise ValueError("Unsafe ZIP entry path")
    return str(path)


def category(path):
    parts = path.lower().split("/")
    if "pages" in parts and "src" in parts:
        return "page"
    if "functions" in parts:
        return "function"
    if "entities" in parts:
        return "entity_schema"
    if "components" in parts:
        return "component"
    if "api" in parts:
        return "api_client"
    return "other"


def inventory_zip(path):
    entries = []
    seen = set()
    total = 0
    with zipfile.ZipFile(path, "r") as archive:
        infos = archive.infolist()
        if len(infos) > MAX_FILES:
            raise ValueError("Archive exceeds file-count safety limit")
        for info in infos:
            name = safe_zip_name(info.filename)
            if name in seen:
                raise ValueError("Duplicate ZIP entry path")
            seen.add(name)
            if info.is_dir():
                continue
            mode = info.external_attr >> 16
            if stat.S_ISLNK(mode):
                raise ValueError("ZIP symlinks are not accepted")
            if info.file_size > MAX_SINGLE_FILE:
                raise ValueError("File exceeds safety limit")
            total += info.file_size
            if total > MAX_TOTAL_UNCOMPRESSED:
                raise ValueError("Archive exceeds decompression safety limit")
            with archive.open(info) as reader:
                digest = sha256_stream(reader)
            entries.append({
                "path": name,
                "kind": category(name),
                "size_bytes": info.file_size,
                "sha256": digest,
            })
    entries.sort(key=lambda item: item["path"])
    return entries


def inventory_csv_dir(path):
    """Count records without returning or storing CSV row values."""
    results = []
    seen = set()
    for item in sorted(path.rglob("*.csv")):
        if item.is_symlink() or not item.is_file():
            raise ValueError("CSV symlinks or non-files are not accepted")
        relative = item.relative_to(path).as_posix()
        if relative in seen:
            raise ValueError("Duplicate CSV relative path")
        seen.add(relative)
        with item.open("rb") as raw:
            digest = sha256_stream(raw)
        try:
            with item.open("r", encoding="utf-8-sig", newline="") as handle:
                reader = csv.reader(handle)
                header = next(reader, None)
                if header is None:
                    raise ValueError("Empty CSV export")
                count = sum(1 for _ in reader)
        except (UnicodeError, csv.Error) as error:
            raise ValueError("Invalid CSV export at " + relative) from error
        results.append({
            "path": relative,
            "sha256": digest,
            "bytes": item.stat().st_size,
            "records": count,
            "column_count": len(header),
        })
    return results


def inventory(source_zip, csv_dir=None, app_id=None):
    with source_zip.open("rb") as handle:
        archive_hash = sha256_stream(handle)
    assets = inventory_zip(source_zip)
    files_by_kind = dict(sorted(Counter(a["kind"] for a in assets).items()))
    tables = inventory_csv_dir(csv_dir) if csv_dir else []
    return {
        "format": "misfit-justice-base44-source-inventory-v1",
        "generated_utc": datetime.now(timezone.utc).isoformat(),
        "migration_key": "misfit_justice_os_base44_exit_v1",
        "claimed_base44_app_id": app_id,
        "identity_verified": False,
        "parity_verified": False,
        "production_cutover_authorized": False,
        "source_code_zip": {
            "sha256": archive_hash,
            "bytes": source_zip.stat().st_size,
            "file_count": len(assets),
            "counts_by_kind": files_by_kind,
        },
        "code_assets": assets,
        "data_exports": tables,
        "data_table_count": len(tables),
        "data_record_count": sum(t["records"] for t in tables),
        "cautions": [
            "App identity must be matched independently against the original Base44 editor URL.",
            "A code ZIP does not prove a complete data migration; CSVs/files/users are separate.",
            "Case attachments, permissions and user identities require separate inventory.",
            "This manifest is private; do not commit or upload it to a public repository.",
            "This tool does not write to Supabase or mutate the Base44 source.",
        ],
    }


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--zip", type=Path, required=True, dest="source_zip")
    parser.add_argument("--csv-dir", type=Path)
    parser.add_argument("--app-id", help="Claimed Base44 app ID (unverified until source inspection)")
    parser.add_argument("--out", type=Path, required=True, help="PRIVATE JSON inventory path")
    args = parser.parse_args(argv)
    if not args.source_zip.is_file():
        parser.error("ZIP source does not exist")
    if args.csv_dir and not args.csv_dir.is_dir():
        parser.error("CSV source directory does not exist")
    if args.out.resolve() == args.source_zip.resolve():
        parser.error("Refusing to overwrite source ZIP")
    if args.csv_dir and args.out.resolve().is_relative_to(args.csv_dir.resolve()):
        parser.error("Keep the output outside the raw CSV source directory")
    if args.out.exists():
        parser.error("Refusing to overwrite an existing inventory")
    result = inventory(args.source_zip, args.csv_dir, args.app_id)
    # Write new private manifest only. The original ZIP and CSVs are never touched.
    try:
        with args.out.open("x", encoding="utf-8") as handle:
            json.dump(result, handle, indent=2, ensure_ascii=False)
            handle.write("\n")
    except FileExistsError:
        parser.error("Output already exists")
    print(
        "Inventory saved (PRIVATE): "
        + str(len(result["code_assets"]))
        + " source files; "
        + str(result["data_table_count"])
        + " CSV tables; "
        + str(result["data_record_count"])
        + " CSV records. No migration performed."
    )


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, zipfile.BadZipFile) as error:
        print("Preflight failed: " + str(error), file=sys.stderr)
        sys.exit(1)
