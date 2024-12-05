import Attestation from '../../components/Attestation'
import { Suspense } from 'react'
import { LoadingSkeleton } from '@/components/loading-skeleton'

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Attestation />
    </Suspense>
)
}