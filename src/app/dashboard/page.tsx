import React from 'react'
import { 
  Pill, 
  FileText, 
  CheckCircle2, 
  HelpCircle, 
  Plus,
  MessageSquare,
  AlertCircle
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { MOCK_PROFILES, MOCK_DRUGS, MOCK_QUESTIONS, Profile } from '@/lib/mock-data'

export default async function DashboardPage() {
  // Static Demo: Always show Pharmacist Dashboard for the primary user
  const profile = MOCK_PROFILES[0] // Budi Santoso, Apt. (pharmacist)
  
  return <PharmacistDashboard profile={profile} />
}

function PharmacistDashboard({ profile }: { profile: Profile }) {
  // Mock stats based on mock data
  const myDrafts = MOCK_DRUGS.filter(d => d.submitted_by === profile.id && d.status === 'draft').length
  const myPublished = MOCK_DRUGS.filter(d => d.submitted_by === profile.id && d.status === 'published').length
  const pendingQuestions = MOCK_QUESTIONS.filter(q => q.status === 'pending').length

  const stats = [
    { title: 'Draft Saya', value: myDrafts || 2, icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
    { title: 'Terpublikasi', value: myPublished || 1, icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
    { title: 'Pertanyaan Baru', value: pendingQuestions || 1, icon: HelpCircle, color: 'text-warning', bg: 'bg-warning/10' },
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
