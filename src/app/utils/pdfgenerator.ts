import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

const logo = require('../../assets/img/logoPDF.png');
const game = require('../../assets/img/logoGAME.png');

export const createPDFTable = (
  header: Array<String>,
  content: Array<Array<String>>
) => {
  const pdfDocument = new jsPDF('l', 'pt', 'letter') as any;

  pdfDocument.autoTable({
    head: [header],
    body: content,
    didDrawPage: data => {
      getImgFromUrl(logo, img => {
        pdfDocument.addImage(img, 'pdf', 5, 10, 35, 25, '', 'FAST', 0);
      });

      pdfDocument.setFontSize(14);
      pdfDocument.text('ORDEN DE SERVICIO - MANTENIMIENTO MECANICO', 40, 25);

      getImgFromUrl(game, img => {
        pdfDocument.addImage(img, 'pdf', 175, 10, 28, 25, '', 'FAST', 0);
      });
    }
  });

  pdfDocument.save('report.pdf');
};

function getImgFromUrl(pdfLogo, callback: Function) {
  const img = new Image();
  img.src = pdfLogo;
  img.onload = function() {
    callback(img);
  };
}
