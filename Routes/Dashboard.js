const express = require('express');
const {createRappel,getRappel} = require('../MysqlQuery/DashoardSql');
const dataVerify = require('../Utils/DataVerification');
const {Rappel}= require('../Models/User');
const {HttpResponse}= require('../Models/AuthentificationModel');

const Route = express.Router();



        Route.post("/getRappel",async (req,res)=>{
                console.log("/getRappel");
                const {Id_User} = req.body.cookie;
                console.log(Id_User);
                if(!dataVerify(Id_User)) res.sendStatus(400);
                        else{
                                let result = await getRappel(Id_User);
                                if(result == 500)   res.sendStatus(500);
                                        else {
                                                const rappelArray = []
                                                
                                                for (const rappel of result) {
                                                        const {Rappel_Id,Title,Description,rappel_date_for} = rappel; 
                                                        rappelArray.push(new Rappel(Rappel_Id,Title,Description,rappel_date_for));      
                                                }
                                                const response = new HttpResponse(rappelArray,200);
                                                res.send(response)

                                        }
                        }
        })


        Route.post('/createRappel',async(req,res)=>{
                console.log("/createRappel",req.body.data);
                const {user_Id,title,description,rappelDateFor} = req.body.data;
                if(!dataVerify(user_Id,title,description,rappelDateFor)) res.sendStatus(400);   
                        else {
                               let result = await createRappel(user_Id,title,description,rappelDateFor);
                               if(result == 500) res.sendStatus(500);
                                else {
                                        res.sendStatus(200);
                                }

                        }
                        
        })


module.exports = Route;       