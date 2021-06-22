const db = require('../DataBaseConnection');


async function createRappel(user_Id,title,description,rappelDateFor){
    let result;
    const InsertQuery =`INSERT INTO RAPPEL VALUES(UUID(),'${user_Id}','${title}','${description}',NOW(),'${rappelDateFor}')`;

    await new Promise((resolve,reject)=>{
        db.query(InsertQuery,(err,rslt)=>{
            if(err)
                reject(err);
                else    
                    resolve(rslt);
        })
    }).then(rslt=>result=rslt)
      .catch(err=>console.log(err))
      
      return result;
}


async function getRappel(user_Id){

    let result;
    const selectQuery =`SELECT Rappel_Id,Title, Descritpion as Description , rapple_date_for as rappel_date_for FROM Rappel WHERE user_Id='${user_Id}' ORDER BY Creation_date_time DESC`;

    await new Promise((resolve,reject)=>{
        db.query(selectQuery,(err,rslt)=>{
            if(err)
                reject(err);
                else    
                    resolve(rslt);
        })
    }).then(rslt=>result=rslt)
      .catch(err=>console.log(err))

      return result;
}

module.exports = {createRappel,getRappel};