import { Router, Request, Response } from "express";
import { getRepository } from "../respositories/link_repository";
import { Repository } from "typeorm";
import { Link } from "../entities/link";
import { authMiddleware } from "../middleware/auth_middleware";

export function getHandlers(_linkRepository: Repository<Link>) {
    
    const getAllLinksHandler = (req: Request, res: Response) => {
        (async () => {
            const links = await _linkRepository.find();
            res.json(links).send();
        })();
    };
    
    const getLinkByIdHandler = (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const link = _linkRepository.findOne({
            where: {
                id: id
            }
        });
        if (link === undefined) {
            res.status(404).send();
        }
        res.json(link).send();
    };

    const createLink = (req: Request, res: Response) => {
        (async () => {
             console.log("create link");
            console.log("req.body.userId");
            console.log(req.body.userId);
            const title = req.body.title;
            const user = req.body.userId;
            const url = req.body.url;
            if (!title || !url) {
                 console.log(" no title not url");
                 console.log(" 400");
                res.status(400).send();
            } else {
                 console.log(" trying to save");

                const newLink = await _linkRepository.save({ user: user, title: title, url: url });
                return res.json(newLink);
            }            
        })();


    };
const deleteMovie =  (req: Request, res: Response) => {

            (async () => {

               console.log("delete link");
            //console.log("req.body.userId");
            const userId = req.body.userId;
            const linkId = parseInt(req.params.id);
            console.log("userId");
            console.log(userId);
            console.log("linkId");
            console.log(linkId);
        const userOwner = await _linkRepository
            .createQueryBuilder("link")
            .innerJoinAndSelect("link.user", "users.user.id")
            .where("link.id = :id ", { id: linkId })
            .getOne();
            //.getMany();
            // const linkFound = await _linkRepository.findOne({
            // where: {
            //     id: linkId
            // }
            // });
             
            
            console.log("userOwner.user.id");
            console.log(userOwner.user.id);
            console.log("userId");
            console.log(userId);
            if(userOwner.user.id==userId){
                const linkFound = await _linkRepository.findOne({ where: { id: linkId }});
                const linkDelete = await _linkRepository.remove(linkFound);
                res.send("Link Deleted succesfully!");
            }else{
                
                res.status(400).send("You are not the owner of the link!");

            }


        })();
};


    return {
        getAllLinksHandler,
        getLinkByIdHandler,
        createLink,
        deleteMovie,

    };

}

export function getLinksRouter() {
    const handlers = getHandlers(getRepository());
    const linkRouter = Router();
    linkRouter.get("/", handlers.getAllLinksHandler); // public
    linkRouter.get("/:id", handlers.getLinkByIdHandler); // public
    linkRouter.post("/", authMiddleware, handlers.createLink); // private
    linkRouter.delete("/:id", authMiddleware, handlers.deleteMovie); // private
//    linkRouter.delete("/:id", handlers.deleteMovie); // private

    return linkRouter;
}
