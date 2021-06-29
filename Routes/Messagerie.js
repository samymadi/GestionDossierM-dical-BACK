const express = require("express");

const router = express.Router();
const dataVerify = require('../Utils/DataVerification');
const {HttpResponse} = require('../Models/AuthentificationModel');
const {Discussion,UserDiscussion, Message} = require('../Models/Messagerie');

const {
    userExit,
    createDiscussion,
    acceptDiscussion,
    getDiscussions,
    getMessages,
    manageBlock,
    getDiscByUserId
    } = require('../MysqlQuery/MessagerieSql')





    router.post('/UserExist',async(req,res)=>{
        console.log('/UserExist');
        const {id_destinataire} = req.body.data;
        if(!dataVerify(id_destinataire)) res.sendStatus(400);
        
            else {
                let result = await  userExit(id_destinataire);
                if(result == 500) res.sendStatus(500);
                    else if(result.length == 0 ) res.sendStatus(204);
                        else {
                            const {id,nom,privileges} = result[0];
                            const userDiscussion = new UserDiscussion(id,nom,privileges);
                            const response = new HttpResponse(userDiscussion,200);
                            res.send(response);
                        }            
            }
    })

    router.post('/createDiscussion',async(req,res)=>{
            console.log("/createDiscussion");
            const {Id_User} =req.body.cookie;
            const {id_destinataire,messageContent} = req.body.data;
            if(!dataVerify(Id_User,id_destinataire,messageContent)) res.sendStatus(400);
                else {
                    let result = await createDiscussion(Id_User,id_destinataire,messageContent);
                    if(result ==  500) res.sendStatus(500);
                        else {
                            const {discussion_id,datemessage} = result[0][0];
                            console.log(datemessage);
                            const discussion = new Discussion(Id_User,discussion_id,"",null,Id_User,messageContent,datemessage,0,0,0,Id_User);
                            const response = new HttpResponse(discussion,200);
                            console.log(response);
                            res.send(response);
                        }
                }
    })

    router.post("/acceptDiscussion",async(req,res)=>{
        console.log("/acceptDiscussion");
        const {Id_discussion} = req.body.data;
        if(!dataVerify(Id_discussion)) res.sendStatus(400);
            else{
                let result = await acceptDiscussion(Id_discussion);
                if(result == 500) res.sendStatus(500)
                    else {
                        res.sendStatus(200);
                    }
            }
    })


    router.post("/manageBlock",async(req,res)=>{
        console.log("/manageBlock");
        const {Id_User} = req.body.cookie;
        const {Id_discussion,block} =req.body.data;
        if(!dataVerify(Id_User,Id_discussion)) res.sendStatus(400);
            else{
                const result = await manageBlock(Id_discussion,block);
                if(result == 500) res.sendStatus(500);
                    else res.sendStatus(200);
            }
    })

    router.post("/getDiscussions",async(req,res)=>{
        console.log("/getDiscussions");
        const {Id_User} = req.body.cookie;
        if(!dataVerify(Id_User)) res.sendStatus(400)
        else {
            let result = await getDiscussions(Id_User);
            if(result == 500) res.sendStatus(500);
                else {
                    let discussion;
                    const DiscussionArray = [];
                    for (const disc of result) {
                            const {Id_Discussion,nom,accept,block,privileges,message_sender,message_content,message_date,message_lu,createur} = disc
                            discussion = new Discussion(Id_User,Id_Discussion,nom,privileges,message_sender,message_content,message_date,message_lu,accept,block,createur);
                            DiscussionArray.push(discussion);
                        }
                        const response = new HttpResponse(DiscussionArray,200);
                        res.send(response);
                }
        } 
    })


    router.post("/getDiscByUserId",async(req,res)=>{
        console.log("/getDiscByUserId");
        const {Id_User} = req.body.cookie;
        const {id_destinataire} = req.body.data;

        if(!dataVerify()) res.sendStatus(400);
            else {
                const result = await getDiscByUserId(Id_User,id_destinataire);
                console.log(result);
                if(result === 500) res.sendStatus(500);
                    else {
                        const response = new HttpResponse(result,200);
                        res.send(response);
                    }
            }
    })

    router.post('/getMessages',async(req,res)=>{
        console.log("/getMessages");
        const {Id_User} = req.body.cookie;
        const {Id_discussion} = req.body.data;
        if(!dataVerify(Id_discussion)) res.sendStatus(400);
            else {
                  const result = await getMessages(Id_discussion);
                  if(result == 500) res.sendStatus(500);
                    else {
                        let mess;
                        const messageArray = [];
                        for (const message of result) {
                            const {id_message,message_sender,message_content,message_date,message_lu} = message
                            mess = new Message(id_message,Id_User,message_content,message_sender,message_date,message_lu);
                            messageArray.push(mess);
                        }

                        const response = new HttpResponse(messageArray,200);
                        res.send(response); 
                    }
            }
    })



module.exports = router;