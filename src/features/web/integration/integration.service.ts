import { UserModel } from "../../../data/repository/database/models/user";
import IError from "../../../data/types/error/error";

const ERROR_UNABLE_TO_GET_ALL_USERS: IError = {
  field: 'emailAddress',
  message: 'Unable to fetch all users',
};
const ERROR_USER_NOT_FOUND: IError = {
  field: 'password',
  message: 'User with this email/password combination does not exist.',
};

class IntegrationService {
  private _userModel: typeof UserModel;

  constructor ({ userModel} : { userModel: typeof UserModel; }){
    this._userModel = userModel;
  }

//   public getAllCoin = async ( options: { limit: number; page: number }): Promise<{ coins: any[] }> => {
//     const usersResponse = await this._userModel.getUsers([{}], options);
//     if ( !usersResponse.status ) {
//       return { errors: [ERROR_UNABLE_TO_GET_ALL_USERS] };
//     } 
//     return { users: usersResponse.data };
//   };

//   public buyCoin = async (userId: string): Promise<{ errors?: IError[]; user?: UserDto; }> => {
      
//     const user = await this._userModel.getUser({ _id: userId });
//     if (!user.status) return { errors: [ERROR_USER_NOT_FOUND] };

//     const updateUser = await this._userModel.updateUser( { _id: user.data.id }, { is_banned: true });
//     if (!updateUser.status) return { errors: [ERROR_USER_NOT_FOUND] };

//     return { user:  updateUser.data};
//   };

//   public unbanUser = async (userId: string): Promise<{ errors?: IError[]; user?: UserDto; }> => {
//     const user = await this._userModel.getUser({ _id: userId });
//     if (!user.status) return { errors: [ERROR_USER_NOT_FOUND] };

//     const updateUser = await this._userModel.updateUser( { _id: user.data.id }, { is_banned: false });
//     if (!updateUser.status) return { errors: [ERROR_USER_NOT_FOUND] };

//     return { user:  updateUser.data};
//   };

}

export default IntegrationService;
