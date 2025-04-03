let currentIndex = 0;
let isTransitioning = false;

function moveSlide(step) {
	if (isTransitioning) return;

	const slides = document.querySelectorAll('.slider .slide');
	const totalSlides = slides.length;

	currentIndex += step;

	if (currentIndex < 0) {
		currentIndex = totalSlides - 1;
	} else if (currentIndex >= totalSlides) {
		currentIndex = 0;
	}

	isTransitioning = true;

	const newTransformValue = -currentIndex * 100;

	document.querySelector('.slider').style.transform = `translateX(${newTransformValue}%)`;

	document.querySelector('.slider').addEventListener('transitionend', function onTransitionEnd() {
		isTransitioning = false;
		document.querySelector('.slider').removeEventListener('transitionend', onTransitionEnd);

		updateButtons();
	});

	updateButtons();
}

function updateButtons() {
	const slides = document.querySelectorAll('.slider .slide');
	const prevButtons = document.querySelectorAll('.prev');
	const nextButtons = document.querySelectorAll('.next');

	if (currentIndex === 0) {
		prevButtons.forEach(button => button.disabled = true);
	} else {
		prevButtons.forEach(button => button.disabled = false);
	}

	if (currentIndex === slides.length - 1) {
		nextButtons.forEach(button => button.disabled = true);
	} else {
		nextButtons.forEach(button => button.disabled = false);
	}
}


updateButtons();
