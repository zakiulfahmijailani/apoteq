import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { Search, Shield, HelpCircle, ArrowRight, Pill, UserCheck } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('drug_categories')
    .select('*')
    .order('name')

  return (
    <div className="flex flex-col gap-24 pb-32">
      {/* Hero Section */}
      <section className="relative pt-20 px-4">
        <div className="container max-w-4xl text-center space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="space-y-4">
            <h2 className="text-primary font-bold tracking-widest uppercase text-xs">Platform Informasi Farmasi Modern</h2>
            <h1 className="text-5xl md:text-7xl font-serif text-text leading-[1.1]">
              Informasi obat yang jelas, <span className="italic text-primary/80">terverifikasi</span>, dan mudah dipahami.
            </h1>
            <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
              Ditinjau oleh tenaga farmasi profesional untuk memastikan keamanan dan akurasi informasi bagi masyarakat Indonesia.
            </p>
          </div>

          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500" />
            <form action="/obat" method="get" className="relative flex items-center bg-surface border border-border p-2 rounded-full shadow-2xl focus-within:ring-4 focus-within:ring-primary/10 transition-all">
              <div className="pl-6 flex items-center gap-3 text-text-muted">
                <Search size={22} />
              </div>
              <input 
                name="q"
                type="text" 
                placeholder="Cari nama obat generik atau merk..." 
                className="w-full bg-transparent border-none focus:ring-0 text-lg py-4 px-2 placeholder:text-text-muted/60"
              />
              <Button type="submit" className="rounded-full h-14 px-8 text-base shadow-xl">
                Cari Obat
              </Button>
            </form>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 pt-4">
            <div className="flex items-center gap-2 text-sm font-medium text-text-muted">
              <Shield className="text-success" size={18} />
              <span>Diverifikasi Apoteker</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-2 text-sm font-medium text-text-muted">
              <UserCheck className="text-primary" size={18} />
              <span>Sesuai Standar Farmasi</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-2 text-sm font-medium text-text-muted">
              <HelpCircle className="text-info" size={18} />
              <span>Konsultasi Publik</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container px-4">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-primary uppercase tracking-widest">Eksplorasi</h2>
            <h3 className="text-3xl md:text-5xl font-serif text-text">Kategori Terpopuler</h3>
          </div>
          <Link href="/obat" className="group flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover transition-colors">
            LIHAT SEMUA OBAT <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories?.map((cat) => (
            <Link key={cat.id} href={`/obat?category=${cat.slug}`} className="group">
              <Card className="h-full border-2 border-border/50 hover:border-primary/30 bg-surface/50 hover:bg-primary/5 transition-all duration-300">
                <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                    <Pill size={32} />
                  </div>
                  <div>
                    <h4 className="font-bold text-text group-hover:text-primary transition-colors">{cat.name}</h4>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed line-clamp-2">
                      {cat.description || `Informasi obat golongan ${cat.name}.`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Tanya Farmasis CTA */}
      <section className="container px-4">
        <div className="relative rounded-[3rem] overflow-hidden bg-[#01696f] p-12 md:p-24 text-white">
          {/* Decorative Pattern */}
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm font-semibold backdrop-blur-md">
                <HelpCircle size={18} />
                <span>Konsultasi Terbuka</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif leading-[1.1]">
                Ragu tentang <span className="italic opacity-80">cara pakai</span> obat Anda?
              </h2>
              <p className="text-lg text-white/80 leading-relaxed max-w-lg">
                Tanyakan langsung melalui fitur Tanya Farmasis. Pertanyaan Anda akan dijawab oleh apoteker terdaftar kami untuk memastikan keamanan penggunaan obat.
              </p>
              <Button variant="secondary" size="lg" className="rounded-full bg-white text-primary hover:bg-white/90 shadow-2xl h-16 px-10 text-lg border-none" asChild>
                <Link href="/tanya">
                  Tanya Sekarang <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
            
            <div className="hidden md:flex justify-center">
              <div className="relative w-80 h-80 rounded-[4rem] border-8 border-white/10 flex items-center justify-center p-8 bg-white/5 backdrop-blur-lg">
                <div className="w-full h-full rounded-[3rem] bg-white/10 flex flex-col items-center justify-center text-center p-8 border border-white/20">
                  <Logo className="text-white mb-4" />
                  <p className="text-sm font-medium opacity-60">Komitmen apoteq untuk kesehatan masyarakat Indonesia.</p>
                </div>
                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Bottom Search Callout */}
      <section className="container max-w-4xl text-center px-4 pt-10">
        <div className="bg-surface-2 border border-border p-10 md:p-16 rounded-[3rem] space-y-8">
          <h3 className="text-2xl md:text-3xl font-serif text-text">Belum menemukan informasi yang Anda cari?</h3>
          <p className="text-text-muted max-w-xl mx-auto">
            Gunakan kotak pencarian obat di atas atau telusuri berdasarkan kategori indikasi.
          </p>
          <Button variant="outline" size="lg" asChild className="rounded-full border-primary/20 text-primary">
            <Link href="/obat">Eksplorasi Semua Daftar Obat</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 font-semibold ${className}`}>
      <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
        <rect x="4" y="10" width="24" height="12" rx="6" fill="currentColor" />
        <path d="M16 10V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-40" />
        <circle cx="10" cy="16" r="2" fill="white" />
        <circle cx="22" cy="16" r="2" fill="white" />
      </svg>
      <span className="text-2xl tracking-tight">apoteq</span>
    </div>
  )
}
