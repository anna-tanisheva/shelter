'use strict'

//burger-menu logic
const burgerButton = document.querySelector('.hamburger');
const mainNav = document.querySelector('.main-nav__ul');
const mainNavItems = mainNav.querySelectorAll('.main-nav__li')
const closeMenu = (e) => {
	if (!e.target.classList.contains('disabled-nav')) {
		burgerButton.classList.remove('is-active');
		mainNav.classList.remove('active-nav');
		overlay.classList.remove('overlay-active');
		document.querySelector('html').classList.remove('overflow');
	}
}

const overlay = document.querySelector('.overlay')
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

//create pagination
const largeScreen = 1280;
const mediumScreen = 768;
let currentScreen = window.innerWidth;
let petsPerPage;
let pagArr = [];
let currentPage = 0;
let nextBtn = document.querySelector('.next');
let lastBtn = document.querySelector('.last');
let firstBtn = document.querySelector('.first');
let prevBtn = document.querySelector('.prev');
let wrapper = document.querySelector('.content-wrapper');


const query = {
	load: `../../assets/data/pets.json`,
	user: null
}

if (currentScreen >= largeScreen) {
	petsPerPage = 8;
} else if (currentScreen < largeScreen && currentScreen >= mediumScreen) {
	petsPerPage = 6;
} else {
	petsPerPage = 3;
}

const randomCard = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const shuffle = (array) => {
	let currentIndex = array.length, randomIndex;
	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
	}

	return array;
}
const changePageNumber = (num, arr) => {
	let pageNumBlock = document.querySelector('.active-page');
	pageNumBlock.innerText = num + 1;
	if (num === arr.length - 1) {
		firstBtn.removeAttribute('disabled');
		prevBtn.removeAttribute('disabled');
		nextBtn.setAttribute('disabled', true);
		lastBtn.setAttribute('disabled', true);
	} else if (num > 0 && num < arr.length - 1) {
		nextBtn.removeAttribute('disabled');
		lastBtn.removeAttribute('disabled');
		firstBtn.removeAttribute('disabled');
		prevBtn.removeAttribute('disabled');
	} else {
		firstBtn.setAttribute('disabled', true);
		prevBtn.setAttribute('disabled', true);
		nextBtn.removeAttribute('disabled');
		lastBtn.removeAttribute('disabled');
	}
}
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


//page
async function loadContent(query, petsPerPage) {
	//load data
	const url = query.load;
	const res = await fetch(url);
	const data = await res.json();
	let pagesAmount = 48 / petsPerPage;
	//create ordered array of pets
	let dataToArr = [];
	let i = 0;
	while (dataToArr.length < 48) {
		if (i < data.length) {
			dataToArr.push(data[i]);
			i++;
		} else {
			i = 0;
			dataToArr.push(data[i]);
			i++;
		}
	}
	//create pseudo-random array of pages
	let initPet = 0;
	let pet = 0;
	while (pagArr.length < pagesAmount) {
		let page = [];
		while (page.length < petsPerPage) {
			page.push(dataToArr[pet])
			pet++
			initPet = pet;
			pet = pet
		}
		shuffle(page)
		pagArr.push(page)
	}
	// add initial page
	pagArr[0].forEach(elem => {
		let card = createCard(elem.id, elem.img, elem.type, elem.name);
		wrapper.prepend(card)
	})
	console.log(`Для удобства проверки количества каждого из питомцев, это массив объектов постранично:` + `\n`, pagArr)
	//add event listeners to buttons
	nextBtn.addEventListener('click', () => {
		Array.from(wrapper.children).forEach(node => {
			if (node.classList.contains('card-wrapper')) {
				wrapper.removeChild(node)
			}
		})
		pagArr[currentPage + 1].forEach(elem => {
			let card = createCard(elem.id, elem.img, elem.type, elem.name);
			document.querySelector('.content-wrapper').prepend(card);
		})
		currentPage = currentPage + 1;
		changePageNumber(currentPage, pagArr)
	})

	prevBtn.addEventListener('click', () => {
		Array.from(wrapper.children).forEach(node => {
			if (node.classList.contains('card-wrapper')) {
				wrapper.removeChild(node)
			}
		})
		pagArr[currentPage - 1].forEach(elem => {
			let card = createCard(elem.id, elem.img, elem.type, elem.name);
			document.querySelector('.content-wrapper').prepend(card);
		})
		currentPage = currentPage - 1;
		changePageNumber(currentPage, pagArr)
	})

	lastBtn.addEventListener('click', () => {
		Array.from(wrapper.children).forEach(node => {
			if (node.classList.contains('card-wrapper')) {
				wrapper.removeChild(node)
			}
		})
		pagArr[pagArr.length - 1].forEach(elem => {
			let card = createCard(elem.id, elem.img, elem.type, elem.name);
			document.querySelector('.content-wrapper').prepend(card);
			currentPage = pagArr.length - 1;
			changePageNumber(currentPage, pagArr)
		});
	})
	firstBtn.addEventListener('click', () => {
		Array.from(wrapper.children).forEach(node => {
			if (node.classList.contains('card-wrapper')) {
				wrapper.removeChild(node)
			}
		})
		pagArr[0].forEach(elem => {
			let card = createCard(elem.id, elem.img, elem.type, elem.name);
			document.querySelector('.content-wrapper').prepend(card);
			currentPage = 0;
			changePageNumber(currentPage, pagArr)
		});
	})

}
loadContent(query, petsPerPage);

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

wrapper.addEventListener('click', (e) => {
	let id;
	if (e.target.parentNode.classList.contains('card-wrapper') || e.target.classList.contains('card-wrapper')) {
		let page = pagArr[currentPage]
		id = e.target.parentNode.getAttribute('data-id');
		let pet;
		page.forEach(elem => {
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

		popup.classList.toggle('popup-hidden')
		popup.classList.toggle('popup-active')
		let coordinateY = window.scrollY + window.innerHeight / 2 - (window.getComputedStyle(popup).height.split('p')[0] / 2) + 60;
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
popupOverlay.addEventListener('click', closePopup)
