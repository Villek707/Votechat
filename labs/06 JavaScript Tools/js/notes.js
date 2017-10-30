'use strict';
var notes = new Array();
var localStorage;
	
function addItem() {
	var textbox = document.getElementById('item');
	var itemText = textbox.value;
	var exists = false;
	textbox.value = '';
	textbox.focus();
	for (var i = 0; notes.length>i; i++) {
		if (notes[i].title == itemText) {
			notes[i].quantity += 1;
			exists = true;
		}
	}
	if (!exists) {
		var newItem = {title: itemText, quantity: 1};
		notes.push(newItem);
	}
//	displayList();
	saveList();
	loadList();
}

function displayList() {
	var table = document.getElementById('list');
	table.innerHTML = '';
	for (var i = 0; i<notes.length; i++) {
		var node = undefined;
		var note = notes[i];
		var node = document.createElement('tr');
		var html = '<td>'+note.title+'</td><td>'+note.quantity+'</td><td><a href="#" onClick="deleteIndex('+i+')">delete</td>';
		node.innerHTML = html;
		table.appendChild(node);
	}
}

function deleteIndex(i) {
	notes.splice(i, 1);
//	displayList();
	saveList();
	loadList();
}

function saveList() {
    localStorage.notes = JSON.stringify(notes);
}

function loadList() {
    console.log('loadList');
    if (localStorage.notes) {
        notes = JSON.parse(localStorage.notes);
        displayList();
    }
}

loadList();
var button = document.getElementById('add');
button.onclick = addItem;
