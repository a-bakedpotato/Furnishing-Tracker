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

	const profileName = document.getElementById('profileName');
	profileName.value = settings.profileName || 'New Profile';

	const profiles = JSON.parse(localStorage.getItem('profiles') || '[]').map((p, idx) => ({ ...p, idx }));
	if (!settings.idx && settings.idx !== 0){ 
		settings.idx = profiles.length;
		localStorage.setItem('settings', JSON.stringify(settings));
	}

	const select = document.getElementById('profileSelect');
	for (const profile of (profiles.length ? profiles : [{ settings, idx: 0 }]).slice().reverse()){
		const opt = document.createElement('option');
		opt.value = profile.idx;
		opt.innerText = profile.settings.profileName || 'Profile ' + profile.idx;

		select.insertBefore(opt, select.firstChild);
		if (!settings.idx || settings.idx === profile.idx) select.value = profile.idx.toString();
	}

	select.onchange = () => {
		const settings = JSON.parse(localStorage.getItem('settings') || '{}') || {};
		const characters = JSON.parse(localStorage.getItem('characters') || '{}') || {};
		const inventory = JSON.parse(localStorage.getItem('inventory') || '{}') || {};
		profiles[settings.idx || 0] = { settings, characters, inventory };

		localStorage.setItem('profiles', JSON.stringify(profiles));

		const newIdx = select.value === 'new' ? profiles.length : select.value;
		const newProfile = profiles[newIdx] || { settings: {}, characters: {}, inventory: {} };

		localStorage.setItem('settings', JSON.stringify(newProfile.settings));
		localStorage.setItem('characters', JSON.stringify(newProfile.characters));
		localStorage.setItem('inventory', JSON.stringify(newProfile.inventory));

		window.location.reload();
	}
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

function updateName(){
	const settings = JSON.parse(localStorage.getItem('settings') || '{}') || {};

	const element = document.getElementById('profileName');
	settings['profileName'] = element.value || 'New Profile';

	localStorage.setItem('settings', JSON.stringify(settings));
}

window.toggleChar = toggleChar;
window.toggleSetting = toggleSetting;
window.updateChars = updateChars;
window.updateName = updateName;

window.addEventListener('load', loadSettings);