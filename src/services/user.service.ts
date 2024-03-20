import { User } from "../models/user.model"
import { IUser } from "../models/interfaces.models"
import mongoose from "mongoose"

interface CreateUserSchema {
    email: string,
    publicAddress: string
}

class UserService {
    // function already defined in code used for authentication
    addUser = async (createUserSchema: CreateUserSchema) =>
        await User.create({
            _id: createUserSchema.email,
            walletAddress: createUserSchema.publicAddress
       });
    
    // function to add full profile of user
    addMainUser = async (userData: IUser): Promise<void> =>
       {
        const _id = new  mongoose.Types.ObjectId(); 
        const { walletAddress, name, bio,profileImg, professionalTitle, socialMediaURLs, works } = userData;
        await User.create({
            _id: _id,
            walletAddress: walletAddress,
            name : name,
            bio : bio,
            profileImg : profileImg,
            professionalTitle : professionalTitle,
            socialMediaURLs : socialMediaURLs,
            works: works
        });
    }

    getUserByEmail = async (email: string) =>
        await User.findById(email);
    
    getUser = async () =>
        await User.find({});

    getUserByWalletAddress = async (walletAddress: string) =>
        await User.findOne({walletAddress});
    
}

export default new UserService();