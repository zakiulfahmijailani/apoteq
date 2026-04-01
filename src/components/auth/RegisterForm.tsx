'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { AlertCircle, Loader2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

const registerSchema = z.object({
  full_name: z.string().min(3, { message: 'Nama lengkap minimal 3 karakter' }),
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter' }),
  role: z.enum(['pharmacist', 'verifier'], { message: 'Pilih peran Anda' }),
  institution: z.string().min(3, { message: 'Nama institusi/apotek minimal 3 karakter' }),
  sipa_number: z.string().optional().refine(() => {
    // If pharmacist, sipa_number is recommended/required based on PRD
    return true 
  }, { message: 'Nomor SIPA diperlukan untuk apoteker' }),
}).refine((data) => {
  if (data.role === 'pharmacist' && !data.sipa_number) {
    return false
  }
  return true
}, {
  message: 'Nomor SIPA wajib diisi untuk Apoteker',
  path: ['sipa_number'],
})

type RegisterFormValues = z.infer<typeof registerSchema>

export const RegisterForm = () => {
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'pharmacist',
    }
  })

  const selectedRole = watch('role')

  const onSubmit = async (_values: RegisterFormValues) => {
    setIsLoading(true)
    setError(null)

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    try {
      // Mock registration always succeeds for demo
      setIsSuccess(true)
      setTimeout(() => {
        router.push('/pending-approval')
      }, 3000)
    } catch {
      setError('Terjadi kesalahan pendaftaran. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-lg border-none shadow-2xl bg-surface/50 backdrop-blur-xl">
        <CardContent className="pt-12 pb-12 flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center text-success animate-bounce">
            <CheckCircle2 size={48} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-text">Pendaftaran Berhasil!</h3>
            <p className="text-text-muted px-8">
              Terima kasih telah mendaftar. Akun Anda sedang menunggu persetujuan dari administrator apoteq.
            </p>
          </div>
          <p className="text-xs text-text-muted mt-4">
            Anda akan diarahkan secara otomatis...
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-lg border-none shadow-2xl bg-surface/50 backdrop-blur-xl">
      <CardHeader className="space-y-1 pb-8">
        <CardTitle className="text-3xl text-center">Daftar Akun Baru</CardTitle>
        <CardDescription className="text-center text-text-muted">
          Bergabunglah sebagai tenaga farmasi terverifikasi di apoteq.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <div className="p-4 rounded-xl bg-error/10 border border-error/20 flex items-center gap-3 text-error text-sm">
              <AlertCircle size={18} />
              <p>{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nama Lengkap"
              placeholder="Apoteker Madya"
              {...register('full_name')}
              error={errors.full_name?.message}
              disabled={isLoading}
            />
            <Input
              label="Email"
              type="email"
              placeholder="nama@institusi.com"
              {...register('email')}
              error={errors.email?.message}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text">Pilih Peran</label>
              <div className="grid grid-cols-2 gap-2">
                <label className={`
                  flex items-center justify-center px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all
                  ${selectedRole === 'pharmacist' 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-border bg-surface hover:border-primary/50 text-text-muted'}
                `}>
                  <input type="radio" value="pharmacist" {...register('role')} className="hidden" />
                  <span className="text-sm font-semibold">Apoteker</span>
                </label>
                <label className={`
                  flex items-center justify-center px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all
                  ${selectedRole === 'verifier' 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-border bg-surface hover:border-primary/50 text-text-muted'}
                `}>
                  <input type="radio" value="verifier" {...register('role')} className="hidden" />
                  <span className="text-sm font-semibold">Verifikator</span>
                </label>
              </div>
              {errors.role && <p className="text-xs text-error font-medium">{errors.role.message}</p>}
            </div>

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
              disabled={isLoading}
            />
          </div>

          <Input
            label="Nama Institusi / Apotek"
            placeholder="Apotek Sehat Jaya"
            {...register('institution')}
            error={errors.institution?.message}
            disabled={isLoading}
          />

          {selectedRole === 'pharmacist' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <Input
                label="Nomor SIPA"
                placeholder="SIPA/123456/789"
                {...register('sipa_number')}
                error={errors.sipa_number?.message}
                disabled={isLoading}
                helperText="Wajib diisi untuk pendaftaran Apoteker."
              />
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-semibold mt-4" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mendaftarkan...
              </>
            ) : (
              'Daftar Sekarang'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 text-center pb-8 pt-0">
        <p className="text-sm text-text-muted">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Masuk di sini
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
