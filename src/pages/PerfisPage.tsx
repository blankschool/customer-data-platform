import { ShieldIcon, PenIcon, EyeIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useStore } from '@/lib/store'
import { toast } from 'sonner'

const iconMap: Record<string, React.ElementType> = {
  Admin:  ShieldIcon,
  Editor: PenIcon,
  Viewer: EyeIcon,
}

const PerfisPage = () => {
  const { state, dispatch } = useStore()

  function handleToggle(perfilId: string, perfilName: string, category: string, actionName: string) {
    if (perfilName === 'Admin') return // Admin é protegido
    dispatch({ type: 'PERFIL_TOGGLE_PERMISSION', payload: { perfilId, category, actionName } })
    toast.success(`Permissão "${actionName}" atualizada`)
  }

  return (
    <div className='flex flex-col gap-6'>
      {/* Header */}
      <div>
        <h2 className='font-serif text-[22px] font-normal tracking-tight'>Perfis de acesso</h2>
        <span className='text-xs text-muted-foreground font-light'>
          Gerencie permissões por nível de acesso
        </span>
      </div>

      {/* Profile cards */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {state.perfis.map((perfil) => {
          const Icon = iconMap[perfil.name] ?? ShieldIcon
          const isAdmin = perfil.name === 'Admin'

          return (
            <Card key={perfil.id} className='flex flex-col overflow-hidden'>
              {/* Header */}
              <div className='px-6 py-5 border-b border-border'>
                <div className='flex items-center gap-2 mb-1'>
                  <Icon className='size-4 text-muted-foreground' />
                  <h3 className='font-serif text-lg font-normal tracking-tight'>{perfil.name}</h3>
                  {isAdmin && (
                    <span className='ml-auto text-[9px] uppercase tracking-[0.1em] text-muted-foreground'>
                      Protegido
                    </span>
                  )}
                </div>
                <p className='text-xs text-muted-foreground font-light mb-2'>
                  {perfil.description}
                </p>
                <Badge variant='outline' className='text-[10px]'>
                  {perfil.userCount} {perfil.userCount === 1 ? 'usuário' : 'usuários'}
                </Badge>
              </div>

              {/* Permissions */}
              <div className='px-6 py-4 flex flex-col gap-4 flex-1'>
                {perfil.permissions.map((cat) => (
                  <div key={cat.category}>
                    <span className='text-[9px] uppercase tracking-[0.12em] text-muted-foreground'>
                      {cat.category}
                    </span>
                    <div className='mt-1.5 flex flex-col'>
                      {cat.actions.map((action) => (
                        <div
                          key={action.name}
                          className='flex items-center justify-between py-1.5 border-b border-border/50 last:border-0'
                        >
                          <span className='text-xs'>{action.name}</span>
                          <Switch
                            checked={action.allowed}
                            disabled={isAdmin}
                            onCheckedChange={() =>
                              handleToggle(perfil.id, perfil.name, cat.category, action.name)
                            }
                            className='scale-75'
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )
        })}
      </div>

      {state.perfis.length === 0 && (
        <Card className='border-dashed px-6 py-8 text-center text-sm text-muted-foreground'>
          Nenhum perfil carregado localmente. Esta tela deve ser alimentada pelo backend/RLS.
        </Card>
      )}
    </div>
  )
}

export default PerfisPage
