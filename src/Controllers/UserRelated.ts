import { FL } from '../Utility/FunctionLibrary'
import { UserModel, IDeck, IUser, SavedDeckModel } from '../DB/schema'

interface EndpointController{
    loginUser: (req: any, res: any) => Promise<void>,
    signUp: (req: any, res: any) => Promise<void>,
    saveDecks: (req: any, res: any) => Promise<void>
}

let controls: EndpointController = {
    loginUser: async (req, res) =>{
        const { username, password } = req.body
    
        try {
            const _user = await UserModel.findOne({ username: username }).populate('myDecks')
            if (_user) {
                const isMatch = await FL.comparePasswords(password, _user.password)
                if (isMatch) {
                    const _info = {}
                    _info["username"] = username
    
                    if(_user.myDecks instanceof SavedDeckModel){
                        _info["decks"] = _user.myDecks;
                    }

                    console.log(_info)
    
                    res.send(FL.CreateResponseToClient(true, "Login successful.", JSON.stringify(_info)))
                } else {
                    res.send(FL.CreateResponseToClient(false, "Invalid password."))
                }
            } else {
                res.send(FL.CreateResponseToClient(false, "User: " + username + " not found."))
            }
        } catch (err) {
            console.log(err)
            res.send(FL.CreateResponseToClient(false, "An error occurred, please try again later."))
        }
    },
    signUp: async (req, res) => {
        const { username, password } = req.body;
      
        try {
            const _user = await FL.CheckForValidUsername(username)
    
            if (_user) {
                res.send(FL.CreateResponseToClient(false, "That user already exists."))
            }
    
            const hashedPassword = await FL.hashPassword(password)
            const user = new UserModel({
                username: username,
                password: hashedPassword
            })
    
            await user.save();
            res.send(FL.CreateResponseToClient(true, "Welcome to Gwent " + username))
        } catch (err) {
            console.error(err)
            res.send(FL.CreateResponseToClient(false, err))
        }
    },
    saveDecks: async (req, res) =>{
        const username: string = req.body.username
        const decks: IDeck[] = req.body.decks
        
        if(!decks || decks && decks.length == 0){
            res.send(FL.CreateResponseToClient(false, "You are trying to save no decks."))
        }
    
        try{
            const _user: IUser = await UserModel.findOne({ username: username }).populate('myDecks')
    
            if(!_user) res.send(FL.CreateResponseToClient(false, "User: " + username + " not found."))
    
            let savedDeck;
    
            if(_user.myDecks instanceof SavedDeckModel){
                savedDeck = _user.myDecks;
                savedDeck.decks = decks;
                await savedDeck.save();
            }
            else{
                const newSave = {
                    user: _user._id,
                    decks: decks,
                }
                savedDeck = await SavedDeckModel.create(newSave)
                if(!(savedDeck instanceof SavedDeckModel)){
                    res.send(FL.CreateResponseToClient(false, "Failed to save decks. Try again later."))
                }
    
                _user.myDecks = savedDeck._id
                await _user.save()
            }
    
            res.send(FL.CreateResponseToClient(true, "Decks saved!"))
    
        } catch (err){
            console.error(err)
            res.send(FL.CreateResponseToClient(false, err))
        }
        
    }
}

export { controls }