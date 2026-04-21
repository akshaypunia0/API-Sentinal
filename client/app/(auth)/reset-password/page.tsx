import { Suspense } from 'react'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm'

const ResetPasswordPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-background to-muted">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}

export default ResetPasswordPage
