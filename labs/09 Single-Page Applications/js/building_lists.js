
var request = new XMLHttpRequest();
request.open('GET', 'data/books.json', false);
request.send(null);
var data = JSON.parse(request.responseText);
console.log(data);

var books = data.books;

var list = document.createElement('table');
var rowa = document.createElement('tr');
var rowb = document.createElement('tr');
list.appendChild(rowa);
list.appendChild(rowb);
for (var i=0; i < books.length; i++) {
	console.log(books[i].title);
	var heading = document.createElement('th');
	heading.innerHTML = i+1;
	var item = document.createElement('td');
	item.innerHTML = books[i].title+", "+books[i].year;
	item.setAttribute('id', 'book'+i);
	rowa.appendChild(heading);
	rowb.appendChild(item);
}
var titletop = document.createElement('p');
document.body.appendChild(titletop);
document.body.appendChild(list);
for (var i = 0; i < books.length; i++) {
	document.getElementById('book'+i).addEventListener('click', getinnerHTML);
}

function getinnerHTML(){ 
	titletop.innerHTML = this.innerHTML; 
}