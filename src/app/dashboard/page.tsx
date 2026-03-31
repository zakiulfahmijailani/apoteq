import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { 
  Pill, 
  FileText, 
  CheckCircle2, 
  HelpCircle, 
  Shield, 
  Users, 
  Clock, 
  ArrowRight,
  Plus,
  Search,
  MessageSquare,
  AlertCircle
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

import { Profile } from '@/types'
import { SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) return null

  // Render different dashboards based on role
  if (profile.role === 'pharmacist') {
    return <PharmacistDashboard user={user} profile={profile} supabase={supabase} />
  } else if (profile.role === 'verifier') {
    return <VerifierDashboard user={user} profile={profile} supabase={supabase} />
  } else if (profile.role === 'admin') {
    return <AdminDashboard user={user} profile={profile} supabase={supabase} />
  }

  return null
}

async function PharmacistDashboard({ user, supabase }: { user: SupabaseUser, profile: Profile, supabase: SupabaseClient }) {
  // Fetch stats
  const { count: myDrafts } = await supabase
    .from('drugs')
    .select('*', { count: 'exact', head: true })
    .eq('submitted_by', user.id)
    .eq('status', 'draft')

  const { count: myPublished } = await supabase
    .from('drugs')
    .select('*', { count: 'exact', head: true })
    .eq('submitted_by', user.id)
    .eq('status', 'published')

  const { count: pendingQuestions } = await supabase
    .from('public_questions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const stats = [
    { title: 'Draft Saya', value: myDrafts || 0, icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
    { title: 'Terpublikasi', value: myPublished || 0, icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
    { title: 'Pertanyaan Baru', value: pendingQuestions || 0, icon: HelpCircle, color: 'text-warning', bg: 'bg-warning/10' },
  ]

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-none shadow-sm bg-surface-2/40">
            <CardContent className="p-8 flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <stat.icon size={28} />
              </div>
              <div>
                <p className="text-sm font-bold text-text-muted uppercase tracking-widest mb-1">{stat.title}</p>
                <h4 className="text-3xl font-bold text-text">{stat.value}</h4>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-text uppercase tracking-widest flex items-center gap-3">
              <Plus className="text-primary" />
              Tindakan Cepat
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button size="lg" className="h-24 rounded-3xl justify-start px-8 gap-4 shadow-xl shadow-primary/10" asChild>
              <Link href="/dashboard/obat/new">
                <Pill size={24} />
                <div className="text-left">
                  <p className="font-bold">Buat Monografi</p>
                  <p className="text-xs opacity-70 font-medium">Tambah draft obat baru</p>
                </div>
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-24 rounded-3xl justify-start px-8 gap-4 border-2" asChild>
              <Link href="/dashboard/tanya">
                <MessageSquare size={24} />
                <div className="text-left">
                  <p className="font-bold">Jawab Diskusi</p>
                  <p className="text-xs text-text-muted font-medium">Bantu konsultasi publik</p>
                </div>
              </Link>
            </Button>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-xl font-bold text-text uppercase tracking-widest flex items-center gap-3">
            <AlertCircle className="text-primary" />
            Panduan Kontribusi
          </h3>
          <Card className="border-none bg-[#01696f]/5 rounded-3xl">
            <CardContent className="p-8 space-y-4">
              <p className="text-sm text-primary/80 leading-relaxed font-medium">
                Setiap monografi yang Anda buat akan diperiksa oleh tim Verifikator apoteq sebelum tampil di publik.
              </p>
              <ul className="space-y-3">
                {['Gunakan bahasa yang mudah dipahami.', 'Pastikan referensi medis akurat.', 'Gunaan klasifikasi terapeutik yang tepat.'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-bold text-[#01696f] uppercase tracking-wide">
                    <CheckCircle2 size={14} />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

async function VerifierDashboard({ supabase }: { user: SupabaseUser, profile: Profile, supabase: SupabaseClient }) {
  const { count: pendingReview } = await supabase
    .from('drugs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'review')

  const { count: totalPublished } = await supabase
    .from('drugs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')

  const stats = [
    { title: 'Antrean Review', value: pendingReview || 0, icon: Shield, color: 'text-warning', bg: 'bg-warning/10' },
    { title: 'Total Published', value: totalPublished || 0, icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
    { title: 'Tugas Saya', value: 0, icon: Clock, color: 'text-primary', bg: 'bg-primary/10' },
  ]

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-none shadow-sm bg-surface-2/40">
            <CardContent className="p-8 flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <stat.icon size={28} />
              </div>
              <div>
                <p className="text-sm font-bold text-text-muted uppercase tracking-widest mb-1">{stat.title}</p>
                <h4 className="text-3xl font-bold text-text">{stat.value}</h4>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none bg-surface-2/40 rounded-[3rem]">
        <CardHeader className="p-10 pb-0">
          <CardTitle className="text-2xl font-serif">Aktivitas Verifikasi</CardTitle>
          <CardDescription>Baris antrean monografi obat yang memerlukan peninjauan.</CardDescription>
        </CardHeader>
        <CardContent className="p-10">
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-6 border border-dashed border-border rounded-[2rem]">
            <Search size={48} className="text-text-muted/20" />
            <p className="text-text-muted font-medium italic">Tidak ada antrean review saat ini.</p>
            <Button variant="outline" asChild className="rounded-full">
              <Link href="/dashboard/verifikasi">Buka Queue Lengkap</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

async function AdminDashboard({ supabase }: { user: SupabaseUser, profile: Profile, supabase: SupabaseClient }) {
  const { count: pendingUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', false)

  const { count: totalDrugs } = await supabase
    .from('drugs')
    .select('*', { count: 'exact', head: true })

  const stats = [
    { title: 'Persetujuan User', value: pendingUsers || 0, icon: Users, color: 'text-error', bg: 'bg-error/10' },
    { title: 'Total Monografi', value: totalDrugs || 0, icon: Pill, color: 'text-primary', bg: 'bg-primary/10' },
    { title: 'Log Aktivitas', value: 'Live', icon: Clock, color: 'text-success', bg: 'bg-success/10' },
  ]

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-none shadow-sm bg-surface-2/40">
            <CardContent className="p-8 flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <stat.icon size={28} />
              </div>
              <div>
                <p className="text-sm font-bold text-text-muted uppercase tracking-widest mb-1">{stat.title}</p>
                <h4 className="text-3xl font-bold text-text">{stat.value}</h4>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-none bg-surface-2/40 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg uppercase tracking-widest">User Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-text-muted leading-relaxed">
              Anda memiliki {pendingUsers} akun baru yang memerlukan verifikasi manual sebelum dapat mengakses dashboard.
            </p>
            <Button className="w-full rounded-xl gap-2" asChild>
              <Link href="/dashboard/admin/users">
                Kelola Pengguna <ArrowRight size={18} />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="border-none bg-surface-2/40 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg uppercase tracking-widest">System Audit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-text-muted leading-relaxed">
              Pantau setiap tindakan yang dilakukan oleh apoteker dan verifikator untuk menjaga keamanan sistem.
            </p>
            <Button variant="outline" className="w-full rounded-xl gap-2" asChild>
              <Link href="/dashboard/admin/audit">
                Buka Audit Log <Clock size={18} />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
