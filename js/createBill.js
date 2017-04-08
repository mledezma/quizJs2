
// IIEF
(function(window){
	var Noteform = document.getElementById('noteForm');
	var form = {
		description: Noteform.description,
		type: Noteform.type,
		amount: Noteform.amount,
		date: Noteform.date,
	}
	var notes = null;
	var nodeId = 0;

	// Composes the bill
	function composeNote(note) {
		var tr = document.createElement('tr');
		var tdDescription = document.createElement('td');
		var tdType = document.createElement('td');
		var tdAmount = document.createElement('td');
		var tdDate = document.createElement('td');

		tr.setAttribute('id', note.id);
		tr.classList.add('note');

		tdDescription.innerText = note.description;
		tdType.innerText = note.type;
		tdAmount.innerText = note.amount;
		tdDate.innerText = note.date;

		tr.appendChild(tdDescription);
		tr.appendChild(tdType);
		tr.appendChild(tdAmount);
		tr.appendChild(tdDate);

		return tr;
	}

	// Renders the bills in a table format
	function renderNotes() {
        var container= document.getElementById('noteBook');
		var noteBook = notes.map(composeNote);
		console.log(noteBook);
		noteBook.forEach(function(note){
			container.appendChild(note);
		});
	}

	// Renders the bill using the "form" as a object param
	function main(data) {
		if(data && Array.isArray(data)){
			notes = data;
			return renderNotes();
		}

		return new Error('Notes Array params required', notes);
	}

	// Toggles the visibility of the bills
	function showEditor() {
		document.getElementById('noteBook').className = 'hidden';
		document.getElementById('noteNode').className = '';
	}

	// Discards the bill
	function discardNote() {
		document.getElementById('noteNode').className = 'hidden';
		document.getElementById('noteBook').className = '';
		form.description.value = '';
		form.type.value = '';
		form.amount.value = '';
		form.date.value = '';
	}

	// Delete the bill
	function deleteNote() {
		var note = this.closest('div');
		note.parentNode.removeChild(note);
	}

	// Edits the bill
	function editNote() {

	}

	// Saves the bill
	function saveNote() {
		var notes = [];
		var i = {
			id: nodeId++, 
			description: form.description.value,
			type: form.type.value,
			amount: form.amount.value,
			date: form.date.value,
		}
		notes.push(i);
		main(notes);
		discardNote();
	}

	window.app = {
		showEditor: showEditor,
		discard: discardNote,
		delete: deleteNote,
		edit: editNote,
		new: saveNote,
	};

}(window));

document.getElementById('addNote').addEventListener('click', app.showEditor);
document.getElementById('discard').addEventListener('click', app.discard);
document.getElementById('save').addEventListener('click', app.new);
