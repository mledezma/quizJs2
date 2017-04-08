
// IIEF
(function(window){
	var Billform = document.getElementById('billForm');
	var form = {
		description: Billform.description,
		date: Billform.date,		
		type: Billform.type,
		amount: Billform.amount,		
		department: Billform.department,
		notes: Billform.notes,
	}
	var isValid = null;
	var bills = [];
	var nodeId = 0;

	// Composes the bill
	function composeBill(bill) {
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
	function renderBills() {
        var container= document.getElementById('billTable');
		var billArray = bills.map(composeBill);
		container.innerHTML = '';
		billArray.forEach(function(bill){

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
	function main(data) {
		if(data && Array.isArray(data)){
			bills = data;
			return renderBills();
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
	}

	// Delete the bill
	function deleteBill() {
		var bill = this.closest('div');
		bill.parentNode.removeChild(bill);
	}

	// Edits the bill
	function editBill() {

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
			console.log('waaaat')
			return false;
		}
		bills.push(i);
		main(bills);
		resetBill();
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
					if(a.type === 'debit') return 1;
					if(a.type === 'credit') return -1;
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
		renderBills();
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
			_enableButton();           
        }        
    }

	// Enable the buttons of edit and remove
	// function _enableButton() {
	// 	var btnEditBill = document.getElementById('editBill');
	// 	var btnRemoveBill = document.getElementById('removeBill');

	// 	btnEditBill.prop
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

// Create Bill
document.getElementById('addBill').addEventListener('click', app.showEditor);
document.getElementById('discard').addEventListener('click', app.reset);
document.getElementById('save').addEventListener('click', app.new);

// Sorts
document.getElementById('sortDate').addEventListener('click', app.sort);
document.getElementById('sortType').addEventListener('click', app.sort);
document.getElementById('sortAmount').addEventListener('click', app.sort);

// Highlight
document.getElementById('billTable').addEventListener('click', function(e) {
    app.highlightRow(e.target)
});