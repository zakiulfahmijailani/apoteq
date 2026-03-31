'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { 
  User as UserIcon, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Settings, 
  Loader2,
  AlertCircle
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogTrigger
} from '@/components/ui/Dialog'
import { Profile } from '@/types'

interface UserTableProps {
  profiles: Profile[]
  currentUserId: string
}

export const UserTable = ({ profiles, currentUserId }: UserTableProps) => {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const toggleStatus = async (profileId: string, currentStatus: boolean) => {
    setIsLoading(profileId)
    setError(null)
    
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_active: !currentStatus })
        .eq('id', profileId)

      if (updateError) throw updateError
      router.refresh()
    } catch {
      setError('Gagal mengubah status pengguna.')
    } finally {
      setIsLoading(null)
    }
  }

  const changeRole = async (profileId: string, newRole: string) => {
    setIsLoading(profileId)
    
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: newRole as 'pharmacist' | 'verifier' | 'admin' })
        .eq('id', profileId)

      if (updateError) throw updateError
      router.refresh()
    } catch {
      setError('Gagal mengubah peran pengguna.')
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-error/10 border border-error/20 flex gap-3 text-error text-xs">
          <AlertCircle size={16} />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {profiles.map((p) => (
          <Card key={p.id} className="border-none bg-surface-2/40 hover:bg-surface-2 transition-all p-2 rounded-3xl group">
            <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="flex items-center gap-6 flex-1 min-w-0">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg ${p.is_active ? 'bg-primary' : 'bg-text-muted/40'}`}>
                  {p.full_name?.charAt(0) || <UserIcon size={24} />}
                </div>
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-3">
                    <h4 className="text-xl font-bold font-serif text-text truncate">{p.full_name || 'Username'}</h4>
                    <Badge variant={p.role === 'admin' ? 'default' : p.role === 'verifier' ? 'warning' : 'secondary'} className="h-6">
                      {p.role.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex wrap items-center gap-4 text-xs font-bold text-text-muted uppercase tracking-widest">
                    <span className="flex items-center gap-2">
                       {p.institution || 'No Institution'}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span>SIPA: {p.sipa_number || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="flex items-center gap-6 mr-4">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none">STATUS</span>
                    <span className={`text-xs font-bold font-sans uppercase mt-1 ${p.is_active ? 'text-success' : 'text-error'}`}>
                      {p.is_active ? 'AKTIF' : 'PENDING'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant={p.is_active ? 'outline' : 'primary'}
                    size="sm"
                    className="rounded-xl h-10 px-5 gap-2 border-border"
                    onClick={() => toggleStatus(p.id, p.is_active || false)}
                    disabled={isLoading === p.id || p.id === currentUserId}
                  >
                    {isLoading === p.id ? <Loader2 size={14} className="animate-spin" /> : (p.is_active ? <XCircle size={16} /> : <CheckCircle2 size={16} />)}
                    {p.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="rounded-xl h-10 px-3 border-border" disabled={p.id === currentUserId}>
                        <Settings size={18} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Ubah Peran Pengguna</DialogTitle>
                        <DialogDescription>
                          Pilih peran baru untuk {p.full_name}. Verifikator dapat mempublikasikan monografi.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-1 gap-3 py-6">
                        {['pharmacist', 'verifier', 'admin'].map((role) => (
                          <Button 
                            key={role}
                            variant={p.role === role ? 'primary' : 'outline'}
                            className="justify-start gap-4 h-14 rounded-2xl"
                            onClick={() => changeRole(p.id, role)}
                            disabled={isLoading === p.id}
                          >
                            <Shield size={20} className={p.role === role ? 'text-white' : 'text-primary'} />
                            <span className="uppercase font-bold tracking-widest text-xs">{role}</span>
                          </Button>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
