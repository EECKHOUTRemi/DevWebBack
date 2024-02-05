const express = require('express');
const {MongoClient} = require('mongodb');
const bodyParser = require('body-parser');

const uri = "mongodb+srv://RemiEeckhout:Remeck2004@devwebback.guq6q5j.mongodb.net/?retryWrites=true&w=majority";

const app = express();
app.use(bodyParser.json());
const port = 3000;

app.use((req, res, next) => {
    console.log(`Requête reçue : ${req.method} ${req.url} ${JSON.stringify(req.body)}`);
    next();
});

const client = new MongoClient(uri);

client.connect(err =>{
    console.log("Tentative de connection.")
    if (err) {
        console.log("Erreur de la connection à la base de données.");
    } else {
        console.log("Connection réussie.");
    }
});

app.post('/utilisateurs',(request,response) => {
    const {id, prenom, nom} = request.body;
    if (!id || !prenom || !nom) {
        return response.status(400).json({erreur : "Veuillez fournir un nom et un prénom"});
    }

    const nouvelUtilisateur = {id, prenom, nom};
    const collection = client.db("MyDb").collection("utilisateurs");

    try {
        const result = collection.insertOne(nouvelUtilisateur);
        console.log("Utilisateur ajouté avec succès !");
        response.status(201).json(nouvelUtilisateur);
    }
    catch (error){
        console.error("Erreur lors de l'ajout de l'utilisateur.", error);
        response.status(500).json({erreur : "Erreur lors de l'ajout de l'utilisateur."});

    }
});

app.get('/utilisateurs', (request, response) => {
    const collection = client.db("MyDb").collection("utilisateurs");
    collection.find().toArray((err, utilisateurs) => {
        if (err) {
            console.error("Erreur lors de la recherche des utilisateurs.", error);
            response.status(500).send("Erreur interne du serveur");
        } else {
            response.json(utilisateurs);
        }
    });
});

app.listen(port, ()=> {
    console.log(`Serveur en cours d'execution sur le port : ${port}.`)

});

client.close();