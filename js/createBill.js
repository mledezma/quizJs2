
// IIEF
(function(window){
	var billForm = document.getElementById('billForm');
	var form = {
		description: billForm.description,
		date: billForm.date,		
		type: billForm.type,
		amount: billForm.amount,		
		department: billForm.department,
		notes: billForm.notes,
	}
	var isValid = null;
	var bills = [];
	var nodeId = 0;
	var thisTr = null;
	var edit = false;
	var sumBills = 0;

	// Composes the bill
	function _composeBill(bill) {
		var tr = document.createElement('tr');
		var tdDescription = document.createElement('td');
		var tdAmount = document.createElement('td');
		var tdType = document.createElement('td');		
		var tdDate = document.createElement('td');

		tr.setAttribute('id', bill.id);

		tdDescription.innerText = bill.description;
		tdType.innerText = bill.type;
		tdDate.innerText = bill.date;
		tdAmount.innerText = bill.amount;		

		tdDescription.classList = 'description';
		tdType.classList = 'type';
		tdDate.classList = 'date';
		tdAmount.classList = 'amount';		

		tr.appendChild(tdDescription);
		tr.appendChild(tdDate);		
		tr.appendChild(tdType);
		tr.appendChild(tdAmount);		

		return tr;
	}

	// Renders the bills in a table format
	function _renderBills() {
        var container= document.getElementById('billTable');
		var billArray = bills.map(_composeBill);
		container.innerHTML = '';
		billArray.forEach(function(bill) {

			// Highlights the row depending of the type
			var billType = bill.childNodes[2];
			if(billType.innerHTML === 'credit') {
				bill.className += ' credit';
			} else if(billType.innerHTML === 'debit') {
				bill.className += ' debit';
			}

			// Apends every node to the container
			container.appendChild(bill);
		});
	}

	// Renders the bill using the "form" as a object param
	function _main(data) {
		if(data && Array.isArray(data)){
			bills = data;
			return _renderBills();
		}

		return new Error('Bill Array params required', bills);
	}

	// Toggles the visibility of the bills
	function showEditor() {
		document.getElementById('billTable').className = 'hidden';
		document.getElementById('billNode').className = '';
	}

	// Resets the bill
	function resetBill() {
		document.getElementById('billNode').className = 'hidden';
		document.getElementById('billTable').className = '';
		form.description.value = '';
		form.amount.value = '';
		form.date.value = '';
		form.department.value = '';
		form.notes.value = '';
		sumBills = 0;
	}

	// Delete the bill
	function deleteBill() {
		if(confirm('Are you sure you want to save this thing into the database?')) {
			var bill = thisTr.closest('tr');
		console.log(bill)	
		bill.parentNode.removeChild(bill);

		bills.forEach(function(data, index) {
			if(data.id = bill.id) {
				if (index > -1) bills.splice(index, 1);
			}
		})
		}
		else{
			console.log('hi')
		}
		
	}

	// Edits the bill
	function editBill() {
		showEditor();	
		var element = thisTr.parentNode;
		for(var prop in form) {
			form[prop].value = bills[element.id][prop];
		}
		edit = true;
	}

	// Saves the bill
	function saveBill() {
		var i = {
			id: nodeId++, 
			description: form.description.value,
			date: form.date.value,
			type: form.type.value,			
			amount: parseInt(form.amount.value),			
		}
		_validation(i);
		if(!isValid) {
			return false;
		}
		if(edit) {
			var element = thisTr.parentNode;
			console.log(bills)
			bills.splice(element.id, 1, i);
			console.log(bills)
			
		} else {
			bills.push(i);			
		}
		_main(bills);
		//_sumBill()
		resetBill();
		edit = false;
	}

	// Sorts the table
	function _sort(sort) {
		var sorting = sort.target.id;					
		switch(sorting) {
			case 'sortDate':
				bills.sort(function(a, b) {
					if(a.date < b.date) return 1;
					if(a.date > b.date) return -1;
					return 0;
				});
				break;
			case 'sortType':
				bills.sort(function(a, b) {
					if(a.type === 'debit') return -1;
					if(a.type === 'credit') return 1;
					return 0;
				});
				break;
			case 'sortAmount':
				bills.sort(function(a, b) {
					if(a.amount < b.amount) return 1;
					if(a.amount > b.amount) return -1;
					return 0;
				});
				break;
		}
		_renderBills();
	}

	// Form validation
	function _validation(i) {
		isValid = true;
        if(i.description === ''){              
            alert('Insert a description');
            isValid = false;
        }
		if(i.amount === '' || isNaN(i.amount)){
            alert('Insert a valid amount');
            isValid = false;
        }
        if(i.date === '' || !isNaN(i.date)){              
            alert('Insert a valid date');
            isValid = false;
        }
	}

	// Highlight Row
    function highlightRow(row) {
        parentRow = row.parentNode.className;
        var tr = document.getElementsByTagName('tr');
        for(var i = 1; i < tr.length; i++) {
			for(var value of tr[i].classList.values()) {
				tr[i].classList.remove("selected");
			}
        }

        if(parentRow != 'selected') {
            row.parentNode.classList.add('selected');
			thisTr = row;
			_enableButton();           
        }        
    }

	// Enable the buttons of edit and remove
	function _enableButton() {
		var btnEditBill = document.getElementById('editBill');
		var btnRemoveBill = document.getElementById('deleteBill');

		btnEditBill.removeAttribute('disabled');
		btnRemoveBill.removeAttribute('disabled');
	}

	// // Sums the bills
	// function _sumBill() {
	// 	bills.forEach(function(value) {
	// 		sumBills += value.amount;
	// 		console.log(sumBills)
	// 	})

	// 	_renderFooter();
	// }

	// // Renders the footer
	// function _renderFooter() {
	// 	var tdCredit = document.createElement(td);
	// 	var td
	// }
	
	window.app = {
		showEditor: showEditor,
		reset: resetBill,
		delete: deleteBill,
		edit: editBill,
		new: saveBill,
		sort: function(sort) {
			_sort(sort);
		},
		highlightRow: function(row){
            highlightRow(row);
        },
	};

}(window));

// Bill
document.getElementById('addBill').addEventListener('click', app.showEditor);
document.getElementById('discard').addEventListener('click', app.reset);
document.getElementById('save').addEventListener('click', app.new);
document.getElementById('deleteBill').addEventListener('click', app.delete);
document.getElementById('editBill').addEventListener('click', app.edit);

// Sorts
document.getElementById('sortDate').addEventListener('click', app.sort);
document.getElementById('sortType').addEventListener('click', app.sort);
document.getElementById('sortAmount').addEventListener('click', app.sort);

// Highlight
document.getElementById('billTable').addEventListener('click', function(e) {
    app.highlightRow(e.target)
});