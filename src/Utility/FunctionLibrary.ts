import bcrypt from 'bcrypt'
import { UserModel, SavedDeckModel } from '../DB/schema'
import { IResponseToClient } from '../Utility/structures'

const saltRounds = 10;

let FL: any = {}

FL.hashPassword = async function(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(password, salt)
    return hash
}

FL.comparePasswords = async function(password: string, hash: string): Promise<boolean> {
    const match = await bcrypt.compare(password, hash);
    return match;
}

FL.CheckForValidUsername = async function(username: string){
    try{
        const _user = await UserModel.findOne({username: username})
        return _user
    }
    catch(err){
        console.error(err)
        throw err
    }
}

FL.CreateResponseToClient = function(success: boolean, message: string): string {
    let toClient: IResponseToClient = {
        isSuccess: success,
        message: message,
    };
    console.log(message)
    return JSON.stringify(toClient);
}

export { FL }