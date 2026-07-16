import Image from 'next/image';
import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="site-footer border-t border-white/10 py-14 px-6 brand-watermark">
      <div className="max-w-7xl mx-auto relative z-10 mb-14">
        <p className="font-display uppercase leading-[0.95] text-[clamp(2.5rem,6vw,5rem)] text-balance">
          Stop being <span className="text-brand">ignored.</span>
        </p>
      </div>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        <div className="max-w-sm">
          <Link href="/" className="flex items-center gap-3 mb-4 w-fit">
            <Image src="/logo.png" alt="AR Strategies" width={36} height={36} className="site-logo h-9 w-auto" />
            <span className="font-display text-lg tracking-wide">AR STRATEGIES</span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed">
            We help local businesses get found first on Google, run Meta ads that pay for
            themselves, and publish content locals remember and act on.
          </p>
        </div>
        <div className="flex gap-16">
          <div>
            <p className="font-semibold mb-4 text-sm uppercase tracking-wide">Company</p>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/#services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/#process" className="hover:text-white transition-colors">Process</Link></li>
              <li><Link href="/#why" className="hover:text-white transition-colors">Why Us</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/mechanisms" className="hover:text-white transition-colors">Mechanisms</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/tools/three-second-test" className="hover:text-white transition-colors">3-Second Test</Link></li>
              <li><Link href="/#faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-4 text-sm uppercase tracking-wide">Connect</p>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="https://instagram.com/ar_strats.aa" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="mailto:hello@arstrategists.com" className="hover:text-white transition-colors">Email</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <p>© 2026 AR Strategies. All rights reserved.</p>
        <p className="font-display uppercase tracking-wide text-gray-400">Dominate your market.</p>
      </div>
    </footer>
  );
}
