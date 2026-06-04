import PageWrapper from "@/components/PageWrapper";
import Seo from "@/components/Seo";

export default function Terms() {
  const updated = "June 1, 2026";
  return (
    <PageWrapper>
      <Seo
        title="Terms of Service – StudyKro"
        description="The rules for using StudyKro's free AI study tools — acceptable use, intellectual property, disclaimers, and account-free access terms."
        canonical="https://studykro.com/terms"
        keywords={["terms of service", "StudyKro terms", "user agreement"]}
      />
      <article className="mx-auto max-w-3xl">
        <span className="note-label">Legal</span>
        <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">Terms of Service</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {updated}</p>

        <div className="prose-mag mt-8 max-w-none space-y-6 text-base leading-7 text-muted-foreground">
          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">1. Acceptance of terms</h2>
            <p>
              By accessing or using StudyKro ("the Service"), you agree to be bound by
              these Terms of Service ("Terms"). If you do not agree, do not use the
              Service. StudyKro is operated from Pakistan and provided free of charge.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">2. Description of the service</h2>
            <p>
              StudyKro offers free AI-powered tools for students: summarizing notes,
              generating flashcards, quizzes, study plans, mnemonics, essay outlines,
              concept explanations, exam tips, and plagiarism checks. No account is
              required to use the tools.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">3. Acceptable use</h2>
            <p>You agree NOT to use StudyKro to:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Submit copyrighted material you do not have permission to use.</li>
              <li>Generate output for academic dishonesty (e.g. submitting AI essays as your own where prohibited).</li>
              <li>Upload illegal, harmful, hateful, defamatory, or sexually explicit content.</li>
              <li>Attempt to break, overload, scrape, or reverse-engineer the Service.</li>
              <li>Resell, white-label, or commercially redistribute the Service without permission.</li>
              <li>Use automated tools, bots, or scripts to access the Service beyond normal use.</li>
            </ul>
            <p>We may rate-limit, block, or disable access without notice if we suspect misuse.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">4. AI-generated content</h2>
            <p>
              Output from StudyKro is produced by AI models and may be inaccurate,
              incomplete, or biased. You are responsible for reviewing, fact-checking,
              and editing any output before relying on it for exams, assignments,
              publications, or decisions. StudyKro is a study aid, not a replacement
              for your own learning or for professional advice.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">5. Intellectual property</h2>
            <p>
              The StudyKro name, logo, design, code, and content (excluding user
              submissions) are owned by StudyKro and protected by copyright and other
              laws. You retain ownership of the content you submit. You grant us a
              limited license to process your submissions for the sole purpose of
              providing the requested AI output.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">6. Privacy</h2>
            <p>
              Your use of the Service is also governed by our <a className="text-primary hover:underline" href="/privacy">Privacy Policy</a>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">7. Third-party services & links</h2>
            <p>
              StudyKro relies on third-party providers (AI, hosting, analytics,
              advertising) and may link to external websites. We are not responsible
              for the content, policies, or practices of those third parties.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">8. Disclaimers</h2>
            <p>
              The Service is provided <strong>"as is"</strong> and <strong>"as available"</strong>, without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose, accuracy, or non-infringement. We do not guarantee that the Service will be uninterrupted, error-free, or secure.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">9. Limitation of liability</h2>
            <p>
              To the maximum extent permitted by law, StudyKro and its team shall not
              be liable for any indirect, incidental, special, consequential, or
              punitive damages, or any loss of data, grades, profits, or reputation
              arising from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">10. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless StudyKro and its team from any
              claim, loss, or liability arising out of your use of the Service or your
              violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">11. Termination</h2>
            <p>
              We may suspend or terminate your access to the Service at any time, with
              or without notice, for any reason — including suspected violation of
              these Terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">12. Changes to terms</h2>
            <p>
              We may revise these Terms from time to time. The updated version takes
              effect when posted on this page. Continued use of the Service after
              changes means you accept the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">13. Governing law</h2>
            <p>
              These Terms are governed by the laws of Pakistan, without regard to
              conflict-of-law principles. Disputes shall be resolved in the courts of
              competent jurisdiction in Pakistan.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">14. Contact</h2>
            <p>
              Questions about these Terms? Email <a className="text-primary hover:underline" href="mailto:info@studykro.com">info@studykro.com</a> or use our <a className="text-primary hover:underline" href="/contact">contact form</a>.
            </p>
          </section>
        </div>
      </article>
    </PageWrapper>
  );
}
