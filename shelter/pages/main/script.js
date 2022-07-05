'use strict'
const accountLink = document.querySelector('.account-link');
accountLink.addEventListener('click', (e) => {
	e.preventDefault(e.currentTarget)
})

//burger-menu logic
const burgerButton = document.querySelector('.hamburger');
const mainNav = document.querySelector('.main-nav__ul');
const mainNavItems = mainNav.querySelectorAll('.main-nav__li')
const overlay = document.querySelector('.overlay');
const closeMenu = (e) => {
	if (!e.target.classList.contains('disabled-nav')) {
		burgerButton.classList.remove('is-active');
		mainNav.classList.remove('active-nav');
		overlay.classList.remove('overlay-active');
		document.querySelector('html').classList.remove('overflow');
	}
}
burgerButton.addEventListener('click', () => {
	burgerButton.classList.toggle('is-active');
	mainNav.classList.toggle('active-nav');
	mainNavItems.forEach(elem => {
		if (elem.classList.contains('hoverable') && !elem.classList.contains('active')) {
			elem.classList.remove('hoverable');
		}
	})
	overlay.classList.toggle('overlay-active');
	document.querySelector('html').classList.toggle('overflow');
})
overlay.addEventListener('click', closeMenu);
mainNav.addEventListener('click', closeMenu);

//slider logic
const sliderWrapper = document.querySelector('.slider-wrapper');
const query = {
	load: `../../assets/data/pets.json`,
	user: null
}
let currentSlide = [];
let newSlide = [];
const largeScreen = 1280;
const mediumScreen = 768;
let windowSize = window.innerWidth;
const sliderArrows = document.querySelectorAll('.slider-arrows');
const sliderArrowLeft = document.querySelector('.slider-arrow-left');
const sliderArrowRight = document.querySelector('.slider-arrow-right');
const CAROUSEL = document.querySelector('.carousel');
const SLIDE_LEFT = document.querySelector('#slide-left');
const SLIDE_RIGHT = document.querySelector('#slide-right');
const SLIDE_CURRENT = document.querySelector('#slide-current');
let leftClick, rightClick;

const moveLeft = () => {
	currentSlide = newSlide;
	newSlide = [];
	leftClick = true;
	rightClick = false;
	if (windowSize >= largeScreen) {
		let cardsQnt = 3;
		createSlide(cardsQnt)
	} else if (windowSize < largeScreen && windowSize >= mediumScreen) {
		let cardsQnt = 2;
		createSlide(cardsQnt)
	} else if (windowSize < mediumScreen) {
		let cardsQnt = 1;
		createSlide(cardsQnt)
	}
	CAROUSEL.classList.add("transition-left");
	sliderArrowLeft.removeEventListener("click", moveLeft);
	sliderArrowRight.removeEventListener("click", moveRight);
}

const moveRight = () => {
	currentSlide = newSlide;
	newSlide = [];
	leftClick = false;
	rightClick = true;
	if (windowSize >= largeScreen) {
		let cardsQnt = 3;
		createSlide(cardsQnt)
	} else if (windowSize < largeScreen && windowSize >= mediumScreen) {
		let cardsQnt = 2;
		createSlide(cardsQnt)
	} else if (windowSize < mediumScreen) {
		let cardsQnt = 1;
		createSlide(cardsQnt)
	}
	CAROUSEL.classList.add("transition-right");
	sliderArrowLeft.removeEventListener("click", moveLeft);
	sliderArrowRight.removeEventListener("click", moveRight);
};

const createCard = (id, imgPath, imgAlt, text) => {
	let cardWrapper = document.createElement('div');
	let petImg = document.createElement('img');
	let cardText = document.createElement('p');
	let cardButton = document.createElement('button');
	cardWrapper.classList.add('card-wrapper');
	petImg.classList.add('pet-img');
	petImg.setAttribute('src', imgPath);
	petImg.setAttribute('alt', imgAlt);
	cardText.classList.add('pet-name');
	cardText.innerText = text;
	cardButton.classList.add('learn-more-button');
	cardButton.classList.add('btn');
	cardButton.innerText = 'Learn more';
	cardWrapper.append(petImg, cardText, cardButton);
	cardWrapper.setAttribute('data-id', id);
	return cardWrapper;
}

const randomCard = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function fetchPets(query, ind) {
	const url = query.load;
	const res = await fetch(url);
	const data = await res.json();
	let card = createCard(data[ind].id, data[ind].img, `${data[ind].type}, breed ${data[ind].breed}`, data[ind].name)
	if (currentSlide.length === 0) {
		SLIDE_CURRENT.append(card)
	} else {
		if (leftClick) {
			SLIDE_LEFT.append(card)
		} else if (rightClick) {
			SLIDE_RIGHT.append(card)
		}
	}
}

const createSlide = (qnt) => {
	while (newSlide.length < qnt) {
		let ind = randomCard(0, 7);
		if (!newSlide.includes(ind) && !currentSlide.includes(ind)) {
			newSlide.push(ind);
		}
	}
	newSlide.forEach((elem) => {
		fetchPets(query, elem);
	})
}


window.addEventListener('load', (e) => {
	if (windowSize >= largeScreen) {
		let cardsQnt = 3;
		createSlide(cardsQnt)
	} else if (windowSize < largeScreen && windowSize >= mediumScreen) {
		let cardsQnt = 2;
		createSlide(cardsQnt)
	} else if (windowSize < mediumScreen) {
		let cardsQnt = 1;
		createSlide(cardsQnt)
	}
})
sliderArrowLeft.addEventListener('click', moveLeft)
sliderArrowRight.addEventListener('click', moveRight)

CAROUSEL.addEventListener('animationend', (animationEvent) => {
	let changedItem;
	if (animationEvent.animationName === 'move-left') {
		CAROUSEL.classList.remove('transition-left');
		changedItem = SLIDE_LEFT;
		document.querySelector("#slide-current").innerHTML = SLIDE_LEFT.innerHTML;
		changedItem.innerHTML = '';
	} else if (animationEvent.animationName === 'move-right') {
		CAROUSEL.classList.remove('transition-right');
		changedItem = SLIDE_RIGHT;
		document.querySelector("#slide-current").innerHTML = SLIDE_RIGHT.innerHTML;
		changedItem.innerHTML = '';
	}
	sliderArrowLeft.addEventListener('click', moveLeft)
	sliderArrowRight.addEventListener('click', moveRight)
})



//popup
const popupOverlay = document.querySelector('.popup-overlay');
const popup = document.querySelector('.popup');
const closeButton = popup.querySelector('.popup-close');
const customHover = function (e) {
	if (e.target.classList.contains('popup-overlay-active')) {
		closeButton.classList.add('popup-overlay-hovered')
	}
}
const closePopup = () => {
	popup.classList.toggle('popup-hidden');
	popup.classList.toggle('popup-active');
	popupOverlay.classList.toggle('popup-overlay-active');
	document.querySelector('html').classList.remove('overflow');
	closeButton.classList.remove('popup-overlay-hovered');
	popupOverlay.removeEventListener('mouseover', customHover)

}

async function fetchPet(query, id) {
	const url = query.load;
	const res = await fetch(url);
	const data = await res.json();
	let pet;
	data.forEach(elem => {
		if (elem.id === id) {
			pet = elem
		}
	})
	popup.querySelector('.popup-photo').setAttribute('src', pet.img);
	popup.querySelector('.popup-photo').setAttribute('alt', pet.name);
	popup.querySelector('.popup-name').innerText = pet.name;
	popup.querySelector('.popup-pet-type').innerText = `${pet.type} - ${pet.breed}`;
	popup.querySelector('.popup-description').innerText = pet.description;
	let popupList = popup.querySelectorAll('.popup-item');
	popupList[0].innerHTML = `<b>Age:</b> ${pet.age}`;
	if (pet.inoculations.length > 1) {
		popupList[1].innerHTML = `<b>Inoculations:</b>`
		pet.inoculations.forEach((inoculation, i) => {
			if (i === pet.inoculations.length - 1) {
				popupList[1].innerHTML += `${inoculation}`
			} else {
				popupList[1].innerHTML += `${inoculation}, `
			}
		})
	} else {
		popupList[1].innerHTML = `<b>Inoculations:</b> ${pet.inoculations}`
	}

	popupList[2].innerHTML = `<b>Diseases:</b> ${pet.diseases}`;
	popupList[3].innerHTML = `<b>Parasites:</b> ${pet.parasites}`;
}

sliderWrapper.addEventListener('click', (e) => {
	let id;
	if (e.target.parentNode.classList.contains('card-wrapper') || e.target.classList.contains('card-wrapper')) {
		id = e.target.parentNode.getAttribute('data-id')
		fetchPet(query, id)
		popup.classList.toggle('popup-hidden')
		popup.classList.toggle('popup-active')
		let coordinateY = window.scrollY + window.innerHeight / 2 - (window.getComputedStyle(popup).height.split('p')[0] / 2);
		popup.style.top = `${coordinateY}px`;
		popupOverlay.style.top = `${window.scrollY}px`;
		document.querySelector('html').classList.toggle('overflow');
		popupOverlay.classList.toggle('popup-overlay-active');

		//custom hover for popup-overlay
		window.setTimeout(() => {
			popupOverlay.addEventListener('mouseover', customHover)
		}, 500)
		popupOverlay.addEventListener('mouseleave', (e) => {
			if (e.target.classList.contains('popup-overlay-active')) {
				closeButton.classList.remove('popup-overlay-hovered');
			}
		})
	}
})

closeButton.addEventListener('click', closePopup)
popupOverlay.addEventListener('click', closePopup);
