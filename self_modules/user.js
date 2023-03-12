//const AccesBD=require('./accesbd.js');

class User{
    static connectionType = "local";
    #erorr;

    constructor({id, username, first_name, last_name, email, rolee, chat_color="black", profile_pic} = {}) {
        this.id = id;

        //optional sa facem asta in constructor
        /*try {
            if(this.checkUsername(username)) this.username = username;
        } catch(e) {this.#eroare = e.message}*/

        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.rolee = rolee; //TO DO clasa Rol
        this.chat_color = chat_color;
        this.profile_pic = profile_pic;

        this.#erorr = "";
    }

    checkName(first_name) {
        return first_name != "" && first_name.match(new RegExp(/^[A-Z][a-z]+$/));
    }

    set setName(first_name) {
        if (checkName(first_name)) this.first_name = first_name
        else {
            throw new Error("Wrong name");
        };
    }

    checkUsername(username) {
        return username != "" && username.match(new RegExp(/^[A-Za-z0-9]$/));
    }

    set setUsername(username) {
        if (checkUsername(username)) this.username = username
        else {
            throw new Error("Wrong username");
        };
    }

/*
    async trimiteMail(subiect, mesajText, mesajHtml, atasamente=[]){
        var transp= nodemailer.createTransport({
            service: "gmail",
            secure: false,
            auth:{//date login 
                user:obGlobal.emailServer,
                pass:"rwgmgkldxnarxrgu"
            },
            tls:{
                rejectUnauthorized:false
            }
        });
        //genereaza html
        await transp.sendMail({
            from:obGlobal.emailServer,
            to:email, //TO DO
            subject:subiect,//"Te-ai inregistrat cu succes",
            text:mesajText, //"Username-ul tau este "+username
            html: mesajHtml,// `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${username}.</p> <p><a href='http://${numeDomeniu}/cod/${username}/${token}'>Click aici pentru confirmare</a></p>`,
            attachments: atasamente
        })
        console.log("trimis mail");
    }
   */ 
}

// exportam clasa {} intre acolade avem un obiect {numele_proprietatii:valoarea}
module.exports = {User:User}