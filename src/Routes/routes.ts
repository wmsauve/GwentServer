import { Router } from 'express';
import { userCtrl } from '../Controllers/UserRelated';
import { serverCtrl } from '../Controllers/ServerRelated';

const router = Router();

//Add endpoints to .env
router.post('/api' + '/generateUser', userCtrl.signUp);

router.post('/api' + '/login', userCtrl.loginUser);

router.post('/api' + '/saveDecks', userCtrl.saveDecks);

router.post('/apiServer' + '/fetchDeckByUser', serverCtrl.fetchDeckByUser);

export default router;