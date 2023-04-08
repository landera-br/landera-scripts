// NOTE Document ready functions
$(document).ready(function () {
	var inputRooms = document.querySelector('input[name=rooms]'),
		tagify = new Tagify(inputRooms, {
			whitelist: [
				'Cozinha',
				'Home Theater',
				'Jardim',
				'Lavanderia',
				'Quarto',
				'Piscina',
				'Varanda',
				'Sala de estar',
				'Sala de jantar',
				'Suite',
			],
			mode: 'select',
			enforceWhitelist: false,
		});

	var inputStyle = document.querySelector('input[name=style]'),
		tagify = new Tagify(inputStyle, {
			duplicates: true,
		});
});

// NOTE Global variables
let images = [];
let slides_content = [];
const LOADING_SLIDE = `<div class="swiper-slide"><div class="loading-wrapper"><h1 class="generating-heading">Gerando imagem...</h1><lottie-player src="https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/6429e6622b8b8c1d86661637_ab-%5Baint%20(2).json" background="transparent" speed="1" style="width: 50vh;transform: rotate(-90deg);margin-top: -40px;" loop="" autoplay=""></lottie-player></div></div>`;
const INPUT_SLIDE = (before) =>
	`<div class="swiper-slide"><div class="image-wrapper"><img src="${before}" loading="lazy" sizes="(max-width: 479px) 66vw, (max-width: 767px) 79vw, (max-width: 991px) 59vw, (max-width: 1279px) 62vw, (max-width: 1439px) 64vw, (max-width: 1919px) 67vw, 73vw" alt="" class="image-61"><a href="#" class="btn-generate link-block-11 link w-inline-block"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="btn-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"/></svg><div class="text-block-70">Criar ambiente</div></a></div></div>`;
const RESULT_SLIDE = (before, after) =>
	`<div class="swiper-slide"><div class="slider-wrapper"><img sizes="(max-width: 479px) 66vw, (max-width: 767px) 600px, (max-width: 821px) 73vw, (max-width: 1279px) 59vw, (max-width: 1439px) 600px, (max-width: 1919px) 42vw, 37vw" src="${before}" loading="lazy" alt=""> <img sizes="(max-width: 479px) 66vw, (max-width: 767px) 600px, (max-width: 821px) 73vw, (max-width: 1279px) 59vw, (max-width: 1439px) 600px, (max-width: 1919px) 42vw, 37vw" src="data:image/png;base64,${after}" loading="lazy" alt=""><a href="#" class="btn-generate link-block-11 link w-inline-block"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="btn-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg><div class="text-block-70">Recriar ambiente</div></a></div></div>`;
const swiper = new Swiper('.swiper', {
	// Navigation arrows
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
});

// NOTE Support functions

function updateSlides(index = null) {
	// Check if index is null and if it is an integer
	if (index !== null && Number.isInteger(index)) {
		const slide = slides_content[index];
		swiper.removeSlide(index);

		// Update single slide
		if (slide.state === 'input' && slide.before) {
			const img = new Image();

			img.addEventListener('load', () => {
				// Update input slide
				swiper.addSlide(index, stringToHTML(INPUT_SLIDE(slide.before)));
			});

			// Set the source of the image element to the 'before' URL
			img.src = slide.before;

			return;
		}

		if (slide.state === 'result' && slide.before && slide.after) {
			// Add result slide
			const beforeImg = new Image();
			const afterImg = new Image();

			let loadedCount = 0;

			const checkLoaded = () => {
				loadedCount++;
				if (loadedCount === 2) {
					// Both images have loaded, append the slide to the swiper
					swiper.addSlide(index, stringToHTML(RESULT_SLIDE(slide.before, slide.after)));
					reloadSliders();
				}
			};

			// Add event listeners for the 'load' event on both image elements
			beforeImg.addEventListener('load', checkLoaded);
			afterImg.addEventListener('load', checkLoaded);

			// Set the sources of the image elements to the 'before' URL and 'after' base64 string, respectively
			beforeImg.src = slide.before;
			afterImg.src = `data:image/png;base64,${slide.after}`;

			return;
		}

		// Add loading slide
		swiper.addSlide(index, stringToHTML(LOADING_SLIDE));
		swiper.slideTo(index, 0, false);
	} else {
		swiper.removeAllSlides();

		// Update all slides based on slides_content
		console.log(slides_content.length);
		for (const slide of slides_content) {
			if (slide.state === 'input' && slide.before) {
				const img = new Image();

				// Add input slide
				img.addEventListener('load', () => {
					// Append the slide to the swiper
					swiper.appendSlide(stringToHTML(INPUT_SLIDE(slide.before)));
				});

				// Set the source of the image element to the 'before' URL
				img.src = slide.before;

				continue;
			}

			if (slide.state === 'result' && slide.before && slide.after) {
				// Add result slide
				swiper.appendSlide(stringToHTML(RESULT_SLIDE(slide.before, slide.after)));
				continue;
			}

			// Add loading slide
			swiper.appendSlide(stringToHTML(LOADING_SLIDE));
		}

		// Reset swiper to first slide
		swiper.slideTo(0, 0, false);
	}
}

async function generate(url) {
	const image = url;
	const room = $('.rooms-embed .tagify .tagify__tag .tagify__tag-text').text();
	const style = getStyles();
	const payload = { image, room, style };
	var jobResult = null;
	var statusResult = null;
	const MAX_ATTEMPTS = 12;
	const INTERVAL_TIME = 5000; // 5 seconds
	let attemptCount = 0;
	const ACTIVE_INDEX = swiper.activeIndex;

	slides_content[ACTIVE_INDEX].state = 'loading';
	updateSlides(ACTIVE_INDEX);

	console.log('Generating image...');
	try {
		const response = await fetch('https://landera-network-7ikj4ovbfa-uc.a.run.app/api/v1/vision', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('fb_token')}`,
			},
			body: JSON.stringify(payload),
		});

		jobResult = await response.json();
	} catch (error) {
		console.log(error.message);
		return alert('Não foi possível gerar imagens no momento. Tente novamente mais tarde.');
	}

	// If the request is successful, try to get the image every 5 seconds with a maximum of 10 attempts
	if (jobResult.status === 'IN_QUEUE' || jobResult.status === 'IN_PROGRESS') {
		const interval = setInterval(async () => {
			console.log('Checking status...');
			try {
				const response = await fetch(
					`https://landera-network-7ikj4ovbfa-uc.a.run.app/api/v1/vision/${jobResult.id}`,
					{
						method: 'GET',
						headers: {
							Authorization: `Bearer ${localStorage.getItem('fb_token')}`,
						},
					}
				);

				statusResult = await response.json();

				console.log(statusResult);

				if (statusResult.status === 'COMPLETED') {
					console.log('Image generated!');
					clearInterval(interval);

					slides_content[ACTIVE_INDEX].state = 'result';
					slides_content[ACTIVE_INDEX].after = statusResult.output.image;
					updateSlides(ACTIVE_INDEX);
					swiper.slideTo(ACTIVE_INDEX, 0, false);
				} else {
					attemptCount++;
					if (attemptCount >= MAX_ATTEMPTS) {
						clearInterval(interval);
						return alert('Não foi possível gerar imagens no momento. Tente novamente mais tarde.');
					}
				}
			} catch (error) {
				console.log(error.message);
				clearInterval(interval);
				return alert('Não foi possível gerar imagens no momento. Tente novamente mais tarde.');
			}
		}, INTERVAL_TIME);
	} else {
		return alert('Não foi possível gerar imagens no momento. Tente novamente mais tarde.');
	}
}

function stringToHTML(str) {
	var parser = new DOMParser();
	var doc = parser.parseFromString(str, 'text/html');
	return doc.body.firstChild;
}

function getStyles() {
	// Check if there are elements with class .thumb-block .selected
	if ($('.thumb-block.selected').length > 0) {
		var styles = [];

		// Get preset styles and separate them by comma
		$('.thumb-block.selected').each(function () {
			styles.push($(this).find('.style-title').text());
		});
		return styles.join(', ');
	} else {
		// Get custom styles
		return $('.style-embed .tagify .tagify__tag .tagify__tag-text').text();
	}
}

function reloadSliders() {
	// Rerender sliders
	const sliderWrappers = document.getElementsByClassName('slider-wrapper');
	for (const sliderWrapper of sliderWrappers) {
		// Get the source of the before and after image within the current "slider-wrapper" element
		const before = sliderWrapper.querySelectorAll('img')[0].src;
		const after = sliderWrapper.querySelectorAll('img')[1].src;
		// Create a template for the beer slider using the before and after image sources
		const template = `
        <div class="beer-slider slider-label" data-beer-label="Depois">
          <img src="${after}">
          <div class="beer-reveal slider-label" data-beer-label="Antes">
            <img src="${before}">
          </div>
        </div>
      `;
		// Remove the after and the before images, on this sequence
		sliderWrapper.querySelectorAll('img')[1].remove();
		sliderWrapper.querySelectorAll('img')[0].remove();
		// Append the template to the current "image-wrapper" element
		sliderWrapper.insertAdjacentHTML('afterbegin', template);
	}

	// Select all elements with the class "beer-slider" and loop through them
	const beerSliders = document.getElementsByClassName('beer-slider');
	for (const beerSlider of beerSliders) {
		// Initialize the BeerSlider plugin on the current element, passing in the "start" data attribute as the option
		new BeerSlider(beerSlider, { start: beerSlider.dataset.start });
	}
}

function downloadFile(base64) {
	const blobData = atob(base64);
	const arrayBuffer = new ArrayBuffer(blobData.length);
	const uint8Array = new Uint8Array(arrayBuffer);

	for (let i = 0; i < blobData.length; i++) {
		uint8Array[i] = blobData.charCodeAt(i);
	}

	const blob = new Blob([uint8Array], { type: 'application/octet-stream' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.setAttribute('href', url);
	link.setAttribute('download', 'landera-vision.png');
	link.click();
	URL.revokeObjectURL(url);
}

function addSlides(images) {
	console.log(images.length);

	// Create the slider container element
	var sliderContainer = $('<div>').addClass('slider-4 w-slider').attr({
		'data-delay': '4000',
		'data-animation': 'slide',
		'data-autoplay': 'false',
		'data-easing': 'ease',
		'data-hide-arrows': 'true',
		'data-disable-swipe': 'false',
		'data-autoplay-limit': '0',
		'data-nav-spacing': '3',
		'data-duration': '500',
		'data-infinite': 'false',
		role: 'region',
	});

	// Create the slider mask element
	var sliderMask = $('<div>').addClass('mask-3 w-slider-mask').appendTo(sliderContainer);

	// Create each slide and append it to the slider mask element
	for (var i = 0; i < images.length; i++) {
		var slide = $('<div>').addClass('slide w-slide').appendTo(sliderMask);
		var slideContentWrapper = $('<div>').addClass('slide-content-wrapper').appendTo(slide);
		$('<img>').attr('src', images[i].cdnUr).appendTo(slideContentWrapper);
	}

	// Create the slider arrows and nav dots
	$('<div>')
		.addClass('slider-left-arrow w-slider-arrow-left')
		.attr({
			role: 'button',
			tabindex: '0',
			'aria-controls': 'mask',
			'aria-label': 'previous slide',
			style: 'display: none;',
		})
		.append($('<div>').addClass('slider-icon w-icon-slider-left'))
		.appendTo(sliderContainer);

	$('<div>')
		.addClass('slider-right-arrow w-slider-arrow-right')
		.attr({
			role: 'button',
			tabindex: '0',
			'aria-controls': 'mask',
			'aria-label': 'next slide',
		})
		.append($('<div>').addClass('slider-icon w-icon-slider-right'))
		.appendTo(sliderContainer);

	var sliderNav = $('<div>').addClass('w-slider-nav w-round').appendTo(sliderContainer);

	for (var i = 0; i < images.length; i++) {
		$('<div>')
			.addClass('w-slider-dot' + (i == 0 ? ' w-active' : ''))
			.attr({
				role: 'button',
				tabindex: '0',
				'aria-controls': 'mask',
				'aria-label': 'Show slide ' + (i + 1) + ' of ' + images.length,
			})
			.css({
				'margin-left': '3px',
				'margin-right': '3px',
			})
			.appendTo(sliderNav);
	}

	// Append the slider container to the DOM
	$('#mask').append(sliderContainer);
}

// NOTE Listeners

window.addEventListener('LR_DATA_OUTPUT', (e) => {
	if (e.detail.ctx === 'upload-context') {
		images = e.detail.data;
	}
});

$(document).on('click', '.done-btn', function () {
	$('.uploadcare-section').css('display', 'none');
	$('#slider-container').css('display', 'block');

	// Create the slides
	addSlides(images);
});

$(document).on('click', '.btn-generate', async function () {
	await generate(slides_content[swiper.activeIndex].before);
});

$(document).on('click', '.thumb-block', function () {
	$(this).toggleClass('selected');
	$(this).find('.style-title').toggleClass('transition');
});

$(document).on('click', '#btn-add-images', function () {
	if ($('.uploadcare-section').css('display') === 'none') {
		$('.uploadcare-section').css('display', 'flex');
		$('.swiper-wrapper').css('display', 'none');
		images = [];
		slides_content = [];
		swiper.removeAllSlides();

		// Reset file uploader
		$('.cancel-btn').click();
	}
});

$(document).on('click', '.btn-free-download', function () {
	downloadFile(slides_content[swiper.activeIndex].after);
});
