import Menu, {RENDER_TYPE} from './components/Menu/Menu.js';
import {safe} from './utils/safe.js';

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('sw.js')
		.then((reg) => {
			console.log('sw registered', reg);
		})
		.catch((e) => {
			console.error(e);
		});
}

const root = document.getElementById('root');
const menuElement = document.createElement('aside');
menuElement.classList.add('menu');
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
			name: safe('Профиль'),
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

function renderMain() {
	const mainElement = document.createElement('div');

	ajax.get({
		url: '/feed',
		callback: (status, responseString) => {
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
	})

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

		ajax.post({
			url: '/login',
			body: {email, password},
			callback: (status => {
				if (status === 200) {
					goToPage(config.menu.profile);
					return;
				}

				alert('АХТУНГ! НЕВЕРНЫЙ ЕМЕЙЛ ИЛИ ПАРОЛЬ');
			})
		});
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

	ajax.get({
		url: '/me',
		callback: (status, responseString) => {
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
	})

	return profileElement;
}

function renderMenu() {
	const menu = new Menu(menuElement);
	menu.items = config.menu;
	menu.render(RENDER_TYPE.TEMPLATE);
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
