const db = require('../DataBaseConnection');



async function getUserData(User_ID){

    let result;

    const selectQuery =`SELECT nom,prenom,date_naissance,lieu_naissance,adresse,telephone,sexe FROM User_Informations WHERE Id_User='${User_ID}'`;
      await  new Promise((resolve,reject)=>{
            db.query(selectQuery,(err,rslt)=>{
                if(err)
                    reject(err);
                        else {
                            resolve(rslt);
                        }
            })
        })
        .then(rslt=>result=rslt)
        .catch(()=>result=500);

        console.log(result);
        return result;
}


async function saveChange(User_Id,User_DATA){

    const {nom,prenom,lieuNaissance,adresse,telephone,sexe} = User_DATA;
    const dateNaissance = User_DATA.dateNaissance ? `'${User_DATA.dateNaissance}'`: `null`;
    let result;
    const updateQuery = `UPDATE User_Informations SET nom='${nom}',date_naissance=${dateNaissance}, prenom='${prenom}'
    ,lieu_naissance='${lieuNaissance}',adresse='${adresse}',telephone='${telephone}',sexe=${sexe} WHERE Id_User='${User_Id}'`;
 
    await new Promise((resolve,reject)=>{
        db.query(updateQuery,(err,rslt)=>{
            if(err)
                reject(err);
                    else {
                        resolve(rslt);
                    }
        })
    })
    .then(rslt=>result=rslt)
    .catch((err)=>{console.log(err); result=500});

    return result;
           
    
}


async function getNotif(User_Id){
        let result;
        const selectQuery =`SELECT notification,message,email FROM User_Parameters WHERE Id_User=${User_Id}`;
        await new Promise((resolve,reject)=>{
            db.query(selectQuery,(err,rslt)=>{
                if(err)
                    reject(err);
                        else resolve(rslt);
            })
        })
        .then((rslt)=>result=rslt)
        .catch(()=>result=500);
}



module.exports.getUserData= getUserData;
module.exports.saveChange = saveChange;
module.exports.getNotif =  getNotif;



