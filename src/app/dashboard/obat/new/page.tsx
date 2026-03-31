import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { DrugForm } from '@/components/drug/DrugForm'
import { redirect } from 'next/navigation'

export default async function NewDrugPage() {
  const supabase = createClient()
  const { data: { user } } = await (await supabase).auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: categories } = await (await supabase)
    .from('drug_categories')
    .select('id, name')
    .order('name')

  return (
    <div className="py-6">
      <DrugForm categories={categories || []} mode="create" />
    </div>
  )
}
