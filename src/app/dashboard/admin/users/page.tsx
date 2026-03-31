import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { UserTable } from '@/components/dashboard/UserTable'
import { Users, Search, Shield, CheckCircle2, XCircle, Clock, BadgeCheck, ShieldPlus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; q?: string; active?: string }>
}) {
  const { role, q, active } = await searchParams
  const supabase = createClient()
  const { data: { user } } = await (await supabase).auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Admin Check
  const { data: profile } = await (await supabase)
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  let query = (await supabase)
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (role && role !== 'all') {
    query = query.eq('role', role)
  }

  if (active === 'true') {
    query = query.eq('is_active', true)
  } else if (active === 'false') {
    query = query.eq('is_active', false)
  }

  if (q) {
    query = query.ilike('full_name', `%${q}%`)
  }

  const { data: profiles } = await query

  const roleOptions = [
    { label: 'Semua', value: 'all' },
    { label: 'Apoteker', value: 'pharmacist' },
    { label: 'Verifikator', value: 'verifier' },
    { label: 'Admin', value: 'admin' },
  ]

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
        <div className="animate-in fade-in slide-in-from-left-4 duration-700">
          <Badge variant="destructive" className="px-5 py-2 rounded-full border-error/20 text-error bg-error/5 uppercase text-[10px] font-bold tracking-widest mb-4">
            Domain Administrator
          </Badge>
          <h2 className="text-3xl font-serif text-text leading-tight">Manajemen Pengguna</h2>
          <p className="text-text-muted mt-1 leading-relaxed">
            Kelola akses, peran, dan persetujuan akun tenaga farmasi apoteq.
          </p>
        </div>
        <div className="flex items-center gap-6 animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Pending Approval</span>
            <span className="text-2xl font-bold text-error">{profiles?.filter(p => !p.is_active).length || 0}</span>
          </div>
          <div className="w-px h-10 bg-border" />
          <BadgeCheck size={32} className="text-primary opacity-20" />
        </div>
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
                placeholder="Cari nama pengguna..." 
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              />
              <input type="hidden" name="role" value={role || 'all'} />
              <input type="hidden" name="active" value={active || 'all'} />
            </form>
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {roleOptions.map((opt) => (
              <Link 
                key={opt.value}
                href={`/dashboard/admin/users?role=${opt.value}${q ? `&q=${q}` : ''}${active ? `&active=${active}` : ''}`}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap border-2 transition-all ${
                  (role || 'all') === opt.value
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

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
        {profiles && profiles.length > 0 ? (
          <UserTable profiles={profiles} currentUserId={user.id} />
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 bg-surface-2/50 rounded-[3rem] border border-dashed border-border px-8">
            <div className="w-20 h-20 rounded-full bg-border/20 flex items-center justify-center text-text-muted/40">
              <Users size={40} />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-serif text-text">Data pengguna tidak ditemukan</h3>
              <p className="text-text-muted max-w-sm mx-auto leading-relaxed">
                {q ? `Tidak ada pengguna yang cocok dengan kriteria pencarian "${q}".` : 'Belum ada pengguna terdaftar sama sekali.'}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="pt-20 border-t border-border flex flex-col items-center text-center gap-6">
        <ShieldPlus size={48} className="text-primary opacity-20" />
        <h4 className="text-xl font-serif text-text">Keamanan Dashboard apoteq</h4>
        <p className="text-sm text-text-muted max-w-2xl mx-auto italic leading-relaxed">
          Sebagai Administrator, persetujuan akun Anda adalah garis pertahanan pertama integritas platform. 
          Pastikan Nomor SIPA dan kualifikasi institusi diperiksa sebelum mengaktifkan akun.
        </p>
      </div>
    </div>
  )
}
