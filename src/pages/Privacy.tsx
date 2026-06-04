import PageWrapper from "@/components/PageWrapper";
import Seo from "@/components/Seo";

export default function Privacy() {
  const updated = "June 1, 2026";
  return (
    <PageWrapper>
      <Seo
        title="Privacy Policy – StudyKro"
        description="How StudyKro collects, uses, and protects your data when you use our free AI study tools. No accounts, minimal tracking, your notes stay yours."
        canonical="https://studykro.com/privacy"
        keywords={["privacy policy", "StudyKro privacy", "data protection"]}
      />
      <article className="mx-auto max-w-3xl">
        <span className="note-label">Legal</span>
        <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {updated}</p>

        <div className="prose-mag mt-8 max-w-none space-y-6 text-base leading-7 text-muted-foreground">
          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">1. Introduction</h2>
            <p>
              StudyKro ("we", "us", "our") provides free AI-powered study tools at
              studykro.com. This Privacy Policy explains what information we collect, how
              we use it, and the choices you have. By using StudyKro you agree to this
              policy. If you do not agree, please stop using the site.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">2. Information we collect</h2>
            <p>StudyKro is designed to work without accounts. We collect the minimum data needed to run and improve the service:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li><strong>Content you submit</strong> — text, notes, or PDFs you paste or upload to generate flashcards, quizzes, summaries, plans, mnemonics, essay outlines, or plagiarism checks.</li>
              <li><strong>Usage data</strong> — anonymous analytics such as page views, browser type, device type, country, and referring site.</li>
              <li><strong>Contact form submissions</strong> — your name, email, and message when you contact us via the form on /contact.</li>
              <li><strong>Cookies & local storage</strong> — small files used for theme preference, rate limiting, and basic analytics.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">3. How we use your information</h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>To generate the AI study output you request.</li>
              <li>To protect the service from abuse (rate limits, spam detection).</li>
              <li>To analyze aggregate usage and improve the tools.</li>
              <li>To reply to support and feedback messages.</li>
            </ul>
            <p>We do <strong>not</strong> sell your personal data. We do not use your submitted notes to train third-party AI models for other customers.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">4. Third-party services</h2>
            <p>StudyKro uses a small number of trusted providers to operate:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li><strong>AI providers</strong> (such as Google Gemini and OpenAI-compatible gateways) — process the text you submit to generate output. Submitted content is sent over HTTPS and is subject to the provider's own privacy terms.</li>
              <li><strong>Hosting & backend</strong> (Supabase / Lovable Cloud) — runs the serverless functions that handle your requests.</li>
              <li><strong>Formspree</strong> — delivers contact-form messages to our inbox.</li>
              <li><strong>Analytics</strong> — anonymized, aggregate page-view metrics.</li>
              <li><strong>Advertising partners</strong> (e.g. Google AdSense, if enabled) — may set cookies to show relevant ads. You can opt out via Google's Ads Settings.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">5. Cookies</h2>
            <p>
              We use a small number of cookies and similar technologies for essential
              functionality (theme, session, rate limiting) and aggregate analytics. Most
              browsers let you block or delete cookies in their settings. Disabling
              cookies may break some features.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">6. Data retention</h2>
            <p>
              Submitted notes and generated output are processed in memory and are not
              stored long-term in a user-linked database. Anonymous analytics may be
              retained for up to 26 months. Contact-form messages are kept as long as
              needed to resolve your inquiry.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">7. Children's privacy</h2>
            <p>
              StudyKro is intended for users aged 13 and older. We do not knowingly
              collect personal information from children under 13. If you believe a child
              has provided us with personal data, contact us and we will remove it.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">8. Your rights</h2>
            <p>
              Depending on where you live (e.g. EEA, UK, California), you may have the
              right to access, correct, delete, or restrict use of your personal data,
              and to object to processing. Email us at <a className="text-primary hover:underline" href="mailto:info@studykro.com">info@studykro.com</a> to make a request.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">9. Security</h2>
            <p>
              We use HTTPS, scoped backend permissions, and reputable infrastructure
              providers. No method of transmission over the internet is 100% secure, but
              we work to protect your information using industry-standard practices.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">10. Changes to this policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The "Last updated"
              date at the top of this page shows the latest revision. Material changes
              will be announced on the site.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">11. Contact</h2>
            <p>
              Questions about this policy? Email <a className="text-primary hover:underline" href="mailto:info@studykro.com">info@studykro.com</a> or use our <a className="text-primary hover:underline" href="/contact">contact form</a>.
            </p>
          </section>
        </div>
      </article>
    </PageWrapper>
  );
}
