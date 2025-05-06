import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import adminRoutes from './routes/admin'
import userRoutes from './routes/users'
import awardsRoutes from './routes/awards'
import messagesRoutes from './routes/messages'
import metricsRoutes from './routes/metrics'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

app.use(
  cors({
    origin: '*', // Permite chamadas de qualquer origem (ideal pra produção, ajustar se quiser restringir)
    credentials: true,
  })
)

app.use(express.json())

app.use('/admin', adminRoutes)
app.use('/users', userRoutes)
app.use('/awards', awardsRoutes)
app.use('/messages', messagesRoutes)
app.use('/metrics', metricsRoutes)

app.get('/', (req, res) => {
  res.send('FURIA Fan Chat API running 🟢')
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://0.0.0.0:${port}`)
})
