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
        self.assertIn("letter-spacing: -0.025em;", styles)
        self.assertIn("word-spacing: 0.06em;", styles)
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

    def test_cover_links_to_the_wizard_reel_safely(self):
        app = (SRC / "js" / "app.js").read_text(encoding="utf-8")
        styles = (SRC / "styles.css").read_text(encoding="utf-8")
        self.assertIn('href="https://www.youtube.com/watch?v=U8x98Sk45DI"', app)
        self.assertIn('target="_blank"', app)
        self.assertIn('rel="noopener noreferrer"', app)
        self.assertIn('class="cover-reel"', app)
        self.assertIn(".cover-reel", styles)

    def test_slide_two_explains_what_wizard_makes_possible(self):
        app = (SRC / "js" / "app.js").read_text(encoding="utf-8")
        self.assertIn("Lo que tu negocio necesita.", app)
        self.assertIn("Lo que tus clientes esperan.", app)
        self.assertIn("Y todo lo que todavía imaginas.", app)
        self.assertNotIn("Lo que ya funciona.", app)
        self.assertIn(
            "Con Wizard, esas ideas se convierten en soluciones que sí se pueden construir.",
            app,
        )
        self.assertNotIn("Y lo que sigue empieza escuchándote.", app)
        self.assertNotIn(
            "Diez escenas. Preguntas directas. Sin respuestas para quedar bien.", app
        )

    def test_identity_capture_lives_on_slide_two_only(self):
        app = (SRC / "js" / "app.js").read_text(encoding="utf-8")
        slide_two = app[
            app.index("function identityCaptureMarkup()") : app.index("function screenTwo()")
        ]
        slide_three = app[
            app.index("function screenTwo()") : app.index("function screenThree()")
        ]
        slide_nine = app[
            app.index("function screenEight()") : app.index("function closingScreen()")
        ]
        self.assertIn('${identityCaptureMarkup()}', slide_two)
        self.assertIn('data-bind="identity.name"', slide_two)
        self.assertIn('data-bind="identity.company"', slide_two)
        self.assertEqual(slide_two.count('aria-required="true"'), 2)
        self.assertEqual(slide_two.count("<em>Obligatorio</em>"), 2)
        self.assertNotIn("<em>Opcional</em>", slide_two)
        self.assertNotIn('data-bind="identity.name"', slide_three)
        self.assertNotIn('data-bind="identity.company"', slide_three)
        self.assertNotIn('data-bind="identity.name"', slide_nine)
        self.assertNotIn('data-bind="identity.company"', slide_nine)

    def test_closing_has_explicit_finish_action_and_heart_copy(self):
        app = (SRC / "js" / "app.js").read_text(encoding="utf-8")
        self.assertIn("Gracias por compartir tu experiencia &lt;3.", app)
        self.assertIn('data-action="finish"', app)
        self.assertIn('nextButton.textContent = "Ver cierre"', app)
        self.assertIn('showToast("Recorrido terminado.")', app)

    def test_header_logo_is_prominent_on_desktop_and_mobile(self):
        styles = (SRC / "styles.css").read_text(encoding="utf-8")
        self.assertIn("width: clamp(13.5rem, 18vw, 17.5rem);", styles)
        self.assertIn("width: 11.5rem;", styles)

    def test_all_numeric_ratings_use_a_five_point_scale(self):
        app = (SRC / "js" / "app.js").read_text(encoding="utf-8")
        styles = (SRC / "styles.css").read_text(encoding="utf-8")
        self.assertIn('aria-label="Escala del 1 al 5"', app)
        self.assertIn("Array.from({ length: 5 }", app)
        self.assertEqual(app.count("Del 1 al 5"), 3)
        self.assertNotIn("Del 1 al 10", app)
        self.assertNotIn("/10", app)
        self.assertIn("grid-template-columns: repeat(5", styles)

    def test_slide_four_uses_the_direct_new_technology_question(self):
        app = (SRC / "js" / "app.js").read_text(encoding="utf-8")
        content = (SRC / "js" / "content.js").read_text(encoding="utf-8")
        question = "¿Qué tan cómodo te sientes usando tu nueva tecnología?"
        self.assertIn(question, content)
        self.assertIn(question.lower(), app)
        self.assertNotIn("las soluciones que implementamos", app)

    def test_referrals_use_one_group_consent_control(self):
        app = (SRC / "js" / "app.js").read_text(encoding="utf-8")
        consent = (
            "Confirmo que todas las personas están de acuerdo con que comparta "
            "sus datos para que Wizard las contacte."
        )
        self.assertEqual(app.count(consent), 1)
        self.assertEqual(app.count('data-bind="referralsConsent"'), 1)
        self.assertNotIn('data-ref-field="consent"', app)

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
