import * as jsPDF from 'jspdf';
import { createHeader } from './htmlutil';

// const html = require('../../assets/template.html');

export const generateOrder = () => {
  // const reader = new FileReader();
  // const div = new HTMLDivElement();
  const pdf = new jsPDF('p', 'px', 'letter');

  /*reader.onload = (e: any) => {
        debugger;
        div.innerHTML = e.target.result;
    };

    reader.readAsText(html);

    pdf.fromHTML(div, 0, 0);
    */

  pdf.fromHTML(createHeader('ORDEN DE SERVICIO - MANTENIMIENTO MECANICO'), 0, 0);
};
