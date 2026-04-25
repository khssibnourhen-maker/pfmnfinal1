import { connectDb } from './config/db.js'
import { env } from './config/env.js'
import { createApp } from './app.js'
import { seedDatabase } from './utils/seed.js'

const app = createApp()

async function start() {
  try {
    await connectDb()
    await seedDatabase()
    app.listen(env.port, () => {
      console.log(`[server] listening on http://localhost:${env.port}`)
    })
  } catch (error) {
    console.error('[server] failed to start:', error?.message || error)
    process.exit(1)
  }
}

start()
