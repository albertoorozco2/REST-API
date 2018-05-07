import { expect } from "chai";
import request from "supertest";
import { getApp } from "../../app";
import { getHandlers } from "../../src/backend/controllers/link_controller";
import { getUserRouter } from "../../src/backend/controllers/user_controller";

var api = request('http://localhost:3000');
//var newUser = { email: "pedro.duenas5@hotmail.com", password: "secret" };
var newUser = { email: Math.random().toString(36).substring(7)+"@gmail.com", password: "secret" };
var defaultUser = { email: "albertoorozco7@gmail.com", password: "secret" };
var token;
var newLink = { url: "www.biglink.com", title: "biglink" };
var newLinkId;

describe('UNIT TEST  /api/v1/users POST', () => {


 it('create a new user -  should return new user object', function(done)  {
     api.post('/api/v1/users')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(newUser)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res ){    
            try{
            expect(JSON.stringify(res.body)).to.equal(JSON.stringify(newUser))
            done();
             }
                catch (e) {
                    done(e);
                }
        });

})
it('create new user missing email -  should return string bad request', function(done)  {

     api.post('/api/v1/users')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(newUser.password)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res ){
                try{
               expect(res.text).to.equal("Bad Request! ")
                done();
                }
                catch (e) {
                    done(e);
                }
            });

})
it('create new user missing password -  should return string bad request', function(done)  {

     api.post('/api/v1/users')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(newUser.email)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res ){
                try{
               expect(res.text).to.equal("Bad Request! ")
                done();
                }
                catch (e) {
                    done(e);
                }
            });

})

it('create new user no data attached  -  should return string bad request' , function(done)  {

     api.post('/api/v1/users')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send()
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res ){
                try{
               expect(res.text).to.equal("Bad Request! ")
                done();
                }
                catch (e) {
                    done(e);
                }
            });

})

setTimeout(function(){}, 1000);
it('create same new user  -  should return string bad request user already in the system', function(done)  {

     api.post('/api/v1/users')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(newUser)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res ){
                try{
               expect(res.text).to.equal("Bad Request! user already  in the system")
                done();
                }
                catch (e) {
                    done(e);
                }
            });

})
});


describe('INTEGRATON TEST - auth user, create link, upvotelink, and downvote link', () => {

 it('authentification of User - /api/v1/auth/login POST  authentification, should return a token', function(done){
    api.post('/api/v1/auth/login')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(defaultUser)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(

            function(err, res ){
                try{
                expect(!res.body.token).to.equal(false);
                token = res.body.token;
                done();
                }
                catch (e) {
                    done(e);
                }
            }
            );
})
 it('add a new link - /api/v1/links POST add first new link, should return a link json', function(done){
    api.post('/api/v1/links')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('authorization', token)
        .send(newLink)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(

            function(err, res ){
                try{
                expect(res.body.url).to.equal(newLink.url)
                expect(res.body.title).to.equal(newLink.title)
                newLinkId = res.body.id;
                done();
                }
                catch (e) {
                    done(e);
                }
            }
            );
})
 it('add a new link NO token - /api/v1/links POST add first new link, should return a link json', function(done){
    api.post('/api/v1/links')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('authorization', '' )
        .send(newLink)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(

            function(err, res ){
                try{
               expect(res.text).to.equal("Forbidden!")
                done();
                }
                catch (e) {
                    done(e);
                }
            }
            );
})
it('upvote a link - /api/v1/links/:id/upvote POST upvote a link, should return a string', function(done){
    api.post('/api/v1/links/'+newLinkId+'/upvote')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('authorization', token)
        .send()
        .expect('Content-Type', /json/)
        .expect(200)
        .end(

            function(err, res ){
                try{
               expect(res.text).to.equal("upvoted saved sucessfully!")
                done();
                }
                catch (e) {
                    done(e);
                }
            }
            );
})
it('upvote a link NO token - /api/v1/links/:id/upvote POST upvote a link, should return a string', function(done){
    api.post('/api/v1/links/'+newLinkId+'/upvote')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('authorization', '')
        .send()
        .expect('Content-Type', /json/)
        .expect(200)
        .end(

            function(err, res ){
                try{
               expect(res.text).to.equal("Forbidden!")
                done();
                }
                catch (e) {
                    done(e);
                }
            }
            );
})
it('upvote same link - /api/v1/links/:id/upvote POST upvote a link, should return a error', function(done){
    api.post('/api/v1/links/'+newLinkId+'/upvote')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('authorization', token)
        .send()
        .expect('Content-Type', /json/)
        .expect(200)
        .end(

            function(err, res ){
                try{
               expect(res.text).to.equal("Bad Request! upvote already registered")
                done();
                }
                catch (e) {
                    done(e);
                }
            }
            );
})

it('downvote a link - /api/v1/links/:id/downvote POST downvote a link, should return a string', function(done){
    api.post('/api/v1/links/'+newLinkId+'/downvote')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('authorization', token)
        .send()
        .expect('Content-Type', /json/)
        .expect(200)
        .end(

            function(err, res ){
                try{
               expect(res.text).to.equal("downvoted saved sucessfully!")
                done();
                }
                catch (e) {
                    done(e);
                }
            }
            );
})
it('downvote a link NO token- /api/v1/links/:id/downvote POST downvote a link, should return a string', function(done){
    api.post('/api/v1/links/'+newLinkId+'/downvote')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('authorization', '')
        .send()
        .expect('Content-Type', /json/)
        .expect(200)
        .end(

            function(err, res ){
                try{
               expect(res.text).to.equal("Forbidden!")
                done();
                }
                catch (e) {
                    done(e);
                }
            }
            );
})

it('downvote same link - /api/v1/links/:id/downvote POST downvote a link, should return a error', function(done){
    api.post('/api/v1/links/'+newLinkId+'/downvote')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('authorization', token)
        .send()
        .expect('Content-Type', /json/)
        .expect(200)
        .end(

            function(err, res ){
                try{
               expect(res.text).to.equal("Bad Request! downvote already registered")
                done();
                }
                catch (e) {
                    done(e);
                }
            }
            );
})



});




// describe('authentification of User - /api/v1/auth/login POST', function(){


// });

// describe("add a new link - /api/v1/links POST", function(){
// it('add first new link, should return a link json', function(done){
//     api.post('/api/v1/links')
//         .set('Content-Type', 'application/x-www-form-urlencoded')
//         .set('authorization', token)
//         .send(newLink)
//         .expect('Content-Type', /json/)
//         .expect(200)
//         .end(

//             function(err, res ){
//                 try{
//                 expect(res.body.url).to.equal(newLink.url)
//                 expect(res.body.title).to.equal(newLink.title)
//                 newLinkId = res.body.id;
//                 done();
//                 }
//                 catch (e) {
//                     done(e);
//                 }
//             }
//             );
// })
// });

// describe("upvote a link - /api/v1/links/:id/upvote POST", function(){
// it('upvote a link, should return a string', function(done){
//     api.post('/api/v1/links/'+newLinkId+'/upvote')
//         .set('Content-Type', 'application/x-www-form-urlencoded')
//         .set('authorization', token)
//         .send()
//         .expect('Content-Type', /json/)
//         .expect(200)
//         .end(

//             function(err, res ){
//                 try{
//                expect(res.text).to.equal("upvoted saved sucessfully!")
//                 done();
//                 }
//                 catch (e) {
//                     done(e);
//                 }
//             }
//             );
// })
// });

// describe("downvote a link - /api/v1/links/:id/downvote POST", function(){
// it('downvote a link, should return a string', function(done){
//     api.post('/api/v1/links/'+newLinkId+'/downvote')
//         .set('Content-Type', 'application/x-www-form-urlencoded')
//         .set('authorization', token)
//         .send()
//         .expect('Content-Type', /json/)
//         .expect(200)
//         .end(

//             function(err, res ){
//                 try{
//                expect(res.text).to.equal("downvoted saved sucessfully!")
//                 done();
//                 }
//                 catch (e) {
//                     done(e);
//                 }
//             }
//             );
// })
// });

// // test suite
// describe("LinkController", () => {

//     // test case 1: read all
//     it("HTTP GET /", async () => {
//         // THIS IS AN INTEGRATION TEST!
//         const expected = [
//     {
//         "id": 2,
//         "url": "pleasew",
//         "title": "pleasew"
//     },
//     {
//         "id": 3,
//         "url": "www.google.com",
//         "title": "google"
//     }
// ];

//         const app = await getApp();

//         await request(app).get("/api/v1/links")
//             .set('Accept', 'application/x-www-form-urlencoded')
//             .expect('Content-Type', /json/)
//             .expect(200)
//             .then((response) => {
//                 expect(response.body).to.eqls(expected);
//             });

//     });

//     it("LinkRouter.get", () => {

//         const expected = [
//     {
//         "id": 2,
//         "url": "pleasew",
//         "title": "pleasew"
//     },
//     {
//         "id": 3,
//         "url": "www.google.com",
//         "title": "google"
//     }
// ];
//         const fakeReq: any = {};
//         const fakeResponse: any = {
//             json: (movies: any[]) => {
//                 expect(movies).eqls(expected);
//                 return {
//                     send: () => {
//                         expect(1).to.eqls(1, "send was invoked!");
//                     }
//                 };
//             }
//         };

//         const fakeRepository: any = {
//             readAll: () => expected
//         };

//         const handlers = getHandlers(fakeRepository, fakeRepository );
//         handlers.getAllLinksHandler(fakeReq, fakeResponse);

//     });

// });