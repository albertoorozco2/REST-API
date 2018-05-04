import { expect } from "chai";
import request from "supertest";
import { getApp } from "../../src/app";
import { getHandlers } from "../../src/controllers/movie_controller";

// test suite
describe("MovieController", () => {

    // test case 1: read all
    it("HTTP GET /", async () => {
        // THIS IS AN INTEGRATION TEST!
        const expected = [
            { id: 1, title: "Star Wars" },
            { id: 2, title: "Star Trek" }
        ];

        const app = await getApp();

        await request(app).get("/api/v1/movies/")
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).to.eqls(expected);
            });

    });

    it("movieRouter.get", () => {

        const expected = [
            { id: 1, title: "Star Wars" },
            { id: 2, title: "Star Trek" }
        ];
        const fakeReq: any = {};
        const fakeResponse: any = {
            json: (movies: any[]) => {
                expect(movies).eqls(expected);
                return {
                    send: () => {
                        expect(1).to.eqls(1, "send was invoked!");
                    }
                };
            }
        };

        const fakeRepository: any = {
            readAll: () => expected
        };

        const handlers = getHandlers(fakeRepository);
        handlers.getAllMoviesHandler(fakeReq, fakeResponse);

    });

});