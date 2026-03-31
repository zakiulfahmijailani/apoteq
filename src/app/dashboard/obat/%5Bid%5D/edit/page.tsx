import React from 'react'
import { notFound } from 'next/navigation'
import { DrugForm } from '@/components/drug/DrugForm'
import { MOCK_DRUGS, MOCK_CATEGORIES, MOCK_PROFILES } from '@/lib/mock-data'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditDrugPage({ params }: PageProps) {
  const { id } = await params
  
  // Static Demo: Always use pharmacist Budi Santoso
  const profile = MOCK_PROFILES[0]
  
  const drug = MOCK_DRUGS.find(d => d.id === id)

  if (!drug) {
    notFound()
  }

  // Auth Check: In static demo we allow editing if it matches owner or is admin/verifier
  const isOwner = drug.submitted_by === profile.id
  const canEdit = isOwner || profile?.role === 'verifier' || profile?.role === 'admin'

  if (!canEdit) {
    // For demo purposes, we usually allow it but can redirect if needed
    // redirect('/dashboard/obat')
  }

  return (
    <div className="py-6">
      <DrugForm 
        initialData={drug} 
        categories={MOCK_CATEGORIES} 
        mode="edit" 
      />
    </div>
  )
}

