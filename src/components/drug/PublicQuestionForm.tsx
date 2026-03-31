'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@/lib/supabase/client'
import { 
  Send, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  User,
  MessageSquare
} from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'

const questionSchema = z.object({
  asker_name: z.string().min(2, { message: 'Nama minimal 2 karakter' }),
  asker_email: z.string().email({ message: 'Email tidak valid' }).optional().or(z.literal('')),
  question_text: z.string().min(10, { message: 'Pertanyaan minimal 10 karakter' }).max(1000),
  drug_id: z.string().optional(),
})

type QuestionFormValues = z.infer<typeof questionSchema>

interface PublicQuestionFormProps {
  drugs?: { id: string; name: string }[]
  initialDrugId?: string
}

export const PublicQuestionForm = ({ drugs, initialDrugId }: PublicQuestionFormProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      drug_id: initialDrugId || '',
    }
  })

  const onSubmit = async (values: QuestionFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error: insertError } = await supabase
        .from('public_questions')
        .insert({
          asker_name: values.asker_name,
          asker_email: values.asker_email || null,
          question_text: values.question_text,
          drug_id: values.drug_id || initialDrugId || null,
          status: 'pending'
        })

      if (insertError) throw insertError

      setIsSubmitted(true)
      reset()
    } catch {
      setError('Gagal mengirim pertanyaan. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="border-none bg-success/5 rounded-[2.5rem] p-12 text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center text-success mx-auto">
          <CheckCircle2 size={40} />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-serif text-text">Pertanyaan Terkirim!</h3>
          <p className="text-text-muted max-w-sm mx-auto leading-relaxed">
            Terima kasih. Apoteker kami akan meninjau dan menjawab pertanyaan Anda segera. Jawaban akan tampil di halaman ini.
          </p>
        </div>
        <Button variant="outline" className="rounded-full px-8" onClick={() => setIsSubmitted(false)}>
          Kirim Pertanyaan Lain
        </Button>
      </Card>
    )
  }

  return (
    <Card className="border-none bg-surface-2/40 rounded-[3rem] overflow-hidden">
      <CardHeader className="p-10 md:p-14 pb-0">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <MessageSquare size={24} />
            <h3 className="text-lg font-bold uppercase tracking-widest">Tanya Farmasis</h3>
          </div>
          <p className="text-text-muted leading-relaxed">
            Punya pertanyaan mengenai penggunaan obat? Tim apoteker kami siap membantu memberikan informasi yang akurat.
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-10 md:p-14 space-y-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-error/10 border border-error/20 flex items-center gap-3 text-error text-sm">
              <AlertCircle size={18} />
              <p>{error}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Nama Lengkap"
              placeholder="Contoh: Budi Santoso"
              {...register('asker_name')}
              error={errors.asker_name?.message}
              disabled={isLoading}
              className="rounded-2xl h-12"
            />
            <Input
              label="Email (Opsional untuk Notifikasi)"
              placeholder="budi@example.com"
              {...register('asker_email')}
              error={errors.asker_email?.message}
              disabled={isLoading}
              className="rounded-2xl h-12"
            />
          </div>

          {drugs && drugs.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-text uppercase tracking-widest pl-1">Pilih Obat (Opsional)</label>
              <select
                {...register('drug_id')}
                className="w-full h-12 rounded-2xl bg-surface border border-border px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm appearance-none"
                disabled={isLoading}
              >
                <option value="">-- Pilih Obat --</option>
                {drugs.map(drug => (
                  <option key={drug.id} value={drug.id}>{drug.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-text uppercase tracking-widest pl-1">Pertanyaan Anda</label>
            <Textarea
              placeholder="Tuliskan detail pertanyaan Anda mengenai dosis, efek samping, atau interaksi obat..."
              {...register('question_text')}
              error={errors.question_text?.message}
              disabled={isLoading}
              className="rounded-3xl min-h-[160px]"
            />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
            <div className="flex items-center gap-3 text-xs text-text-muted font-medium italic text-left">
              <User size={16} className="text-primary opacity-40 shrink-0" />
              <span>Identitas Anda akan disamarkan di halaman publik.</span>
            </div>
            <Button 
              type="submit" 
              size="lg" 
              className="w-full md:w-auto rounded-full h-14 px-10 gap-3 shadow-xl shadow-primary/10"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
              Kirim Pertanyaan
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
