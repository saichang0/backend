import { User } from "../user.entity";
import { IOneResponse } from "../../../types/base";
import { AppDataSource } from "../../../database/dbConnecte";
import { handleErrorOneRespones, handleSuccesOneRespones } from "../../../utils";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

export class MutationService {
    static UserRepository = AppDataSource.getRepository(User)
    //create
    static async CreateUser(data: any): Promise<IOneResponse> {
        try {
            if (!data.fullname || !data.email) {
                return handleErrorOneRespones({
                    code: "Data_Required",
                    message: "fullname or email must required",
                    error: {},
                    status: 401
                })
            }
            if (!data.password) {
                return handleErrorOneRespones({
                    code: "Data_Required",
                    message: "Password must required",
                    error: {},
                    status: 401
                })
            }

            // hash password 
            const hash = bcrypt.hashSync(data.password, 10);
            data.password = hash;

            const existEmail = await this.UserRepository.findOne({ where: { email: data.email } })
            if (existEmail) {
                return handleErrorOneRespones({
                    code: "EMAIL AREADY EXIST",
                    message: "THIS EMAIL HAS ALREDY",
                    error: {},
                    status: 401
                })
            }
            // insert user data to database
            else {
                const createuser = await this.UserRepository.create(data);
                await this.UserRepository.save(createuser);
                return handleSuccesOneRespones({
                    code: "SUCCES",
                    message: "CREATE USER SUCCES",
                    data: { ...createuser, password: null },
                    status: 200
                });
            }
        } catch (error) {
            return handleErrorOneRespones({
                code: "Faild",
                message: "Internal Server Error",
                error: {},
                status: 401
            })
        }
    }

    //delete
    static async DeleteUser(userId: number): Promise<IOneResponse> {
        try {
            const user = await this.UserRepository.findOneBy({ id: userId }) as User
            if (!user) {
                handleErrorOneRespones({
                    code: "Data_Required",
                    message: "User not found",
                    error: {},
                    status: 401
                })
            }
            await this.UserRepository.remove(user);
            return (handleSuccesOneRespones({
                code: "Deleted",
                message: "Delete user succes",
                data: {},
                status: 200
            }));
        } catch (err) {
            return handleErrorOneRespones({
                code: "Faild",
                message: "Internal Server Error",
                error: {},
                status: 401
            })
        }
    }

    //updata user
    static async UpdateUser(Id: number, userData: User): Promise<IOneResponse> {
        try {
            if (!Id) {
                return handleErrorOneRespones({
                    code: "Faild",
                    message: "can not find this id",
                    error: {},
                    status: 401
                })
            }

            const user = await this.UserRepository.findOneBy({ id: Id });

            if (!user) {
                return handleErrorOneRespones({
                    code: "FAILD",
                    message: "User not found",
                    error: {},
                    status: 400
                })
            }
            if (userData.email){
                const emailExisting = await this.UserRepository.findOneBy({email:userData.email,})
                if(emailExisting && emailExisting.id !== Id){
                    return handleErrorOneRespones({
                        code: "EMAIL ALREADE EXIST",
                        message: "this email has alreade in system",
                        error: {},
                        status:401
                    })
                }
            }
            //  Hash the new password only if it's being updated
            if (userData.password) {
                const hash = bcrypt.hashSync(String(userData.password), 10);
                userData.password = hash;
            }

            //  Merge and save
            this.UserRepository.merge(user, userData);
            const updatedUser = await this.UserRepository.save(user);

            // const updatedUser = await UserRepository.update(userId,userData)
            return handleSuccesOneRespones({
                code: "SUCCESS",
                message: "User updated successfully",
                data: { ...updatedUser, password: null },
                status: 200
            })
        } catch (error) {
            console.error("Update error:", error);
            return handleErrorOneRespones({
                code: "UPDATE_FAILED",
                message: "An error occurred while updating the user 1",
                error: {},
                status: 401
            })
        }
    }

    // login
    static async UserLogin(email: string, password: string): Promise<IOneResponse> {
        try {
            // 1 check email and password
            if (!email || !password) {
                return handleErrorOneRespones({
                    code: "BAD REQEST",
                    message: "Email OR Password must requied",
                    error: {},
                    status: 401
                })
            }
            // 2 check email
            const existEmail = await this.UserRepository.findOneBy({ email })
            if (!existEmail) {
                return handleErrorOneRespones({
                    code: "BAD REQEST",
                    message: "Email OR Password are incorrect",
                    error: {},
                    status: 401
                })
            }
            // 3 compare password
            const comparePassword = await bcrypt.compare(password, existEmail.password)
            if (!comparePassword) {
                return handleErrorOneRespones({
                    code: "BAD REQEST",
                    message: "Password or Email are incorrect",
                    error: {},
                    status: 401
                })
            }
            // 4 make token
            const payload = {
                id: existEmail.id,
                fullname: existEmail.fullname,
            }
            const token = jwt.sign(payload, "abc", { expiresIn: "1h" })

            // 5 return data to client
            return handleSuccesOneRespones({
                code: "SUCCESS",
                message: "login successfully",
                data: { user: { ...existEmail, password: null }, token },
                status: 200
            })

        } catch (error: any) {
            return handleErrorOneRespones({
                code: "Faild",
                message: "not found userone",
                error: {error},
                status: 401
            })
        }
    }

    // register
    static async Register(data: any): Promise<IOneResponse> {
        try {
            if (!data.fullname || !data.username || !data.email || !data.password) {
                return handleErrorOneRespones({
                    code: "data is requied",
                    message: "missing data is requied",
                    error: {},
                    status: 401
                })
            }

            const hash = await bcrypt.hash(data.password, 10)
            data.password = hash

            const existEmail = await this.UserRepository.findOne({ where: { email: data.email } })
            if (existEmail) {
                return handleErrorOneRespones({
                    code: "EMAIL AREADY EXIST",
                    message: "THIS EMAIL HAS ALREDY",
                    error: {},
                    status: 401
                })
            }
            else{
                const createuser = await this.UserRepository.create(data)
                await this.UserRepository.save(createuser)
                return handleSuccesOneRespones({
                    code: "SUCCES",
                    message: "CREATE USER SUCCES",
                    data: { ...createuser, password: null },
                    status: 200
                });
            }
        } catch (error) {
            return handleErrorOneRespones({
                code: "Faild",
                message: "Internal Server Error",
                error: {},
                status: 401
            })
        }
    }
}