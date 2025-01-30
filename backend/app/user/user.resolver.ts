import * as userService from './user.service';
import { createUserTokens } from '../common/services/passport-jwt.service';
import bcrypt from 'bcrypt';
import { type IUser } from "./user.dto";


interface Context {
  user: IUser | null;
}

export const userResolvers = {
  Query: {
    getAllUsers: async (_: unknown, __: unknown, { user }: Context): Promise<IUser[]> => {
        if (!user || user.role !== 'ADMIN') {
          throw new Error('Unauthorized');
        }
        return await userService.getAllUser();
      },
      getUserById: async (_:unknown, { id }: { id: string }, { user }: Context): Promise<IUser | null> => {
        if (!user) {
            throw new Error('Unauthorized');
          }
         return await userService.getUserById(id);     
      },
    me: async (_:unknown, __:unknown, { user }: Context): Promise<IUser | null> => {
      if (!user) return null; 
      return await userService.getUserById(user._id);
    },
  },
  
  Mutation: {
    createUser: async (
        _: any,
        { name, email, password, role = "USER" }: { name: string; email: string; password: string; role?: "USER" | "ADMIN" }
      ): Promise<IUser> => {
        return await userService.createUser({
          name,
          email,
          password,
          role, 
        });
      },
    login: async (
      _: any,
      { email, password }: { email: string, password: string }
    ): Promise<{ accessToken: string; refreshToken: string; user: IUser }> => {
      const user = await userService.getUserByEmail(email);
      if (!user) throw new Error('User not found');

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error('Invalid credentials');

      const { accessToken, refreshToken } = createUserTokens(user);
      await userService.editUser(user._id, { refToken: refreshToken });
      
      return {
        accessToken,
        refreshToken,
        user,
      };
    },
    updateUser: async (
      _: any,
      { id, name, email, role="USER", active }: { id: string, name: string, email: string, role?: "USER", active: boolean }
    ): Promise<IUser | null> => {
      const updatedUser = await userService.updateUser(id, { name, email, role, active });
      return updatedUser;
    },
    deleteUser: async (
      _: any,
      { id }: { id: string }
    ): Promise<boolean> => {
      const result =  await userService.deleteUser(id);
      return result.deletedCount > 0;
    },
    changePassword: async (
      _: any,
      { id, currentPassword, newPassword }: { id: string, currentPassword: string, newPassword: string }
    ): Promise<IUser> => {
      return await userService.changePassword(id, currentPassword, newPassword);
    },
    resetPassword: async (
      _: any,
      { id, password }: { id: string, password: string }
    ): Promise<IUser> => {
      return await userService.resetPassword(id, password);
    },
  },
};
