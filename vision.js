// Load components
$(document).ready(function () {
	// Select all elements with the class "slider-wrapper" and loop through them
	const sliderWrappers = document.getElementsByClassName('slider-wrapper');
	for (const sliderWrapper of sliderWrappers) {
		console.log(sliderWrapper);
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

window.addEventListener('LR_DATA_OUTPUT', (e) => {
	if (e.detail.ctx === 'upload-context') {
		images = e.detail.data;
	}

	$('.done-btn').click(() => {
		$('.uploadcare-section').hide();
		$('.result-canvas').show();

		// Loop through images and add to slides_content
		for (const image of images) {
			slides_content.push({ state: 'input', before: image.cdnUrl, after: '' });
		}

		// Update slides
		updateSlides();
	});
});

function updateSlides(slide = null) {
	let mask = document.getElementById('mask');

	mask.innerHTML = '';

	if (slide) {
		// Update single slide
	} else {
		// Update all slides based on slides_content
		for (const slide of slides_content) {
			if (slide.state === 'input') {
				// Add input slide
				mask.innerHTML += `<div class="result-slide w-slide" aria-label="2 of 3" role="group" style="transform: translateX(-1150px); opacity: 1; transition: transform 500ms ease 0s;"><div class="image-wrapper"><img src="${slide.before}" loading="lazy" sizes="(max-width: 479px) 66vw, (max-width: 767px) 79vw, (max-width: 991px) 59vw, (max-width: 1279px) 62vw, (max-width: 1439px) 64vw, (max-width: 1919px) 67vw, 73vw" alt="" class="image-61"><a href="#" class="btn-generate w-button">Gerar imagem</a></div></div>`;
				continue;
			}

			if (slide.state === 'result') {
				// Add result slide
				mask.innerHTML += ``;
				continue;
			}

			// Add loading slide
			mask.innerHTML += `<div class="result-slide w-slide" aria-label="1 of 3" role="group" style="transform: translateX(0px); opacity: 1; transition: transform 500ms ease 0s;"><div class="loading-wrapper"><div class="loading-lottie" data-w-id="d4c2b18d-b35b-b48b-19f8-703f27eababa" data-animation-type="lottie" data-src="https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/6429e6622b8b8c1d86661637_ab-%5Baint%20(2).json" data-loop="1" data-direction="1" data-autoplay="1" data-is-ix2-target="0" data-renderer="svg" data-default-duration="8" data-duration="0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400" preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);"><defs><clipPath id="__lottie_element_2"><rect width="400" height="400" x="0" y="0"></rect></clipPath></defs><g clip-path="url(#__lottie_element_2)"><g transform="matrix(1.0273606777191162,0,0,1.0273606777191162,64.13154602050781,9.681427001953125)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,132.25,185.25)"><path fill="rgb(27,21,72)" fill-opacity="1" d=" M125,178 C125,178 -125,178 -125,178 C-125,178 -125,-178 -125,-178 C-125,-178 125,-178 125,-178 C125,-178 125,178 125,178z M132,-185 C132,-185 -132,-185 -132,-185 C-132,-185 -132,185 -132,185 C-132,185 132,185 132,185 C132,185 132,-185 132,-185z"></path></g></g><g transform="matrix(1,0,0,1,80.26000213623047,27.025985717773438)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,119.73999786376953,172.97300720214844)"><path fill="rgb(244,250,255)" fill-opacity="1" d=" M119.48999786376953,172.72300720214844 C119.48999786376953,172.72300720214844 -119.48999786376953,172.72300720214844 -119.48999786376953,172.72300720214844 C-119.48999786376953,172.72300720214844 -119.48999786376953,-172.72300720214844 -119.48999786376953,-172.72300720214844 C-119.48999786376953,-172.72300720214844 119.48999786376953,-172.72300720214844 119.48999786376953,-172.72300720214844 C119.48999786376953,-172.72300720214844 119.48999786376953,172.72300720214844 119.48999786376953,172.72300720214844z"></path></g></g><g transform="matrix(1,0,0,1,108.72899627685547,196.68600463867188)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(-0.30040279030799866,0.9538124203681946,-0.9538124203681946,-0.30040279030799866,136.51600646972656,46.97600173950195)"><path fill="rgb(55,129,255)" fill-opacity="1" d=" M-57.82899856567383,-43.85100173950195 C-57.82899856567383,-43.85100173950195 -20.424999237060547,-63.76599884033203 5.235000133514404,-68.87200164794922 C19.18899917602539,-71.64900207519531 61.91600036621094,-79.97899627685547 76.7239990234375,-70.91500091552734 C81.08799743652344,-68.24400329589844 84.43099975585938,-66.1719970703125 86.97699737548828,-64.5770034790039 C91.27200317382812,-61.88800048828125 92.68099975585938,-56.29800033569336 90.18499755859375,-51.888999938964844 C90.18499755859375,-51.888999938964844 74.93699645996094,-24.957000732421875 74.93699645996094,-24.957000732421875 C74.93699645996094,-24.957000732421875 29.87299919128418,43.85100173950195 10.086000442504883,51.382999420166016 C-9.701000213623047,58.915000915527344 -55.2760009765625,76.14900207519531 -55.2760009765625,76.14900207519531 C-55.2760009765625,76.14900207519531 -72.51000213623047,79.97899627685547 -82.59500122070312,63.63800048828125 C-92.68000030517578,47.29800033569336 -81.8290023803711,-7.5960001945495605 -81.8290023803711,-7.5960001945495605 C-81.8290023803711,-7.5960001945495605 -80.46700286865234,-27.680999755859375 -57.82899856567383,-43.85100173950195z"></path></g></g><g transform="matrix(1,0,0,1,97.05699920654297,39.57300567626953)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(0.3799256980419159,-0.9250169992446899,0.9250169992446899,0.3799256980419159,90.08999633789062,97.03399658203125)"><path fill="rgb(15,52,42)" fill-opacity="1" d=" M81.22799682617188,10.866000175476074 C81.22799682617188,10.866000175476074 90.14700317382812,-52.20800018310547 68.46199798583984,-67.26200103759766 C39.59600067138672,-87.3010025024414 -54.35900115966797,-91.73600006103516 -86.1449966430664,-67.23799896240234 C-89.58399963378906,-64.58699798583984 -90.14600372314453,-59.62300109863281 -87.32099914550781,-56.32400131225586 C-87.32099914550781,-56.32400131225586 26.770999908447266,76.86599731445312 26.770999908447266,76.86599731445312 C27.000999450683594,77.13500213623047 27.246000289916992,77.38400268554688 27.511999130249023,77.61699676513672 C30.086000442504883,79.88099670410156 44.10499954223633,91.73699951171875 52.12200164794922,88.65399932861328 C60.972999572753906,85.25 65.31199645996094,84.65399932861328 69.14199829101562,69.58999633789062 C72.97200012207031,54.527000427246094 81.22799682617188,10.866000175476074 81.22799682617188,10.866000175476074z"></path></g></g><g transform="matrix(0.9998365640640259,-0.018078967928886414,0.018078967928886414,0.9998365640640259,88.86991882324219,215.92588806152344)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,59.7400016784668,72.50599670410156)"><path fill="rgb(41,177,77)" fill-opacity="1" d=" M-59.4900016784668,-72.25599670410156 C-59.4900016784668,-72.25599670410156 59.23400115966797,-70.7229995727539 59.23400115966797,-70.7229995727539 C59.23400115966797,-70.7229995727539 59.4900016784668,-61.7869987487793 59.4900016784668,-61.7869987487793 C59.4900016784668,-61.7869987487793 0.2549999952316284,-49.659000396728516 -17.489999771118164,-35.23400115966797 C-36.20199966430664,-20.02199935913086 -38.29899978637695,-13.276000022888184 -43.65999984741211,7.914999961853027 C-51.547000885009766,39.0880012512207 -48.766998291015625,49.02199935913086 -51.57500076293945,57.19200134277344 C-54.38399887084961,65.36199951171875 -58.46900177001953,72.25599670410156 -58.46900177001953,72.25599670410156 C-58.46900177001953,72.25599670410156 -59.4900016784668,-72.25599670410156 -59.4900016784668,-72.25599670410156z"></path></g></g><g transform="matrix(1,0,0,1,239.06900024414062,250.17599487304688)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,33.31100082397461,-143.947998046875)"><path fill="rgb(145,205,153)" fill-opacity="1" d=" M-28.084999084472656,0 C-28.084999084472656,15.51099967956543 -15.51099967956543,28.084999084472656 0,28.084999084472656 C15.51099967956543,28.084999084472656 28.084999084472656,15.51099967956543 28.084999084472656,0 C28.084999084472656,-15.51099967956543 15.51099967956543,-28.084999084472656 0,-28.084999084472656 C-15.51099967956543,-28.084999084472656 -28.084999084472656,-15.51099967956543 -28.084999084472656,0z"></path></g></g><g transform="matrix(1,0,0,1,152.07400512695312,328.62799072265625)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(0.34642988443374634,0.938075840473175,-0.938075840473175,0.34642988443374634,7.7789998054504395,-143.53799438476562)"><path stroke-linecap="square" stroke-linejoin="round" fill-opacity="0" stroke="rgb(27,21,72)" stroke-opacity="1" stroke-width="7" d=" M3.5,3.5 C3.5,3.5 157.20199584960938,3.5 157.20199584960938,3.5"></path></g></g><g transform="matrix(0.31820008158683777,-0.9480235576629639,0.9480235576629639,0.31820008158683777,247.7501678466797,253.41152954101562)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,49.87900161743164,15.449000358581543)"><path fill="rgb(241,231,211)" fill-opacity="1" d=" M-44.055999755859375,15.168999671936035 C-44.055999755859375,15.168999671936035 38.99100112915039,14.418000221252441 38.99100112915039,14.418000221252441 C38.99100112915039,14.418000221252441 49.630001068115234,10.418000221252441 47.84199905395508,4.886000156402588 C46.05500030517578,-0.6460000276565552 38.13999938964844,-11.454999923706055 34.224998474121094,-12.47599983215332 C30.309999465942383,-13.496999740600586 28.523000717163086,-15.199000358581543 25.885000228881836,-9.411999702453613 C23.246999740600586,-3.625 19.50200080871582,3.6089999675750732 15.16100025177002,2.1619999408721924 C10.821000099182129,0.7160000205039978 5.459000110626221,-5.497000217437744 3.4170000553131104,-6.3480000495910645 C1.3739999532699585,-7.198999881744385 -1.5190000534057617,3.5239999294281006 -4.243000030517578,3.694000005722046 C-6.966000080108643,3.864000082015991 -11.222000122070312,0.5450000166893005 -15.47700023651123,-2.6040000915527344 C-19.73200035095215,-5.752999782562256 -25.264999389648438,-9.753000259399414 -27.39299964904785,-7.198999881744385 C-29.520000457763672,-4.645999908447266 -29.179000854492188,-3.0290000438690186 -29.94499969482422,0.11999999731779099 C-30.711000442504883,3.2690000534057617 -33.47800064086914,4.289999961853027 -34.88199996948242,3.184000015258789 C-36.2859992980957,2.0769999027252197 -36.75299835205078,-0.39100000262260437 -41.86000061035156,-0.39100000262260437 C-44.73400115966797,-0.39100000262260437 -47.069000244140625,4.557000160217285 -48.56100082397461,8.883000373840332 C-49.62900161743164,11.977999687194824 -47.32899856567383,15.199000358581543 -44.055999755859375,15.168999671936035z"></path></g></g><g transform="matrix(1,0,0,1,200,200)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(154,97,106)" fill-opacity="1" d=" M-390,120.5"></path><path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4" stroke="rgb(255,255,255)" stroke-opacity="1" stroke-width="2" d=" M-390,120.5"></path></g></g></g></svg></div></div></div>`;
		}
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
	$('.result-canvas').hide();
	$('.uploadcare-section').show();
});
