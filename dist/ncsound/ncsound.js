/**
 *  Audio JS for Art Generator
 *  Final project for KTH course DH2321 Information Visualization by M. Romero
 *
 * Arhur Câmara            arthurcamara@gmail.com
 * Vera Fuest              vera.fuest@hotmail.de
 * Mladen Milivojevic      milivojevicmladen@gmail.com
 * Nora Tejada             ntexaa@gmail.com
 * Midas Nouwens           nouwens@kth.se
 * Konstantina Pantagaki   konstantina.pantagaki@gmail.com
 * Alexandre Andrieux      andrieux@kth.se
 *
 * Feb. 2015
 *
 */

// Platform compatibility
//navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

// NCSOUND object
var NCSOUND = {};
NCSOUND.analyser = null;


NCSOUND.init= function(context, source){
    this.analyser=new Meyda(context, source, 512);
    console.log("Entra2");
}


NCSOUND.get = function(feature) {
       //if an array is received, combine results into an array
           console.log("Entra3");
       if(_.isArray(feature)) {
             var results = [];
             for(var i = 0; i<feature.length; i++) {
                     results[i] = this.get(feature[i]);
             }
             return results;
       }
       
       //otherwise, its not an array
       var value;
       switch(feature) {
            //we add our features...
             case "silence":
                    value = 0
                    break;
             case "speed":
                    value = 1
                    break;
             //in case its not a customized feature, try meyda default ones
             default:
                    value = this.analyser.get(feature);
                    break;

       }
       return value;
}
