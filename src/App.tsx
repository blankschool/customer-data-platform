import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/lib/theme'
import { StoreProvider } from '@/lib/store'
import { Toaster } from '@/components/ui/sonner'
import AppLayout from './components/app-layout'
import DashboardPage from './pages/DashboardPage'
import UploadPage from './pages/UploadPage'
import InconsistenciasPage from './pages/InconsistenciasPage'
import ContatosPage from './pages/ContatosPage'
import TagsPage from './pages/TagsPage'
import ExportarPage from './pages/ExportarPage'
import UsuariosPage from './pages/UsuariosPage'
import PerfisPage from './pages/PerfisPage'

function App() {
  return (
    <ThemeProvider defaultTheme='system'>
      <StoreProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Toaster richColors position='top-right' />
          <Routes>
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
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </ThemeProvider>
  )
}

export default App
