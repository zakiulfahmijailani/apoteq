import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Mail, CheckCircle2, ArrowRight, LogIn } from 'lucide-react'
import { Logo } from '@/components/layout/Logo'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-primary/10 via-transparent to-primary/5 pointer-events-none" />
      
      <div className="w-full max-w-lg relative z-10 flex flex-col gap-10">
        <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Link href="/">
            <Logo className="scale-110 mb-2" />
          </Link>
          <div className="h-px w-16 bg-border mb-4" />
        </div>

        <Card className="border-none shadow-2xl bg-surface/50 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          <CardHeader className="pt-12 text-center pb-2">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
              <Mail size={40} className="animate-bounce" />
            </div>
            <CardTitle className="text-3xl font-serif">Verifikasi Email Anda</CardTitle>
            <CardDescription className="text-base text-text-muted mt-2">
              Tautan verifikasi telah dikirimkan ke alamat email Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 pb-10 px-8 text-center space-y-6">
            <div className="p-5 rounded-2xl bg-surface-2 border border-border text-sm leading-relaxed text-text">
              <p>
                Silakan periksa kotak masuk (dan folder spam/junk) Anda. Klik tautan dalam email tersebut untuk mengonfirmasi akun baru Anda.
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <CheckCircle2 size={16} />
                <span>Pendaftaran dasar selesai</span>
              </div>
              <div className="flex items-center gap-2 text-text-muted font-medium text-sm italic">
                <span className="w-2 h-2 rounded-full bg-border" />
                <span>Menunggu aktivasi verifikasi email</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pb-12 pt-0 flex flex-col gap-3">
            <Button variant="outline" className="w-full h-12" asChild>
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Kembali ke Login
              </Link>
            </Button>
            <Button variant="ghost" className="w-full text-text-muted hover:text-primary" asChild>
              <Link href="/">
                Ke Beranda
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-1000 delay-300">
          <p className="text-center text-xs text-text-muted max-w-xs leading-relaxed italic">
            Setelah memverifikasi email, tim apoteq akan meninjau kualifikasi Anda sebelum memberikan akses penuh ke dashboard.
          </p>
        </div>
      </div>
    </div>
  )
}
