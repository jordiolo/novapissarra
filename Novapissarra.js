// Class Pissarra

var Pissarra = class Pissarra {


    constructor(llistatcastellers, plantilla, configuracio) {
        // Creem l' stage i el layer on

        this.castellerSeleccionat = false;
        this.prova = new Prova (llistatcastellers, plantilla);
        this.contestat = false;
        // this.desplarcar = false;

        //this.agafemConfiguracio ( configuracio);

        this.config = configuracio;
        let width = window.innerWidth;
        let height = window.innerHeight;

        this.stage = new Konva.Stage({
            container: 'container',
            width: width,
            height: height
        });

        this.layerPinya = new Konva.Layer();
        this.iniciEntorn(); // Creem l' entorn de treball
        this.iniciaCastellers(); // MOstres el llista de castelles
        this.dibuixaPlantilla ();
        this.mostraLlistatCastellers('Tots', 0);
        this.stage.add(this.layerPinya, this.layerCastellers);
    }


// ********************************************************Inici Entorn ***********
//  Dibuixa l' entorn de treball : Recuadre dels noms, Recuadre de la plantilla
//
//


    iniciEntorn() {

        var rect_nomscastellers = new Konva.Rect({
            x: 20,
            y: 100,
            width: 300,
            height: 600,
            fill: "#dbdbdb",
            cornerRadius: 10,
            id: -1
        });
        // add the shape to the layer

        this.layerPinya.add(rect_nomscastellers);

        var rect_plantilla = new Konva.Rect({
            x: 350,
            y: 100,
            width: 1000,
            height: 600,
            fill: '#dbdbdb',
            cornerRadius: 10,
            id: -1
        });
        this.layerPinya.add(rect_plantilla);

    }

// Dibuixa la planti


    dibuixaPlantilla() {
        for (var i = 0; i < this.prova.numposicions; i++) {
            this.prova.pinya[i].fill = 'Ivory';
            this.prova.pinya[i].stroke = 'black';

            var posicio = new Konva.Rect(this.prova.pinya[i]);
            this.layerPinya.add(posicio);
        }
    }


    iniciaCastellers() {

        this.layerCastellers = new Konva.Layer();

        let nomsCastellers;
        for (var i = 0; i < this.prova.numcastellers; i++) {
            nomsCastellers = new Konva.Text({
                text: this.prova.castellers[i].nom,
                draggable: true,
                visible: false,
                fontSize: 15,
                id: this.prova.castellers[i].id,
                rol: this.prova.castellers[i].rol,
                posicio: this.prova.castellers[i].posicio,
                assistencia: this.prova.castellers[i].assistencia,
            });
            this.layerCastellers.add(nomsCastellers);
        }
    }


    mostraColorsPosicions(opcio) {

        let config = this.config;

        switch (opcio) {
            case 'Fonsblanc':
                this.layerPinya.children.each(function (posicio) {
                    if (posicio.attrs.id != -1) {
                        posicio.setAttrs ({
                            fill: 'Ivory',
                        });
                    }
                });
                break;
            case 'ColorxPosicio':
                this.layerPinya.children.each(function (posicio) {
                    config.ColorsPosicionsPinya.forEach(function (posicioColor) {
                        if (posicioColor.posicio == posicio.attrs.nom) {
                            posicio.setAttrs ({
                                fill: posicioColor.color,
                            });
                        }
                    });
                });
                break;
            case 'ColorxAlcada':
                break;
        }

        this.stage.draw();
    }


    mostraLlistatCastellers(rol = this.rol_actual, assistencia = this.assistencia) {
        this.rol_actual;
        this.assistencia;


        let color;
        let novacolumna = 0;
        let fila = 0;

        this.rol_actual = rol;
        this.assistencia = assistencia;

        this.layerCastellers.children.each(function (Casteller) {

            if (((Casteller.attrs.rol == rol) || (Casteller.attrs.posicio != "") || (rol == "Tots")) && (Casteller.attrs.assistencia & assistencia)) {
                if (Casteller.attrs.assistencia & 1) {
                    color = 'green'
                }
                if (Casteller.attrs.assistencia & 2) {
                    color = 'red'
                }
                if (Casteller.attrs.assistencia & 4) {
                    color = 'orange'
                }
                Casteller.setAttrs  ({
                    'fill': color,
                });

                if (Casteller.attrs.posicio == "") {


                    Casteller.setAttrs  ({
                        'x': 25 + novacolumna,
                        'y': 105 + (fila++ * 20),
                    });
                }
                Casteller.show();
                if (fila === 25) {
                    fila = 0;
                    novacolumna = 150;
                }
            } else {


                Casteller.hide();

            }

        });

        this.stage.draw();
    }

    // clickCasteller
    //
    // Parametres
    //              seleccio: Pasem l'objecte selecionat amb el click

    // Si es el primer click guardem el casteller a this.castellerSeleccionat
    // Si es la segona vegada intentem moure el casteller a la posicio on s'ha fet el click

    clickCasteller(castellerseleccionat) {


        if (!this.castellerSeleccionat) {
            this.castellerSeleccionat = castellerseleccionat;
            this.castellerSeleccionat.fontStyle('bold');
            this.layerCastellers.draw();
            return;

        } else {

            this.castellerSeleccionat.fontStyle('normal');
            this.layerCastellers.draw();

            let objectesotacasteller = pissarra.layerPinya.getIntersection({
                x: castellerseleccionat.attrs.x,
                y: castellerseleccionat.attrs.y
            });
            this.finalMovimentcasteller (this.castellerSeleccionat, objectesotacasteller);
            this.castellerSeleccionat = false;
        }
    }

    clickPosicio(seleccio) {


        this.castellerSeleccionat.fontStyle('normal');
        this.layerCastellers.draw();
        this.finalMovimentcasteller(this.castellerSeleccionat, seleccio);
        this.castellerSeleccionat = false;
    }


    iniciMovimentCasteler(seleccio) {
        let castellerSeleccionat = seleccio.target;

        castellerSeleccionat.moveToTop();

        castellerSeleccionat.setAttrs  ({
            'x': castellerSeleccionat.attrs.x,
            'y': castellerSeleccionat.attrs.y,
            'rotation': 0,
            'fontFamily': 'Arial',
            scaleX: 1,
            scaleY: 1
        });
        this.layerCastellers.draw();
    }


    // finalMovimentCasteller
    //
    //    Funcio que es crida per acabar el moviment
    //
    //      Parametres:
    //              seleccio: Pasem l'objecte sellecionat per el moviment
    //              posiciopinya: Objecte on volem moure el casteller seleccionat

    //  La funcio  mira on volem moure el casteller:
    //      Si no hi ha posicio de pinya a sota torna el casteller al menu de casteller
    //      Si hi ha posicio cridem a posicionar castelelr per tal de col.locar-lo al lloc


    finalMovimentcasteller(castellerSeleccionat, posiciopinya) {

        if (posiciopinya.attrs.id != -1) {   // Mirem si posem el casteller en una posicio correcte
            // la posicio es correcte
            this.posicioOcupada (posiciopinya)
            this.posicionarCasteller('AssignarNovaPosicio', posiciopinya, castellerSeleccionat);
            this.mostraLlistatCastellers();
        } else { //  Hem Arrastrat el casteller on no  hi ha posició a la pinya i per tan l'enviem al menu
            this.posicionarCasteller ('AssignarMenu', "", castellerSeleccionat);
            this.mostraLlistatCastellers();
        }
        this.layerCastellers.draw();
    }


    posicioDarrera(grup, ordre) {

        let llistatposicions = this.layerPinya.getChildren();
        for (let i = 0; i < llistatposicions.length; i++) {
            if ((llistatposicions[i].attrs.grup === grup) && (llistatposicions[i].attrs.ordre === ordre + 1)) {
                return llistatposicions[i];
            }


        }
    }


    posicioOcupada(posicio) {


        let posiciodarrera;
        let llistatcastellers = this.layerCastellers.getChildren();

        for (let i = 0; i < llistatcastellers.length; i++) { // MIrem s per  els castellers si hi ha algun en la posicio on hem arrastrat

            if (llistatcastellers[i].attrs.posicio == posicio.attrs.id) {// La posicio esta ocupada;
                if (posicio.attrs.grup) { // mirem si la posicio forma part d'un grup per veure si hem de moure enrera les posicion
                    if (!this.contestat) {
                        this.contestat = true;
                        if (confirm("Vols moure el casteller actual enrera ? ") == true) {
                            this.desplacar = true;
                        }
                    }
                    if (this.desplacar) {
                        if (posiciodarrera = this.posicioDarrera(posicio.attrs.grup, posicio.attrs.ordre)) {
                            this.posicioOcupada(posiciodarrera);
                            this.posicionarCasteller ('MoureEnrrera', posiciodarrera, llistatcastellers[i]);
                            this.contestat = false;
                            this.desplacar = false;
                            return;
                        }
                    }
                }
                this.contestat = false;
                this.posicionarCasteller('AssignarMenu', "", llistatcastellers[i]);
                return;
            }
        }
        return;
    }


    posicionarCasteller(accio, posiciopinya, casteller) {

        switch (accio) {

            case 'AssignarNovaPosicio':

                let tamanyTextActual = casteller.getClientRect();


                casteller.setAttrs ({
                    'x': posiciopinya.attrs.x,
                    'y': posiciopinya.attrs.y,
                    'rotation': posiciopinya.attrs.rotation,
                    'fontFamily': 'Arial',
                    scaleX: posiciopinya.attrs.width / tamanyTextActual.width,
                    scaleY: posiciopinya.attrs.height / tamanyTextActual.height,
                    posicio: posiciopinya.attrs.id,
                    //  fontStyle: 'bold',
                });

                return;

            case 'MoureEnrrera' :

                casteller.setAttrs ({
                    'x': posiciopinya.attrs.x,
                    'y': posiciopinya.attrs.y,
                    'rotation': posiciopinya.attrs.rotation,
                    'fontFamily': 'Arial',
                    //  scaleX: posiciopinya.attrs.width / tamanyTextActual.width,
                    //  scaleY: posiciopinya.attrs.height / tamanyTextActual.height,
                    posicio: posiciopinya.attrs.id
                });
                return;

            case 'AssignarMenu' :

                casteller.setAttrs  ({
                    'rotation': 0, //posiciopinya.attrs.rotation,
                    'fontFamily': 'Arial',
                    scaleX: 1,
                    scaleY: 1,
                    posicio: "",
                    //   fontStyle: 'normal',
                });
        }

    }


    ObtenirJSONPinya() {
        let pinyaJSON = [];
        this.layerCastellers.children.each(function (Casteller) {

            pinyaJSON.push({
                id: Casteller.attrs.id,
                nom: Casteller.attrs.text,
                posicio: Casteller.attrs.posicio,

            });
        });
        return pinyaJSON;
    }
}
