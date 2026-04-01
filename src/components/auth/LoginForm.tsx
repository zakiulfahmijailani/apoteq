'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

const loginSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter' }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export const LoginForm = () => {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (_values: LoginFormValues) => {
    setIsLoading(true)
    setError(null)

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))

    try {
      // Mock login always succeeds for demo
      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-none shadow-2xl bg-surface/50 backdrop-blur-xl">
      <CardHeader className="space-y-1 pb-8">
        <CardTitle className="text-3xl text-center">Selamat Datang</CardTitle>
        <CardDescription className="text-center text-text-muted">
          Masuk ke akun apoteq Anda untuk mengelola informasi obat.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-4 rounded-xl bg-error/10 border border-error/20 flex items-center gap-3 text-error text-sm animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle size={18} />
              <p>{error}</p>
            </div>
          )}
          
          <Input
            label="Email"
            type="email"
            placeholder="nama@institusi.com"
            {...register('email')}
            error={errors.email?.message}
            disabled={isLoading}
          />
          
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-text">Password</label>
              <Link 
                href="/forgot-password" 
                className="text-xs text-primary hover:underline font-medium"
              >
                Lupa password?
              </Link>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
              disabled={isLoading}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-semibold mt-6" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              'Masuk Sekarang'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 text-center pb-8 pt-0">
        <p className="text-sm text-text-muted">
          Belum punya akun?{' '}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Daftar di sini
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
