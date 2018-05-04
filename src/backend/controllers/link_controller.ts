import { Router, Request, Response } from "express";
import { getRepository } from "../respositories/link_repository";
import { Repository } from "typeorm";
import { Link } from "../entities/link";
import { authMiddleware } from "../middleware/auth_middleware";

export function getHandlers(_linkRepository: Repository<Link>) {
    
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

        // (async () => {
        //     const links = await _linkRepository.find();

        //     res.json(links).send();

        // })();
    };
    
    // const getLinkByIdHandler = (req: Request, res: Response) => {
    //     const id = parseInt(req.params.id);
    //     const link = _linkRepository.findOne({
    //         where: {
    //             id: id
    //         }
    //     });
    //     if (link === undefined) {
    //         res.status(404).send();
    //     }
    //     res.json(link).send();
    // };

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

                // const newLink = await _linkRepository.save({ user: user, title: title, url: url });
                // return res.json(newLink);
            }            
        })();


    };
const deleteMovie =  (req: Request, res: Response) => {

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
//                const linkFound = await _linkRepository.findOne({ where: { id: linkId }})

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


    return {
        getAllLinksHandler,
//        getLinkByIdHandler,
        createLink,
        deleteMovie,

    };

}

export function getLinksRouter() {
    const handlers = getHandlers(getRepository());
    const linkRouter = Router();
    linkRouter.get("/", handlers.getAllLinksHandler); // public
 //   linkRouter.get("/:id", handlers.getLinkByIdHandler); // public
    linkRouter.post("/", authMiddleware, handlers.createLink); // private
    linkRouter.delete("/:id", authMiddleware, handlers.deleteMovie); // private
//    linkRouter.delete("/:id", handlers.deleteMovie); // private

    return linkRouter;
}
