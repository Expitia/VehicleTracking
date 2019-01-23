import jsPDF from "jspdf";

const doc = new jsPDF();
const logo = require("../../assets/img/logoPDF.png");
const game = require("../../assets/img/logoGAME.png");

function getImgFromUrl(logo, callback) {
  var img = new Image();
  img.src = logo;
  img.onload = function() {
    callback(img);
  };
}
//Agregamos el icono principal
getImgFromUrl(logo, function(img) {
  doc.addImage(img, "pdf", 5, 10, 35, 25, "", "FAST", 0);
});
doc.setFontSize(14);
doc.text("ORDEN DE SERVICIO - MANTENIMIENTO MECANICO", 40, 25);
//Agregamos el icono de GAME
getImgFromUrl(game, function(img) {
    doc.addImage(img, "pdf", 175, 10, 28, 25, "", "FAST", 0);
  });

export default doc;
