

 //Pour Verifier si les données envoyes dans le body et le header ne sont ni nulles ni undefined 
function dataVerify(...data){  

    for (const element of data) {
        if(!element)  return false;  //Verifie  la condition et renvoie false  
          }
          
    return true;   //Tous est Oke renvoi un true;
   
}



module.exports = dataVerify;