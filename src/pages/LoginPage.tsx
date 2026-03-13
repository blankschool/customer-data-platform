import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  KeyRoundIcon,
  Loader2Icon,
  MailIcon,
  ShieldCheckIcon,
} from 'lucide-react'
import { toast } from 'sonner'

import { ThemeSwitcher } from '@/components/kibo-ui/theme-switcher'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/lib/auth/auth'

type LocationState = {
  from?: {
    pathname?: string
  }
}

export default function LoginPage() {
  const location = useLocation()
  const { status, errorMessage, signInWithMagicLink, signInWithPassword, clearError, workspaceSlug } =
    useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pendingAction, setPendingAction] = useState<'password' | 'magic-link' | null>(null)

  const targetPath = (location.state as LocationState | null)?.from?.pathname ?? '/'

  if (status === 'authenticated') {
    return <Navigate to={targetPath} replace />
  }

  const isMisconfigured = status === 'misconfigured'

  async function handlePasswordLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    clearError()
    setPendingAction('password')

    try {
      await signInWithPassword(email.trim(), password)
      toast.success('Sessão autenticada com sucesso.')
    } catch {
      toast.error('Falha ao autenticar. Revise e-mail e senha.')
    } finally {
      setPendingAction(null)
    }
  }

  async function handleMagicLink() {
    clearError()
    setPendingAction('magic-link')

    try {
      await signInWithMagicLink(email.trim())
      toast.success('Magic link enviado. Verifique sua caixa de entrada.')
    } catch {
      toast.error('Não foi possível enviar o magic link.')
    } finally {
      setPendingAction(null)
    }
  }

  return (
    <div className='relative flex min-h-screen overflow-y-auto bg-background text-foreground'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--foreground)/0.08),transparent_28%),radial-gradient(circle_at_bottom_right,hsl(var(--muted-foreground)/0.12),transparent_34%)]' />

      <div className='relative grid min-h-screen w-full lg:grid-cols-[1.1fr_0.9fr]'>
        <section className='flex flex-col justify-between border-b border-border/70 px-6 py-6 sm:px-10 lg:border-b-0 lg:border-r lg:px-14 lg:py-10'>
          <div className='flex items-center justify-between gap-4'>
            <div>
              <span className='text-[10px] uppercase tracking-[0.18em] text-muted-foreground'>
                Blank School CDP
              </span>
              <h1 className='mt-2 font-serif text-[30px] font-normal tracking-tight sm:text-[40px]'>
                Acesso protegido
              </h1>
            </div>
            <ThemeSwitcher defaultValue='system' />
          </div>

          <div className='mt-12 flex max-w-xl flex-col gap-8 lg:mt-0'>
            <div className='space-y-4'>
              <div className='inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground'>
                <ShieldCheckIcon className='size-3.5' />
                Segurança por Supabase Auth + PKCE
              </div>

              <p className='max-w-lg text-sm leading-6 text-muted-foreground sm:text-base'>
                Entre para acessar o workspace do CDP. A sessão é persistida no navegador e o acesso
                fica restrito a usuários autenticados.
              </p>
            </div>

            <div className='grid gap-3 sm:grid-cols-3'>
              {[
                {
                  title: 'Sessão segura',
                  body: 'Tokens gerenciados pelo Supabase com renovação automática.',
                },
                {
                  title: 'Workspace isolado',
                  body: workspaceSlug ? `Slug atual: ${workspaceSlug}` : 'Defina o slug do workspace no .env.',
                },
                {
                  title: 'Acesso auditável',
                  body: 'Fluxo pronto para evoluir para RLS + membership checks no backend.',
                },
              ].map((item) => (
                <div key={item.title} className='rounded-2xl border border-border bg-card/80 p-4 backdrop-blur-sm'>
                  <p className='text-[11px] uppercase tracking-[0.12em] text-muted-foreground'>{item.title}</p>
                  <p className='mt-2 text-sm text-foreground/85'>{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className='mt-10 text-xs text-muted-foreground'>
            A entrada principal do produto continua em <Link className='underline underline-offset-4' to='/'>/</Link>, mas agora é protegida por autenticação.
          </div>
        </section>

        <section className='flex items-center justify-center px-6 py-10 sm:px-10 lg:px-14'>
          <div className='w-full max-w-md rounded-[28px] border border-border bg-card p-6 shadow-[0_24px_80px_hsl(var(--foreground)/0.08)] sm:p-8'>
            <div className='mb-6'>
              <p className='text-[10px] uppercase tracking-[0.16em] text-muted-foreground'>Entrar</p>
              <h2 className='mt-2 font-serif text-[28px] font-normal tracking-tight'>Login do operador</h2>
              <p className='mt-2 text-sm text-muted-foreground'>
                Use senha ou receba um magic link no e-mail cadastrado.
              </p>
            </div>

            {errorMessage && (
              <div className='mb-5 rounded-2xl border border-[hsl(var(--warning)/0.35)] bg-[hsl(var(--warning)/0.08)] px-4 py-3 text-sm text-foreground'>
                <div className='flex items-start gap-3'>
                  <AlertTriangleIcon className='mt-0.5 size-4 flex-shrink-0' />
                  <div>{errorMessage}</div>
                </div>
              </div>
            )}

            <form className='flex flex-col gap-4' onSubmit={handlePasswordLogin}>
              <div className='flex flex-col gap-1.5'>
                <Label htmlFor='login-email'>E-mail</Label>
                <Input
                  id='login-email'
                  type='email'
                  autoComplete='email'
                  placeholder='voce@empresa.com'
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={isMisconfigured || pendingAction !== null}
                  required
                />
              </div>

              <div className='flex flex-col gap-1.5'>
                <div className='flex items-center justify-between gap-3'>
                  <Label htmlFor='login-password'>Senha</Label>
                  <button
                    type='button'
                    onClick={handleMagicLink}
                    disabled={isMisconfigured || !email.trim() || pendingAction !== null}
                    className='text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50'
                  >
                    Enviar magic link
                  </button>
                </div>
                <Input
                  id='login-password'
                  type='password'
                  autoComplete='current-password'
                  placeholder='Sua senha'
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isMisconfigured || pendingAction !== null}
                  required
                />
              </div>

              <Button
                type='submit'
                size='lg'
                disabled={isMisconfigured || pendingAction !== null}
                className='mt-2 h-11 gap-2'
              >
                {pendingAction === 'password' ? (
                  <>
                    <Loader2Icon className='size-4 animate-spin' />
                    Autenticando...
                  </>
                ) : (
                  <>
                    <KeyRoundIcon className='size-4' />
                    Entrar com senha
                  </>
                )}
              </Button>
            </form>

            <Separator className='my-6' />

            <div className='space-y-3'>
              <Button
                type='button'
                variant='outline'
                size='lg'
                disabled={isMisconfigured || !email.trim() || pendingAction !== null}
                onClick={handleMagicLink}
                className='h-11 w-full gap-2'
              >
                {pendingAction === 'magic-link' ? (
                  <>
                    <Loader2Icon className='size-4 animate-spin' />
                    Enviando link...
                  </>
                ) : (
                  <>
                    <MailIcon className='size-4' />
                    Receber magic link
                  </>
                )}
              </Button>

              <p className='text-xs leading-5 text-muted-foreground'>
                Depois do login, você volta automaticamente para a página solicitada.
              </p>
            </div>

            <div className='mt-6 rounded-2xl bg-muted/60 px-4 py-3 text-xs text-muted-foreground'>
              Dica para testes locais: crie o usuário no Supabase Auth e confirme o e-mail antes de usar o fluxo protegido.
              <span className='mt-2 flex items-center gap-1 text-foreground/80'>
                Workspace protegido <ArrowRightIcon className='size-3' /> {workspaceSlug ?? 'não configurado'}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
