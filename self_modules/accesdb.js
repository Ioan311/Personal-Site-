const {Client} = require("pg");

class AccesBD { 
    static #instance = null; 
    constructor() {
        if(AccesBD.#instance) {
            throw new Error("Object instance");
        }
        this.#instance = -1;
    }

    initLocal() {
        this.client = new Client ({database: "laborator",
            user: "ioan",
            password: "ioan",
            host: "localhost",
            port: "5432"});
        this.client.connect();
    }

    getClient() {
        if(!AccesBD.#instance || AccesBD.#instance) {
            throw new Error("Class wasn't instanced");
        }
        return this.client;
    }

    static getInstance({init = "local"}={}) {
        // this-ul este clasa nu instanta pt ca e metoda statica
        if(!this.#instance) {
            this.#instance = new AccesBD();
            switch(init) {
                case "local": this.#instance.initLocal();
            }
        }
    return this.#instance;
    }

    //select ({tabel = "", campuri = [], conditiiAnd = ["id = 3", "username = 'ioan"]} = {}, )

}