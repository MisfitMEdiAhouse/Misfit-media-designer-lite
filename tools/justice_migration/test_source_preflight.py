"""Regression tests for source preflight; synthetic data only."""
import json
import tempfile
import unittest
import zipfile
from pathlib import Path

from source_preflight import inventory, inventory_zip, inventory_csv_dir


class SourcePreflightTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)

    def make_zip(self, entries):
        filename = self.root / "base44.zip"
        with zipfile.ZipFile(filename, "w") as archive:
            for name, data in entries:
                archive.writestr(name, data)
        return filename

    def test_zip_and_csv_inventory_is_metadata_only(self):
        secret = "synthetic private case value"
        source = self.make_zip([
            ("src/pages/Home.jsx", "const app = 'safe';"),
            ("src/components/Editor.jsx", "export default 1;"),
            ("functions/test.ts", "Deno.serve(()=>Response.json({ok:true}));"),
            ("entities/Case.json", '{"type":"object"}'),
        ])
        data = self.root / "exports"
        data.mkdir()
        (data / "Cases.csv").write_text(
            "id,client_name\n1," + secret + "\n2,Fictional\n",
            encoding="utf-8",
        )
        result = inventory(source, data, app_id="UNVERIFIED-EXAMPLE")
        self.assertEqual(result["source_code_zip"]["file_count"], 4)
        self.assertEqual(result["data_table_count"], 1)
        self.assertEqual(result["data_record_count"], 2)
        self.assertFalse(result["identity_verified"])
        self.assertFalse(result["parity_verified"])
        self.assertNotIn(secret, json.dumps(result))

    def test_reject_directory_traversal_zip(self):
        source = self.make_zip([("../not-safe.txt", "x")])
        with self.assertRaises(ValueError):
            inventory_zip(source)

    def test_reject_duplicate_zip_entries(self):
        source = self.make_zip([("src/pages/A.jsx", "A"), ("src/pages/A.jsx", "B")])
        with self.assertRaises(ValueError):
            inventory_zip(source)

    def test_empty_csv_directory_is_not_claimed_migrated(self):
        source = self.make_zip([("src/pages/Home.jsx", "safe")])
        data = self.root / "exports"
        data.mkdir()
        result = inventory(source, data)
        self.assertEqual(result["data_record_count"], 0)
        self.assertFalse(result["production_cutover_authorized"])

    def test_reject_empty_csv(self):
        data = self.root / "exports"
        data.mkdir()
        (data / "Cases.csv").write_bytes(b"")
        with self.assertRaises(ValueError):
            inventory_csv_dir(data)


if __name__ == "__main__":
    unittest.main()
