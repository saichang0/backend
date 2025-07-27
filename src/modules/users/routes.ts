import express, { Request, Response } from 'express'
import { handleErrorManyRespones, handleErrorOneRespones, handleSuccesManyRespones, handleSuccesOneRespones } from '../../utils';
import { AppDataSource } from '../../database/dbConnecte';
import { User } from './user.entity';
import { QueryService } from './services/query.services';
import { MutationService } from './services/mutation.services';
import jwt from 'jsonwebtoken';
import { accessAuthenticate } from '../../middlewares';

const userRoute = express();

userRoute.get("/get-many", async (req: Request, res: Response) => {
    try {
        const results = await QueryService.findManyUsers();
        res.status(200).json(results)
    } catch (error: any) {
        res.status(500).json(handleErrorManyRespones({
            code: "INTERNAL-SERVER.ERROR",
            error: error,
            message: error.message,
            status: 200
        }))
    }
})

userRoute.get("/get/:userId", async (req: Request, res: Response) => {
    // userRoute.get("/get", async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId)
        const result = await QueryService.findOneUser(userId);
        res.status(200).json(result);

    } catch (error) {
        handleErrorOneRespones({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
            error: {},
            status: 500
        })
    }

})

userRoute.post("/create", async (req: Request, res: Response) => {
    try {
        const result = await MutationService.CreateUser(req.body);
        res.status(200).json(result);
    } catch (err) {
        handleErrorOneRespones({
            code: "Data_Required",
            message: "fullname or email must required",
            error: {},
            status: 400
        })
    }
});

userRoute.delete("/delete/:id", async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id)
        const result = await MutationService.DeleteUser(userId)
        res.status(201).json(result)
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

userRoute.put("/update/:id", async (req: Request, res: Response) => {
    try {
        const Id = parseInt(req.params.id);
        const data = req.body
        const result = await MutationService.UpdateUser(Id, data)
        res.status(200).json(result)
    } catch (error) {
        console.error("Update error:", error);
        handleErrorOneRespones({
            code: "UPDATE_FAILED",
            message: "An error occurred while updating the user",
            error: {},
            status: 500
        })
    }
});

userRoute.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        const result = await MutationService.UserLogin(email, password)
        res.status(200).json(result)
    } catch (error) {
        handleErrorOneRespones({
            code: "LOGIN_FAILED",
            message: "An error occurred while login the user",
            error: {},
            status: 500
        })
    }
})

// userRoute.post("/forgot", async (req: Request, res: Response) => {
//     try {
//         const { email } = req.body
//         const result = await MutationService.Forgot(email)
//         res.status(200).json(result)
//     } catch (error) {
//         handleErrorOneRespones({
//             code: "FORGOT_FAILED",
//             message: "An error occurred while forgot the user",
//             error: {},
//             status: 500
//         })
//     }
// })

userRoute.post("/register", async (req: Request, res: Response) => {
    try {
        const user = await MutationService.Register(req.body)
        res.status(200).json(user)
    } catch (error) {
        handleErrorOneRespones({
            code: "FAILED",
            message: "An error occurred while create the user",
            error: {},
            status: 500
        })
    };
})

userRoute.get("/upload", accessAuthenticate, async (req: Request, res: Response) => {
    try {
        const userId = req.body.userId
        const result = await QueryService.findOneUser(userId);

        return res.status(200).json(result);
    } catch (error) {
        return res.status(401).json(
            handleErrorOneRespones({
                code: "INVALID_TOKEN",
                message: "Invalid or expired token",
                error: {},
                status: 401,
            })
        );
    }
});

userRoute.put("/updateprofile", accessAuthenticate, async (req: Request, res: Response) => {
    try {
        const userId = req.body.userId
        const data = {} as User
        data.fullname = req.body.fullname;
        data.username = req.body.username;
        data.email = req.body.email;
        data.password = req.body.password;
        const result = await MutationService.UpdateUser(userId, data)
        res.status(200).json(result)
    } catch (error) {
        return res.status(401).json(
            handleErrorOneRespones({
                code: "INVALID_TOKEN",
                message: "Invalid or expired token",
                error: {},
                status: 401,
            })
        );
    }
});



export default userRoute
