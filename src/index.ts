import express, { Application } from 'express'
import router from './Routes/routes'


const port = 3000
const app: Application = express()

app.use(express.json())
app.use('/', router)

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})