import { Router } from 'express'

const router = Router()

router.get('/hello', (req, res) => {
  res.send('Hello,my guy!')
})

router.post('/users', (req, res) => {
  const { name, email } = req.body
  res.send(`User ${name} (${email}) created successfully!`)
})

export default router