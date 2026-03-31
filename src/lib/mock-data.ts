interface Profile {
  id: string
  full_name: string | null
  role: 'pharmacist' | 'verifier' | 'admin'
  sipa_number: string | null
  institution: string | null
  is_active: boolean
  avatar_url: string | null
  created_at: string
}

interface DrugCategory {
  id: string
  name: string
  slug: string
  description: string | null
}

interface Drug {
  id: string
  name: string
  brand_names: string[]
  slug: string
  category_id: string | null
  drug_class: string | null
  summary: string | null
  status: 'draft' | 'review' | 'published' | 'archived'
  submitted_by: string | null
  verified_by: string | null
  published_at: string | null
  created_at: string
  category?: DrugCategory
}

interface PublicQuestion {
  id: string
  question_text: string
  asker_name: string | null
  asker_email: string | null
  drug_id: string | null
  status: 'pending' | 'answered' | 'closed'
  answered_by: string | null
  answer_text: string | null
  answered_at: string | null
  is_published: boolean
  created_at: string
  drug?: { name: string }
}

export const MOCK_CATEGORIES: DrugCategory[] = [
  { id: '1', name: 'Antibiotik', slug: 'antibiotik', description: 'Obat untuk mengatasi infeksi bakteri.' },
  { id: '2', name: 'Analgesik', slug: 'analgesik', description: 'Obat pereda nyeri dan demam.' },
  { id: '3', name: 'Antihistamin', slug: 'antihistamin', description: 'Obat untuk meredakan gejala alergi.' },
  { id: '4', name: 'Antivirus', slug: 'antivirus', description: 'Obat untuk infeksi virus.' },
  { id: '5', name: 'Suplemen', slug: 'suplemen', description: 'Vitamin dan mineral tambahan.' },
]

export const MOCK_PROFILES: Profile[] = [
  { id: 'user-1', full_name: 'Budi Santoso, Apt.', role: 'pharmacist', sipa_number: '123/SIPA/2023', institution: 'Apotek Sehat', is_active: true, avatar_url: null, created_at: new Date().toISOString() },
  { id: 'user-2', full_name: 'Siti Aminah, Apt.', role: 'verifier', sipa_number: '456/SIPA/2023', institution: 'RS Medika', is_active: true, avatar_url: null, created_at: new Date().toISOString() },
  { id: 'user-3', full_name: 'Admin Apoteq', role: 'admin', sipa_number: null, institution: 'Apoteq Central', is_active: true, avatar_url: null, created_at: new Date().toISOString() },
  { id: 'user-4', full_name: 'Andi Pratama, Apt.', role: 'pharmacist', sipa_number: '789/SIPA/2024', institution: 'Puskesmas Maju', is_active: false, avatar_url: null, created_at: new Date().toISOString() },
]

export const MOCK_DRUGS: Drug[] = [
  {
    id: 'd1',
    name: 'Amoxicillin',
    brand_names: ['Amoxsan', 'Kalmoxillin', 'Opimox'],
    slug: 'amoxicillin',
    category_id: '1',
    drug_class: 'Penisilin',
    summary: 'Antibiotik spektrum luas yang digunakan untuk mengobati berbagai infeksi bakteri.',
    status: 'published',
    submitted_by: 'user-1',
    verified_by: 'user-2',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    category: MOCK_CATEGORIES[0]
  },
  {
    id: 'd2',
    name: 'Paracetamol',
    brand_names: ['Panadol', 'Sanmol', 'Biogesic'],
    slug: 'paracetamol',
    category_id: '2',
    drug_class: 'Analgesik & Antipiretik',
    summary: 'Obat yang digunakan untuk meredakan nyeri ringan hingga sedang dan menurunkan demam.',
    status: 'published',
    submitted_by: 'user-1',
    verified_by: 'user-2',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    category: MOCK_CATEGORIES[1]
  },
  {
    id: 'd3',
    name: 'Cetirizine',
    brand_names: ['Incidal', 'Ryzen', 'Ozen'],
    slug: 'cetirizine',
    category_id: '3',
    drug_class: 'Antihistamin Gen-2',
    summary: 'Obat untuk meredakan gejala alergi seperti pilek, bersin, dan gatal-gatal.',
    status: 'published',
    submitted_by: 'user-4',
    verified_by: 'user-2',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    category: MOCK_CATEGORIES[2]
  }
]

export const MOCK_QUESTIONS: PublicQuestion[] = [
  {
    id: 'q1',
    question_text: 'Apakah Amoxicillin boleh diminum sesudah makan?',
    asker_name: 'Rina',
    asker_email: 'rina@example.com',
    drug_id: 'd1',
    status: 'answered',
    answered_by: 'user-1',
    answer_text: 'Amoxicillin sebaiknya diminum di awal makan untuk mengurangi rasa tidak nyaman pada perut, namun bisa juga diminum saat perut kosong.',
    answered_at: new Date().toISOString(),
    is_published: true,
    created_at: new Date().toISOString(),
    drug: { name: 'Amoxicillin' }
  },
  {
    id: 'q2',
    question_text: 'Berapa dosis maksimal Paracetamol untuk dewasa?',
    asker_name: 'Bambang',
    asker_email: 'bambang@example.com',
    drug_id: 'd2',
    status: 'pending',
    answered_by: null,
    answer_text: null,
    answered_at: null,
    is_published: false,
    created_at: new Date().toISOString(),
    drug: { name: 'Paracetamol' }
  }
]
