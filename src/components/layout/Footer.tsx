import React from 'react'
import Link from 'next/link'
import { Logo } from './Logo'
import { HelpCircle, Info, Mail } from 'lucide-react'

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  const links = {
    platform: [
      { name: 'Cari Obat', href: '/obat' },
      { name: 'Tanya Farmasis', href: '/tanya' },
      { name: 'Tentang Kami', href: '/tentang' },
    ],
    legal: [
      { name: 'Kebijakan Privasi', href: '/privasi' },
      { name: 'Syarat & Ketentuan', href: '/syarat' },
      { name: 'Disclaimer Medis', href: '/disclaimer' },
    ],
    social: [
      { name: 'Github', href: 'https://github.com/zakiulfahmijailani/apoteq', icon: HelpCircle },
      { name: 'Website', href: '#', icon: Info },
      { name: 'Email', href: 'mailto:contact@apoteq.id', icon: Mail },
    ],
  }

  return (
    <footer className="mt-auto border-t border-border bg-surface-2 pt-20 pb-10">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <Logo className="mb-6" />
          <p className="text-text-muted max-w-sm mb-8 leading-relaxed">
            Platform informasi obat terverifikasi untuk masyarakat Indonesia. 
            Membantu Anda mendapatkan informasi yang jelas, akurat, dan dapat dipercaya 
            mengenai obat-obatan dari tenaga profesional farmasi.
          </p>
          <div className="flex gap-4">
            {links.social.map((item) => (
              <a 
                key={item.name} 
                href={item.href} 
                target="_blank" 
                rel="noreferrer"
                className="p-2 rounded-full border border-border text-text-muted hover:text-primary hover:border-primary transition-all"
                aria-label={item.name}
              >
                <item.icon size={20} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-6 uppercase tracking-wider text-text">Platform</h4>
          <ul className="flex flex-col gap-4">
            {links.platform.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="text-text-muted hover:text-primary transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-6 uppercase tracking-wider text-text">Legal</h4>
          <ul className="flex flex-col gap-4">
            {links.legal.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="text-text-muted hover:text-primary transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-sm text-text-muted">
          © {currentYear} apoteq. Dikembangkan sebagai kontribusi untuk sistem farmasi digital Indonesia.
        </p>
        
        <div className="bg-primary/5 px-4 py-2 rounded-lg border border-primary/10">
          <p className="text-xs text-primary font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Verified Medical Content Platform
          </p>
        </div>
      </div>
      
      <div className="container mt-8 text-center">
        <p className="text-[10px] text-text-muted/60 max-w-2xl mx-auto leading-relaxed italic">
          PENTING: Informasi dalam platform ini bertujuan untuk edukasi dan tidak menggantikan konsultasi profesional medis 
          dengan dokter atau apoteker Anda. Selalu baca label obat dan konsultasikan penggunaan obat dengan tenaga medis terdaftar.
        </p>
      </div>
    </footer>
  )
}
