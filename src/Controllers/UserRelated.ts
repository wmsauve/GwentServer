import { FL } from '../Utility/FunctionLibrary'
import { UserModel, IDeck, IUser, SavedDeckModel, IDeckSave } from '../DB/schema'

let controls: any = {}

controls.loginUser = async (req, res) =>{
    const { username, password } = req.body

    try {
        const user = await UserModel.findOne({ username: username })
        if (user) {
            const isMatch = await FL.comparePasswords(password, user.password)
            if (isMatch) {
                res.send(FL.CreateResponseToClient(true, "Login successful."))
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
}

controls.signUp = async (req, res) => {
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
}

controls.saveDecks = async (req, res) =>{
    const username: string = req.body.username
    const decks: IDeck[] = req.body.decks
    
    if(!decks || decks && decks.length == 0){
        res.send(FL.CreateResponseToClient(false, "You are trying to save no decks."))
    }

    console.log("We getting here at least?")
    try{
        const _user: IUser = await UserModel.findOne({ username: username }).populate('myDecks')

        console.log(_user)

        if(!_user) res.send(FL.CreateResponseToClient(false, "User: " + username + " not found."))


        console.log("We have a user.")
        if(_user.myDecks instanceof SavedDeckModel){

            const currentDecks = _user.myDecks.decks
            if(!currentDecks || currentDecks && currentDecks.length == 0){
                const savedDeck = await SavedDeckModel.create(decks)
                if(savedDeck instanceof SavedDeckModel){
                    _user.myDecks = savedDeck._id
                    await _user.save()
                    res.send(FL.CreateResponseToClient(true, "Decks saved!"))
                }
            }
        }
        else{
            console.log("Gotta create a deck yo.")
            const newSave = {
                user: _user._id,
                decks: decks,
            }
            const savedDeck = await SavedDeckModel.create(newSave)
            if(savedDeck instanceof SavedDeckModel){
                _user.myDecks = savedDeck._id
                await _user.save()
                res.send(FL.CreateResponseToClient(true, "Decks saved!"))
            }
        }

    } catch (err){
        console.error(err)
        res.send(FL.CreateResponseToClient(false, err))
    }
    
}

export { controls }