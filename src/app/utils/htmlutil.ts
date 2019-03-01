// partes html para la creación de pdfs

export const createHeader = (title: string): HTMLDivElement => {
    const div = new HTMLDivElement(), // interfaz -> reemplazar
        table = new HTMLTableElement(),
        row = new HTMLTableRowElement(),
        logo1Cell = new HTMLTableCellElement(),
        logo2Cell = new HTMLTableCellElement(),
        titleCell = new HTMLTableCellElement(),
        logo1 = new Image(120, 100),
        logo2 = new Image(110, 100);

    logo1.src = '../../assets/img/LogoPDF.png';
    logo1.alt = 'left-logo';

    logo2.src = '../../assets/img/LogoGAME.png';
    logo2.alt = 'right-logo';

    logo1Cell.appendChild(logo1);
    logo2Cell.appendChild(logo2);
    titleCell.append(title);

    row.appendChild(logo1Cell);
    row.appendChild(titleCell);
    row.appendChild(logo2Cell);

    table.id = 'header';
    table.appendChild(row);

    div.appendChild(table);
    return div;
};
