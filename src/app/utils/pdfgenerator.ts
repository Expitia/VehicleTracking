// jsAutotable: https://github.com/simonbengtsson/jsPDF-AutoTable

import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

export const createPDFTable = (
    title: String,
    header: Array<String>,
    content: Array<Array<String>>
) => {
    const pdfDocument = new jsPDF('l', 'px', 'letter') as any;
    const leftLogo = new Image();
    const rightLogo = new Image();

    leftLogo.src = '../../assets/img/LogoPDF.png';
    rightLogo.src = '../../assets/img/LogoGAME.png';

    pdfDocument.autoTable({
        head: [header],
        body: content,
        didDrawPage: data => {
            pdfDocument.addImage(
                leftLogo,
                'PNG',
                data.settings.margin.left,
                15,
                Math.round(leftLogo.width * 0.3),
                Math.round(leftLogo.height * 0.3)
            );
            pdfDocument.text(
                ['Nombre de la compañia', title],
                leftLogo.width - data.settings.margin.left - 10,
                25
            );
            pdfDocument.addImage(
                rightLogo,
                'PNG',
                data.table.width - data.settings.margin.left,
                15,
                Math.round(leftLogo.width * 0.3),
                Math.round(leftLogo.height * 0.3)
            );
        },
        margin: { top: leftLogo.height * 0.3 + 20 }
    });

    pdfDocument.save(`report_${title}.pdf`);
};
