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
const LOADING_SLIDE = `<div class="swiper-slide"><div class="loading-wrapper"><lottie-player src="https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/6429e6622b8b8c1d86661637_ab-%5Baint%20(2).json" background="transparent" speed="1" style="width: 50vh; transform: rotate(-90deg);" loop autoplay></lottie-player></div></div>`;
const INPUT_SLIDE = (before) =>
	`<div class="swiper-slide"><div class="image-wrapper"><img src="${before}" loading="lazy" sizes="(max-width: 479px) 66vw, (max-width: 767px) 79vw, (max-width: 991px) 59vw, (max-width: 1279px) 62vw, (max-width: 1439px) 64vw, (max-width: 1919px) 67vw, 73vw" alt="" class="image-61"><a href="#" class="btn-generate w-button">Gerar imagem</a></div></div>`;
const RESULT_SLIDE = (before, after) =>
	`<div class="swiper-slide"><div class="slider-wrapper"><img sizes="(max-width: 479px) 66vw, (max-width: 767px) 600px, (max-width: 821px) 73vw, (max-width: 1279px) 59vw, (max-width: 1439px) 600px, (max-width: 1919px) 42vw, 37vw" src="${before}" loading="lazy" alt=""><img sizes="(max-width: 479px) 66vw, (max-width: 767px) 600px, (max-width: 821px) 73vw, (max-width: 1279px) 59vw, (max-width: 1439px) 600px, (max-width: 1919px) 42vw, 37vw" src="data:image/png;base64,${after}" loading="lazy" alt=""><a href="#" class="btn-free-download w-button">Download</a><a href="#" class="btn-generate w-button">Regerar imagem</a></div></div>`;
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
		console.log(slide);
		console.log(index);
		swiper.removeSlide(index);

		// Update single slide
		if (slide.state === 'input' && slide.before) {
			// Update input slide
			swiper.addSlide(index, stringToHTML(INPUT_SLIDE(slide.before)));
			return;
		}

		if (slide.state === 'result' && slide.before && slide.after) {
			// Add result slide
			swiper.addSlide(index, stringToHTML(RESULT_SLIDE(slide.before, slide.after)));
			return;
		}

		// Add loading slide
		swiper.addSlide(index, stringToHTML(LOADING_SLIDE));
	} else {
		swiper.removeAllSlides();

		// Update all slides based on slides_content
		console.log(slides_content.length);
		for (const slide of slides_content) {
			if (slide.state === 'input' && slide.before) {
				// Add input slide
				swiper.appendSlide(stringToHTML(INPUT_SLIDE(slide.before)));
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
	const maxAttempts = 12;
	const intervalTime = 5000; // 5 seconds
	let attemptCount = 0;

	slides_content[swiper.activeIndex].state = 'loading';
	updateSlides(swiper.activeIndex);

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

	console.log(jobResult);

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

					slides_content[swiper.activeIndex].state = 'result';
					slides_content[swiper.activeIndex].after = statusResult.output.image;
					updateSlides(swiper.activeIndex);
					reloadSliders();
				} else {
					attemptCount++;
					if (attemptCount >= maxAttempts) {
						clearInterval(interval);
						return alert('Não foi possível gerar imagens no momento. Tente novamente mais tarde.');
					}
				}
			} catch (error) {
				console.log(error.message);
				clearInterval(interval);
				return alert('Não foi possível gerar imagens no momento. Tente novamente mais tarde.');
			}
		}, intervalTime);
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

// NOTE Listeners

window.addEventListener('LR_DATA_OUTPUT', (e) => {
	console.log(e.detail);
	if (e.detail.ctx === 'upload-context') {
		images = e.detail.data;
	}

	console.log(images);

	$('.done-btn').click(() => {
		$('.uploadcare-section').css('display', 'none');
		$('.swiper-wrapper').css('display', 'flex');

		// Loop through images and add to slides_content
		for (const image of images) {
			console.log('Adding image to slides_content...');
			slides_content.push({ state: 'input', before: image.cdnUrl, after: '' });
		}

		// Update slides
		updateSlides();
	});
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
