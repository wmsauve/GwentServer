import { Router } from 'express'
import { UserModel } from '../DB/schema'
import bcrypt from 'bcrypt'

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
router.post('/api' + '/generateUser', (req, res) => {
    const { username, password } = req.body

    let hashedPassword = hashPassword(password);

    hashedPassword.then(data => {
        let user = new UserModel({
            username: username,
            password: data
        })
        user.save().then(() => {
            console.log("User saved to database")
            res.send("User created successfully!")
        }).
        catch((err) =>{
            console.error(err)
            res.send(err);
        })
    }).catch(err => {
        console.error(err)
        res.send(err);
    })
})

router.post('/api' + '/login', (req, res) =>{
    const { username, password } = req.body

    UserModel.findOne({username: username}).
    then((user) => {
        let compare = comparePasswords(password, user.password)
        compare.then(data =>{
            if(data){
                console.log("Login successful.")
                res.send("Login successful.")
            }
            else{
                console.log("Invalid password.")
                res.send("Invalid password.")
            }
        }).
        catch(err => {
            console.log(err)
        })
    }). 
    catch(err =>{
        console.log(err)
        console.log("User: " + username + " not found.")
        res.send("User: " + username + " not found.")
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

export default router