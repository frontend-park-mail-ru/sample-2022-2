const btn = document.getElementsByTagName('button')[0];
btn.onclick = () => {
	const h1 = btn.parentElement.firstElementChild;
	h1.style = 'color: red';
}
