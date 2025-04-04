import data from './data.js';

let pagination = {
	limit: 5,
	current: 1,
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
					<a href="gallery.html"><img src="${item.image}" alt="${item.title}" width="300" height="300" loading="lazy"></a>
				</figure>
				<div class="article-content h4">
					<h3 class="h4 article-title"><a href="gallery.html">${item.title}</a></h3>
					<p class="article-subtitle">${item.description}</p>
					<div>${item.language.map(tag => `<span class="tag tag-grey">${tag}</span>`).join('')}</div>
					<div><span class="tag">${item.topic}</span></div>
					<div><span class="tag tag-purple-dark">${item.level}</span></div>
					<span class="article-author">${item.authors}</span>
					<span class="article-price">${item.paid ? item.price : `<del>${item.price}</del><span class="tag tag-green">FREE</span>`}</span>
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
		result = result.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));
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
		let end = Math.min(Math.max(index + 3, 6), pagination.count);
		let start = Math.max(Math.min(index - 3, pagination.count - 6), 1);
		for (let i = start; i <= end; i++) {
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

document.addEventListener('DOMContentLoaded', () => {
	if (document.querySelector('#root')) resetFilters();
});

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

/*
document.addEventListener('keyup', e => {
	if (e.target.matches('.search-input')) {
		state.search = e.target.value;
		filterData();
	}
});
*/

document.addEventListener('submit', e => {
	if (e.target.matches('.search-form')) {
		e.preventDefault();
		state.search = document.querySelector('.search-input').value;
		filterData();
	}
});

document.addEventListener('click', e => {
	if (e.target.matches('.page')) {
		if (e.target.matches('.prev')) {
			if (pagination.current > 1) {
				renderMarkup(result, pagination.current - 1);
				document.getElementById('scroll-anchor').scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
			}
		} else if (e.target.matches('.next')) {
			if (pagination.current < pagination.count) {
				renderMarkup(result, pagination.current + 1);
				document.getElementById('scroll-anchor').scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
			}
		} else {
			if (pagination.current !== parseInt(e.target.textContent)) {
				renderMarkup(result, parseInt(e.target.textContent));
				document.getElementById('scroll-anchor').scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
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

document.addEventListener('click', e => {
	if (e.target.closest('.dropdown-selection')) {
		let trigger = e.target;
		let dest = e.target.closest('.dropdown');
		if (dest) {
			if (trigger.classList.contains('inactive')) {
				trigger.classList.remove('inactive');
				dest.classList.remove('inactive');
			} else {
				trigger.classList.add('inactive');
				dest.classList.add('inactive');
			}
		}
	}
});

document.addEventListener('click', e => {
	if (e.target.closest('.trigger')) {
		let trigger = e.target.closest('.trigger');
		let dest = document.querySelector(trigger.dataset.dest);
		if (dest) {
			if (trigger.classList.contains('active')) {
				trigger.classList.remove('active');
				dest.classList.remove('active');
			} else {
				trigger.classList.add('active');
				dest.classList.add('active');
			}
		}
	}
});

// SWIPER
import Swiper, { Autoplay, EffectFade, Navigation, Pagination, Thumbs } from 'swiper';

function swiper({
	element,
	options,
	nav = {}
} = {}) {

	var $element = document.querySelector(element),
		$elements = document.querySelectorAll(element);

	this.initSwiper = function() {
		if ($element == null) return false;

		options = Object.assign({}, options, { modules: [Navigation, Pagination, EffectFade, Autoplay, Thumbs] })

		if (nav.hasOwnProperty('element') && nav.hasOwnProperty('options')) {
			for (let i = 0; i < $elements.length; i++) {
				var swiperNav = new Swiper(document.querySelectorAll(nav.element)[i], nav.options),
					thumbsNav = {
						thumbs: {
							swiper: swiperNav
						}
					};
				options = Object.assign({}, options, thumbsNav);
				new Swiper($elements[i], options);
			}
			return false;
		}

		new Swiper(element, options);
	}

}

var swiperGalleryOptions = {
	element: '.swiper-gallery .gallery-main',
	options: {
		rewind: true,
		effect: 'fade',
		fadeEffect: {
			crossFade: true
		},
		navigation: {
			nextEl: '.swiper-gallery .gallery-main .swiper-button-next',
			prevEl: '.swiper-gallery .gallery-main .swiper-button-prev',
		}
	},
	nav: {
		element: '.swiper-gallery .gallery-thumbs',
		options: {
			spaceBetween: 10,
			slidesPerView: 4,
			freeMode: true,
			watchSlidesVisibility: true,
			watchSlidesProgress: true
		}
	}
}
var swiperGalleryModule = new swiper(swiperGalleryOptions);
swiperGalleryModule.initSwiper();

var swiperOptions = {
	element: '.swiper-section .swiper-main',
	options: {
		rewind: true,
		autoplay: {
			delay: 3000
		},
		effect: 'fade',
		fadeEffect: {
			crossFade: true
		},
		navigation: {
			nextEl: '.swiper-section .swiper-main .swiper-button-next',
			prevEl: '.swiper-section .swiper-main .swiper-button-prev',
		}
	}
}
var swiperModule = new swiper(swiperOptions);
swiperModule.initSwiper();
