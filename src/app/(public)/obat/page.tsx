import React, { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { Pill, Search, SlidersHorizontal, ArrowRight, Pill as PillIcon } from 'lucide-react'
import { DrugCard } from '@/components/drug/DrugCard'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface SearchParams {
  q?: string
  category?: string
}

export default async function DrugSearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { q, category } = await searchParams
  const supabase = createClient()

  // Fetch categories for filters
  const { data: categories } = await supabase
    .from('drug_categories')
    .select('*')
    .order('name')

  // Build query for drugs
  let query = (await supabase)
    .from('drugs')
    .select(`
      *,
      drug_categories(name),
      verifier:profiles!drugs_verified_by_fkey(full_name)
    `)
    .eq('status', 'published')
    .order('name')

  if (q) {
    query = query.ilike('name', `%${q}%`)
  }

  if (category) {
    query = query.eq('drug_categories.slug', category)
  }

  const { data: drugs, error } = await query

  return (
    <div className="container px-4 pb-24 space-y-12">
      {/* Search Header */}
      <section className="pt-10 flex flex-col md:flex-row items-end justify-between gap-8 border-b border-border pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-4 max-w-2xl">
          <Badge variant="primary" className="px-4 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest">
            Database Obat Terverifikasi
          </Badge>
          <h1 className="text-4xl md:text-6xl font-serif text-text leading-tight">
            Temukan Informasi <span className="italic">Akurat</span> Penggunaan Obat.
          </h1>
          <p className="text-lg text-text-muted leading-relaxed">
            Telusuri ribuan monografi obat yang disusun secara profesional untuk keamanan penggunaan obat masyarakat.
          </p>
        </div>

        <div className="w-full md:w-96 space-y-6">
          <form action="/obat" method="get" className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
            <input 
              name="q"
              type="text" 
              defaultValue={q}
              placeholder="Cari nama obat..." 
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface border border-border focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
            />
            <input type="hidden" name="category" value={category || ''} />
          </form>
        </div>
      </section>

      <div className="grid lg:grid-cols-[280px_1fr] gap-12">
        {/* Filters Sidebar */}
        <aside className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm font-bold text-text uppercase tracking-widest">
              <SlidersHorizontal size={18} className="text-primary" />
              <span>KATEGORI OBAT</span>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <Link 
                href="/obat"
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between group ${
                  !category 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-text-muted hover:bg-surface-2 hover:text-primary border border-transparent hover:border-border'
                }`}
              >
                <span>Semua Kategori</span>
                <ArrowRight size={14} className={`transition-transform duration-350 ${!category ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
              </Link>
              
              {categories?.map((cat) => (
                <Link 
                  key={cat.id}
                  href={`/obat?category=${cat.slug}${q ? `&q=${q}` : ''}`}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between group ${
                    category === cat.slug 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'text-text-muted hover:bg-surface-2 hover:text-primary border border-transparent hover:border-border'
                  }`}
                >
                  <span>{cat.name}</span>
                  <ArrowRight size={14} className={`transition-transform duration-350 ${category === cat.slug ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                </Link>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#01696f]/5 border border-[#01696f]/10 space-y-4">
            <h4 className="text-sm font-bold text-primary uppercase tracking-widest">Butuh Bantuan?</h4>
            <p className="text-xs text-text-muted leading-relaxed italic">
              Jika Anda tidak menemukan obat yang dicari, silakan ajukan pertanyaan kepada tim farmasis kami.
            </p>
            <Button size="sm" className="w-full rounded-xl bg-[#01696f] text-white py-5" asChild>
              <Link href="/tanya">Tanya Farmasis</Link>
            </Button>
          </div>
        </aside>

        {/* Drug Grid */}
        <div className="flex-1 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-muted font-medium">
              Menampilkan <span className="text-text font-bold">{drugs?.length || 0}</span> hasil untuk 
              {q ? ` "${q}"` : ' semua obat'} 
              {category ? ` dalam kategori "${categories?.find(c => c.slug === category)?.name}"` : ''}
            </p>
          </div>

          {drugs && drugs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {//@ts-ignore - Supabase type casting
              drugs.map((drug) => (
                <DrugCard key={drug.id} drug={drug as any} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 bg-surface-2/50 rounded-[3rem] border border-dashed border-border px-8">
              <div className="w-20 h-20 rounded-full bg-border/20 flex items-center justify-center text-text-muted/40">
                <PillIcon size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-serif text-text">Obat tidak ditemukan</h3>
                <p className="text-text-muted max-w-sm mx-auto leading-relaxed">
                  Kami tidak dapat menemukan obat yang sesuai dengan kriteria pencarian Anda. Pastikan ejaan benar atau gunakan nama generik.
                </p>
              </div>
              <Button variant="outline" asChild className="rounded-full">
                <Link href="/obat">Reset Pencarian</Link>
              </Button>
            </div>
          )}
          
          <div className="pt-10 flex justify-center">
            <p className="text-xs text-text-muted/60 italic max-w-md text-center leading-relaxed">
              * Database diperbarui secara berkala oleh tenaga farmasi terverifikasi. Selalu konsultasikan penggunaan obat keras dengan dokter.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
