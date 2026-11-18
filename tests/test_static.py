from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"


class StaticSiteTests(unittest.TestCase):
    def test_index_references_existing_local_files(self):
        index = (SRC / "index.html").read_text(encoding="utf-8")
        for relative in re.findall(r'(?:href|src)="(\./[^"?#]+)', index):
            self.assertTrue((SRC / relative.removeprefix("./")).exists(), relative)

    def test_required_robot_scenes_and_logo_exist(self):
        assets = SRC / "assets"
        expected = {
            "logo-wizard.png",
            "robot-challenge.jpg",
            "robot-welcome.jpg",
            "robot-listening.jpg",
            "robot-future.jpg",
            "robot-archive.jpg",
            "robot-referral.jpg",
            "robot-fortune-outro.mp4",
            "social-preview-v1.jpg",
        }
        self.assertTrue(expected.issubset({path.name for path in assets.iterdir()}))

    def test_social_preview_metadata_is_complete(self):
        index = (SRC / "index.html").read_text(encoding="utf-8")
        preview_url = (
            "https://encuesta-wizard-clientes.robust-hare-3246.chatgpt.site/"
            "assets/social-preview-v1.jpg"
        )
        self.assertIn(f'property="og:image"\n      content="{preview_url}"', index)
        self.assertIn('property="og:image:width" content="1200"', index)
        self.assertIn('property="og:image:height" content="630"', index)
        self.assertIn('name="twitter:card" content="summary_large_image"', index)

        preview = SRC / "assets" / "social-preview-v1.jpg"
        data = preview.read_bytes()
        self.assertGreater(len(data), 50_000)
        self.assertEqual(data[:2], b"\xff\xd8")
        self.assertEqual(data[-2:], b"\xff\xd9")

    def test_stage_two_services_are_not_exposed_in_public_source(self):
        public_text = "\n".join(
            path.read_text(encoding="utf-8", errors="ignore")
            for path in SRC.rglob("*")
            if path.suffix in {".html", ".css", ".js"}
        )
        self.assertNotIn("1drv.ms", public_text)
        self.assertNotIn("intelligencewizard.app.n8n.cloud", public_text)


if __name__ == "__main__":
    unittest.main()
