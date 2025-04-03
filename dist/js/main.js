import data from './data.js';

let pagination = {
	limit: 10,
	current: 0,
	count: 0
};

let state = {
	search: '',
	paid: null,
	language: [],
	topic: [],
	level: []
};

let result = data;

const renderMarkup = (input, index = 1) => {
	const sortedData = sortData(input);
	const items = paginationOffset(sortedData, index);
	let output = '';
	items.map(item => {
		const markup = `
			<article class="article">
				<figure class="article-thumb">
					<a href="article.html"><img src="${item.image}" alt="${item.title}" width="300" height="300" loading="lazy"></a>
				</figure>
				<div class="article-content h4">
					<h3 class="h4 article-title"><a href="article.html">${item.title}</a></h3>
					<p class="article-subtitle">${item.description}</p>
					<span class="article-author">${item.authors}</span>
					<span class="article-price">${item.price}</span>
				</div>
			</article>
		`;
		return output += markup;
	});
	if (output === '') {
		document.querySelector('#root').innerHTML = '<p class="h1">No results</p>';
	} else {
		document.querySelector('#root').innerHTML = output;
	}
};

const sortData = (result) => {
	const value = document.querySelector('.sort').value;
	switch (value) {
		case '0':
			return result.sort((a, b) => a.id - b.id);
		case '1':
			return result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
		case '2':
			return result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
		case '3':
			return result.sort((a, b) => a.title.localeCompare(b.title));
		case '4':
			return result.sort((a, b) => b.title.localeCompare(a.title));
		default:
			return result;
	}
};

const filterData = () => {
	const { search, paid, language, topic, level } = state;
	result = data;
	if (search) {
		result = result.filter(item => item.title.toLowerCase().includes(search));
	}
	if (paid !== null) {
		result = result.filter(item => item.paid === paid);
	}
	if (language.length) {
		result = result.filter(item => language.some(lang => item.language.includes(lang)));
	}
	if (topic.length) {
		result = result.filter(item => topic.includes(item.topic));
	}
	if (level.length) {
		result = result.filter(item => level.includes(item.level));
	}
	renderMarkup(result);
};

const resetFilters = () => {
	[...document.querySelectorAll('.filter-input')].map(item => {
		item.checked = false;
	});
	state = {
		...state,
		paid: null,
		language: [],
		topic: [],
		level: []
	};
	filterData();
};

const paginationOffset = (result, index) => {
	let max = pagination.limit * index,
		min = max - pagination.limit;
	pagination.count = Math.ceil(result.length / pagination.limit);
	pagination.current = index;
	if (pagination.count > 1) {
		let markup = `<nav class="pagination">`;
		if (pagination.current > 1) {
			markup += `<a class="prev page">&lt;</a>`;
		}
		for (let i = 1; i <= pagination.count; i++) {
			if (i === index) {
				markup += `<span class="page current">${i}</span>`;
			} else {
				markup += `<a class="page">${i}</a>`;
			}
		}
		if (pagination.current < pagination.count) {
			markup += `<a class="next page">&gt;</a>`;
		}
		markup += `</nav>`;
		document.querySelector('#pagination').innerHTML = markup;
	} else {
		document.querySelector('#pagination').innerHTML = '';
	}
	result = result.slice(min, max);
	console.log(pagination);
	return result;
}

document.addEventListener('DOMContentLoaded', resetFilters);

document.addEventListener('change', e => {
	if (e.target.matches('.filter-input')) {
		let inputName = e.target.name,
			key = inputName.split('-')[1],
			value = [],
			isArray = e.target.type !== 'radio';
		[...document.querySelectorAll('input[name="' + inputName + '"]')].map(item => {
			if (item.checked) {
				value = isArray ? [...value, item.value] : (item.value == '1' ? true : false);
			}
		});
		if (state.hasOwnProperty(key)) {
			state[key] = value;
		}
		filterData();
	}
});

document.addEventListener('keyup', e => {
	if (e.target.matches('.search-input')) {
		state.search = e.target.value;
		filterData();
	}
});

document.addEventListener('click', e => {
	if (e.target.matches('.page')) {
		if (e.target.matches('.prev')) {
			if (pagination.current > 1) {
				renderMarkup(result, pagination.current - 1);
				window.scrollTo(0, 0);
			}
		} else if (e.target.matches('.next')) {
			if (pagination.current < pagination.count) {
				renderMarkup(result, pagination.current + 1);
				window.scrollTo(0, 0);
			}
		} else {
			if (pagination.current !== parseInt(e.target.textContent)) {
				renderMarkup(result, parseInt(e.target.textContent));
				window.scrollTo(0, 0);
			}
		}
	}
});

document.addEventListener('change', () => {
	renderMarkup(result);
});

document.addEventListener('click', e => {
	if (e.target.matches('.filter-reset')) {
		resetFilters();
	}
});
