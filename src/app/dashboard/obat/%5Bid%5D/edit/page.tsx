import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { DrugForm } from '@/components/drug/DrugForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditDrugPage({ params }: PageProps) {
  const { id } = await params
  const supabase = createClient()
  const { data: { user } } = await (await supabase).auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: categories } = await (await supabase)
    .from('drug_categories')
    .select('id, name')
    .order('name')

  const { data: drug, error } = await (await supabase)
    .from('drugs')
    .select(`
      *,
      sections:drug_monograph_sections(*)
    `)
    .eq('id', id)
    .single()

  if (!drug || error) {
    notFound()
  }

  // Auth Check: Only submitted_by or Verifier/Admin
  const { data: profile } = await (await supabase)
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isOwner = drug.submitted_by === user.id
  const canEdit = isOwner || profile?.role === 'verifier' || profile?.role === 'admin'

  if (!canEdit) {
    redirect('/dashboard/obat')
  }

  return (
    <div className="py-6">
      <DrugForm 
        initialData={drug} 
        categories={categories || []} 
        mode="edit" 
      />
    </div>
  )
}
