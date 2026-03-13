import assert from 'node:assert/strict'
import test from 'node:test'

import { buildHealthMetrics, FONTE_LABELS } from '../src/lib/domain'
import { initialState } from '../src/lib/store'

test('store starts empty once mock data is removed', () => {
  assert.deepEqual(initialState, {
    contatos: [],
    inconsistencias: [],
    tags: [],
    usuarios: [],
    perfis: [],
    importacoes: [],
  })
})

test('health metrics render stable zero-state values without seeded data', () => {
  const metrics = buildHealthMetrics([], [], [])
  const metricsByLabel = new Map(metrics.map((metric) => [metric.label, metric]))

  assert.equal(metricsByLabel.get('Total de contatos')?.value, '0')
  assert.equal(metricsByLabel.get('Total de contatos')?.delta, '0 bases ativas')
  assert.equal(metricsByLabel.get('Duplicatas')?.delta, '0,0% da base')
  assert.equal(metricsByLabel.get('Sem tag correta')?.delta, '0,0% da base')
  assert.equal(metricsByLabel.get('Resolvidos')?.delta, 'De 0 inconsistências')
})

test('contact source labels remain available after removing seeded rows', () => {
  assert.deepEqual(FONTE_LABELS, {
    vendas: 'Vendas',
    email: 'E-mail',
    whatsapp: 'WhatsApp',
  })
})
