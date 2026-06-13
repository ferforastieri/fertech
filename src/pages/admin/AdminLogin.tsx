import { FormEvent, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ThemeToggle } from '@/components/ui/feedback'
import { Button, Input } from '@/components/ui/forms'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/layout'
import { supabase } from '@/config/supabase/client'
import { useAdminSession } from '@/api/admin/useAdminSession'
import { useStoredTheme } from '@/hooks/useStoredTheme'
import { notifyError, notifySuccess } from '@/components/ui/feedback/notifications'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { session, isLoading } = useAdminSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { theme, toggleTheme } = useStoredTheme()

  if (!isLoading && session) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setIsSubmitting(false)

    if (loginError) {
      setError(loginError.message)
      notifyError('Erro ao entrar no painel', loginError)
      return
    }

    notifySuccess('Login realizado com sucesso.')
    navigate('/admin')
  }

  return (
    <main className="min-h-screen bg-background px-4 py-12 text-foreground">
      <div className="fixed right-4 top-4">
        <ThemeToggle theme={theme} onToggle={toggleTheme} variant="outline" size="lg" />
      </div>
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                label="E-mail"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
              <Input
                label="Senha"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" loading={isSubmitting}>
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
