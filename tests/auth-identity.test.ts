import assert from 'node:assert/strict'
import test from 'node:test'

import { buildAuthIdentity, toAvatarFallback } from '../src/lib/auth/identity'

test('buildAuthIdentity prefers Supabase metadata when available', () => {
  const identity = buildAuthIdentity({
    email: 'operadora@empresa.com',
    user_metadata: {
      full_name: 'Operadora Segura',
      avatar_url: 'https://example.com/avatar.png',
    },
  } as never)

  assert.equal(identity.name, 'Operadora Segura')
  assert.equal(identity.email, 'operadora@empresa.com')
  assert.equal(identity.avatarUrl, 'https://example.com/avatar.png')
  assert.equal(identity.avatarFallback, 'OS')
})

test('buildAuthIdentity falls back to the email local part', () => {
  const identity = buildAuthIdentity({
    email: 'time.cdp@empresa.com',
    user_metadata: {},
  } as never)

  assert.equal(identity.name, 'Time Cdp')
  assert.equal(identity.avatarFallback, 'TC')
})

test('toAvatarFallback still returns a stable fallback without name', () => {
  assert.equal(toAvatarFallback('', 'cdp@empresa.com'), 'CD')
})
