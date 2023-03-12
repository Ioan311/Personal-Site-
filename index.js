// Etapa 4
// 1) creare ob server pt 8080 
const { render } = require("ejs");
const express = require("express");
// filesystem pt a accesa json-urile 
const fs = require("fs");
const sharp = require("sharp");
const sass = require("sass");
const formidable = require("formidable");
const {User} = require("./self_modules/user.js")
var cssBootstrap = sass.compile(__dirname + "/Resources/SCSS/custom.scss", {sourceMap:true});
// sourceMap este pt a putea sa facem debug in browser
fs.writeFileSync(__dirname + "/Resources/CSS/libraries/custom.css", cssBootstrap.css);
// Etapa 5

const {Client} = require("pg");
var client = new Client({
    database:"website",
    user:"ioann",
    password:"ioan",
    host:"localhost",
    port:5432
});
client.connect();
// query 
client.query("select * from unnest(enum_range(null::big_category))", function(err, rez){
    if(err)
        console.log(err);
    else 
        console.log(rez);
});

app = express();

// ca sa putem sa folosim ejs 
app.set("view engine", "ejs");
console.log("Path:", __dirname);
app.use("/Resources", express.static(__dirname + "/Resources"));


obGlobal = {
    errors: null,
    menuOptions: null 
}
/*
client.query("select * from wheels", function(err, rez){
    if(err)
        console.log(err);
    else 
        console.log(rez);
});*/

client.query("select * from reviste", function(err, rez){
    if(err)
        console.log(err);
    else 
        console.log(rez);
});

app.use("/*", function(req, res, next){
    menuOptions = "Something!";
    res.locals.option = menuOptions;
    next();
})

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
    res.render("pages/index", {ip: req.ip, images: obGlobal.images, menuOptions: obGlobal.menuOptions});
});
// pt pagina de produse
app.get("/produse", function(req, res){ // filtrare la nivel de server 
    console.log(req.query);
    //The UNNEST function takes an ARRAY and returns a table with a row for each element in the ARRAY.
    client.query("select * from unnest(enum_range(null::big_category))", function(err, rezCateg) {
        contQuery = ""
        if(req.query.tip)
            // prin query se face filtrarea la nivel de server
            contQuery+=`and material='${req.query.tip}'`   // "tip=''" + req.query.tip + "''" // produse?.. 
        client.query("select * from wheels where 1=1" + contQuery, function(err, rez){
            if(err) { // daca avem eroare
                console.log(err);
                errorRender(res, 2); 
            }
            else 
                res.render("pages/produse", {produse: rez.rows, optiuni: rezCateg.rows, menuOptions: obGlobal.menuOptions});
        });
    });
});
// pt pagina unui singur produs 
/*
    :id este un parametru de query 
    daca punem : si apoi un text devine parametru 
*/
app.get("/produs/:id", function(req, res){
    client.query("select * from wheels where id="+req.params.id, function(err, rez){ // where id = (pt ca vrem doar pt un anumit id)
        if(err) {
            console.log(err);
            errorRender(res, 2); 
        }
        else 
            res.render("pages/produs", {prod: rez.rows[0], menuOptions: obGlobal.menuOptions});
    });
});

////////// Users //////////
app.post("/inregistrare",function(req, res){
    var username;
    console.log("ceva");
    // formidable este un modul care lucreaza cu formulare
    // pentru a putea lucra cu imagini
    var formular= new formidable.IncomingForm()
    formular.parse(req, function(err, campuriText, campuriFisier ){
        console.log(campuriText); 
        var eroare="";
        var newUser = new User();

        try {
            newUser.setName(campuriText.first_name);
            newUser.setUsername(campuriText.username);
        } catch(e) {eroare+=e.message}

        if(!eroare){
           
        }
        else
            res.render("pages/inregistrare", {err: "Eroare: "+eroare});
    });
    // .on ---> eveniment onClick / onSubmit / ... sunt evenimente
    formular.on("field", function(nume,val){  // 1
   
        console.log(`--- ${nume}=${val}`);
       
        if(nume=="username")
            username=val;
    })
    formular.on("fileBegin", function(nume,fisier){ //2
        console.log("fileBegin");
       
        console.log(nume,fisier);
        //TO DO in folderul poze_uploadate facem folder cu numele utilizatorului

    })    
    formular.on("file", function(nume,fisier){//3
        console.log("file");
        console.log(nume,fisier);
    });
});

/////////

///PAGINA DE REVISTE
/*
client.query('SELECT * FROM reviste', (err, reviste) => {
    if (err) throw err;
  
    // Preluare informații despre fiecare revistă
    reviste.forEach(revista => {
      const { id, titlu, tematici, aparitie, pret, numar_pagini } = revista;
  
      // Afișare informații despre fiecare revistă în formatul specificat
      console.log(`
        <article class="revista" id="idr-${id}">
          <h2><i><u>${titlu} (${numar_pagini})</u></i></h2>
          <p>Tip apariție: ${aparitie}</p>
          <p>Preț: ${pret}</p>
          <ul>
            Tematici:
            ${tematici.split(',').map(tematica => `<li>${tematica}</li>`).join('')}
          </ul>
        </article>
      `);
    });
  });
*/

/* facem split sa le separam prin / string urile 
   iar map itereaza prin fiecare elem si returneaza un elem li pt fiecare tematica din array-ul split
   join concateneaza
*/

app.get('/reviste', (req, res) => {
    client.query('SELECT * FROM reviste', (err, result) => { 
      if (err) {
        res.status(500).send(err);
      } else { // daca nu exista eroare trimitem datele revistelor
        let reviste = '';
        // acm trb sa interogam prin fiecare rand 
        // revista = un rand din rezultat / un ob js care contine datele unei reviste
        result.rows.forEach(revista => { 
          reviste += `
          <article class="revista" id="idr-${revista.id}"> 
            <h2><i><u>${revista.titlu} (${revista.numar_pagini})</u></i></h2>
            <p>Apariție: ${revista.aparitie} | <b id="pret">Preț: ${revista.pret}</b></p>
            <ul>
              ${revista.tematici.split('/').map(tematica => `<li>${tematica}</li>`).join('')}
            </ul>
          </article>
          `;
        });
        
        res.send(`
          <html>
            <head>
              <title>Reviste</title>
              <style>
                #grid {
                    display: grid; 
                    grid-template-columns: repeat(3, 1fr);
                }
                .revista:nth-child(1) {
                    background-color: blue;
                }
                .revista:nth-child(2) {
                    background-color: blue;
                }
                .revista:nth-child(3) {
                    background-color: blue;
                }
                .revista:nth-child(7) {
                    background-color: blue;
                }
                .revista:nth-child(8) {
                    background-color: blue;
                }
                .revista:nth-child(9) {
                    background-color: blue;
                }
                .revista:nth-child(13) {
                    background-color: blue;
                }
                .revista:nth-child(14) {
                    background-color: blue;
                }
                .revista:nth-child(15) {
                    background-color: blue;
                }
                .revista b:hover {
                    background-color: red; 
                    color: white;
                    font-weight: bold;
                    transition: background-color 2s ease;  // ease pentru slow start - fast - end slowly -- iz
                }
              </style> 
            </head>
            <body>
            <form action="/reviste" method="post"> 
                <div>
                    <input type="radio" name="sort" value="cresc" id="cresc"> <!-- bulina crescatoare -->
                    <label for="cresc">cresc</label>
                    <input type="radio" name="sort" value="descresc" id="descresc"> <!-- bulina descrescatoare -->
                    <label for="descresc">descresc</label>
                </div>
                <button type="submit">sortează</button>
                <div>
                    <input type="checkbox" name="tematici" value="sport" id="sport" checked>
                    <label for="sport">sport</label>
                    <input type="checkbox" name="tematici" value="tehnica" id="tehnica">
                    <label for="tehnica">tehnica</label>
                    <input type="checkbox" name="tematici" value="stiinta" id="stiinta">
                    <label for="stiinta">știință</label>
                    <input type="checkbox" name="tematici" value="alta" id="alta">
                    <label for="alta">alta</label>
                </div>
                <button type="submit">filtrează</button>
            </form>
                <div id="grid">
                    ${reviste}
                </div>
            </body>
          </html>
        `);
      }
    });
});
/*
app.post('/reviste', (req, res) => {
    let { sort, tematici } = req.body;
  
    client.query('SELECT * FROM reviste', (err, result) => { 
        if (err) {
            res.status(500).send(err); 
        } else {
            let reviste = result.rows;
            let reviste_l = Array.from(reviste);
            if (sort === 'cresc') {
                reviste_l.sort(function(a, b){
                    return ((a.pret / a.numar_pagini) - (b.pret / b.numar_pagini))
                })
            } else if (sort === 'descresc') {
                reviste_l.sort(function(a, b){
                    return ((b.pret / b.numar_pagini) - (a.pret / a.numar_pagini))
                })

*/

/* facem o eticheta formular care colecteaza informatii
    action la submiterea formularului trimite catre /reviste
    method --- metoda https 
*/

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