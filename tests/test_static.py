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
        }
        self.assertTrue(expected.issubset({path.name for path in assets.iterdir()}))

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
