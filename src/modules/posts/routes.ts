import express, { Request, Response } from 'express';
import { handleErrorOneRespones } from '../../utils';
import { accessAuthenticate } from '../../middlewares';
import { Post } from './posts.entity';
import { PostMutationService } from './services/mutation.services';
import { PostQueryService } from './services/query.services';
const postRoute = express();

postRoute.post("/create", accessAuthenticate, async (req: Request, res: Response) => {
    try {
        const data = req.body as Post
        const postData = {
            title: data?.title,
            details: data?.details,
            url: data?.url,
            userId: Number(data?.userId)
        } as Post;
        const result = await PostMutationService.create(postData);
        res.status(200).json(result)
    } catch (err) {
        handleErrorOneRespones({
            code: "Data_Required",
            message: "fullname or email must required",
            error: {},
            status: 400
        })
    }
})

postRoute.get("/get-one", async (req: Request, res: Response) => {
    try {
        const { id } = req.query
        const result = await PostQueryService.get_one(String(id));
        res.status(200).json(result)

    } catch (error) {
        handleErrorOneRespones({
            code: "Data_Required",
            message: "fullname or email must required",
            error: {},
            status: 400
        })
    }
})

postRoute.get("/get-many", async (req: Request, res: Response) => {
    try {

        // const { id, title, detail } = req.query
        // const results = await PostQueryService.get_many({
        //     id: id ? String(id) : undefined,
        //     title: title ? String(title) : undefined,
        //     detail: detail ? String(detail) : undefined
        // });

        const keyword = String(req.query.q);
        console.log("Keyword for search:", keyword);
        const page = Number(req.query.page  || "1");
        const limit = Number(req.query.limit || "20");
        const results = await PostQueryService.get_many(keyword,page, limit);
        res.status(200).json(results)

    } catch (error) {
        handleErrorOneRespones({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
            error: {},
            status: 500
        })
    }
})

postRoute.delete("/delete/:id",accessAuthenticate, async (req: Request, res: Response) => {
    try {
        const userId = req.body.userId;
        const postId = Number(req.params.id)
        const result = await PostMutationService.deletepost(postId,userId)
        res.status(201).json(result)
    } catch (err) {
        handleErrorOneRespones({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
            error: {},
            status: 500
        })
    }
})

postRoute.put("/update/:id", accessAuthenticate, async (req: Request, res: Response) => {
    try {
        const postId = parseInt(req.params.id)
        const data = req.body as Post
        const userId = req.body.userId;
        const result = await PostMutationService.updatePost(postId, data, userId);
        res.status(200).json(result)
    } catch (error) {
        handleErrorOneRespones({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
            error: {},
            status: 500
        })
    }
})

export default postRoute;
