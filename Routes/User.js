const express = require('express');
const {getUserData,saveChange,getNotif} = require("../MysqlQuery/UserSql");
const {checkSession} = require('../MysqlQuery/AuthentificationSQL')
const dataVerify = require('../Utils/DataVerification');
const {HttpResponse,NotificationParameters} =  require("../Models/AuthentificationModel");
const {User} = require("../Models/User"); 

const router = express.Router();


     router.use(async(req,res,next)=>{  //middleWare    Verifier la session pour tous les requetes
        console.log("/user MiddleWare")
                const {Session_Id,Id_User} =req.body.cookie;
                if(!dataVerify(Session_Id,Id_User)) res.sendStatus("400"); //Verifier les donnes renvoyer code 400  
                        else{
                                let result =await checkSession(Session_Id,Id_User);
                                if(result === 500) res.sendStatus("500");   //Verfier si ya pas d erreur cote base de donnes
                                        else {
                                                  if(result[0].EXIST != 1) res.sendStatus("204") //Session Non trouvé non Valide
                                                        else next();    
                                        }
                        } 
     })


     router.post("/UserData",async(req,res)=>{
         console.log("/UserData");
       const result = await  getUserData(req.body.cookie.Id_User);
            if(result == 500) res.sendStatus("500")
                else if(result.length == 0) res.sendStatus("201") //aucune data
                        else {
                            const {nom,prenom,date_naissance,lieu_naissance,adresse,telephone,sexe} = result[0];
                            const user = new User(nom,prenom,date_naissance,lieu_naissance,adresse,telephone,sexe == 1 );
                            const response = new HttpResponse(user,200);
                            res.status(200).send(response);
                        }
     })


     router.post("/saveChange",async(req,res)=>{
             console.log("/saveChange")
             const {Id_User} = req.body.cookie;
                let result = await saveChange(Id_User,req.body.data);
                        if(result == 500)
                                 res.sendStatus("500");
                                        else
                                                res.sendStatus(200); 

     })


     router.post("/parameters/Notif",async (req,res)=>{
             console.log("/parameters/notif");
             const {Id_User} = req.body.cookie;
             const result = await getNotif();
             if(result === 500 ) res.sendStatus("500")
                else if(result[0].length === 0 ) res.sendStatus(204);
                        else {
                                const data =new NotificationParameters()
                                const response = new HttpResponse()
                        }
     });

module.exports=router;