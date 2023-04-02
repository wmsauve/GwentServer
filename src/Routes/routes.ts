import { Router } from 'express'
import { controls } from '../Controllers/UserRelated'

const router = Router()

//Add endpoints to .env
router.post('/api' + '/generateUser', controls.signUp)

router.post('/api' + '/login', controls.loginUser)

router.post('/api' + '/saveDecks', controls.saveDecks)

export default router