const db = require("../DataBaseConnection")
const {nanoid} = require('nanoid');


async function Signin(email,password){

    const SigninQuery = `SELECT ID FROM USER WHERE EMAIL='${email}' AND PASSWORD='${password}'`;
    let result;

          await new Promise((resolve,reject)=>{
                db.query(SigninQuery,(err,rslt)=>{
                    console.log(rslt);    
                    if(err) reject(err);
                    resolve(rslt);

                })

            })
            
            .then((rslt)=>result=rslt)
            .catch(err=>result=500);
            
            console.log(result);

        return result;
}



async function Login(email,password){

        let result;
        let LoginQuery = `SELECT COUNT(EMAIL) as count FROM USER WHERE EMAIL ='${email}'`
        await new Promise(async (resolve,reject)=>{
            db.query(LoginQuery,async(err,rslt)=>{
                if(err)
                    reject(err);
                        else {
                            
                            if(rslt[0].count >= 1)  { resolve(201)} // si il éxiste deja un compte avec cet email renvoyer 201 deja existe;
                                else {
                                    LoginQuery = `CALL CreateUser('${email}','${password}')`;  //Sinon lancer la creation de l'utilsateur
                                 await new Promise((resolve,reject)=>{
                                        db.query(LoginQuery,(err2,rslt2)=>{
                                                console.log("data")
                                            if(err2) reject(err2); 
                                                else resolve(rslt2); //Renvoyer le resultat;
                                        })
                                        
                                   }).then(rslt=>result=rslt)
                                     .catch(()=>result=err);   
                                     resolve(result);
                                  
                                }  
                        }
            })

        }).then(rslt=>result=rslt)
          .catch(err=>result=500);
          console.log("data2");
        

         return result; 
}





async function createSession(IdUser){
    const id_session = nanoid(40);
    let result;
    const CreateSessionQuery = `INSERT INTO SESSION VALUES ('${id_session}','${IdUser}',Now())`;
        await  new Promise((resolve,reject)=>{
            db.query(CreateSessionQuery,(err,rslt)=>{
                if(err) reject(err);
                    else {
                        resolve(id_session);
                    }
            })

               }).then(rslt=>result=rslt)
                 .catch(err=>result=500);   
                console.log("create session",result);
                
               
               return result;
}


async function checkSession(Session_Id,Id_User){

    const SelectQuery =`SELECT COUNT(*) AS EXIST,Privileges FROM SESSION,USER WHERE Id_Session='${Session_Id}' AND Id_User='${Id_User}' AND ID=Id_User`;
    let result;
        await new Promise((resolve,reject)=>{
            db.query(SelectQuery,(err,rslt)=>{
                if(err)
                    reject(err);
                    else{
                        resolve(rslt);
                    }
            })
        }).then(rslt=>result=rslt)
          .catch(()=>result = 500);
         console.log(result);
          
          return result;
}


async function Disconnect(Session_Id,Id_User){

    const SelectQuery =`DELETE FROM SESSION WHERE Id_Session='${Session_Id}' AND Id_User='${Id_User}'`
    let result;
        await new Promise((resolve,reject)=>{
            db.query(SelectQuery,(err,rslt)=>{
                if(err)
                    reject(err);
                    else{
                        resolve(rslt);
                    }
            })
        }).then(rslt=>result=rslt)
          .catch(()=>result = 500);
           console.log(result);
          
          return result;

}


async function checkPrivileges(User_Id,Visitor_Id){
        let result ;
        const selectQuery= `SELECT COUNT(*) AS EXIST,Droit FROM Compte_Acces WHERE User_Id='${User_Id}' AND Visitor_Id='${Visitor_Id}'`;
        await new Promise((resolve,reject)=>{
            db.query(selectQuery,(err,rslt)=>{
                if(err) reject(err);
                    else 
                        resolve(rslt);
            })
        }).then(rslt=>result=rslt)
          .catch(()=>result=500);
          
          return result;
}

  
module.exports.Signin = Signin;
module.exports.Login = Login;
module.exports.createSession=createSession;
module.exports.checkSession=checkSession;
module.exports.Disconnect=Disconnect;
module.exports.checkPrivileges = checkPrivileges;