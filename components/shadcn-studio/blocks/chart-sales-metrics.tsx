'use client'

import {
  AlertCircleIcon,
  ChartNoAxesCombinedIcon,
  CirclePercentIcon,
  TagIcon,
  TriangleAlertIcon,
  UserXIcon
} from 'lucide-react'

import { Bar, BarChart, Label, Pie, PieChart } from 'recharts'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const diagnosticsPercentage = 65
const totalBars = 24
const filledBars = Math.round((diagnosticsPercentage * totalBars) / 100)

const diagnosticsChartData = Array.from({ length: totalBars }, (_, index) => {
  const date = new Date(2025, 2, 8)
  const formattedDate = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
  return {
    date: formattedDate,
    resolvidos: index < filledBars ? 315 : 0
  }
})

const diagnosticsChartConfig = {
  resolvidos: {
    label: 'Resolvidos'
  }
} satisfies ChartConfig

const MetricsData = [
  {
    icons: <TriangleAlertIcon className='size-5' />,
    title: 'Duplicatas',
    value: '284'
  },
  {
    icons: <TagIcon className='size-5' />,
    title: 'Tags ausentes',
    value: '631'
  },
  {
    icons: <AlertCircleIcon className='size-5' />,
    title: 'Inadimplentes',
    value: '5'
  },
  {
    icons: <UserXIcon className='size-5' />,
    title: 'Órfãos',
    value: '3'
  }
]

const conflictChartData = [
  { tipo: 'resolvidos', conflitos: 38, fill: 'var(--color-resolvidos)' },
  { tipo: 'duplicatas', conflitos: 18, fill: 'var(--color-duplicatas)' },
  { tipo: 'pendentes', conflitos: 9, fill: 'var(--color-pendentes)' }
]

const conflictChartConfig = {
  conflitos: {
    label: 'Conflitos'
  },
  resolvidos: {
    label: 'Resolvidos',
    color: 'var(--primary)'
  },
  duplicatas: {
    label: 'Duplicatas',
    color: 'color-mix(in oklab, var(--primary) 60%, transparent)'
  },
  pendentes: {
    label: 'Pendentes',
    color: 'color-mix(in oklab, var(--primary) 20%, transparent)'
  }
} satisfies ChartConfig

const SalesMetricsCard = ({ className }: { className?: string }) => {
  return (
    <Card className={className}>
      <CardContent className='space-y-4'>
        <div className='grid gap-6 lg:grid-cols-5'>
          <div className='flex flex-col gap-7 lg:col-span-3'>
            <span className='text-lg font-semibold'>Métricas da base</span>
            <div className='flex items-center gap-3'>
              <img
                src='https://cdn.shadcnstudio.com/ss-assets/logo/logo-square.png'
                className='size-10.5 rounded-lg'
                alt='CDP logo'
              />
              <div className='flex flex-col gap-0.5'>
                <span className='text-xl font-medium'>CDP Platform</span>
                <span className='text-muted-foreground text-sm'>diagnostico@empresa.com</span>
              </div>
            </div>

            <div className='grid gap-4 sm:grid-cols-2'>
              {MetricsData.map((metric, index) => (
                <div key={index} className='flex items-center gap-3 rounded-md border px-4 py-2'>
                  <Avatar className='size-8.5 rounded-sm'>
                    <AvatarFallback className='bg-primary/10 text-primary shrink-0 rounded-sm'>
                      {metric.icons}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col gap-0.5'>
                    <span className='text-muted-foreground text-sm font-medium'>{metric.title}</span>
                    <span className='text-lg font-medium'>{metric.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Card className='gap-4 py-4 shadow-none lg:col-span-2'>
            <CardHeader className='gap-1'>
              <CardTitle className='text-lg font-semibold'>Conflitos resolvidos</CardTitle>
            </CardHeader>

            <CardContent className='px-0'>
              <ChartContainer config={conflictChartConfig} className='h-38.5 w-full'>
                <PieChart margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={conflictChartData}
                    dataKey='conflitos'
                    nameKey='tipo'
                    startAngle={300}
                    endAngle={660}
                    innerRadius={58}
                    outerRadius={75}
                    paddingAngle={2}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                          return (
                            <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle' dominantBaseline='middle'>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) - 12}
                                className='fill-card-foreground text-lg font-medium'
                              >
                                38/47
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 19}
                                className='fill-muted-foreground text-sm'
                              >
                                Resolvidos
                              </tspan>
                            </text>
                          )
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>

            <CardFooter className='justify-between'>
              <span className='text-xl'>Conflitos resolvidos</span>
              <span className='text-2xl font-medium'>81%</span>
            </CardFooter>
          </Card>
        </div>
        <Card className='shadow-none'>
          <CardContent className='grid gap-4 px-4 lg:grid-cols-5'>
            <div className='flex flex-col justify-center gap-6'>
              <span className='text-lg font-semibold'>Diagnóstico</span>
              <span className='max-lg:5xl text-6xl'>{diagnosticsPercentage}%</span>
              <span className='text-muted-foreground text-sm'>Progresso do diagnóstico da base</span>
            </div>
            <div className='flex flex-col gap-6 text-lg md:col-span-4'>
              <span className='font-medium'>Indicadores de inconsistência</span>
              <span className='text-muted-foreground text-wrap'>
                Cruzamento de três fontes: Base Vendas, E-mail Marketing e CRM WhatsApp. Deduplicação por e-mail
                (chave primária) e telefone com normalização de formato.
              </span>
              <div className='grid gap-6 md:grid-cols-2'>
                <div className='flex items-center gap-2'>
                  <ChartNoAxesCombinedIcon className='size-6' />
                  <span className='text-lg font-medium'>Fila de revisão</span>
                </div>
                <div className='flex items-center gap-2'>
                  <CirclePercentIcon className='size-6' />
                  <span className='text-lg font-medium'>Resolução em lote</span>
                </div>
              </div>

              <ChartContainer config={diagnosticsChartConfig} className='h-7.75 w-full'>
                <BarChart
                  accessibilityLayer
                  data={diagnosticsChartData}
                  margin={{
                    left: 0,
                    right: 0
                  }}
                  maxBarSize={16}
                >
                  <Bar
                    dataKey='resolvidos'
                    fill='var(--primary)'
                    background={{ fill: 'color-mix(in oklab, var(--primary) 10%, transparent)', radius: 12 }}
                    radius={12}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

export default SalesMetricsCard
