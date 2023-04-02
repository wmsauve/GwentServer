import bcrypt from 'bcrypt'
import { IUser, UserModel } from '../DB/schema'
import { IResponseToClient } from '../Utility/structures'

const saltRounds = 10;

interface FuncLibrary{
    hashPassword: (password: string) => Promise<string>;
    comparePasswords: (password: string, hash: string) => Promise<boolean>;
    CheckForValidUsername: (username: string) => Promise<IUser | null>;
    CreateResponseToClient: (success: boolean, message: string, info?: string) => string;
}

let FL: FuncLibrary = {
    hashPassword: async function(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(saltRounds)
        const hash = await bcrypt.hash(password, salt)
        return hash
    },
    comparePasswords: async function(password: string, hash: string): Promise<boolean> {
        const match = await bcrypt.compare(password, hash);
        return match;
    },
    CheckForValidUsername: async function(username: string){
        try{
            const _user = await UserModel.findOne({username: username})
            return _user
        }
        catch(err){
            console.error(err)
            throw err
        }
    },
    CreateResponseToClient: function(success: boolean, message: string, info: string = ""): string {
        let toClient: IResponseToClient = {
            isSuccess: success,
            information: info,
            message: message,
        };
        console.log(message)
        return JSON.stringify(toClient);
    }
}

export { FL }