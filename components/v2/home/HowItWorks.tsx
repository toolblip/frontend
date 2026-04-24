import { IconShield, IconGift, IconZap } from '@/components/v2/icons';

export default function HowItWorks() {
  return (
    <section className="tb-v2-band">
      <div className="tb-v2-container">
        <div className="tb-v2-band-head">
          <div>
            <div className="tb-v2-kicker">The principle</div>
            <h2>
              Three things we&apos;ll <em>never</em> do.
            </h2>
          </div>
          <div className="tb-v2-band-head-side">
            Online tool sites got bad. Toolblip is our correction — small, fast,
            honest. The utility web from before it learned to extract.
          </div>
        </div>
        <div className="tb-v2-steps">
          <div className="tb-v2-step">
            <div className="tb-v2-step-icon">
              <IconShield width={22} height={22} />
            </div>
            <div className="tb-v2-step-title">Send your data anywhere.</div>
            <div className="tb-v2-step-desc">
              Every tool runs in your browser. Your file never touches a server —
              ours or anyone else&apos;s. Close the tab, it&apos;s gone.
            </div>
          </div>
          <div className="tb-v2-step">
            <div className="tb-v2-step-icon">
              <IconGift width={22} height={22} />
            </div>
            <div className="tb-v2-step-title">Ask for your email.</div>
            <div className="tb-v2-step-desc">
              No signup. No &ldquo;unlock the export&rdquo; prompt. No
              &ldquo;confirm your address to download the PDF.&rdquo; It just
              works.
            </div>
          </div>
          <div className="tb-v2-step">
            <div className="tb-v2-step-icon">
              <IconZap width={22} height={22} />
            </div>
            <div className="tb-v2-step-title">Waste your time.</div>
            <div className="tb-v2-step-desc">
              Keyboard shortcuts everywhere, shareable results, deep-linkable
              state. Built for the third time you&apos;ve needed this today.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
