const root = document.getElementById('root');
const menuElement = document.createElement('aside');
const mainContentElement = document.createElement('main');
root.appendChild(menuElement);
root.appendChild(mainContentElement);

const config = {
	menu: {
		main: {
			href: '/main',
			name: 'Лента',
			render: renderMain,
		},
		login: {
			href: '/login',
			name: 'Авторизация',
			render: renderLogin,
		},
		signup: {
			href: '/signup',
			name: 'Регистрация',
			render: renderSignup,
		},
		profile: {
			href: '/profile',
			name: 'Профиль',
			render: renderProfile,
		},
	},
};

function createInput(type, text, name) {
	const input = document.createElement('input');
	input.type = type;
	input.name = name;
	input.placeholder = text;

	return input;
}

function ajax(method, url, body = null, callback) {
	const xhr = new XMLHttpRequest();
	xhr.open(method, url, true);
	xhr.withCredentials = true;

	xhr.addEventListener('readystatechange', function () {
		if (xhr.readyState !== XMLHttpRequest.DONE) return;

		callback(xhr.status, xhr.responseText);
	});

	if (body) {
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf8');
		xhr.send(JSON.stringify(body));
		return;
	}

	xhr.send();
}


function renderMain() {
	const mainElement = document.createElement('div');

	ajax(
		'GET',
		'/feed',
		null,
		(status, responseString) => {
			let isAuthorized = false;

			if (status === 200) {
				isAuthorized = true;
			}

			if (!isAuthorized) {
				alert('АХТУНГ НЕТ АВТОРИЗАЦИИ');
				goToPage(config.menu.login);
				return;
			}

			const images = JSON.parse(responseString);

			if (images && Array.isArray(images)) {
				const div = document.createElement('div');
				mainElement.appendChild(div);

				images.forEach(({src, likes}) => {
					div.innerHTML += `<img width="400" src="${src}"/><div>${likes} лайков</div>`;
				})
			}
		}
	);

	return mainElement;
}

function renderLogin() {
	const form = document.createElement('form');

	const emailInput = createInput('email', 'Емайл', 'email');
	const passwordInput = createInput('password', 'Пароль', 'password');

	const submitBtn = document.createElement('input');
	submitBtn.type = 'submit';
	submitBtn.value = 'Войти!';

	form.appendChild(emailInput);
	form.appendChild(passwordInput);
	form.appendChild(submitBtn);

	form.addEventListener('submit', (e) => {
		e.preventDefault();

		const email = emailInput.value.trim();
		const password = passwordInput.value;

		ajax(
			'POST',
			'/login',
			{email, password},
			(status => {
				if (status === 200) {
					goToPage(config.menu.profile);
					return;
				}

				alert('АХТУНГ! НЕВЕРНЫЙ ЕМЕЙЛ ИЛИ ПАРОЛЬ');
			})
		)
	});

	return form;
}

function renderSignup() {
	const form = document.createElement('form');

	const emailInput = createInput('email', 'Емайл', 'email');
	const passwordInput = createInput('password', 'Пароль', 'password');
	const ageInput = createInput('number', 'Возраст', 'age');

	const submitBtn = document.createElement('input');
	submitBtn.type = 'submit';
	submitBtn.value = 'Зарегестрироваться!';

	form.appendChild(emailInput);
	form.appendChild(passwordInput);
	form.appendChild(ageInput);
	form.appendChild(submitBtn);

	return form;
}

function goToPage(menuElement) {
	mainContentElement.innerHTML = '';
	root.querySelector('.active').classList.remove('active');
	root.querySelector(`[data-section=${menuElement.href.slice(1)}]`).classList.add('active');

	mainContentElement.appendChild(menuElement.render());
}

function renderProfile() {
	const profileElement = document.createElement('div');

	ajax(
		'GET',
		'/me',
		null,
		(status, responseString) => {
			let isAuthorized = false;

			if (status === 200) {
				isAuthorized = true;
			}

			if (!isAuthorized) {
				alert('АХТУНГ НЕТ АВТОРИЗАЦИИ');
				goToPage(config.menu.login);
				return;
			}


			const {age, images, email} = JSON.parse(responseString);

			const span = document.createElement('span');
			profileElement.appendChild(span);
			span.textContent = `${email}, ${age} лет`;

			if (images && Array.isArray(images)) {
				const div = document.createElement('div');
				profileElement.appendChild(div);

				images.forEach(({src, likes}) => {
					div.innerHTML += `<img width="400" src="${src}"/><div>${likes} лайков</div>`;
				})
			}
		}
	);

	return profileElement;
}

function renderMenu() {
	Object
		.entries(config.menu)
		.map(([key, {href, name}], index) => {
			const menuElement = document.createElement('a');
			menuElement.href = href;
			menuElement.textContent = name;
			menuElement.dataset.section = key;

			if (index === 0) {
				menuElement.classList.add('active');
			}

			return menuElement;
		})
		.forEach((a) => {
			menuElement.appendChild(a);
		})
	;
}

root.addEventListener('click', (e) => {
	const {target} = e;

	if (target instanceof HTMLAnchorElement) {
		e.preventDefault();
		goToPage(config.menu[target.dataset.section]);
	}
});

renderMenu();
renderMain();
