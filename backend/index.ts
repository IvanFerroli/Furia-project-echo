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
const port = Number(process.env.PORT) || 3001;

app.use(
  cors({
    origin: 'https://furia-project-echo-1.onrender.com',
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
