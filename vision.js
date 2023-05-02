// NOTE Global variables
const IMAGE_CANVAS = (image) => `<img src="${image}" class="slider-image" alt="slide-image"/>`;
const OUTPUT_MENU = `<div class="output-menu"><div class="output-options"><div class="menu-button btn-free-download tippy" data-tippy-animation="scale" data-tippy-content="Baixar gratuitamente" data-tippy-placement="bottom" data-tippy-followcursor="false" data-tippy-arrow="true" data-tippy-interactive="true"><img src="https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/6336fd9ad65bc35bb14a118b_download.svg" loading="lazy" width="20" height="20" alt=""></div><div class="menu-button btn-full-screen tippy" data-tippy-animation="scale" data-tippy-content="Ver antes/depois" data-tippy-placement="bottom" data-tippy-followcursor="false" data-tippy-arrow="true" data-tippy-interactive="true"><img src="https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/64341bc10a05bcee6478ce40_full.svg" loading="lazy" width="20" height="20" alt=""></div></div><div class="regenerate"><div class="menu-button btn-regenerate tippy" data-tippy-animation="scale" data-tippy-content="Recriar imagem" data-tippy-placement="bottom" data-tippy-followcursor="false" data-tippy-arrow="true" data-tippy-interactive="true"><img src="https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/642ffbce908513dcb14b19ce_reset.svg" loading="lazy" width="20" height="20" alt=""></div></div></div>`;
let images = [];
let slides_content = [];
let current_slide = 0;
const TAGIFY_OBJECTS = {
	whitelist: ['Armário', 'Cadeira', 'Janela', 'Mesa', 'Porta', 'Sofá', 'TV'],
	mode: 'select',
	enforceWhitelist: false,
};
let tagify_rooms = new Tagify(document.querySelector('input[name=rooms]'), {
	whitelist: [
		'Banheiro',
		'Cozinha',
		'Escritório',
		'Quarto',
		'Sala de estar',
		'Sala de jantar',
		'Varanda',
	],
	mode: 'select',
	enforceWhitelist: false,
});
let first_obj = new Tagify(document.querySelector('input[name=obj-1]'), TAGIFY_OBJECTS);
let second_obj = new Tagify(document.querySelector('input[name=obj-2]'), TAGIFY_OBJECTS);
let third_obj = new Tagify(document.querySelector('input[name=obj-3]'), TAGIFY_OBJECTS);
let tagify_styles = new Tagify(document.querySelector('input[name=style]'), {
	duplicates: false,
});
let elements = [];

// NOTE Support functions

function updateSlides(index = null) {
	// Check if index is null and if it is an integer
	if (index !== null && Number.isInteger(index)) {
		const slide = slides_content[index];

		if (slide.after) {
			var image = new Image();

			image.src = `data:image/png;base64,${slide.after}`;
			image.onload = function () {
				// Update result slide
				$('.slide-content-wrapper')[index].innerHTML = IMAGE_CANVAS(
					`data:image/png;base64,${slide.after}`
				);
				addOutputMenu(index);
			};
		}
	} else {
		// Update all slides based on slides_content
		slides_content.forEach((slide, index) => {
			if (slide.before) {
				var image = new Image();

				image.src = slide.before;
				image.onload = function () {
					// Update input slide
					$('.slide-content-wrapper')[index].innerHTML = IMAGE_CANVAS(slide.before);
				};

				// Unhide slide
				$('.slide-content-wrapper')[index].style.display = 'flex';
			}
		});
	}
	tippy('.tippy');
}

async function generate(url) {
	// Get payload data
	const image = url;
	const room = $('.rooms-embed .tagify .tagify__tag .tagify__tag-text').text();
	const style = getStyles();
	const creative = $('#creativemode').is(':checked');

	const payload = { image, room, style, creative };
	var jobResult = null;
	var statusResult = null;
	const MAX_ATTEMPTS = 18; // 90 seconds
	const INTERVAL_TIME = 5000; // 5 seconds
	let attemptCount = 0;
	const INDEX = current_slide;

	startLoading();

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

				if (statusResult.status === 'COMPLETED') {
					console.log('Image generated!');
					clearInterval(interval);
					stopLoading();

					slides_content[INDEX].after = statusResult.output.image;
					updateSlides(INDEX);
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
	var tags = $('.style-wrapper .tagify .tagify__tag .tagify__tag-text')
		.map(function () {
			return $(this).text();
		})
		.get()
		.join(', ');

	return tags;
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

function startLoading() {
	const POWER_UNITS = 17; // Set the desired number of power units here
	let powerUnitsHtml = '';

	$('.slider-image')[current_slide].style.filter = 'brightness(0.5)';

	for (let i = 0; i < POWER_UNITS; i++) {
		powerUnitsHtml += '<div class="battery-square_power-unit"></div>';
	}

	$('.slide-content-wrapper')
		.eq(current_slide)
		.append(`<div class="loader-rectangle_component">${powerUnitsHtml}</div>`);

	// Hide output menu
	if ($('.output-menu').length > 0) $('.output-menu').css('display', 'none');

	// Set opacity of .battery-square_power-unit to 1 every 3 seconds
	var units = document.querySelectorAll('.battery-square_power-unit');
	var unitIndex = 0;
	var batteryInterval = setInterval(function () {
		units[unitIndex].style.opacity = '1';
		unitIndex++;
		if (unitIndex >= units.length) {
			clearInterval(batteryInterval);
		}
	}, 3000);
}

function stopLoading() {
	$('.slide-content-wrapper').eq(current_slide).find('.loader-rectangle_component').remove();
	$('.slider-image')[current_slide].style.filter = 'brightness(1)';
	// Show output menu, if exists
	if ($('.output-menu').length > 0) $('.output-menu').css('display', 'flex');
}

function displayOutput() {
	// Get the lightbox element
	var lightbox = document.getElementById('lightbox');

	// Get the lightbox's JSON script
	var script = lightbox.querySelector('script.w-json');

	// Parse the JSON script to get the current items
	var items = JSON.parse(script.innerHTML).items;

	// Remove all existing media from the items array
	items.length = 0;

	items.push({
		_id: 'after',
		fileName: 'after.png',
		url: `data:image/png;base64,${slides_content[current_slide].after}`,
		type: 'image',
	});

	items.push({
		_id: 'before',
		fileName: 'before.png',
		url: slides_content[current_slide].before,
		type: 'image',
	});

	// Update the JSON script with the new items array
	script.innerHTML = JSON.stringify({ items: items });

	// Initialize Webflow lightbox
	Webflow.require('lightbox').ready();

	var lightboxLink = $('#lightbox-trigger');
	lightboxLink.click();
}

function addOutputMenu(index) {
	$('.slide-content-wrapper').eq(index).append(OUTPUT_MENU);

	// Add event listeners
	$('.btn-regenerate').on('click', async function () {
		// Remove output menu
		$('.output-menu').remove();

		await generate(slides_content[index].before);
	});

	$('.btn-free-download').on('click', function () {
		if (slides_content[index].after === '') {
			alert('Por favor, aguarde a imagem ser processada.');
		} else {
			downloadFile(slides_content[index].after);
		}
	});

	$('.btn-full-screen').on('click', function () {
		if (slides_content[index].after === '' || slides_content[index].after === undefined) {
			alert('Por favor, aguarde a imagem ser processada.');
		} else {
			displayOutput();
		}
	});
}

function restartCanvas(index) {
	const selector = '.slider-image';
	let images = document.querySelectorAll(selector);

	if (index !== undefined) {
		images = [images[index]];
	}

	images.forEach((image) => {
		const canvas = document.createElement('canvas');
		canvas.style.top = image.offsetTop + 'px';
		canvas.style.left = image.offsetLeft + 'px';
		canvas.width = image.width;
		canvas.height = image.height;

		// Remove previous canvas, if any
		const previousCanvas = image.parentNode.querySelector('canvas');
		if (previousCanvas) {
			previousCanvas.parentNode.removeChild(previousCanvas);
		}

		image.parentNode.appendChild(canvas);

		const ctx = canvas.getContext('2d');
		ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

		let boxes = [];
		let currentBox = null;
		let boxCount = 0;
		const colors = ['#3782ff', '#2AB24D', '#DB4437'];
		const boxFillOpacity = 0.3;

		function drawBox(box) {
			const LABEL = 'ELEMENTO';
			ctx.strokeStyle = box.color;
			ctx.fillStyle = `${box.color}${Math.round(boxFillOpacity * 255).toString(16)}`;
			ctx.lineWidth = 2;
			ctx.strokeRect(box.x, box.y, box.width, box.height);
			ctx.fillRect(box.x, box.y, box.width, box.height);
			ctx.fillStyle = box.color;
			ctx.fillRect(box.x, box.y, ctx.measureText(LABEL).width + 8, 20);
			ctx.fillStyle = '#fff';
			ctx.font = '500 14px Eudoxussans';
			ctx.letterSpacing = '2px';
			ctx.fillText(LABEL.toUpperCase(), box.x + 5, box.y + 15);
		}

		function handleMouseDown(event) {
			if (boxCount >= colors.length) {
				return;
			}
			if (currentBox) {
				drawBox(currentBox);
				boxes.push(currentBox);
				currentBox = null;
				boxCount++;
				if (boxCount >= colors.length) {
					canvas.removeEventListener('mousemove', handleMouseMove);
				}
				console.log('boxes', boxes);
				// Update elements block
				updateElements(current_slide, boxes.length - 1, '');
			} else {
				const { offsetX, offsetY } = event;
				currentBox = {
					x: offsetX,
					y: offsetY,
					width: 0,
					height: 0,
					color: colors[boxCount],
				};
			}
		}

		function handleMouseMove(event) {
			if (currentBox) {
				const { offsetX, offsetY } = event;
				currentBox.width = offsetX - currentBox.x;
				currentBox.height = offsetY - currentBox.y;

				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
				boxes.forEach(drawBox);
				drawBox(currentBox);
			}
		}

		function handleMouseUp(event) {
			if (currentBox) {
				const { offsetX, offsetY } = event;
				currentBox.width = offsetX - currentBox.x;
				currentBox.height = offsetY - currentBox.y;

				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
				boxes.forEach(drawBox);
				drawBox(currentBox);
			}
		}

		canvas.addEventListener('mousedown', handleMouseDown);
		canvas.addEventListener('mousemove', handleMouseMove);
		canvas.addEventListener('mouseup', handleMouseUp);
	});
}

function updateElements(element_index = 0, element_text = '') {
	if (element_index === -1) {
		// Restart elements
		elements[current_slide] = [];

		// Hide elements block
		$('.elements-input-block').css('display', 'none');

		// Show elements placeholder
		$('.elements-placeholder').css('display', 'flex');
		return;
	}

	console.log(element_index);
	console.log(elements);

	elements[current_slide][element_index] = element_text;

	// Hide elements placeholder
	$('.elements-placeholder').css('display', 'none');

	elements[current_slide][element_index] = element_text;

	$('.element-input-wrapper').each(function (index, elementWrapper) {
		elementWrapper.css(
			'display',
			elements[current_slide][element_index] === null ? 'none' : 'flex'
		);
	});

	// Show elements block
	$('.elements-input-block').css('display', 'flex');
}

// NOTE Listeners

window.addEventListener('LR_DATA_OUTPUT', (e) => {
	if (e.detail.ctx === 'upload-context') {
		// Push e.detail.data[] values to images array~
		e.detail.data.forEach((image) => {
			images.push(image);
		});
	}
});

$(document).ready(function () {
	$('#unfurnished').change(function () {
		if (this.checked) {
			$('.room-input').show();
		} else {
			$('.room-input').hide();
		}
	});
});

$(document).on('click', '#elements-reset', function () {
	updateElements(-1);
	restartCanvas(current_slide);
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
		});
		elements.push([]);
	});

	// Update slides
	updateSlides();
	console.log('Restarting canvas...');
	restartCanvas();
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
	await generate(slides_content[current_slide].before);
});

$(document).on('click', '.thumb-block', function () {
	// Add keyword to styles
	tagify_styles.addTags([`estilo ${$(this).find('.style-title').text()}`]);
});

$(document).on('click', '#btn-add-images', function () {
	$('lr-drop-area').click();

	if ($('.uploadcare-section').css('display') === 'none') {
		$('.uploadcare-section').css('display', 'flex');
		$('#slider-container').css('display', 'none');
		slides_content = [];

		// // Remove all images
		// $('.slide-content-wrapper').html('');

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

$(document).on('mouseenter', '.tippy', function () {
	tippy(this);
});
