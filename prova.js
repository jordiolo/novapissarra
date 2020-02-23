
class Prova {

    constructor(llistaCastellers, plantilla) {

        this.castellers = [];
        this.pinya = [];

     //   this.indexcasteller = 0;
        this.numcastellers = 0;

       // this.indexposicio = 0;
        this.numposicions = 0;

        // Inicialitzem els arrys de posicions i casteller
        let i = 0;

        for (i = 0; i < llistaCastellers.Casteller.length; i++) {

            this.castellers.push(llistaCastellers.Casteller[i]);

        }
        this.numcastellers = i;

        for (i = 0; i < plantilla.Posicions.length; i++) {
            this.pinya.push(plantilla.Posicions[i]);
        }
        this.numposicions = i;
    }






}



