export const RENDER_TYPE = {
    STRING: 'string',
    DOM: 'dom',
    TEMPLATE: 'template'
}

export default class Menu {
    #data
    #parent

    constructor(parent) {
        this.#parent = parent;
    }

    get items() {
        return this.#data;
    }

    set items(value) {
        this.#data = Object.entries(value);
    }

    render(renderType = RENDER_TYPE.DOM) {
        switch (renderType) {
            case RENDER_TYPE.STRING:
                return this.renderString();
            case RENDER_TYPE.DOM:
                return this.renderDOM();
            case RENDER_TYPE.TEMPLATE:
                return this.renderTemplate();
        }
    }

    renderTemplate() {
        const template = fest['components/Menu/Menu.tmpl'];
        const templateData = this.items.map(([key, {href, name}]) => ({key, href, name}));
        this.#parent.innerHTML = template(templateData);
    }

    renderString() {
        this.#parent.innerHTML = this.items.map(([key, {href, name}], index) => {
            let className = 'menu__item';
            if (index === 0) {
                className += ' active';
            }

            return `<a class="${className}" data-section="${key}" href="${href}">${name}</a>`;
        }).join('\n');
    }

    renderDOM() {
        this.items.map(([key, {href, name}], index) => {
            const menuElement = document.createElement('a');
            menuElement.href = href;
            menuElement.textContent = name;
            menuElement.dataset.section = key;
            menuElement.classList.add('menu__item');

            if (index === 0) {
                menuElement.classList.add('active');
            }

            return menuElement;
        })
        .forEach((a) => {
            this.#parent.appendChild(a);
        });
    }
}


