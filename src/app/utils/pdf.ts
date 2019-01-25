import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

const doc = new jsPDF('p', 'pt', 'letter') as any;

const logo = require('../../assets/img/logoPDF.png');
const game = require('../../assets/img/logoGAME.png');

function getImgFromUrl(pdfLogo, callback: Function) {
  const img = new Image();
  img.src = pdfLogo;
  img.onload = function() {
    callback(img);
  };
}

// Agregamos el icono principal
getImgFromUrl(logo, function(img) {
  doc.addImage(img, 'pdf', 5, 10, 35, 25, '', 'FAST', 0);
});

doc.setFontSize(14);
doc.text('ORDEN DE SERVICIO - MANTENIMIENTO MECANICO', 40, 25);
// Agregamos el icono de GAME
getImgFromUrl(game, function(img) {
  doc.addImage(img, 'pdf', 175, 10, 28, 25, '', 'FAST', 0);
});

/*
doc.table(10, 10, [{ a: 'sa', b: 'ssa' }, { a: 'asa', b: 'asas' }], ['a', 'b'], {
  autosize: true
});
*/

doc.autoTable({
  head: [['a', 'b', 'c']],
  body: [['1', '2', '3'], ['4', '5', '6']]
});

export default doc;
