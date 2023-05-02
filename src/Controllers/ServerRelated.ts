import { FL } from '../Utility/FunctionLibrary';
import { UserModel, IDeck, IUser, SavedDeckModel } from '../DB/schema';

interface ServerController {
    fetchDeckByUser: (req: any, res: any) => Promise<void>,
};

let serverCtrl: ServerController = {
    fetchDeckByUser: async (req, res) =>{
        const { username } = req.body;
            
        try {
            const _user = await UserModel.findOne({ username: username }).populate('myDecks');
            if (_user) {
                let _decks: IDeck[];
                if(_user.myDecks instanceof SavedDeckModel){
                    _decks = _user.myDecks.decks;
                }
                
                if(_decks.length == 0){
                    res.send(FL.CreateResponseToClient(false, "Somehow you have no decks saved"));
                }

                _decks.forEach(element => {
                    if(element.isCurrent){
                        const _info = {};
        
                        _info["currentDeck"] = element;
    
                        console.log(_info);
                        
                        res.send(FL.CreateResponseToClient(true, "Find current deck successful.", JSON.stringify(_info)));
                    }
                });
            } else {
                res.send(FL.CreateResponseToClient(false, "User: " + username + " not found."));
            }
        } catch (err) {
            console.log(err);
            res.send(FL.CreateResponseToClient(false, "Deck not retreived for game."));
        }
    }
};

export { serverCtrl };