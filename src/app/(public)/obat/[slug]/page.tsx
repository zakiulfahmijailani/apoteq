import React from 'react'
import { MOCK_DRUGS } from '@/lib/mock-data'
import { notFound } from 'next/navigation'
import { 
  BadgeCheck, 
  User, 
  AlertTriangle, 
  ChevronRight,
  Info,
  Activity,
  History,
  Shield,
  HelpCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function DrugDetailPage({ params }: PageProps) {
  const { slug } = await params
  
  // Use mock data
  const drug = MOCK_DRUGS.find(d => d.slug === slug)

  if (!drug) {
    notFound()
  }

  const sections = drug.sections || []
  
  const sectionLabels: Record<string, string> = {
    indication: 'Indikasi Umum',
    dosage: 'Dosis & Aturan Pakai',
    side_effects: 'Efek Samping',
    contraindication: 'Kontraindikasi',
    drug_interactions: 'Interaksi Obat',
    mechanism: 'Mekanisme Kerja',
    pharmacokinetics: 'Farmakokinetik',
    storage: 'Cara Penyimpanan',
    warnings: 'Peringatan & Perhatian',
    pregnancy_category: 'Kategori Kehamilan',
    references: 'Referensi Medis',
  }

  // Sort sections by priority
  const sectionPriority = [
    'indication', 'dosage', 'side_effects', 'contraindication', 
    'drug_interactions', 'warnings', 'pregnancy_category', 'mechanism', 
    'pharmacokinetics', 'storage', 'references'
  ]

  const sortedSections = [...sections].sort((a, b) => {
    return sectionPriority.indexOf(a.section_type) - sectionPriority.indexOf(b.section_type)
  })

  return (
    <div className="container px-4 pb-32">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-widest mb-10 overflow-x-auto whitespace-nowrap pb-2">
        <Link href="/" className="hover:text-primary transition-colors">BERANDA</Link>
        <ChevronRight size={14} />
        <Link href="/obat" className="hover:text-primary transition-colors">DATABASE OBAT</Link>
        <ChevronRight size={14} />
        <Link href={`/obat?category=${drug.drug_categories?.slug}`} className="hover:text-primary transition-colors">
          {drug.drug_categories?.name || 'UMUM'}
        </Link>
        <ChevronRight size={14} />
        <span className="text-primary">{drug.name}</span>
      </nav>

      <div className="grid lg:grid-cols-[1fr_320px] gap-12 items-start">
        <article className="space-y-12">
          {/* Header Section */}
          <header className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="default" className="px-5 py-2 rounded-full uppercase text-[10px] font-bold tracking-widest bg-primary/5 border-primary/20 text-primary">
                  {drug.drug_class || 'Golongan Obat'}
                </Badge>
                <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-success/5 border border-success/10 text-success text-[10px] font-bold uppercase tracking-widest">
                  <BadgeCheck size={14} />
                  Informasi Terverifikasi
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif text-text leading-[1.1]">{drug.name}</h1>
              <p className="text-xl md:text-2xl text-text-muted leading-relaxed font-medium">
                {drug.brand_names && drug.brand_names.length > 0 
                  ? `Nama Dagang: ${drug.brand_names.join(', ')}` 
                  : 'Nama Generik'}
              </p>
            </div>

            <Card className="bg-surface-2/50 border-none rounded-[2rem] shadow-sm">
              <CardContent className="p-8 md:p-10 space-y-6">
                <div className="flex items-center gap-3 text-primary">
                  <Info size={24} />
                  <h2 className="text-lg font-bold uppercase tracking-widest">Ringkasan Monografi</h2>
                </div>
                <p className="text-lg text-text italic leading-relaxed">
                  &quot;{drug.summary || 'Informasi lengkap mengenai indikasi, dosis, efek samping, dan kontraindikasi penggunaan obat.'}&quot;
                </p>
                <div className="flex flex-wrap items-center gap-8 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-3 text-sm text-text-muted">
                    <History size={18} className="text-primary" />
                    <span>Terakhir diperbarui: <span className="text-text font-bold">
                      {drug.published_at ? new Date(drug.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                    </span></span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-muted">
                    <User size={18} className="text-primary" />
                    <span>Ditinjau oleh: <span className="text-text font-bold">{drug.verifier?.full_name || 'Tim Farmasi'}</span></span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </header>

          {/* Dynamic Content Sections */}
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            {sortedSections.map((section) => (
              <section 
                key={section.id} 
                id={section.section_type}
                className="scroll-mt-32 space-y-6 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Activity size={20} />
                  </div>
                  <h3 className="text-2xl font-serif text-text font-semibold">
                    {sectionLabels[section.section_type] || section.section_type}
                  </h3>
                  <div className="h-px flex-1 bg-border/50 group-hover:bg-primary/20 transition-colors" />
                </div>
                <div className="pl-14 prose prose-slate max-w-none prose-p:text-lg prose-p:leading-relaxed prose-p:text-text-muted prose-strong:text-text text-lg text-text-muted whitespace-pre-wrap leading-relaxed">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          {/* Medical Disclaimer */}
          <section className="bg-error/5 border-2 border-error/10 p-10 md:p-12 rounded-[3rem] space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <div className="flex items-center gap-4 text-error">
              <AlertTriangle size={32} />
              <h3 className="text-xl font-bold uppercase tracking-widest">Peringatan Penting</h3>
            </div>
            <p className="text-lg text-error/80 leading-relaxed font-medium">
              Informasi obat ini bersifat edukasi dan bukan pengganti saran medis profesional. Penggunaan obat keras wajib melalui konsultasi dan resep dokter. Jangan mengubah dosis atau cara penggunaan obat tanpa sepengetahuan tenaga medis terdaftar.
            </p>
          </section>
        </article>

        {/* Sidebar Navigation - Sticky */}
        <aside className="hidden lg:block sticky top-32 space-y-8 animate-in fade-in slide-in-from-right-4 duration-700 delay-100">
          <Card className="rounded-[2rem] border border-border shadow-2xl bg-surface/50 backdrop-blur-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">Navigasi Halaman</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <nav className="flex flex-col gap-1">
                {sortedSections.map((section) => (
                  <a 
                    key={section.id} 
                    href={`#${section.section_type}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-primary/5 text-sm font-semibold text-text-muted hover:text-primary transition-all group"
                  >
                    <span>{sectionLabels[section.section_type]}</span>
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </nav>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-none bg-gradient-to-br from-[#01696f] to-[#0c4e54] text-white p-2">
            <CardContent className="p-8 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <HelpCircle size={24} />
              </div>
              <h4 className="text-lg font-serif">Masih ada pertanyaan?</h4>
              <p className="text-sm text-white/70 leading-relaxed italic">
                Jika Anda memiliki pertanyaan spesifik mengenai interaksi obat ini dengan kondisi Anda, tanyakan langsung pada kami.
              </p>
              <Button variant="secondary" className="w-full rounded-xl bg-white text-primary border-none font-bold" asChild>
                <Link href="/tanya">Tanya Farmasis</Link>
              </Button>
            </CardContent>
          </Card>

          <div className="flex flex-col items-center text-center gap-4 pt-4">
            <Shield className="text-primary/30" size={48} />
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest max-w-[200px] leading-relaxed">
              Ditinjau secara profesional oleh departemen farmasi apoteq Indonesia.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
