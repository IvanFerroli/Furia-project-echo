import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import adminRoutes from './routes/admin'
import userRoutes from './routes/users'
import awardsRoutes from './routes/awards'
import messagesRoutes from './routes/messages'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

app.use(
    cors({
      origin: 'http://localhost:5173', // URL do seu frontend
      credentials: true,
    })
  )
  
app.use(express.json())

app.use('/admin', adminRoutes)
app.use('/users', userRoutes)
app.use('/awards', awardsRoutes)
app.use('/messages', messagesRoutes)

app.get('/', (req, res) => {
  res.send('FURIA Fan Chat API running 🟢')
})

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
})
