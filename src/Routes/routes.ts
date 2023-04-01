import { Router } from 'express'
import { controls } from '../Controllers/UserRelated'

const router = Router()

// router.get('/users', async (req, res) => {
//     try {
//         const users = await UserModel.find({});
//         console.log(users);
//         res.send(users);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Error retrieving users from database');
//     }
// });

//Add endpoints to .env
router.post('/api' + '/generateUser', controls.signUp)

router.post('/api' + '/login', controls.loginUser)

router.post('/api' + '/saveDecks', controls.saveDecks)

export default router