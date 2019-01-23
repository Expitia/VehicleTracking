const monthsName = [
	"Enero", 
	"Febrero", 
	"Marzo", 
	"Abril", 
	"Mayo", 
	"Junio", 
	"Julio", 
	"Agosto", 
	"Septiembre", 
	"Octubre", 
	"Noviembre", 
	"Diciembre"
];

export let toGTMformat = (dateToShow: Date, hasTime: boolean = false) => {

	let	monthDes = monthsName[dateToShow.getMonth()].substring(-1, 3),
       	dayMonth = (dateToShow.getDate() < 10 ? "0" : "") + dateToShow.getDate(),
		year = dateToShow.getFullYear(),
		hours = dateToShow.getHours(),
		minutes = dateToShow.getMinutes();
		
   return monthDes + " " + dayMonth + ", " + year + (hasTime ? " " + hours + ":" + minutes : "" );
}