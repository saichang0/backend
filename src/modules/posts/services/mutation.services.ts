import { AppDataSource } from "../../../database/dbConnecte";
import { IOneResponse } from "../../../types/base";
import { handleErrorOneRespones, handleSuccesOneRespones } from "../../../utils";
import { Post } from "../posts.entity";

export class PostMutationService {
    static postRepository = AppDataSource.getRepository(Post);

    static async create(data: any): Promise<IOneResponse> {
        try {
            if (!data.title) {
                return handleErrorOneRespones({
                    code: "bad request",
                    message: "Internal data",
                    error: {},
                    status: 401
                })
            }
            //save post 
            const createpost = await this.postRepository.save(data);
            return handleSuccesOneRespones({
                code: "SUCCESS",
                message: "Create post success",
                data: createpost,
                status: 200
            })
        } catch (error) {
            return handleErrorOneRespones({
                code: "Faild",
                message: "Internal Server Error",
                error: {},
                status: 500
            })
        }
    }

    static async deletepost(postId: number,userId:number): Promise<IOneResponse> {
        try {
            if (!postId || typeof postId !== 'number') {
                return handleErrorOneRespones({
                    code: "BAD_REQUEST",
                    message: "Post ID is required and must be a number",
                    error: {},
                    status: 400
                });
            }
            if (!postId) {
                return handleErrorOneRespones({
                    code: "BAD_REQUEST",
                    message: "Post ID is required",
                    error: {},
                    status: 400
                });
            }
            const post = await this.postRepository.findOneBy({ id: postId,userId: userId });
            if (!post) {
                return handleErrorOneRespones({
                    code: "NOT_FOUND",
                    message: "Post not found",
                    error: {},
                    status: 404
                });
            }
            await this.postRepository.delete(postId);
            return handleSuccesOneRespones({
                code: "SUCCESS",
                message: "Post deleted successfully",
                data: post,
                status: 200
            });
        } catch (error) {
            return handleErrorOneRespones({
                code: "INTERNAL_SERVER_ERROR",
                message: "Something went wrong",
                error: {},
                status: 500
            });
        }
    }

    static async updatePost(postId: number, data: any, userId: number): Promise<IOneResponse> {
        try {
            if (!postId || !data) {
                return handleErrorOneRespones({
                    code: "BAD_REQUEST",
                    message: "Post ID and data are required",
                    error: {}, 
                    status: 400
                });
            }
            const post = await this.postRepository.findOneBy({ id: postId , userId: userId });
            if (!post) {
                return handleErrorOneRespones({
                    code: "NOT_FOUND",
                    message: "Post not found",
                    error: {},
                    status: 404
                });
            }
            const updatedPost = await this.postRepository.save({ ...post, ...data });
            return handleSuccesOneRespones({
                code: "SUCCESS",
                message: "Post updated successfully",
                data: updatedPost,
                status: 200
            });
        } catch (error) {
            return handleErrorOneRespones({
                code: "INTERNAL_SERVER_ERROR",
                message: "Something went wrong",
                error: {},
                status: 500
            });
        }
    }
}
