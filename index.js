// Etapa 4
// 1) creare ob server pt 8080
const { render } = require("ejs");
const express = require("express");
// filesystem pt a accesa json-urile 
const fs = require("fs");
const sharp = require("sharp");



app = express();

// ca sa putem sa folosim ejs 
app.set("view engine", "ejs");
console.log("Path:", __dirname);
app.use("/Resources", express.static(__dirname + "/Resources"));

obGlobal = {
    errors: null
}

function createImages() {
    // citire fisier erori json 
    // sincron pt ca asteptam sa se termine operatiile // encodam in utf-8
    var fileContent = fs.readFileSync(__dirname + "/Resources/json/gallery.json").toString("utf8");
    // primire string si transformare ob cu prop din fisier 
    var obj = JSON.parse(fileContent);
    var dim_mediu = 200;

    obGlobal.images = obj.images;
    // aici s-au facut concatenari cu calea pana la imagine 
    obGlobal.images.forEach(function (elem){
        // separare in nume si extensie 
        [fileName, extension] = elem.fisier.split(".");
        // daca nu exista acest folder, il cream 
        if(!fs.existsSync(obj.cale_galerie + "/medium/")) {
            fs.mkdirSync(obj.cale_galerie + "/medium/");
        }
        elem.medium_file = obj.cale_galerie + "/" + fileName + ".webp"
        elem.fisier = obj.cale_galerie + "/medium/" + elem.fisier; 
        // imi da eroare 
        //sharp(__dirname + "/" + elem.fisier).resize(dim_mediu).toFile(__dirname + "/" + elem.medium_file);
    });



    console.log(obGlobal.images);
}
createImages(); 


function createErrors() {
    // citire fisier erori json 
    // sincron pt ca asteptam sa se termine operatiile // encodam in utf-8
    var fileContent = fs.readFileSync(__dirname + "/Resources/json/errors.json").toString("utf8");
    // primire string si transformare ob cu prop din fisier 
    obGlobal.errors = JSON.parse(fileContent);
    // console.log(obGlobal.errors);
}
createErrors(); 

// functia care randeaza erorile // param (ob de tip raspuns, identificator)
function errorRender(res, identificator, titlu, text, imagine) {
    // ob global - fisierul json - ob din json
    // cautam elem care are identificatorul cu cel cerut de functie
    var ero = obGlobal.errors.info_erori.find(function(elem){
        // in elem avem fiecare ob din vectorul info_erori 
        return elem.identificator == identificator;
    })
    // verificare --> ori e titlul setat de mn cand am apelat errorRender ori am returat vreo eroare 
    titlu = titlu || (ero && ero.titlu) || obGlobal.errors.eroare_default.titlu;
    text = text || (ero && ero.text) || obGlobal.errors.eroare_default.text;
    imagine = imagine || (ero && obGlobal.errors.cale_baza + "/" + ero.imagine) || obGlobal.errors.cale_baza + "/" + obGlobal.errors.eroare_default.imagine;
    // daca am statusul setat pentru eroare 
    if(ero && ero.status) {
        // pt eroare de de protocol
        // trimit statusul si randez pagina cu campurile specificate 
        res.status(identificator).render("pages/eroare", {titlu:titlu, text:text, imagine:imagine});
    }
    else {
        res.render("pages/eroare", {titlu:titlu, text:text, imagine:imagine});

    }
}

// 6 sa mearga pagina principala pe get-uri 
app.get(["/","/index", "/home"], function(req, res){
    console.log("ceva");
    // res.sendFile(__dirname + "/index.html");
    // obGlobal.images este un vector 
    res.render("pages/index", {ip: req.ip, images: obGlobal.images});
});

// 10 
app.get("/*.ejs", function(req, res){
    errorRender(res, 403);
});

// "/*" orice extensie si orice nume de fisier
// obtinem numele paginii din textul cererii 
app.get("/*", function(req, res){
    console.log("url:", req.url);
    // res.sendFile(__dirname + "/index.html");
    // functie de post-procesare dupa ce a generat html-ul se intra in fct asta unde poate mai face modificari asupra hmlt-ului
    res.render("pages" + req.url, function(err, resRender){
        // console.log("Error", err);
        // console.log("Render result", resRender);

        if(err) {
            // daca nu gaseste pagina, randam 404
            if(err.message.includes("Failed to lookup view"))
                errorRender(res, 404, "custom title");
            else {

            }
        }
        else {
            // vedem rezultatul pt randare, adica intregul html
            res.send(resRender);
        }

    });
});

app.listen(8080);
console.log("Serverul a pornit!");


// 1:21:24 cuurs 14 nov 