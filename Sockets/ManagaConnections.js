const {SocketConnection} = require("../Models/AuthentificationModel");
const {Message}=require('../Models/Messagerie');
const dataVerify = require("../Utils/DataVerification");

const {storeMessage} = require('../MysqlQuery/MessagerieSql');

let ConnectedUsers =[];
let SocketIO;


function mainManageSocket(socket,io){
    SocketIO = io;
   
        socket.on("authentification",(Id_User)=>{
            console.log("socket/authentification",socket.id);
            if(!Id_User) socket.emit("response",{status:204});
                else {
                 const socketID = addUser(Id_User,socket);
                    socket.emit("response",{socketID,status:200});
                }
        })
 
        socket.on("disconnect",()=>{
            console.log("socket/disconnect",socket.id);
            deleteUser(socket.id);
        })
    

        socket.on("onSendMessage",(data)=>{
            console.log("/socket/onSendMessage")
            sendMessage(data,socket);
        })

}



function addUser(id_User,socket){
        const socketConnection = new SocketConnection(id_User,socket);
        ConnectedUsers.push(socketConnection);
        console.log("connected users",ConnectedUsers);
        return socketConnection.socket_session_id;
}

function deleteUser(socketID){
       ConnectedUsers = ConnectedUsers.filter((element)=>element.socket_session_id !=socketID );
}


function getUserSocketId(id_User){
    const array= []
    ConnectedUsers.forEach((element)=>{
        if(element.Id_User == id_User)
            array.push(element.socket_session_id);
    });

    return array;
}




async function sendMessage(data,socket){
        const {userId,messageContent,discussionId} = data;
        if(!dataVerify(userId,messageContent,discussionId)) socket.emit("response",{status:400})
            else {
                  const result = await storeMessage(userId,messageContent,discussionId);
                  if(result == 500) socket.emit("response",{status:500})
                    else {
                        const {id_Message,Id_Discussion,message_sender,message_content,message_date,message_lu,destinataire} = result[0][0];
                        const message = new Message(id_Message,userId,message_content,message_sender,message_date,message_lu);
                        message.discussionId =Id_Discussion;
                        console.log("socket id",destinataire,getUserSocketId(destinataire));
                        socket.emit("onMessage",message)
                        const array = getUserSocketId(destinataire)
                        message.messageSender = message_sender == destinataire;
                        for (const socketid of array) {
                            SocketIO.to(socketid).emit("onMessage",message);
                        }
                        
                    }
            } 
}


module.exports =  mainManageSocket;