window.addEventListener("load", function() {
    /* 
    CAPTURING & BUBBLING
    addEvenListener este pentru propagarea evenimentelor, iar evenimetul se propaga la 
    container si tot asa pana la document
    */
    x = 100
    // pret minim range bar
    document.getElementById("inp-pret").onchange = function() {
        console.log(this.value);
        // pt valoare inputului
        document.getElementById("infoRange").innerHTML = `(${this.value})`
    }

    /* continutul inputurilor le accesam cu .value iar continutul elem care au text intre tag-urile e deschidere
       inchidere le accesam cu innerHTML */
    // facem un eveniment onClick
    document.getElementById("filter").onclick = function() {
        // verificare inputuri
        validation = true;
        var inpNume = document.getElementById("inp-nume").value.toLowerCase().trim(); // am selectat valoarea asta / am facut sirul cu val mici / am sters spatiile
        validation = validation && inpNume.match(new RegExp("^[a-zA-Z]*$"))
        if(!validation) { // daca validarea nu e respectata adica sa fie true si sa fie cu litere de la a-Z
            alert("Incorrect input");
            return;
        }
    
        var inpMaterial = document.getElementById("inp-categorie").value; 
        var produse = document.getElementsByClassName("produs"); 
        for(let produs of produse) { // iteram prin produse -- luam pe rand fiecare element 
            var cond1 = false;
            var cond2 = false;
            // facem produsul invizibil 
            produs.style.display = "none"; 
            // o functie care ia elem cu clasa val-nume chiar din produs 
            let name = produs.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase().trim(); // ne intereseaza primul pentru ca stim ca este singurul  
            if(name.includes(inpNume)) { // daca numele produsului din articol(html) include inpNume(inputul)
                cond1 = true;
            }
            
            // o functie care ia ele cu clasa val-material chiar din produs 
            let material = produs.getElementsByClassName("val-material")[0].innerHTML; 
            if(inpMaterial == "toate" || material == inpMaterial) { // daca materialul selectat este ca cel din input se face filtrarea
                cond2 = true;
            }

            if(cond1 && cond2) { // facem produsul vizibil daca s-a indeplinit conditia de mai sus
                produs.style.display = "block";
            }
        }
    }
    // functia de resteare a filtrelor 
    document.getElementById("resetare").onclick = function() {
        // luam fiecare produs din clasa produs si facem RESETARE PRODUSE
        var produse = document.getElementsByClassName("produs");
        for(let produs of produse) { // iteram prin produse -- luam pe rand fiecare element 
            produs.style.display = "block"; // afisez pe toata lumea din nou -- pt ca afisarea in article a de tip block
        }
        // resetare filtre
        document.getElementById("inp-nume").value = ""; // inputul nume = sir vid    
        document.getElementById("sel-toate").selected = true; // selectez optiunea pe care vreau sa o bifez --> deci by default sa se afiseze toate produsele // selected = un atribut e selected
        document.getElementById("inp-pret").value = 0; 
        document.getElementById("infoRange").innerHTML = '(0)';
    }

    // functia de sortare crescatoare a filtrelor
    // se face in functie de pret intai si apoi in functie de nume
    document.getElementById("sortCrescNume").onclick = function() {
        var produse = document.getElementsByClassName("produs"); // preiau produsele pt ca pe astea vrem sa le sortam
        var v_produse = Array.from(produse); // vreau produsele sa le vad ca pe un vector ca sa fac o sortare
        // in Array avem metoda sort --> de aia folosim || obtinem un vector dintr-un obiect iterabil

        v_produse.sort(function(a,b){ // a, b sunt elem ale lui produse // sunt articole    
            // innerHTML e implicit string, asa ca folosim parseFloat ca sa-l convertim 
            var price_a = parseFloat(a.getElementsByClassName("val-price")[0].innerHTML);
            var price_b = parseFloat(b.getElementsByClassName("val-price")[0].innerHTML);
            if(price_a == price_b) { // cand preturile sunt egale // trebuie sa verific numele lor
                var name_a = a.getElementsByClassName("val-nume")[0].innerHTML;
                var name_b = b.getElementsByClassName("val-nume")[0].innerHTML;
                return name_a.localeCompare(name_b); /* localCompare face --> daca sir1 < sir2 returneaza -1 
                                                                          --> daca sir1 = sir2 return 0 
                                                                          --> daca sir1 > sir2 return 1                                        
                */                    
            }
            return price_a - price_b; // sorteaza dupa pret
        })
        for(let produs of v_produse) { 
            // parentNode este pt produs elem care il contine 
            produs.parentNode.appendChild(produs); // le adaugam in ordinea din v_produse (adica ordinea sortata)
        }
    }

    // sortare descrescatoare 
    function sort(signal) { // dau acest param signal care va fi +1 sau -1 in functie de crescator sau descrescator
        var produse = document.getElementsByClassName("produs");
        var v_produse = Array.from(produse);

        v_produse.sort(function(a,b){
            var price_a = parseFloat(a.getElementsByClassName("val-price")[0].innerHTML);
            var price_b = parseFloat(b.getElementsByClassName("val-price")[0].innerHTML);
            if(price_a == price_b) {
                var name_a = a.getElementsByClassName("val-nume")[0].innerHTML;
                var name_b = b.getElementsByClassName("val-nume")[0].innerHTML;
                return signal*name_a.localeCompare(name_b); // deci rezultatul il inmultim cu signal
            }
            return (price_a - price_b) * signal;
        })
        for(let produs of v_produse) {
            produs.parentNode.appendChild(produs); 
        }
    }
    document.getElementById("sortCrescNume").onclick = function() { 
            sort(1); // apelam sorteaza cu 1 pt crescator
    }
    document.getElementById("sortDescrescNume").onclick = function() {
        sort(-1); // apelam sorteaza cu -1 pt descrescator  
    }
    
    // key pressing response 
    // onkeypress ia evenimentul dupa ce a luat degetul de pe tasta
    window.onkeydown = function(e) {
        console.log("Key down: ");
        if(e.key = 'c' && e.altKey) { // verific daca a apasat tasta c // si verificam daca tasta alt e apasata 
            var produse = document.getElementsByClassName("produs"); // selectam iar toate produsele 
            let mean = 0; // media este egala cu 0 
            for(let prod of produse) { // iteram iar prin produse 
                if(prod.style.display != "none") // daca exista produsul 
                    mean = (mean + parseFloat(prod.getElementsByClassName("val-price")[0].innerHTML) / produse.length); // calculam media 
            }
            if(!document.getElementById("result")) { // vream sa cream elem numai cand nu exista cnv cu id-ul rezultat 
                // daca nu exista elem returneza null 
                result = document.createElement("p"); // creem un rezultat de tip paragraf
                result.id = "result"; // setam un id 
                result.innerHTML = "<b>Total price:</b>" + mean; // ii setam si textul
                // document.body.appendChild(result);
                var ps = document.getElementById("p-mean"); // il punem intr-o variabila
                ps.parentNode.insertBefore(result,ps.nextSibling); // inseram in fata fratelui de mai jos // noi vrem in containerul
                // lui p-mean sa adaugam de aia folosim parentNode 
                // in parintele paragrafului cu texult alc-c inseram in fata fratelui urmator al acestui paragraf rezultatul
                result.style.border = "1px solid purple";
                result.onclick = function() { // stergem paragraful la click 
                    this.remove();
                }
                setTimeout(function(){ // stergem paragraful dupa un anumit numar de secunde 
                    document.getElementById("result").remove();
                }, 2000);
                // set interval va apela repetitiv la fiecare interval de timp
                // setInterval(function(){alert(1);}, 3000);
            }
        }
    }

    // radio button 
    /*
    var radiobuttons = document.getElementsByName("gr-rad");
    string = "";
    for(let rad of radiobuttons) {
        if(rad.checked) {
            string = rad.value;
            break;
        }
    } */

    document.getElementById("i_rad").onclick = function() {
    let radiobuttons = document.getElementsByName("gr-rad");
    string = "";
    for(let rad of radiobuttons) {
        if(rad.checked) {
            string = rad.value;
            break;
        }
        var cond3 = false;
        let material = produs.getElementsByClassName("val-material")[0].innerHTML; 
        if(radiobuttons == "toate" || material == radiobuttons) {
            cond3 = true;
        }
    }
    }
    // aici nu mi-a iesit 

    var options = document.getElementById("inp-multiple").options;
    string2 = "";
    for(let opt of options) {
        if(opt.selected)
            string1+=opt.value+" ";
    }
    document.getElementById("i-datalist").value;
});