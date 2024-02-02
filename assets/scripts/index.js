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

function updateFurnishings(){
	const div = document.getElementById('furnishings');
	const sets = document.getElementsByClassName('furnishingSet');
	const required = {};
	const data = {};
	const inventory = JSON.parse(localStorage.getItem('inventory') || '{}');

	try {
		div.textContent = '';
	} catch(ignored){
		return null;
	} //prevent errors on page load since updateSet is auto called on generation

	for (const set of sets){
		if (set.classList.contains('hidden')) continue;

		const pieces = set.querySelector('.pieces').childNodes || [];
		for (const piece of pieces){
			const pieceId = piece.dataset.pieceid;
			const reqAmt = piece.dataset.quantity;
			const iconRoute = piece.dataset.icon;
			const name = piece.dataset.piecename;

			required[pieceId] = Math.max((required[pieceId] || 0), reqAmt - (inventory[pieceId] || 0));
			data[pieceId] = { pieceId, iconRoute, name };
		}
	}

	for (const [id, amt] of Object.entries(required)){
		if (!amt) continue;
		const pieceData = data[id];

		const piece = document.createElement('div');
		piece.title = pieceData.name.replace(/"/g, '&quot;');
		piece.oncontextmenu = () => { copy(pieceData.name); return false; }
		piece.classList.add('piece', 'furnishing' + id, 'summary');
		piece.onclick = () => updatePrompt(id, pieceData.iconRoute, pieceData.name);
		piece.dataset.pieceid = id;
		piece.dataset.icon = pieceData.iconRoute;
		piece.dataset.piecename = pieceData.name;

		const img = document.createElement('img');
		img.src = pieceData.iconRoute;
		piece.appendChild(img);

		const p = document.createElement('p');
		p.classList.add('quantity');
		p.innerText = amt;
		piece.appendChild(p);

		div.appendChild(piece);
	}
	
	async function updateMaterials(){
		const div = document.getElementById('materials');
		const matsData = {};

		try {
			div.textContent = '';
		} catch(ignored){
			return null;
		} //prevent errors on page load since updateSet is auto called on generation

		for (const id in required){
			const recipe = window.recipes[id] || { input: {} };

			for (const matId in recipe.input){
				const { icon, count } = recipe.input[matId];
				console.log(count);
				console.log(matsData[matId]);
				if (!matsData[matId]) matsData[matId] = { quantity: 0, icon, name: matId };
				matsData[matId].quantity += parseInt(required[id]) * parseInt(count);
				console.log(matsData[matId].quantity);
			}
		}

		for (const [id, value] of Object.entries(matsData)){
			if (!value.quantity) continue;
			const pieceData = matsData[id];

			const piece = document.createElement('div');
			piece.classList.add('piece', 'material' + id, 'summary');
			piece.onclick = () => updatePrompt(id, 'https://api.ambr.top/assets/UI/' + pieceData.icon + '.png', pieceData.name);
			piece.dataset.pieceid = id;
			piece.dataset.icon = 'https://api.ambr.top/assets/UI/' + pieceData.icon + '.png';
			piece.dataset.piecename = pieceData.name;

			const img = document.createElement('img');
			img.src = 'https://api.ambr.top/assets/UI/' + pieceData.icon + '.png';
			piece.appendChild(img);

			const p = document.createElement('p');
			p.classList.add('quantity');
			p.innerText = value.quantity.toLocaleString();
			piece.appendChild(p);

			div.appendChild(piece);
		}
	}

	updateMaterials();
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

	let charsDone = true;
	const divs = document.getElementsByClassName('charSet' + setId);
	for (const div of divs){
		const charId = div.dataset.charid;
		if (data[charId]) div.classList.add('check');
		else div.classList.remove('check');

		if (!div.classList.contains('check') && !div.classList.contains('hidden')) charsDone = false;
	}

	let piecesDone = true;
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
			piecesDone = false;
			piece.classList.remove('check');
		}
	}

	const settings = JSON.parse(localStorage.getItem('settings') || '{}') || {};
	if (settings.hideDone && charsDone && piecesDone){
		const sets = document.getElementsByClassName('set' + setId);
		for (const s of sets) s.classList.add('hidden');
	} else {
		const sets = document.getElementsByClassName('set' + setId);
		for (const s of sets) s.classList.remove('hidden');
	}

	if (settings.hideNonGift){
		const sets = document.getElementsByClassName('set' + setId);
		for (const s of sets){
			if (!s.classList.contains('giftSet')) s.classList.add('hidden');
		}
	}

	updateFurnishings();
}

window.copy = copy;
window.recipes = {};
window.toggleChar = toggleChar;
window.updateSet = updateSet;

window.addEventListener('load', updateFurnishings);