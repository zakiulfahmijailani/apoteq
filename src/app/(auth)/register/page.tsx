import React from 'react'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { Logo } from '@/components/layout/Logo'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden py-20">
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute top-[-10rem] right-[-10rem] w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-[10rem] pointer-events-none" />
      <div className="absolute bottom-[-10rem] left-[-10rem] w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-[10rem] pointer-events-none" />

      <div className="w-full max-w-lg flex flex-col gap-10 relative z-10">
        <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Link href="/">
            <Logo className="scale-125 mb-4" />
          </Link>
          <div className="h-px w-24 bg-border mb-6" />
          <h2 className="text-xl font-serif text-text-muted">Pendaftaran Tenaga Farmasi</h2>
        </div>
        
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          <RegisterForm />
        </div>

        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-1000 delay-300">
          <p className="text-xs text-text-muted text-center max-w-xs leading-relaxed italic">
            Seluruh pendaftaran di apoteq akan melewati proses verifikasi manual oleh administrator untuk menjaga integritas informasi obat.
          </p>
          <Link 
            href="/" 
            className="text-xs font-semibold text-primary hover:text-primary-hover tracking-wide border-b-2 border-primary/20 pb-0.5 hover:border-primary transition-all"
          >
            ← KEMBALI KE BERANDA
          </Link>
        </div>
      </div>
    </div>
  )
}
