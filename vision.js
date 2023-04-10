// NOTE Global variables
let images = [];
let slides_content = [];
let current_slide = 0;
const IMAGE = (image) =>
	`<img src="${image}" class="slider-image" alt="slide-image" /><div class="loading-progress"><div class="loading-bar"></div></div>`;
var tagify_rooms = new Tagify(document.querySelector('input[name=rooms]'), {
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

var tagify_styles = new Tagify(document.querySelector('input[name=style]'), {
	duplicates: false,
});

// NOTE Support functions

function updateSlides(index = null) {
	console.log(slides_content);

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
		// Update all slides based on slides_content
		slides_content.forEach((slide, index) => {
			var image = new Image();

			if (slide.state === 'input' && slide.before) {
				image.src = slide.before;
				image.onload = function () {
					// Update input slide
					$('.slide-content-wrapper')[index].innerHTML = IMAGE(slide.before);
				};
			}

			if (slide.state === 'result' && slide.after) {
				image.src = slide.after;
				image.onload = function () {
					// Update result slide
					$('.slide-content-wrapper')[index].innerHTML = IMAGE(slide.after);
				};
			}

			if (slide.state === 'loading') {
				// Add loading class
				$('.slide-content-wrapper')[index].classList.add('loading');
			}

			// Unhide slide
			$('.slide-content-wrapper')[index].style.display = 'flex';
		});
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

function startLoading(index = 0) {
	// Add loading bar to slide
	$('.slide')
		.eq(index)
		.append(
			`<div class="loader-rectangle_component"><div class="battery-square_power-unit"></div><div class="battery-square_power-unit"></div><div class="battery-square_power-unit"></div><div class="battery-square_power-unit"></div><div class="battery-square_power-unit"></div><div class="battery-square_power-unit"></div><div class="battery-square_power-unit"></div><div class="battery-square_power-unit"></div><div class="battery-square_power-unit"></div><div class="battery-square_power-unit"></div></div>`
		);
}

function stopLoading(index = 0) {
	var loadingProgress = document.querySelectorAll('.loading-progress')[index];
	loadingProgress.style.display = 'none';
	$('.slider-image')[index].style.filter = 'brightness(1)';
}

// NOTE Listeners

window.addEventListener('LR_DATA_OUTPUT', (e) => {
	if (e.detail.ctx === 'upload-context') {
		images = e.detail.data;
	}
});

$(document).on('click', '.done-btn', function () {
	$('.uploadcare-section').css('display', 'none');
	$('#slider-container').css('display', 'flex');

	// Maximum of 20 images
	images.splice(20);

	// Hide slider right arrow if there are less than 2 images
	if (images.length < 2) {
		$('.slider-right-arrow').css('display', 'none');
	}

	// Loop uploaded images and update slides_content
	images.forEach((image) => {
		slides_content.push({
			before: image.cdnUrl,
			after: '',
			state: 'input',
		});
	});

	// Update slides
	updateSlides();
});

$(document).on('click', '.slider-right-arrow', function () {
	current_slide++;

	if (current_slide >= slides_content.length - 1) {
		// Hide slider right arrow
		$('.slider-right-arrow').css('display', 'none');
	}
});

$(document).on('click', '.slider-left-arrow', function () {
	current_slide--;
});

$(document).on('click', '.btn-generate', async function () {
	await generate(slides_content[swiper.activeIndex].before);
});

$(document).on('click', '.thumb-block', function () {
	// Add keyword to styles
	tagify_styles.addTags([$(this).find('.style-title').text()]);
});

$(document).on('click', '#btn-add-images', function () {
	if ($('.uploadcare-section').css('display') === 'none') {
		$('.uploadcare-section').css('display', 'flex');
		$('#slider-container').css('display', 'none');
		images = [];
		slides_content = [];

		// Remove all images
		$('.slide-content-wrapper').html('');

		// Hide slides
		$('.slide-content-wrapper').css('display', 'none');

		// Unhide slider right arrow
		$('.slider-right-arrow').css('display', 'flex');

		// Reset slide position
		while (current_slide > 0) $('.slider-left-arrow').click();

		// Reset file uploader
		$('.cancel-btn').click();
	}
});

$(document).on('click', '.btn-free-download', function () {
	downloadFile(slides_content[current_slide].after);
});
