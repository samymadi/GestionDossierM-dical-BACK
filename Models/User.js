class User {
    constructor(nom,prenom,dateNaissance,lieuNaissance,adresse,telephone,sexe) {
            this.nom=nom;
            this.prenom=prenom;
            this.dateNaissance=dateNaissance;
            this.lieuNaissance=lieuNaissance;
            this.adresse=adresse;
            this.telephone=telephone;
            this.sexe=sexe;     
        
    }
}



class Patient {
    constructor(Id_Patient,nom,prenom,droit) {
        this.Id_Patient=Id_Patient;
        this.nom=nom;
        this.prenom=prenom;
        this.droit =droit;
    }
    
}


class Dossier{
    constructor(DossierId,DossierName,CreationDate) {
        this.DossierId=DossierId;
        this.DossierName=DossierName;
        this.CreationDate= new Date(CreationDate).toGMTString().substring(0,22); 
    }
    
}


class Document{
    constructor(documentId,creationDate,labo_medecinName,documentType,titre,description) {
        this.documentId=documentId;
        this.creationDate=creationDate;
        this.labo_medecinName=labo_medecinName;
        this.documentType = documentType;
        this.titre =titre;
        this.description=description;
    }
    
}


class AvisMedecin {
    constructor(avisId,dateAvis,contenu,nom) {
        this.avisId =avisId;
        this.dateAvis =dateAvis;
        this.contenu = contenu
        this.nom=nom;
        
    }
    
}


class Rappel{
    constructor(rappelId,title,description,dateFor) {
            this.rappelId=rappelId;
            this.title=title;
            this.description=description;
            this.dateFor = new Date(dateFor).toGMTString().substring(0,22);
        
    }
    
}

module.exports.User = User ;
module.exports.Patient=Patient;
module.exports.Dossier=Dossier;
module.exports.Document = Document;
module.exports.AvisMedecin = AvisMedecin;
module.exports.Rappel =Rappel;