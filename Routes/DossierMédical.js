const express = require('express');
const path = require('path');
const multer = require('multer');
const {nanoid} = require('nanoid');

const dataVerify = require('../Utils/DataVerification');

const {checkPrivileges} = require('../MysqlQuery/AuthentificationSQL');
const {getFolder,createFolder,createDocument,getDocuments,getPatients,createAvis,getAvisMedecin}= require("../MysqlQuery/DossierMedSql");

const {Dossier,Document,Patient,AvisMedecin} = require("../Models/User");
const {HttpResponse} =require('../Models/AuthentificationModel');


const fileStorageEngine = multer.diskStorage({
    destination: (req,file,callBack)=>{
        callBack(null,'./Files/Document');
    },

    filename: (req,file,callBack)=>{
        let extension ;
        switch(file.mimetype){
            case 'image/png'  : extension='.png'; break;
            case 'image/jpeg' : extension='.jpeg'; break;
            case 'image/jpg'  : extension='.jpg'; break;
            case '.pdf': extension ='.pdf'; break;
            default : extension='.rar';
        }
        const filename = nanoid(10)+extension;
        callBack(null,filename);
    },
    
    
})

const upload = multer({storage:fileStorageEngine});

const router = express.Router();


    router.post('/getFolders',async(req,res)=>{
            const {User_Id} = req.body.data;
            const {Id_User:Visitor_Id}= req.body.cookie;

            if(!dataVerify(User_Id,Visitor_Id)) res.sendStatus("400"); //Verifier les donnes renvoyer code 400  
                else 
                {
                 if(User_Id !== Visitor_Id)
                  {  let result = await checkPrivileges(User_Id,Visitor_Id); 
                    if(result === 500) {res.sendStatus(500); return;}
                       else 
                        if(result[0].EXIST === 0){ res.sendStatus(204); return; }
                    }   //il a pas les privileges 
                            
                                result = await  getFolder(User_Id);
                                if(result === 500) res.sendStatus(500);
                                    else {
                                        const folderArray=[];
                                        for (const element of result) {
                                            const {Dossier_Id,Dossier_Name,Creation_date} = element
                                                folderArray.push(new Dossier(Dossier_Id,Dossier_Name,Creation_date));
                                        }
                                        const response = new HttpResponse(folderArray,200);
                                        res.status(200).send(response);

                                    }
                            
                 }
    })


    router.post("/createFolder",async(req,res)=>{
        console.log("/createFolder",req.body.data);
        const {User_Id,folderName} = req.body.data;
        const {Id_User:Visitor_Id}= req.body.cookie;
        
        if(!dataVerify(User_Id,Visitor_Id,folderName)) res.sendStatus("400"); //Verifier les donnes renvoyer code 400 
          else{
              let result = await checkPrivileges(User_Id,Visitor_Id);
              if(result === 500) res.sendStatus(500);  
                    else if (result[0].Exist === 0 || result[0].Droit === 1)  res.sendStatus(204);    //il a pas les privileges 
                        else {
                                result= await createFolder(User_Id,folderName);
                                if(result === 500) res.sendStatus(500);
                                    else {console.log(result); res.sendStatus(201); }
                        }
          } 
    })


    

    router.post('/createDocument',upload.array("file",10),async(req,res)=>{
        console.log('/createDocument');
        const {User_Id,Visitor_Id}=req.body;
        const {folderId,documentType,title,description} = req.body
        
        if(!dataVerify(User_Id,Visitor_Id,folderId,documentType,title,description)) res.sendStatus(400);
            else {
                let result = await createDocument(req.body,req.files);
                if(result === 500) res.sendStatus(500) //Erreur server database;
                    else {
                        res.sendStatus(201);
                    }
            }
    })

    router.post('/getDocuments',async(req,res)=>{
        console.log("/getDocuments")

        const {dossierId} = req.body.data;

        if(!dataVerify(dossierId)) res.sendStatus(400); 
            else {
                result = await getDocuments(dossierId);
                if(result == 500) res.sendStatus(500);
                    else {
                        
                        const docArray = [];
                        let doc;
                        for (const document of result) {
                            const {Document_Id,Creation_date,labo_medecinName,Document_Type,titre,description} = document;
                            doc = new Document(Document_Id,Creation_date,labo_medecinName,Document_Type,titre,description);
                                docArray.push(doc);    
                        }   
                        const response = new HttpResponse(docArray,200);
                        res.send(response);
                    }
            }
    })


    router.post('/getPatients',async (req,res)=>{
        console.log('/getPatients')
            if(!dataVerify(req.body.data.Visitor_Id)) res.sendStatus(400);   
                else{
                    const result = await getPatients(req.body.data.Visitor_Id);
                    if(result === 500) res.sendStatus(500);
                        else {
                            console.log(result);
                            const PatientArray = [];
                            for (const element of result ) {
                              const {Id_User,nom,prenom,droit} = element;
                              PatientArray.push(new Patient(Id_User,nom,prenom,droit));
                            }
                            const response = new HttpResponse(PatientArray,200);
                            res.send(response);
                        }
                }
    })


    router.post('/getDocumentDétails',async(res,req)=>{
        
    })



    router.post('/postAvis',async(req,res)=>{
            console.log("/postAvis")
            const {user_id,document_id,contenu} = req.body.data;
            if(!dataVerify(document_id,user_id,contenu)) res.sendStatus(400);
                else{
                        let result = await createAvis(user_id,document_id,contenu);
                        if(result === 500) res.sendStatus(500);
                            else {
                                res.sendStatus(200);
                            }    
                }
    })
    router.post('/getAvis',async(req,res)=>{
            console.log('/getAvis');
            const {document_id} = req.body.data
            if(!dataVerify(document_id)) res.sendStatus(400);
                else {
                    const result = await getAvisMedecin(document_id);
                    if(result == 500)  res.sendStatus(500);
                        else {
                            const avisArray = []
                            
                            console.log(result)
                            for(const avis of result) {
                                const {Avis_Id,Date_Time,Contenu,Nom} = avis;
                                avisArray.push(new AvisMedecin(Avis_Id,Date_Time,Contenu,Nom))
                            }
                            const response = new HttpResponse(avisArray,200);
                            res.send(response)  ;
                        } 
                }
                
    })



module.exports = router;    