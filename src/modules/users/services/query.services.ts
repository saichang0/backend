import { AppDataSource } from "../../../database/dbConnecte";
import { IManyResponse, IOneResponse } from "../../../types/base";
import { handleErrorManyRespones, handleErrorOneRespones, handleSuccesManyRespones, handleSuccesOneRespones } from "../../../utils";
import { User } from "../user.entity";

export class QueryService {
  static userRepository = AppDataSource.getRepository(User)
  // findMany
  static async findManyUsers(): Promise<IManyResponse> {
    try {
      // count total data
      const UserTotal = await this.userRepository.count({})
      // Get user data
      const Users = await this.userRepository.find({})
      // response to client
      return handleSuccesManyRespones({
        code: "Succes",
        message: "Succes fetch data",
        total: UserTotal,
        data: Users.map((Users) => {
          return{...Users, password:null}
        }),
        status:200
      })
    } catch (error: any) {
      return (handleErrorManyRespones({
        code: "INTERNAL-SERVER.ERROR",
        error: error,
        message: error.message,
        status:401
      }))
    }
  }

  // find one
  static async findOneUser(userId: number): Promise<IOneResponse> {
    try {
      if (!userId) {
        return handleErrorOneRespones({
          code: "BAD_REQUEST",
          message: "USER ID IS REQUIRED",
          error: {},
          status:401
        });
      }
 
      const user = await this.userRepository.findOneBy({ id: userId });

      if (!user) {
        return handleErrorOneRespones({
          code: "NOT_FOUND",
          message: "USER NOT FOUND",
          error: {},
          status:401
        });
      }

      return handleSuccesOneRespones({
        code: "SUCCESS",
        message: "Fetch user data successful",
        data: {...user,password:null},
        status:200
      });
    } catch (error) {
      return handleErrorOneRespones({
        code: "NOT_FOUND",
        message: "USER NOT FOUND",
        error: {},
        status:401
      });
    }
  }
} 
