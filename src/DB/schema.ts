import mongoose, {Schema, Document} from 'mongoose'

interface ICard {
    name: string;
}
  
interface IDeck {
    name: string;
    isCurrent: boolean;
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
    isCurrent: {
        type: Boolean,
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

const UserModel = mongoose.model<IUser>('UserModel', userSchema, 'users');
const SavedDeckModel = mongoose.model<IDeckSave>('SavedDeckModel', savedDecksSchema, 'savedDecks')

export { UserModel, SavedDeckModel, IDeck, IDeckSave, IUser };