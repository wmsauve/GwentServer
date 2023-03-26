import mongoose, {Schema, Document} from 'mongoose'

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
})

interface User extends Document {
    username: string,
    password: string
}

const UserModel = mongoose.model<User>('User', userSchema, 'users');

export { UserModel };