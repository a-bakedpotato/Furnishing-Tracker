const settings = JSON.parse(localStorage.getItem('settings') || '{}') || {};
if (settings.hideChars){
	const allChars = document.getElementsByClassName('char');
	for (const char of allChars){
		char.classList.add('hidden');
		if (settings.charsToHide.includes(char.dataset.charid)) char.classList.add('hidden');
		else char.classList.remove('hidden');
	}
}

window.addEventListener('load', () => {
	const sets = document.getElementsByClassName('furnishingset');
	for (const s of sets) window.updateSet(s.dataset.setid);
})