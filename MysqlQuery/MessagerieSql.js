const db = require('../DataBaseConnection');




async function createDiscussion(id_User,id_destinataire,messageContent){

        let result;
        const insertQuery = `call createDicussionWithMessage('${id_User}','${id_destinataire}','${messageContent}')`;
        await new Promise((resolve,reject)=>{
                 db.query(insertQuery,(err,rslt)=>{
                     if(err) reject(err);
                        else resolve(rslt);
                 })   
                 
        })
        .then(rslt=>result=rslt)
        .catch((err)=>{result=500;console.log(err)})

        return result;
}

async function userExit(id_User){
            let result;
            const insertQuery = `SELECT nom,privileges,id FROM User,user_informations as U,laboratoire as L WHERE id='${id_User}'and id=U.id_user and  L.id_user <> id
            union select nom_laboratoire as nom,privileges,id FROM laboratoire ,user WHERE id='${id_User}' and id=id_user;
            `;
            await new Promise((resolve,reject)=>{
                    db.query(insertQuery,(err,rslt)=>{
                        if(err) reject(err);
                            else resolve(rslt);
                    })   
                    
            })
            .then(rslt=>result=rslt)
            .catch((err)=>{result=500;console.log(err)})
                
            return result;
} 


async function acceptDiscussion(id_discussion){
        let result;
        const updateQuery = `UPDATE Discussion SET accept=1 WHERE id_discussion ='${id_discussion}'`;
        await new Promise((resolve,reject)=>{
            db.query(updateQuery,(err,rslt)=>{
                if(err) reject(err);
                    else resolve(rslt);
            })
        }).then(rslt=>result=rslt)
          .catch((err)=>result=500);  
           
          return result;
} 


async function manageBlock(id_discussion,block){
    let result;
    const updateQuery = `UPDATE DISCUSSION SET block = ${block} WHERE Id_Discussion='${id_discussion}'`;
    await new Promise((resolve,reject)=>{
        db.query(updateQuery,(err,rslt)=>{
            if(err) reject(err);
                else resolve(rslt);
        })
    }).then(rslt=>result=rslt)
      .catch(err=>result=500);
    
      return result;  
    
    }

  
async function getDiscussions(id_User){
        let result;
        const selectQuery=`(select D.Id_Discussion,nom,id_Contact1 as createur,accept,block,message_sender,message_content,message_date,message_lu,privileges from discussion as D,user_informations as U , laboratoire as L , Message as M ,user where (id_Contact1= '${id_User}' or id_Contact2 = '${id_User}') and ( U.id_user <>'${id_User}' and (U.id_user=id_contact1 or U.id_user=id_contact2) and L.id_user <> U.id_user and U.id_user = ID   )  and M.id_Message = (select  id_Message from Message as  TM where TM.id_discussion = D.id_discussion  order by message_date desc limit 1 ))
        union (select D.Id_Discussion,nom_laboratoire as nom ,id_Contact1 as createur,accept,block, message_sender,message_content,message_date,message_lu,privileges from discussion as D,user_informations as U ,laboratoire as L  , Message as M, user  where (id_Contact1= '${id_User}' or id_Contact2 = '${id_User}') and ( U.id_user <>'${id_User}' and  (U.id_user=id_contact1 or U.id_user=id_contact2) and  L.id_user =U.id_user and U.id_user = ID  )  and M.id_Message = (select  id_Message from Message as  TM where TM.id_discussion = D.id_discussion  order by message_date desc limit 1 )) ORDER BY message_date DESC 
        `;
        await new Promise((resolve,reject)=>{
            db.query(selectQuery,(err,rslt)=>{
                if(err) reject(err);
                    else resolve(rslt);
            })
        }).then(rslt=>result=rslt)
        .catch((err)=>{result=500; console.log(err); }); 
        
        return result;
}


async function getDiscByUserId(Id_User,id_destinataire){
            let result;
            const selectQuery = `SELECT Id_Discussion FROM DISCUSSION WHERE (id_Contact1='${Id_User}' and id_Contact2='${id_destinataire}') OR (id_Contact1='${id_destinataire}' and id_Contact2='${Id_User}') `;
            await new Promise((resolve,reject)=>{
                db.query(selectQuery,(err,rslt)=>{
                    if (err) reject(err);
                        else resolve(rslt);
                })
            }).then(rslt=>result=rslt)   
              .catch(err=>result=500)

              return result;
}


async function getMessages(id_discussion){

    let result;
    const selectQuery = `SELECT id_message,message_sender,message_content,message_date,message_lu from Message where Id_Discussion='${id_discussion}' ORDER BY Message_date DESC ` ;
    await new Promise((resolve,reject)=>{
        db.query(selectQuery,(err,rslt)=>{
            if(err) reject(err);
                else resolve(rslt);
        })
    }).then(rslt=>result= rslt)
      .catch(err=>result=err);
      return result;  

}


async function storeMessage(userID,messageContent,discussionId){
        let result;
        const insertQuery = `CALL insertMessage('${userID}','${messageContent}','${discussionId}')`;
        await new Promise((resolve,reject)=>{
                db.query(insertQuery,(err,rslt)=>{
                    if(err) reject(err);
                        else resolve(rslt);
                })
        }).then(rslt=>result =rslt)
          .catch(err=>result =500);

          return result;  
}


module.exports = {
    userExit,
    createDiscussion,
    acceptDiscussion,
    getDiscussions,
    getDiscByUserId,
    getMessages,
    storeMessage,
    manageBlock
}


