const db = require('../DataBaseConnection');
const {nanoid} = require('nanoid');


async function createFolder(User_Id,FolderName){
        let result;
        const InsertQuery = `INSERT INTO DOSSIER VALUES(uuid(),'${User_Id}','${FolderName}',Now())`;
        await new Promise((resolve,reject)=>{
            db.query(InsertQuery,(err,rslt)=>{
                if(err) reject(err);
                    else resolve(rslt);
            })
        }).then(rslt=>result=rslt)
          .catch(()=>result= 500);

        
          return result;  
}   


async function getFolder(User_Id){
       let result;
       const  SelectQuery = `SELECT Dossier_Id,Dossier_Name,Creation_date FROM Dossier where User_Id='${User_Id}' ORDER BY Creation_date DESC`;
        await new Promise((resolve,reject)=>{
            db.query(SelectQuery,(err,rslt)=>{
                if(err)
                    reject(err);
                        else 
                            resolve(rslt);
            })
        }).then(rslt=>result=rslt)
          .catch(()=>result=500);  
        
        return result;
}


async function createDocument(data,files){
    const {User_Id,Visitor_Id}=data;
    const {folderId,documentType,title,description} = data;

        let result;
        const documetId= nanoid(40);
        const InsertQuery = `INSERT INTO DOCUMENT VALUES ('${documetId}','${User_Id}','${folderId}','${documentType}',Now(),'${Visitor_Id}','${title}','${description}')`;

        await new Promise((resolve,reject)=>{
            db.query(InsertQuery,async(err,rslt)=>{
                if (err) reject(err);   
                    else {
                        let fileQuery;
                        for (const file of files) {
                            
                                fileQuery =`INSERT IGNORE INTO ANALYSE VALUES ('${file.filename}','${documetId}','${file.originalname}','${file.mimetype}')`
                                await new Promise((resolve1,reject1)=>{
                                    db.query(fileQuery,(err2,rslt2)=>{
                                        if(err2) reject1(err2);
                                            resolve1(rslt2);
                                    })
                                    
                                }).then(rslt1=>result=rslt1)
                                  .catch((err1)=>result=err1);
                                  
                            }
                            resolve(result);
                    }
            })
        }).then(rslt=>result=rslt)
          .catch((err)=>result=err)  
          console.log(result);
       
          
          return result;
}


async function getDocuments(dossierId){
        let result;
        const   selectQuery = `select nom as labo_medecinName,Document_Id,Creation_date,Document_Type,titre,description from document,user_informations as user where (Labo_Medecin_id = user.id_user)  AND (Dossier_ID = '${dossierId}')
            union  select Nom_Laboratoire as labo_medecinName,Document_Id,Creation_date,Document_Type,titre,description from document,laboratoire as user where (Labo_Medecin_id = user.id_user) AND (Dossier_ID = '${dossierId}')`
            await new Promise((resolve,reject)=>{
                db.query(selectQuery,(err,rslt)=>{
                        if(err) reject(err);
                            else resolve(rslt);
                })
            }).then(rslt=>result = rslt)
              .catch((err)=>console.log(err));  

              return result;
}

async function getPatients(Visitor_Id){
    let result;
    console.log(Visitor_Id);
    const selectQuery = `SELECT Id_User,nom,prenom,droit FROM Compte_Acces,user_informations where Visitor_Id ='${Visitor_Id}' AND User_Id = Id_User`;

    await new Promise((resolve,reject)=>{
        db.query(selectQuery,(err,rslt)=>{
            if (err) reject(err);
                else 
                    resolve(rslt);
        })
    }).then(rslt=>result=rslt)
      .catch(()=>result=500)  

      return result;
}


async function getDocumentDétails(document_Id){
        let result;
        const selectQuery=``;

        new Promise((resolve,reject)=>{
            db.query(selectQuery,(err,rslt)=>{
                if(err)
                    reject(err);
                        else resolve(rslt);
            })
        }).then(rslt=>result = rslt)
          .catch(err=>result=500)  

          return result;
}


async function getAvisMedecin(document_Id){
        let result;
        const selectQuery=`SELECT Avis_Id,Date_Time,Contenu,Nom FROM Avis_Medecin,user_informations where document_id ='${document_Id}' AND Id_User=Medecin_Id ORDER BY Date_Time DESC`;

       await new Promise((resolve,reject)=>{
            db.query(selectQuery,(err,rslt)=>{
                if(err)
                    reject(err);
                        else resolve(rslt);
            })
        }).then(rslt=>result = rslt)
          .catch(err=>result=500);  

          return result;
}   

async function createAvis(user_id,document_id,contenu){
        let result;
        const selectQuery=`INSERT INTO AVIS_MEDECIN VALUES(uuid(),'${user_id}','${document_id}',now(),'${contenu}')`;

       await new Promise((resolve,reject)=>{
            db.query(selectQuery,(err,rslt)=>{
                if(err)
                    reject(err);
                        else resolve(rslt);
            })
        }).then(rslt=>result = rslt)
          .catch(err=>result=500)  

          return result;
}






module.exports.getFolder=getFolder;
module.exports.createFolder=createFolder;
module.exports.createDocument = createDocument;
module.exports.getDocuments = getDocuments;
module.exports.getPatients = getPatients;
module.exports.getDocumentDétails = getDocumentDétails;
module.exports.getAvisMedecin = getAvisMedecin;
module.exports.createAvis = createAvis;

