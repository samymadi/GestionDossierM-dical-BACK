const express = require('express');
const http = require('http');
const cors = require('cors');
const socket = require('socket.io');
const db = require("./DataBaseConnection");
const dataVerify = require('./Utils/DataVerification');

const mainManageSocket = require('./Sockets/ManagaConnections');
// ---------------------------------------------------
const authentification = require("./Routes/Authentification");
const user = require('./Routes/User');
const DossierMedical = require('./Routes/DossierMédical');
const Dashboard = require('./Routes/Dashboard');
const Messagerie = require('./Routes/Messagerie');



db.connect((err)=>{
    console.log(err || "Connected");
})
const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use(express.json());
app.use(cors());






// ----------------Routes--------------------



app.use((req,res,next)=>{
    console.log("Middleware authentification",req.headers['content-type']);  
    
    if( req.headers['content-type'] &&  req.headers['content-type'].substring(0,19) === "multipart/form-data"){
      
             next();
    }else    
    {const {key,cookie,dateTime,data}= req.body;
    
    if(!dataVerify(key,cookie,dateTime,data)) res.sendStatus("400");    //Verifier les donnes renvoyer code 400 
       else if(req.body.key !== "ServerCode") res.sendStatus("401");  // si le code est faux ignorer la requete
            else next();   
        } 
})






app.use("/authentification",authentification);  // Route Authentification  
app.use("/Account",user)                        //Account   Route
app.use("/MedDoc",DossierMedical);              //Dossier Medical Route   
app.use("/Dashboard",Dashboard)                 //DashBoard route 
app.use("/Messagerie",Messagerie);              //Messagerie Route




io.on('connection', (socketId) => {
        console.log("connected user ",socketId.id);
        mainManageSocket(socketId,io);
  });

 


server.listen(process.env.PORT || 8000,()=>{
        
    console.log("Server started on port: " + (process.env.PORT || 8000));
} )


