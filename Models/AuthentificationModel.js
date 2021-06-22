const  nanoid = require('nanoid');
// Class pour les requetes de reponses
class HttpResponse{                 
    constructor(data,status) {
            this.data=data;  //data represente les information envoyer au client
            this.status=status;  //status l'état de traitement
    }
} 
// Class pour les requetes entrante 
class HttpRequest {
        constructor(data,dateTime,key,cookie) {
                this.data=data; //data represente les information recus
                this.dateTime=dateTime;
                this.key=key;
                this.cookie=cookie;    
        }       
}

// Class authentification pour les connexions et les Inscriptions
class Authentification{
    constructor(email,password) {
            this.email=email;
            this.password=password;
    }   
}
class SessionCookie{
        constructor(Session_Id,Id_User){
                this.Id_User=Id_User;
                this.Session_Id=Session_Id;                        
        }
}


class SocketConnection{
        constructor(Id_User,socket) {
                this.Id_User=Id_User;
                this.socket =socket;
                this.socket_session_id = socket.id;
                
        }
   
}


module.exports.HttpResponse= HttpResponse;
module.exports.SessionCookie= SessionCookie;
module.exports.SocketConnection=SocketConnection;
  



