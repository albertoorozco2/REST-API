import { Router, Request, Response } from "express";
import { getRepository } from "../respositories/link_repository";
import { getRepositoryVote } from "../respositories/vote_repository";
import { Repository } from "typeorm";
import { Link } from "../entities/link";
import { Vote } from "../entities/vote";
import { authMiddleware } from "../middleware/auth_middleware";

export function getHandlers(_linkRepository: Repository<Link>, _voteRepository: Repository<Vote>) {
    
    const getAllLinksHandler = (req: Request, res: Response) => {
        console.log("api/v1/links GET returns all links");
        const linkRepository = getRepository(); 
        (async () => {
            const links = await _linkRepository.find()
            .then((links) => {
                console.log(" links sent succesfully.");
                res.json(links); 
            }).catch((e: Error) => {
                console.log(" 500 Internal Server Error.");
                res.status(500).send(e.message); 
            });
            
    })();

    };
    
    const createLink = (req: Request, res: Response) => {
        (async () => {
            console.log("/api/v1/links POST creates a new link");
            const title = req.body.title;
            const user = req.body.userId;
            const url = req.body.url;
            if (!title || !url) {
                 console.log(" 400 Bad request!");
                res.status(400).send("Bad request!");
            } else if (!user) {
                 console.log(" 401 Unauthorized!");
                res.status(401).send("Unauthorized!");
            } else {

                const newLink = await _linkRepository.save({ user: user, title: title, url: url }).then((results) => {
                    console.log(" links saved successfully.");
                    return res.json(results);
                }).catch((e: Error) => {
                    console.log(" 500 Internal Server Error.");
                    res.status(500).send(e.message); 
                })


            }            
        })();


    };


    const deleteLink =  (req: Request, res: Response) => {

            (async () => {

            console.log("/api/v1/links/:id DELETE deletes a link");
            const userId = req.body.userId;
            const linkId = parseInt(req.params.id);
            const userOwner = await _linkRepository
            .createQueryBuilder("link")
            .innerJoinAndSelect("link.user", "users.user.id")
            .where("link.id = :id ", { id: linkId })
            .getOne();
             
            

            if(userOwner==undefined){
                console.log(" 400 Bad request!");
                res.status(400).send("Bad Request!");

            }else if(userOwner.user.id==userId){

                const linkDelete = await _linkRepository.remove(await _linkRepository.findOne({ where: { id: linkId }})).catch((e: Error) => {
                console.log(" 500 Internal Server Error.");
                res.status(500).send(e.message); 
                });
                console.log(" Link Deleted succesfully!");
                res.send("Link Deleted succesfully!");
            }else{
                console.log(" 403 Forbidden!");
                res.status(403).send("Forbidden!");

            }


        })();
    };


    const upVoteLink = (req: Request, res: Response) => {
        (async () => {
            console.log("/api/v1/links/:id/upvote POST upvote link");
            const link = req.params.id;
            const user = req.body.userId;
            if (!link) {
                 console.log(" 400 Bad request!");
                res.status(400).send("Bad request!");
            } else if (!user) {
                 console.log(" 401 Unauthorized!");
                res.status(401).send("Unauthorized!");
            } else {
                const upVoteLink = await _linkRepository.findOne({id: link }).catch((e: Error) => {
                     console.log(" 500 Internal Server Error.");
                     res.status(500).send(e.message); 
                 });
                const upVote = await _voteRepository.find({ link: link, user: user, isUpvote: true }).catch((e: Error) => {
                     console.log(" 500 Internal Server Error.");
                     res.status(500).send(e.message); 
                 });
                if(!upVoteLink)
                {
                    console.log(" 400 Bad Request! link does not exist");
                    res.status(400).send("Bad Request! link does not exist");
                } 
                else if(String(upVote)==="")
                {
                    const upVote = await _voteRepository.save({ link: link, user: user, isUpvote: true }).catch((e: Error) => {
                     console.log(" 500 Internal Server Error.");
                     res.status(500).send(e.message); 
                     });
                    console.log(" upvoted saved sucessfully!");
                    res.send("upvoted saved sucessfully!");
                }else{
                    console.log(" 400 Bad Request! upvote already registered");
                    res.status(400).send("Bad Request! upvote already registered");
                }

            }            
        })();
    };

    const downVoteLink = (req: Request, res: Response) => {
        (async () => {
            console.log("/api/v1/links/:id/downvote POST downvote link");
            const link = req.params.id;
            const user = req.body.userId;
            if (!link) {
                 console.log(" 400 Bad request!");
                res.status(400).send("Bad request!");
            } else if (!user) {
                 console.log(" 401 Unauthorized!");
                res.status(401).send("Unauthorized!");
            } else {
                const downVoteLink = await _linkRepository.findOne({id: link }).catch((e: Error) => {
                     console.log(" 500 Internal Server Error.");
                     res.status(500).send(e.message); 
                 });
                const downVote = await _voteRepository.find({ link: link, user: user, isUpvote: false }).catch((e: Error) => {
                     console.log(" 500 Internal Server Error.");
                     res.status(500).send(e.message); 
                 });
                if(!downVoteLink)
                {
                    console.log(" 400 Bad Request! link does not exist");
                    res.status(400).send("Bad Request! link does not exist");
                } 
                else if(String(downVote)==="")
                {
                    const downVote = await _voteRepository.save({ link: link, user: user, isUpvote: false }).catch((e: Error) => {
                     console.log(" 500 Internal Server Error.");
                     res.status(500).send(e.message); 
                     });
                    console.log(" downvoted saved sucessfully!");
                    res.send("downvoted saved sucessfully!");
                }else{
                    console.log(" 400 Bad Request! downvote already registered");
                    res.status(400).send("Bad Request! downvote already registered");
                }

            }            
        })();
    };



    return {
        getAllLinksHandler,
        createLink,
        upVoteLink,
        downVoteLink,
        deleteLink,
    };

}

export function getLinksRouter() {
    const handlers = getHandlers(getRepository(),getRepositoryVote());
    const linkRouter = Router();
    linkRouter.get("/", handlers.getAllLinksHandler); // public
    linkRouter.post("/", authMiddleware, handlers.createLink); // private
    linkRouter.delete("/:id", authMiddleware, handlers.deleteLink); // private
    linkRouter.post("/:id/upvote", authMiddleware, handlers.upVoteLink); // private
    linkRouter.post("/:id/downvote", authMiddleware, handlers.downVoteLink); // private

    return linkRouter;
}
