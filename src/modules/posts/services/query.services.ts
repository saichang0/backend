import { Like } from "typeorm";
import { AppDataSource } from "../../../database/dbConnecte";
import { IOneResponse } from "../../../types/base";
import { handleErrorOneRespones, handleSuccesOneRespones } from "../../../utils";
import { PostFilter } from "../interface/post.interface";
import { Post } from "../posts.entity";

export class PostQueryService {
    static postrepository = AppDataSource.getRepository(Post)

    static async get_one(id: string): Promise<IOneResponse> {
        try {
            console.log("📥 Getting post by ID:", id);
            if (!id) {
                return handleErrorOneRespones({
                    code: "BAD_REQUEST",
                    message: "USER ID IS REQUIRED",
                    error: {},
                    status: 401
                })
            }
            const post = await this.postrepository.findOneBy({ id: Number(id) });
            if (!post) {
                return handleErrorOneRespones({
                    code: "NOT_FOUND",
                    message: "POST NOT FOUND",
                    error: {},
                    status: 401
                })
            }
            else {
                return handleSuccesOneRespones({
                    code: "SUCCESS",
                    message: "Post fetched successfully",
                    data: post,
                    status: 200
                })
            }
        } catch (error) {
            return handleErrorOneRespones({
                code: "INTERNAL_SERVER_ERROR",
                message: "Something went wrong",
                error: {},
                status: 500
            })
        }
    }

    static async get_many(keyword: string | undefined, page: number, limit: number): Promise<IOneResponse> {
        try {
            // const where: any = {};

            // if (filter.id) where.id = Number(filter.id);
            // if (filter.title) where.title = Like(`%${filter.title}%`);
            // if (filter.detail) where.details = Like(`%${filter.detail}%`);
            // console.log({where})

            // const posts = await this.postrepository.find({ where });

            // if (!posts || posts.length === 0) {
            //     return handleErrorOneRespones({
            //         code: "NOT_FOUND",
            //         message: "No posts found",
            //         error: {},
            //         status: 404,
            //     });
            // }

            const skip = (page - 1) * limit;

            const querBuilder = this.postrepository.createQueryBuilder("post");

            if (keyword) {
                querBuilder
                    .where("post.title LIKE :keyword", { keyword: `%${keyword}%` })
                    .orWhere("post.details LIKE :keyword", { keyword: `%${keyword}%` });
            }


            const totalPosts = await querBuilder.getCount();
            const posts = await querBuilder.offset(skip).limit(limit).orderBy("post.created_at", "DESC").getMany();

            return handleSuccesOneRespones({
                code: "SUCCESS",
                message: "Posts fetched successfully",
                data: {
                    posts,
                    total: totalPosts,
                    page,
                    limit,
                },
                status: 200,
            });

        } catch (error) {
            console.error("❌ Error in get_many:", error);
            return handleErrorOneRespones({
                code: "INTERNAL_SERVER_ERROR",
                message: "Something went wrong 1",
                error: {},
                status: 500,
            });
        }
    }
} 