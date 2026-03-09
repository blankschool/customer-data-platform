import { useTheme } from '@/lib/theme'
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeSwitcherProps {
  value?: Theme
  defaultValue?: Theme
  onChange?: (theme: Theme) => void
}

const options: { value: Theme; icon: React.ReactNode }[] = [
  { value: 'light', icon: <SunIcon className='size-3.5' /> },
  { value: 'system', icon: <MonitorIcon className='size-3.5' /> },
  { value: 'dark', icon: <MoonIcon className='size-3.5' /> },
]

export function ThemeSwitcher({ value, defaultValue = 'system', onChange }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme()
  const current = (value ?? theme ?? defaultValue) as Theme

  const handleSelect = (t: Theme) => {
    setTheme(t)
    onChange?.(t)
  }

  return (
    <div className='flex items-center rounded-md border border-border bg-muted p-0.5 gap-0.5'>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => handleSelect(opt.value)}
          className={`flex items-center justify-center size-6 rounded transition-all cursor-pointer ${
            current === opt.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          title={opt.value.charAt(0).toUpperCase() + opt.value.slice(1)}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  )
}
