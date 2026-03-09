'use client'

import { Bar, BarChart } from 'recharts'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { type ChartConfig, ChartContainer } from '@/components/ui/chart'
import { Separator } from '@/components/ui/separator'

import { cn } from '@/lib/utils'

const contactsChartData = [
  { mes: 'Novembro', contatos: 1280 },
  { mes: 'Dezembro', contatos: 2100 },
  { mes: 'Janeiro', contatos: 2540 },
  { mes: 'Fevereiro', contatos: 2847 },
  { mes: 'Março', contatos: 3102 }
]

const contactsChartConfig = {
  contatos: {
    label: 'Contatos',
    color: 'var(--primary)'
  }
} satisfies ChartConfig

const inconsistenciasChartData = [
  { mes: 'Novembro', inconsistencias: 12 },
  { mes: 'Dezembro', inconsistencias: 28 },
  { mes: 'Janeiro', inconsistencias: 19 },
  { mes: 'Fevereiro', inconsistencias: 35 },
  { mes: 'Março', inconsistencias: 47 }
]

const inconsistenciasChartConfig = {
  inconsistencias: {
    label: 'Inconsistências',
    color: 'color-mix(in oklab, var(--primary) 10%, transparent)'
  }
} satisfies ChartConfig

const ProductInsightsCard = ({ className }: { className?: string }) => {
  return (
    <Card className={cn('gap-4', className)}>
      <CardHeader className='flex justify-between'>
        <div className='flex flex-col gap-1'>
          <span className='text-lg font-semibold'>Bases carregadas</span>
          <span className='text-muted-foreground text-sm'>2 de 3 fontes conectadas</span>
        </div>
        <img
          src='https://cdn.shadcnstudio.com/ss-assets/blocks/dashboard-application/widgets/image-7.png'
          alt='Base de dados'
          className='w-20.5 rounded-md'
        />
      </CardHeader>
      <CardContent className='space-y-4'>
        <Separator />
        <div className='flex items-center justify-between gap-1'>
          <div className='flex flex-col gap-1'>
            <span className='text-xs'>Contatos totais</span>
            <span className='text-2xl font-semibold'>5.949</span>
          </div>
          <ChartContainer config={contactsChartConfig} className='min-h-13 max-w-18'>
            <BarChart accessibilityLayer data={contactsChartData} barSize={8}>
              <Bar dataKey='contatos' fill='var(--color-contatos)' radius={2} />
            </BarChart>
          </ChartContainer>
        </div>

        <div className='flex items-center justify-between gap-1'>
          <div className='flex flex-col gap-1'>
            <span className='text-xs'>Inconsistências ativas</span>
            <span className='text-2xl font-semibold'>47</span>
          </div>
          <ChartContainer config={inconsistenciasChartConfig} className='min-h-13 max-w-18'>
            <BarChart accessibilityLayer data={inconsistenciasChartData} barSize={8}>
              <Bar dataKey='inconsistencias' fill='var(--color-inconsistencias)' radius={2} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductInsightsCard
