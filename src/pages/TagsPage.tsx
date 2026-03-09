import { useState } from 'react'
import { PlusIcon, MoreHorizontalIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { tagsData } from '@/lib/mock-data'

const TagsPage = () => {
  const [search, setSearch] = useState('')

  const filteredTags = tagsData.filter((tag) =>
    tag.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className='flex flex-col gap-6'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div>
          <h2 className='font-serif text-[22px] font-normal tracking-tight'>
            Tags
          </h2>
          <span className='text-xs text-muted-foreground font-light'>
            Gerencie as tags de segmentação dos contatos
          </span>
        </div>
        <Button size='sm'>
          <PlusIcon className='size-4 mr-1.5' /> Nova tag
        </Button>
      </div>

      {/* Search */}
      <Input
        placeholder='Buscar tags...'
        className='max-w-xs'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Tag grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {filteredTags.map((tag) => (
          <Card
            key={tag.id}
            className='px-6 py-5 flex flex-col gap-3 hover:bg-card/60 transition-all cursor-pointer'
          >
            <div className='flex items-center justify-between'>
              <span
                className={`text-xs px-2.5 py-1 rounded border ${tag.color}`}
              >
                {tag.name}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='icon' className='size-7'>
                    <MoreHorizontalIcon className='size-3.5' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem>Editar</DropdownMenuItem>
                  <DropdownMenuItem>Renomear</DropdownMenuItem>
                  <DropdownMenuItem className='text-red-500'>
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <span className='font-sans text-[36px] font-light tracking-[-0.03em] leading-none'>
              {tag.count.toLocaleString('pt-BR')}
            </span>
            <span className='text-[11px] text-muted-foreground font-light'>
              {tag.description}
            </span>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default TagsPage
