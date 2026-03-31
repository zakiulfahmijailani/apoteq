import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { Pill, Search, Plus, Eye, Edit3, ChevronRight, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

export default async function MyDrugsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>
}) {
  const { status, q } = await searchParams
  const supabase = createClient()
  const { data: { user } } = await (await supabase).auth.getUser()
  
  if (!user) return null

  const { data: profile } = await (await supabase)
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  let query = (await supabase)
    .from('drugs')
    .select(`
      *,
      drug_categories(name)
    `)
    .order('updated_at', { ascending: false })

  // Pharmacists only see their own drugs
  if (profile?.role === 'pharmacist') {
    query = query.eq('submitted_by', user.id)
  }

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  if (q) {
    query = query.ilike('name', `%${q}%`)
  }

  const { data: drugs } = await query

  const statusOptions = [
    { label: 'Semua Status', value: 'all' },
    { label: 'Draft', value: 'draft' },
    { label: 'Review', value: 'review' },
    { label: 'Published', value: 'published' },
    { label: 'Archived', value: 'archived' },
  ]

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
        <div className="animate-in fade-in slide-in-from-left-4 duration-700">
          <h2 className="text-3xl font-serif text-text">Manajemen Monografi</h2>
          <p className="text-text-muted mt-1 leading-relaxed">
            {profile?.role === 'pharmacist' ? 'Kelola daftar draft dan monografi obat yang Anda susun.' : 'Kelola seluruh database monografi obat di platform.'}
          </p>
        </div>
        <Button size="lg" className="rounded-2xl shadow-xl shadow-primary/10 h-14 px-8 gap-4 animate-in fade-in slide-in-from-right-4 duration-700" asChild>
          <Link href="/dashboard/obat/new">
            <Plus size={20} />
            Buat Draft Baru
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-none bg-surface-2/40 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <form action="" method="get">
              <input 
                name="q"
                type="text" 
                defaultValue={q}
                placeholder="Cari nama obat..." 
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              />
              <input type="hidden" name="status" value={status || 'all'} />
            </form>
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {statusOptions.map((opt) => (
              <Link 
                key={opt.value}
                href={`/dashboard/obat?status=${opt.value}${q ? `&q=${q}` : ''}`}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap border-2 transition-all ${
                  (status || 'all') === opt.value
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/10'
                    : 'bg-transparent text-text-muted border-border hover:border-primary/30'
                }`}
              >
                {opt.label}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* List Table */}
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
        {drugs && drugs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {drugs.map((drug: { id: string, name: string, status: string, slug: string, updated_at: string, drug_categories: { name: string } | null }) => (
              <Card key={drug.id} className="border-none bg-surface-2/40 hover:bg-surface-2 transition-all p-2 rounded-3xl group">
                <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-6 flex-1 min-w-0">
                    <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500 shrink-0">
                      <Pill size={32} />
                    </div>
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="text-xl font-bold font-serif text-text truncate group-hover:text-primary transition-colors">
                          {drug.name}
                        </h4>
                        <Badge variant={
                          drug.status === 'published' ? 'success' : 
                          drug.status === 'review' ? 'warning' :
                          drug.status === 'draft' ? 'secondary' : 'destructive'
                        }>
                          {drug.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-bold text-text-muted uppercase tracking-widest">
                        <span>{drug.drug_categories?.name || 'UMUM'}</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span>UPDATE: {new Date(drug.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Button variant="outline" size="sm" className="rounded-xl h-10 px-4 gap-2 hover:bg-primary/5 hover:text-primary border-border" asChild>
                      <Link href={`/obat/${drug.slug}`} target="_blank">
                        <Eye size={16} />
                        Publik
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-xl h-10 px-4 gap-2 hover:bg-primary/5 hover:text-primary border-border" asChild>
                      <Link href={`/dashboard/obat/${drug.id}/edit`}>
                        <Edit3 size={16} />
                        Edit
                      </Link>
                    </Button>
                    <Button size="icon" variant="ghost" className="rounded-xl h-10 w-10 text-text-muted hover:text-primary hover:bg-surface-2 transition-all">
                      <ChevronRight size={20} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 bg-surface-2/50 rounded-[3rem] border border-dashed border-border px-8">
            <div className="w-20 h-20 rounded-full bg-border/20 flex items-center justify-center text-text-muted/40">
              <FileText size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-serif text-text">Daftar obat kosong</h3>
              <p className="text-text-muted max-w-sm mx-auto leading-relaxed">
                {q ? `Tidak ditemukan obat dengan kata kunci "${q}".` : 'Anda belum membuat monografi obat apapun.'}
              </p>
            </div>
            {!q && (
              <Button className="rounded-full h-12 px-8" asChild>
                <Link href="/dashboard/obat/new">Buat Monografi Pertama</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
