// Load components
$(document).ready(function () {
	// Select all elements with the class "slider-wrapper" and loop through them
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

// Actions
let images;
let slides_content = [];
const swiper = new Swiper('.swiper', {
	// Navigation arrows
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
});

window.addEventListener('LR_DATA_OUTPUT', (e) => {
	if (e.detail.ctx === 'upload-context') {
		images = e.detail.data;
	}

	$('.done-btn').click(() => {
		$('.uploadcare-section').css('display', 'none');
		$('.swiper-wrapper').css('display', 'flex');

		// Loop through images and add to slides_content
		for (const image of images) {
			slides_content.push({ state: 'input', before: image.cdnUrl, after: '' });
		}

		// Update slides
		updateSlides();
	});
});

function updateSlides(index = null) {
	swiper.removeAllSlides();

	if (index) {
		const slide = slides_content[index];
		// Update single slide
		if (slide.state === 'input' && slide.before) {
			// Add input slide
			swiper.addSlide(
				0,
				`<div class="swiper-slide"><div class="image-wrapper"><img src="${slide.before}" loading="lazy" sizes="(max-width: 479px) 66vw, (max-width: 767px) 79vw, (max-width: 991px) 59vw, (max-width: 1279px) 62vw, (max-width: 1439px) 64vw, (max-width: 1919px) 67vw, 73vw" alt="" class="image-61"><a href="#" class="btn-generate w-button">Gerar imagem</a></div></div>`
			);
			return;
		}

		if (slide.state === 'result' && slide.before && slide.after) {
			// Add result slide
			swiper.addSlide(
				0,
				`<div class="swiper-slide"><div class="slider-wrapper"><img sizes="(max-width: 479px) 66vw, (max-width: 767px) 600px, (max-width: 821px) 73vw, (max-width: 1279px) 59vw, (max-width: 1439px) 600px, (max-width: 1919px) 42vw, 37vw" src="${slide.before}" loading="lazy" alt=""><img sizes="(max-width: 479px) 66vw, (max-width: 767px) 600px, (max-width: 821px) 73vw, (max-width: 1279px) 59vw, (max-width: 1439px) 600px, (max-width: 1919px) 42vw, 37vw" src="${slide.after}" loading="lazy" alt=""><a href="#" class="btn-free-download w-button">Download</a><a href="#" class="btn-generate w-button">Regerar imagem</a></div></div>`
			);
			return;
		}

		// Add loading slide
		swiper.addSlide(
			0,
			`<div class="swiper-slide"><div class="loading-wrapper"><lottie-player src="https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/6429e6622b8b8c1d86661637_ab-%5Baint%20(2).json" background="transparent" speed="1" style="width: 50vh; transform: rotate(-90deg);" loop autoplay></lottie-player></div></div>`
		);
	} else {
		// Update all slides based on slides_content
		for (const slide of slides_content) {
			if (slide.state === 'input' && slide.before) {
				// Add input slide
				swiper.addSlide(
					0,
					`<div class="swiper-slide"><div class="image-wrapper"><img src="${slide.before}" loading="lazy" sizes="(max-width: 479px) 66vw, (max-width: 767px) 79vw, (max-width: 991px) 59vw, (max-width: 1279px) 62vw, (max-width: 1439px) 64vw, (max-width: 1919px) 67vw, 73vw" alt="" class="image-61"><a href="#" class="btn-generate w-button">Gerar imagem</a></div></div>`
				);
				continue;
			}

			if (slide.state === 'result' && slide.before && slide.after) {
				// Add result slide
				swiper.addSlide(
					0,
					`<div class="swiper-slide"><div class="slider-wrapper"><img sizes="(max-width: 479px) 66vw, (max-width: 767px) 600px, (max-width: 821px) 73vw, (max-width: 1279px) 59vw, (max-width: 1439px) 600px, (max-width: 1919px) 42vw, 37vw" src="${slide.before}" loading="lazy" alt=""><img sizes="(max-width: 479px) 66vw, (max-width: 767px) 600px, (max-width: 821px) 73vw, (max-width: 1279px) 59vw, (max-width: 1439px) 600px, (max-width: 1919px) 42vw, 37vw" src="${slide.after}" loading="lazy" alt=""><a href="#" class="btn-free-download w-button">Download</a><a href="#" class="btn-generate w-button">Regerar imagem</a></div></div>`
				);
				continue;
			}

			// Add loading slide
			swiper.addSlide(
				0,
				`<div class="swiper-slide"><div class="loading-wrapper"><lottie-player src="https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/6429e6622b8b8c1d86661637_ab-%5Baint%20(2).json" background="transparent" speed="1" style="width: 50vh; transform: rotate(-90deg);" loop autoplay></lottie-player></div></div>`
			);
		}

		// Reset swiper to first slide
		swiper.slideTo(0, 0, false);
	}
}

async function generate(img) {
	const payload = {};

	try {
		const response = await fetch('https://landera-network-7ikj4ovbfa-uc.a.run.app/api/v1/vision', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('fb_token')}`,
			},
			body: JSON.stringify(payload),
		});

		const responseData = await response.json();
	} catch (error) {
		console.log(error.message);
		alert('Não foi possível gerar imagens no momento. Tente novamente mais tarde.');
	}
}

$(document).on('click', '.thumb-block', function () {
	$(this).toggleClass('selected');
	$(this).find('.style-title').toggleClass('transition');
});

$(document).on('click', '#btn-add-images', function () {
	$('.uploadcare-section').css('display', 'flex');
	$('.swiper-wrapper').css('display', 'none');
	swiper.removeAllSlides();
});
