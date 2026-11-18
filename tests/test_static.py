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
            "robot-challenge-wizard-dark-left-chest.png",
            "robot-welcome-wizard-dark-left-chest.png",
            "robot-listening-wizard-dark-left-chest.png",
            "robot-future-wizard-dark-left-chest.png",
            "robot-archive-wizard-dark-left-chest.png",
            "robot-referral-wizard-dark-left-chest.png",
            "robot-fortune-outro.mp4",
            "social-preview-v2.jpg",
        }
        self.assertTrue(expected.issubset({path.name for path in assets.iterdir()}))

    def test_every_static_robot_scene_uses_an_embroidered_wizard_asset(self):
        content = (SRC / "js" / "content.js").read_text(encoding="utf-8")
        scene_refs = re.findall(r'image: "\./assets/(robot-[^"]+)"', content)
        self.assertEqual(len(scene_refs), 9)
        self.assertTrue(
            all(name.endswith("-wizard-dark-left-chest.png") for name in scene_refs)
        )

    def test_title_system_includes_solid_and_outline_treatments(self):
        app = (SRC / "js" / "app.js").read_text(encoding="utf-8")
        styles = (SRC / "styles.css").read_text(encoding="utf-8")
        self.assertIn('class="title-lockup" aria-hidden="true"', app)
        self.assertIn("title-solid-white", app)
        self.assertIn("title-solid-green", app)
        self.assertIn("title-outline-white", app)
        self.assertIn("title-outline-green", app)
        self.assertIn("-webkit-text-stroke", styles)
        self.assertIn('aria-label="${escapeHtml(screen.title)}"', app)

    def test_slide_two_wizard_word_has_accessible_sparkles(self):
        app = (SRC / "js" / "app.js").read_text(encoding="utf-8")
        styles = (SRC / "styles.css").read_text(encoding="utf-8")
        self.assertIn("wizardSparklesMarkup", app)
        self.assertIn("title-outline-white title-sparkles", app)
        self.assertIn('class="title-sparkle"', app)
        self.assertIn("@keyframes wizardSparkle", styles)
        self.assertIn("prefers-reduced-motion: reduce", styles)
        self.assertIn(".title-sparkle {\n    display: none;", styles)

    def test_cover_uses_the_correct_accent_in_podia(self):
        app = (SRC / "js" / "app.js").read_text(encoding="utf-8")
        content = (SRC / "js" / "content.js").read_text(encoding="utf-8")
        index = (SRC / "index.html").read_text(encoding="utf-8")
        preview = (SRC / "assets" / "social-preview-v1.svg").read_text(
            encoding="utf-8"
        )
        self.assertIn("title-solid-green\">ÍA", app)
        self.assertIn("¿No que no se podía?", content)
        self.assertIn("¿No que no se podía? · Wizard", index)
        self.assertIn(">ÍA</tspan>?", preview)
        self.assertNotIn("podIA", app + content + index + preview)

    def test_social_preview_metadata_is_complete(self):
        index = (SRC / "index.html").read_text(encoding="utf-8")
        preview_url = (
            "https://encuesta-wizard-clientes.robust-hare-3246.chatgpt.site/"
            "assets/social-preview-v2.jpg"
        )
        self.assertIn(f'property="og:image"\n      content="{preview_url}"', index)
        self.assertIn('property="og:image:width" content="1200"', index)
        self.assertIn('property="og:image:height" content="630"', index)
        self.assertIn('name="twitter:card" content="summary_large_image"', index)

        preview = SRC / "assets" / "social-preview-v2.jpg"
        data = preview.read_bytes()
        self.assertGreater(len(data), 50_000)
        self.assertEqual(data[:2], b"\xff\xd8")
        self.assertEqual(data[-2:], b"\xff\xd9")

    def test_public_interface_has_no_trial_or_preview_legends(self):
        interface = "\n".join(
            (SRC / path).read_text(encoding="utf-8")
            for path in ("index.html", "js/app.js")
        ).lower()
        for phrase in (
            "vista de prueba",
            "versión de prueba",
            "modo demo",
            "nada se ha enviado",
            "todavía no se envían",
            "todavía no se enviaron",
        ):
            self.assertNotIn(phrase, interface)

        self.assertNotIn("preview-info", interface)

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
