import type { Contato } from './mock-data'
import * as XLSX from 'xlsx'

/**
 * Exporta contatos como arquivo CSV (UTF-8 com BOM para acentos no Excel)
 */
export function exportCSV(contatos: Contato[], filename = 'contatos_cdp.csv') {
  const headers = ['Nome', 'Email', 'Telefone', 'Fonte', 'Tags', 'Status']
  const rows = contatos.map((c) => [
    c.name,
    c.email,
    c.phone,
    c.source,
    c.tags.join('; '),
    c.status,
  ])

  const csvContent =
    '\uFEFF' + // BOM for UTF-8
    [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  triggerDownload(blob, filename)
}

/**
 * Exporta contatos como arquivo Excel (.xlsx) usando SheetJS
 */
export function exportExcel(contatos: Contato[], filename = 'contatos_cdp.xlsx') {
  const data = contatos.map((c) => ({
    Nome: c.name,
    Email: c.email,
    Telefone: c.phone,
    Fonte: c.source,
    Tags: c.tags.join('; '),
    Status: c.status,
  }))

  const ws = XLSX.utils.json_to_sheet(data)

  // Column widths
  ws['!cols'] = [
    { wch: 25 }, // Nome
    { wch: 30 }, // Email
    { wch: 18 }, // Telefone
    { wch: 18 }, // Fonte
    { wch: 35 }, // Tags
    { wch: 12 }, // Status
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Contatos')

  const xlsxBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([xlsxBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  triggerDownload(blob, filename)
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
