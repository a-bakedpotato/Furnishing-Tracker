function loadSettings(){
	const settings = JSON.parse(localStorage.getItem('settings') || '{}') || {};
	for (const [k, v] of Object.entries(settings)){
		try {
			if (v && typeof v === 'boolean') document.getElementById(k).checked = true;
		} catch(e){
			console.log(e);
		}
	}

	const element = document.getElementById('chars');
	if (settings.hideChars) element.classList.remove('hidden');
	else element.classList.add('hidden');
}

function toggleChar(id){
	const settings = JSON.parse(localStorage.getItem('settings') || '{}') || {};
	let disabledChars = settings.charsToHide || [];

	if (disabledChars.includes(id)) disabledChars = disabledChars.filter(c => c !== id);
	else disabledChars.push(id);

	settings.charsToHide = disabledChars;
	localStorage.setItem('settings', JSON.stringify(settings));

	updateChars();
}

function toggleSetting(key){
	const settings = JSON.parse(localStorage.getItem('settings') || '{}') || {};

	const element = document.getElementById(key);
	settings[key] = element.checked;

	if (key === 'hideChars'){
		const element = document.getElementById('chars');
		if (settings[key]) element.classList.remove('hidden');
		else element.classList.add('hidden');
	}

	localStorage.setItem('settings', JSON.stringify(settings));
}

function updateChars(){
	const settings = JSON.parse(localStorage.getItem('settings') || '{}') || {};
	let disabledChars = settings.charsToHide || [];

	const chars = document.getElementsByClassName('char');
	for (const char of chars){
		const id = char.dataset.charid;

		if (disabledChars.includes(id)) char.classList.add('disabled');
		else char.classList.remove('disabled');
	}
}

window.toggleChar = toggleChar;
window.toggleSetting = toggleSetting;
window.updateChars = updateChars;

window.addEventListener('load', loadSettings);