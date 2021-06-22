const {HttpResponse,SessionCookie} = require('../Models/AuthentificationModel');

const dataVerify = require('../Utils/DataVerification');
const {Signin,Login,createSession,checkSession,Disconnect}   = require("..//MysqlQuery/AuthentificationSQL"); 
const express = require("express");

const router = express.Router();
       
        
        router.post('/Signin', async (req,res)=>{   //Signin pour se connecter 
                console.log("Signin")
                const {email,password} = req.body.data
                if(!dataVerify(email,password)) res.sendStatus("400");   //Verifier les donnes renvoyer code 400 
                    else {
                         let result = await Signin(email,password);
                         console.log("result",result);
                         if(result.length === 0) {res.sendStatus("204"); return;} 
                         switch (result){       
                                 case 500 : res.sendStatus("500"); break;   //si il ya un problem dans la base de donnes renvoyer 500
                               // email ou mot de passe incorrect
                                 default  : {
                                     const IdSession = await createSession(result[0].ID);   //Creer une session avec un numero de session id 
                                         if(IdSession === 500)
                                             res.sendStatus(500);   // problem database renvoyer un code d'etat 500
                                                else {
                                                    const sessionCookie = new SessionCookie(IdSession,result[0].ID);
                                                    const Response = new HttpResponse(sessionCookie,200);    //creer une class et renvoyer   
                                                    res.status(200).send(Response);             
                                                }
                                                
                                            }
                          }
                }   
                        

               
        });

        router.post("/Login",async (req,res)=>{
             const {email,password} = req.body.data;
             let response;

             if(!dataVerify(email,password) )  res.sendStatus("400"); //Verifier les donnes renvoyer code 400    
                else{
                        let result = await Login(email,password);   //Effectuer la connexion database 
                        switch(result){
                                case 500 : res.sendStatus("500"); break; //Erreur base de donnes
                                case 201 : response = new HttpResponse(null,201); res.status(201).send(response); break; //existe deja un utilsateur
                                default : {     console.log("default",result[0][0].ID);
                                                const IdSession = await createSession(result[0][0].ID);
                                                 if(IdSession === 500) res.sendStatus("500"); 
                                                        else {
                                                                console.log("result",IdSession)
                                                                const sessionCookie = new SessionCookie(IdSession,result[0][0].ID);
                                                                const Response = new HttpResponse(sessionCookie,200);    //creer une class et renvoyer   
                                                                res.status(200).send(Response);  
                                                         }               
                                }   
                        }
                }      
        })
        
        router.post("/CheckSession",async(req,res)=>{  //Verifier la validite d'une session id 
                console.log("/CheckSession") 
                const {Session_Id,Id_User} =req.body.cookie;
                if(!dataVerify(Session_Id,Id_User)) res.sendStatus("400"); //Verifier les donnes renvoyer code 400  
                        else{
                                let result =await checkSession(Session_Id,Id_User);
                                if(result === 500) res.sendStatus("500");   //Verfier si ya pas d erreur cote base de donnes
                                        else {
                                                  if(result[0].EXIST === 1)res.status("200").send({Privileges:result[0].Privileges});//Renvoyer Oke 200 Session trouvée Valid
                                                        else res.sendStatus("204");      //Session Non trouvé non Valide        
                                        }
                        }
                        
                
        })

        router.post("/Disconnect",async(req,res)=>{  //deconnecter et supprimer les sessions
                console.log("/Disconnect");
                const {Session_Id,Id_User} =req.body.cookie;
                if(!dataVerify(Session_Id,Id_User)) res.sendStatus("400"); //Verifier les donnes renvoyer code 400
                        else{
                               let result =await Disconnect(Session_Id,Id_User);
                               if(result === 500) res.sendStatus("500")  //problem server database
                                else {
                                       if(result.affectedRows >= 1) res.sendStatus(200); 
                                        else   res.sendStatus(204);  //Session non supprimé Session non valide
                                } 
                        }
        })




module.exports = router;        