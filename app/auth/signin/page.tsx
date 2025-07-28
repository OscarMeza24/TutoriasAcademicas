import { EnhancedSignInForm } from "@/components/forms/enhanced-auth-forms"
import { Header } from "@/components/layout/header"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900">
      <Header />
      <main id="main-content" className="flex-1 py-20 px-4">
        <div className="container mx-auto">
          <EnhancedSignInForm />
        </div>
      </main>
    </div>
  )
}
