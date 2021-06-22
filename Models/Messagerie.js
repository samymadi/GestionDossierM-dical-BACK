class Discussion{


    constructor(userID,discussionId,nom,privileges,messageSender,messageContent,messageDate,messageLu,accept,block,createur) {
            this.discussionId=discussionId;
            this.nom=privileges == 3 ? `Labo ${nom}` : (privileges == 2 ? `Dr.${nom}`: nom); 
            this.messageContent=messageContent;
            this.messageSender = messageSender == userID;
            this.messageDate=new Date(messageDate).toGMTString().substring(0,22);
            this.messageLu = messageLu == 1;
            this.accept = accept === 1;
            this.block = block === 1;
            this.createur = userID == createur;
        
    }
    
}


class Message{
    constructor(IdMessage,id_User,messagContent,messageSender,messageDate,messageLu) {
        this.IdMessage=IdMessage;   
        this.messageContent=messagContent;
        this.messageSender=id_User == messageSender
        this.messageDate=new Date(messageDate).toGMTString().substring(0,22);
        this.messageLu= messageLu  == 1;

    }
    
}



class UserDiscussion{
        constructor(idUser,nom,privileges) {
            this.idUser=idUser;
            this.nom=this.customName(nom,privileges);
        }

        customName(nom,privileges){
                if(privileges == 2) 
                    return `Dr.${nom}`
                        else if(privileges == 3)
                            return `Labo ${nom}`;
                                else return nom;
        }
        
}


module.exports ={
    Discussion,
    UserDiscussion,
    Message
}