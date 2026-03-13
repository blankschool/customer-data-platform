import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { ThemeProvider } from '@/lib/theme'
import { AuthProvider, useAuth } from '@/lib/auth/auth'
import { StoreProvider } from '@/lib/store'
import { TRPCProvider } from '@/lib/trpc/react'
import { Toaster } from '@/components/ui/sonner'
import AppLayout from './components/app-layout'

const LoginPage = lazy(() => import('./pages/LoginPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const UploadPage = lazy(() => import('./pages/UploadPage'))
const InconsistenciasPage = lazy(() => import('./pages/InconsistenciasPage'))
const ContatosPage = lazy(() => import('./pages/ContatosPage'))
const TagsPage = lazy(() => import('./pages/TagsPage'))
const ExportarPage = lazy(() => import('./pages/ExportarPage'))
const UsuariosPage = lazy(() => import('./pages/UsuariosPage'))
const PerfisPage = lazy(() => import('./pages/PerfisPage'))

function AuthGuard() {
  const location = useLocation()
  const { status } = useAuth()

  if (status === 'loading') {
    return (
      <div className='flex min-h-screen items-center justify-center text-sm text-muted-foreground'>
        Validando sessão...
      </div>
    )
  }

  if (status !== 'authenticated') {
    return <Navigate to='/login' replace state={{ from: location }} />
  }

  return <Outlet />
}

function App() {
  return (
    <ThemeProvider defaultTheme='system'>
      <TRPCProvider>
        <AuthProvider>
          <StoreProvider>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Toaster richColors position='top-right' />
              <Suspense
                fallback={
                  <div className='flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground'>
                    Carregando página...
                  </div>
                }
              >
                <Routes>
                  <Route path='/login' element={<LoginPage />} />
                  <Route element={<AuthGuard />}>
                    <Route element={<AppLayout />}>
                      <Route path='/' element={<DashboardPage />} />
                      <Route path='/upload' element={<UploadPage />} />
                      <Route path='/inconsistencias' element={<InconsistenciasPage />} />
                      <Route path='/contatos' element={<ContatosPage />} />
                      <Route path='/tags' element={<TagsPage />} />
                      <Route path='/exportar' element={<ExportarPage />} />
                      <Route path='/usuarios' element={<UsuariosPage />} />
                      <Route path='/perfis' element={<PerfisPage />} />
                    </Route>
                  </Route>
                </Routes>
              </Suspense>
            </BrowserRouter>
          </StoreProvider>
        </AuthProvider>
      </TRPCProvider>
    </ThemeProvider>
  )
}

export default App
