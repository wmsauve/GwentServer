import { Router } from 'express'
import { UserModel } from '../DB/schema'
import bcrypt from 'bcrypt'
import { ResponseToClient } from '../Utility/structures'

const router = Router()
const saltRounds = 10;

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
router.post('/api' + '/generateUser', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const _user = await CheckForValidUsername(username);
  
      if (_user) {
        return res.send(CreateResponseToClient(false, "That user already exists."));
      }
  
      const hashedPassword = await hashPassword(password);
      const user = new UserModel({
        username: username,
        password: hashedPassword
      });
  
      await user.save();
      res.send(CreateResponseToClient(true, "Welcome to Gwent " + username));
    } catch (err) {
      console.error(err);
      res.send(CreateResponseToClient(false, err));
    }
  });

router.post('/api' + '/login', (req, res) =>{
    const { username, password } = req.body

    UserModel.findOne({username: username}).
    then((user) => {
        let compare = comparePasswords(password, user.password)
        compare.then(data =>{
            if(data){
                res.send(CreateResponseToClient(true, "Login successful."))
            }
            else{
                res.send(CreateResponseToClient(false, "Invalid password."))
            }
        }).
        catch(err => {
            console.log(err)
            res.send(CreateResponseToClient(false, "An error occurred, please try again later."))
        })
    }). 
    catch(err =>{
        console.log(err)
        res.send(CreateResponseToClient(false, "User: " + username + " not found."))
    })
})

async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(password, salt)
    return hash
}

async function comparePasswords(password: string, hash: string): Promise<boolean> {
    const match = await bcrypt.compare(password, hash);
    return match;
}

async function CheckForValidUsername(username: string){
    try{
        const _user = await UserModel.findOne({username: username})
        return _user
    }
    catch(err){
        console.error(err)
        throw err
    }
}

function CreateResponseToClient(success: boolean, message: string): string {
    let toClient: ResponseToClient = {
        isSuccess: success,
        message: message,
    };
    console.log(message)
    return JSON.stringify(toClient);
}

export default router