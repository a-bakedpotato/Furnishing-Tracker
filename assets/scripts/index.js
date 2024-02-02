function copy(text){
	const type = 'text/plain';
	const blob = new Blob([text], { type });
	const data = [new ClipboardItem({ [type]: blob })];

	navigator.clipboard.write(data);
}

function toggleChar(setId, charId){
	const data = JSON.parse(localStorage.getItem('characters') || '{}');

	if (!data[setId]) data[setId] = {};
	if (!data[setId][charId]) data[setId][charId] = false;

	data[setId][charId] = !data[setId][charId];
	localStorage.setItem('characters', JSON.stringify(data));

	updateSet(setId);
}

function updatePrompt(pieceId, iconRoute, name){
	const container = document.createElement('div')
	container.id = 'overlayContainer';

	const bg = document.createElement('div');
	bg.id = 'overlay';
	container.appendChild(bg);

	const div = document.createElement('div');
	div.id = 'input';
	container.appendChild(div);

	const title = document.createElement('h2');
	title.innerText = name;
	div.appendChild(title);

	const img = document.createElement('img');
	img.src = iconRoute;
	div.appendChild(img);

	const inv = JSON.parse(localStorage.getItem('inventory') || '{}');
	const input = document.createElement('input');
	input.type = 'number';
	input.value = inv[pieceId] || 0;
	input.min = 0;
	input.max = 9999;
	div.appendChild(input);

	bg.onclick = () => {
		const includesPiece = document.getElementsByClassName('furnishing' + pieceId);
		updateInv(pieceId, input.value);
		for (const piece of includesPiece) updateSet(piece.parentElement.parentElement.dataset.setid);

		container.remove();
	}

	document.body.appendChild(container);
}

function updateInv(pieceId, quantity){
	const data = JSON.parse(localStorage.getItem('inventory') || '{}');

	quantity = parseInt(quantity);

	if (isNaN(quantity) || quantity < 0) quantity = 0;
	if (quantity > 9999) quantity = 9999;

	data[pieceId] = quantity;
	localStorage.setItem('inventory', JSON.stringify(data));
}

function updateSet(setId){
	const data = JSON.parse(localStorage.getItem('characters') || '{}')[setId] || {};
	const inv = JSON.parse(localStorage.getItem('inventory') || '{}') || {};

	const divs = document.getElementsByClassName('charSet' + setId);
	for (const div of divs){
		const charId = div.dataset.charid;
		if (data[charId]) div.classList.add('check');
		else div.classList.remove('check');
	}

	const pieces = document.getElementsByClassName('pieceSet' + setId);
	for (const piece of pieces){
		const pieceId = piece.dataset.pieceid;
		const qty = piece.dataset.quantity;
		const remaining = Math.max(qty - (inv[pieceId] || 0), 0);

		const qtyTxt = piece.querySelector('.quantity');
		qtyTxt.innerText = remaining;

		if (remaining <= 0){
			qtyTxt.innerText = qty;
			piece.classList.add('check');
		} else {
			piece.classList.remove('check');
		}
	}
}

window.copy = copy;
window.toggleChar = toggleChar;
window.updateSet = updateSet;