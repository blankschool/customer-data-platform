import cors from 'cors'
import express from 'express'
import * as trpcExpress from '@trpc/server/adapters/express'

import { getServerEnv } from './env'
import { createTrpcContext } from './trpc/context'
import { appRouter } from './trpc/router'

const env = getServerEnv()
const app = express()

app.use(
  cors({
    origin: env.allowedOrigins,
    credentials: true,
  }),
)

app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'cdp-trpc',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  })
})

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: createTrpcContext,
  }),
)

app.listen(env.port, () => {
  console.log(
    `[cdp-trpc] listening on http://localhost:${env.port}/trpc for workspace ${
      env.workspaceSlug ?? '<unset>'
    }`,
  )
})
