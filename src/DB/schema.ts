import mongoose, {Schema, Document} from 'mongoose'

interface ICard {
    name: string;
}
  
interface IDeck {
    name: string;
    cards: ICard[];
}

interface IDeckSave extends Document{
    user: Schema.Types.ObjectId;
    decks: IDeck[];
}

interface IUser extends Document {
    username: string,
    password: string,
    myDecks: Schema.Types.ObjectId | IDeckSave
}


const cardSchema = new Schema({
    name: {
        type: String,
        required: true,
    }
})

const deckSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    cards: {
        type: [cardSchema],
        default: []
    }
})

const savedDecksSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    decks: {
        type: [deckSchema],
        default: []
    }

})

const userSchema = new Schema({
    username: { 
        type: String, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    myDecks: {
        type: Schema.Types.ObjectId,
        ref: "SavedDeckModel"
    },
})

const UserModel = mongoose.model<IUser>('User', userSchema, 'users');
const SavedDeckModel = mongoose.model<IDeckSave>('DeckSave', savedDecksSchema, 'savedDecks')

export { UserModel, SavedDeckModel, IDeck, IDeckSave, IUser };