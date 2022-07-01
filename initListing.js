// // NOTE Get forms wallet data
// const walletAddress = document.querySelector('#field-wallet-address');

// walletAddress.value = selectedAccount;
// walletAddress.disabled = true;

$('#btn-init-form').on('click', async function (event) {
	event.stopPropagation();
	event.stopImmediatePropagation();
	$('#w3a-container').css({ position: 'relative', 'z-index': 1001 });

	try {
		const provider = await web3auth.connect();

		$('#btn-account').show();
		$('#btn-wallet-connect').hide();

		showForm(true);
	} catch (error) {
		console.error(error.message);
		showForm(false);
	}
});

// NOTE Checkboxes
$('#checkbox-house').click(function () {
	$('#checkbox-house-field').toggleClass('checkbox-selected');
	if ($('#checkbox-house').is(':checked')) {
		$('.apt-props').css('display', 'none');
		$('#checkbox-apartment').prop('checked', false);
		$('#checkbox-apartment-field').removeClass('checkbox-selected');

		$('#field-total-floors').val('');
		$('#radio-penthouse').prop('checked', false);
		$('#radio-no-penthouse').prop('checked', false);
	} else {
		$('#checkbox-house').prop('checked', false);
	}
});

$('#checkbox-apartment').click(function () {
	$('#checkbox-apartment-field').toggleClass('checkbox-selected');
	if ($('#checkbox-apartment').is(':checked')) {
		$('.apt-props').css('display', 'block');
		$('#checkbox-house').prop('checked', false);
		$('#checkbox-house-field').removeClass('checkbox-selected');
	} else {
		$('.apt-props').css('display', 'none');
		$('#checkbox-apartment').prop('checked', false);
		$('#field-total-floors').val('');
		$('#radio-penthouse').prop('checked', false);
		$('#radio-no-penthouse').prop('checked', false);
	}
});

$('#checkbox-furnished').click(function () {
	$('#checkbox-furnished-field').toggleClass('checkbox-selected');
	if ($('#checkbox-furnished').is(':checked')) {
		$('.furniture-props').css('display', 'grid');
		$('#checkbox-unfurnished').prop('checked', false);
		$('#checkbox-unfurnished-field').removeClass('checkbox-selected');
	} else {
		$('.furniture-props').css('display', 'none');
		$('#checkbox-furnished').prop('checked', false);
		cleanFurniture();
	}
});

$('#checkbox-unfurnished').click(function () {
	$('#checkbox-unfurnished-field').toggleClass('checkbox-selected');
	if ($('#checkbox-unfurnished').is(':checked')) {
		$('.furniture-props').css('display', 'none');
		$('#checkbox-furnished').prop('checked', false);
		$('#checkbox-furnished-field').removeClass('checkbox-selected');
		cleanFurniture();
	} else {
		$('#checkbox-unfurnished').prop('checked', false);
	}
});

$('#checkbox-condo').click(function () {
	$('#checkbox-condo-field').toggleClass('checkbox-selected');
	if ($('#checkbox-condo').is(':checked')) {
		$('.condo-props').css('display', 'block');
		$('#checkbox-no-condo').prop('checked', false);
		$('#checkbox-no-condo-field').removeClass('checkbox-selected');
	} else {
		$('.condo-props').css('display', 'none');
		$('#checkbox-condo').prop('checked', false);
		cleanCondo();
	}
});

$('#checkbox-no-condo').click(function () {
	$('#checkbox-no-condo-field').toggleClass('checkbox-selected');
	if ($('#checkbox-no-condo').is(':checked')) {
		$('.condo-props').css('display', 'none');
		$('#checkbox-condo').prop('checked', false);
		$('#checkbox-condo-field').removeClass('checkbox-selected');
		cleanCondo();
	} else {
		$('#checkbox-no-condo').prop('checked', false);
	}
});

// NOTE Counters

$('#field-bedrooms').val(0);
$('#field-suites').val(0);
$('#field-bathrooms').val(0);
$('#field-toilets').val(0);
$('#field-kitchens').val(0);
$('#field-offices').val(0);
$('#field-dining-rooms').val(0);
$('#field-living-rooms').val(0);
$('#field-toy-rooms').val(0);
$('#field-eating-areas').val(0);
$('#field-service-areas').val(0);
$('#field-home-theaters').val(0);

$('#plus-bedrooms').on('click', () =>
	$('#field-bedrooms').val() !== ''
		? $('#field-bedrooms').val(parseInt($('#field-bedrooms').val()) + 1)
		: $('#field-bedrooms').val(1)
);

$('#minus-bedrooms').on('click', () => {
	if ($('#field-bedrooms').val() > 0)
		$('#field-bedrooms').val(parseInt($('#field-bedrooms').val()) - 1);
});

$('#plus-suites').on('click', () =>
	$('#field-suites').val() !== ''
		? $('#field-suites').val(parseInt($('#field-suites').val()) + 1)
		: $('#field-suites').val(1)
);

$('#minus-suites').on('click', () => {
	if ($('#field-suites').val() > 0) $('#field-suites').val(parseInt($('#field-suites').val()) - 1);
});

$('#plus-bathrooms').on('click', () =>
	$('#field-bathrooms').val() !== ''
		? $('#field-bathrooms').val(parseInt($('#field-bathrooms').val()) + 1)
		: $('#field-bathrooms').val(1)
);

$('#minus-bathrooms').on('click', () => {
	if ($('#field-bathrooms').val() > 0)
		$('#field-bathrooms').val(parseInt($('#field-bathrooms').val()) - 1);
});

$('#plus-toilets').on('click', () =>
	$('#field-toilets').val() !== ''
		? $('#field-toilets').val(parseInt($('#field-toilets').val()) + 1)
		: $('#field-toilets').val(1)
);

$('#minus-toilets').on('click', () => {
	if ($('#field-toilets').val() > 0)
		$('#field-toilets').val(parseInt($('#field-toilets').val()) - 1);
});

$('#plus-kitchens').on('click', () =>
	$('#field-kitchens').val() !== ''
		? $('#field-kitchens').val(parseInt($('#field-kitchens').val()) + 1)
		: $('#field-kitchens').val(1)
);

$('#minus-kitchens').on('click', () => {
	if ($('#field-kitchens').val() > 0)
		$('#field-kitchens').val(parseInt($('#field-kitchens').val()) - 1);
});

$('#plus-offices').on('click', () =>
	$('#field-offices').val() !== ''
		? $('#field-offices').val(parseInt($('#field-offices').val()) + 1)
		: $('#field-offices').val(1)
);

$('#minus-offices').on('click', () => {
	if ($('#field-offices').val() > 0)
		$('#field-offices').val(parseInt($('#field-offices').val()) - 1);
});

$('#plus-dining-rooms').on('click', () =>
	$('#field-dining-rooms').val() !== ''
		? $('#field-dining-rooms').val(parseInt($('#field-dining-rooms').val()) + 1)
		: $('#field-dining-rooms').val(1)
);

$('#minus-dining-rooms').on('click', () => {
	if ($('#field-dining-rooms').val() > 0)
		$('#field-dining-rooms').val(parseInt($('#field-dining-rooms').val()) - 1);
});

$('#plus-living-rooms').on('click', () =>
	$('#field-living-rooms').val() !== ''
		? $('#field-living-rooms').val(parseInt($('#field-living-rooms').val()) + 1)
		: $('#field-living-rooms').val(1)
);

$('#minus-living-rooms').on('click', () => {
	if ($('#field-living-rooms').val() > 0)
		$('#field-living-rooms').val(parseInt($('#field-living-rooms').val()) - 1);
});

$('#plus-toy-rooms').on('click', () =>
	$('#field-toy-rooms').val() !== ''
		? $('#field-toy-rooms').val(parseInt($('#field-toy-rooms').val()) + 1)
		: $('#field-toy-rooms').val(1)
);

$('#minus-toy-rooms').on('click', () => {
	if ($('#field-toy-rooms').val() > 0)
		$('#field-toy-rooms').val(parseInt($('#field-toy-rooms').val()) - 1);
});

$('#plus-eating-areas').on('click', () =>
	$('#field-eating-areas').val() !== ''
		? $('#field-eating-areas').val(parseInt($('#field-eating-areas').val()) + 1)
		: $('#field-eating-areas').val(1)
);

$('#minus-eating-areas').on('click', () => {
	if ($('#field-eating-areas').val() > 0)
		$('#field-eating-areas').val(parseInt($('#field-eating-areas').val()) - 1);
});

$('#plus-service-areas').on('click', () =>
	$('#field-service-areas').val() !== ''
		? $('#field-service-areas').val(parseInt($('#field-service-areas').val()) + 1)
		: $('#field-service-areas').val(1)
);

$('#minus-service-areas').on('click', () => {
	if ($('#field-service-areas').val() > 0)
		$('#field-service-areas').val(parseInt($('#field-service-areas').val()) - 1);
});

$('#plus-home-theaters').on('click', () =>
	$('#field-home-theaters').val() !== ''
		? $('#field-home-theaters').val(parseInt($('#field-home-theaters').val()) + 1)
		: $('#field-home-theaters').val(1)
);

$('#minus-home-theaters').on('click', () => {
	if ($('#field-home-theaters').val() > 0)
		$('#field-home-theaters').val(parseInt($('#field-home-theaters').val()) - 1);
});

// NOTE File upload
const thumbInput = document.querySelector('#thumb-input');
const thumbFilename = document.querySelector('#thumb-filename');
const thumbDropzone = document.querySelector('#thumb-dropzone');

const imagesInput = document.querySelector('#images-input');
const imagesFilename = document.querySelector('#images-filename');
const imagesDropzone = document.querySelector('#images-dropzone');

let formData = new FormData();

const searchParams = new URLSearchParams(window.location.search);

// TODO When switch to paid plans
// if (searchParams.has('plan'))
// 	if (searchParams.get('plan') === 'premium') $('#select-plan').val('premium');

thumbInput.addEventListener('change', function (e) {
	formData.delete('thumb');
	formData.append('thumb', e.target.files[0]);
	thumbFilename.innerText = thumbInput.value.split('\\').pop();
});

thumbInput.addEventListener('dragenter', function () {
	thumbDropzone.classList.add('dragover');
});

imagesInput.addEventListener('change', function (e) {
	let filenames = '';
	formData.delete('images');
	for (var i = 0; i < imagesInput.files.length; ++i) {
		formData.append('images', e.target.files[i]);
		filenames = filenames.concat(imagesInput.files.item(i).name + '\n');
	}
	imagesFilename.innerText = filenames;
});

imagesInput.addEventListener('dragenter', function () {
	imagesDropzone.classList.add('dragover');
});

// NOTE When form is submitted
$('#btn-submit').on('click', async (e) => {
	e.preventDefault();

	if ($('#btn-submit').hasClass('error-button') || $('#btn-submit').hasClass('sending-button'))
		return false;

	// NOTE Get form data
	getFormData();

	$('#btn-submit').val('Enviando...');
	$('#btn-submit').addClass('sending-button');

	try {
		const response = await fetch(
			'https://landera-network-7ikj4ovbfa-uc.a.run.app/api/v1/listings',
			{
				method: 'post',
				body: formData,
			}
		);

		const responseData = await response.json();

		if (
			!response.ok ||
			!Object.keys(responseData).length ||
			responseData.ipfs_cid === '' ||
			responseData.transaction_id === ''
		)
			throw Error(
				responseData.message
					? responseData.message
					: 'Ocorreu um erro ao preencher o formulário. Por favor, preencha todos os campos e tente novamente.'
			);

		// TODO When paid plans, redirect to  session_url (Stripe)
		// const redirectUrl = responseData.session_url;

		// NOTE Redirecting to Success Page
		const redirectUrl = `/form/listing-success?transaction_id=${responseData.transaction_id}`;

		window.location.replace(redirectUrl);
	} catch (error) {
		if (!alert(error.message)) {
			$('#btn-submit').removeClass('sending-button');
			$('#btn-submit').val('Confirmar');
			resetFormData();
		}
	}
});

function getFormData() {
	const data = {
		mint_to_address: $('#field-wallet-address').val(),
		subscription: {
			plan: $('#select-plan').val(),
		},
		listing: {
			owner_email: $('#field-owner-email').val(),
			price: Number($('#field-listing-price').val()),
			description: $('#field-description').val(),
			offer_type: {
				sale: $('#checkbox-sale').is(':checked'),
				rent: $('#checkbox-rent').is(':checked'),
			},
			overview: {
				area: Number($('#field-area').val()),
				in_condo: $('#checkbox-condo').is(':checked'),
				furnished: $('#checkbox-furnished').is(':checked')
					? true
					: $('#checkbox-unfurnished').is(':checked')
					? false
					: undefined,
				occupied: $('#radio-occupied').is(':checked')
					? true
					: $('#radio-unoccupied').is(':checked')
					? false
					: undefined,
				parking_lots: Number($('#field-parking-lots').val()),
				penthouse: $('#radio-penthouse').is(':checked') ? true : false,
				solar_face: $('#select-solar-face').val(),
				total_floors: Number($('#field-total-floors').val()),
				prop_type: $('#checkbox-house').is(':checked')
					? 'house'
					: $('#checkbox-apartment').is(':checked')
					? 'apartment'
					: undefined,
			},
			address: {
				cep: $('#field-cep').val(),
				city: $('#field-city').val(),
				hood: $('#field-hood').val(),
				state: $('#field-state').val(),
				street_name: $('#field-street-name').val(),
				street_number: Number($('#field-street-number').val()),
				addon: $('#field-addon').val(),
			},
			condo_amn: {
				fitness_studio: $('#checkbox-condo-fitness-studio').is(':checked'),
				pool: $('#checkbox-condo-pool').is(':checked'),
				green_area: $('#checkbox-condo-green-area').is(':checked'),
				party_room: $('#checkbox-condo-party-room').is(':checked'),
				game_room: $('#checkbox-condo-game-room').is(':checked'),
				sports_court: $('#checkbox-condo-sports-court').is(':checked'),
				laundry: $('#checkbox-condo-laundry').is(':checked'),
				playground: $('#checkbox-condo-playground').is(':checked'),
				toy_room: $('#checkbox-condo-toy-room').is(':checked'),
				sauna: $('#checkbox-condo-sauna').is(':checked'),
				pet_friendly: $('#checkbox-condo-pet-friendly').is(':checked'),
			},
			interior_amn: {
				sofa: $('#checkbox-sofa').is(':checked'),
				table: $('#checkbox-table').is(':checked'),
				kitchen_cabinet: $('#checkbox-kitchen-cabinet').is(':checked'),
				refrigerator: $('#checkbox-refrigerator').is(':checked'),
				wardrobe: $('#checkbox-wardrobe').is(':checked'),
				bed: $('#checkbox-bed').is(':checked'),
				garden: $('#checkbox-garden').is(':checked'),
				gas_shower: $('#checkbox-gas-shower').is(':checked'),
				stove: $('#checkbox-stove').is(':checked'),
				microwave: $('#checkbox-microwave').is(':checked'),
				fitness_studio: $('#checkbox-fitness-studio').is(':checked'),
				pool: $('#checkbox-pool').is(':checked'),
			},
			rooms: {
				bedrooms: Number($('#field-bedrooms').val()),
				suites: Number($('#field-suites').val()),
				bathrooms: Number($('#field-bathrooms').val()),
				toilets: Number($('#field-toilets').val()),
				kitchens: Number($('#field-kitchens').val()),
				offices: Number($('#field-offices').val()),
				dining_rooms: Number($('#field-dining-rooms').val()),
				living_rooms: Number($('#field-living-rooms').val()),
				toy_rooms: Number($('#field-toy-rooms').val()),
				eating_areas: Number($('#field-eating-areas').val()),
				service_areas: Number($('#field-service-areas').val()),
				home_theaters: Number($('#field-home-theaters').val()),
			},
			taxes: {
				condo: Number($('#field-condo').val()),
				iptu: Number($('#field-iptu').val()),
				others: Number($('#field-iptu-extra').val()),
			},
		},
	};

	formData = objectToFormData(cleanObj(data), formData);
}

function objectToFormData(obj, form, namespace) {
	var fd = form || new FormData();
	var formKey;

	for (var property in obj) {
		if (obj.hasOwnProperty(property)) {
			if (namespace) {
				formKey = namespace + '[' + property + ']';
			} else {
				formKey = property;
			}

			// if the property is an object, but not a File,
			// use recursivity.
			if (typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
				objectToFormData(obj[property], fd, formKey);
			} else {
				// if it's a string or a File object
				fd.append(formKey, obj[property]);
			}
		}
	}

	return fd;
}

// NOTE Remove undefined, null and '' values
function cleanObj(object) {
	Object.entries(object).forEach(([k, v]) => {
		if (v && typeof v === 'object') {
			cleanObj(v);
		}
		if (
			(v && typeof v === 'object' && !Object.keys(v).length) ||
			v === null ||
			v === undefined ||
			v === ''
		) {
			if (Array.isArray(object)) {
				object.splice(k, 1);
			} else {
				delete object[k];
			}
		}
	});
	return object;
}

function resetFormData() {
	const thumb = formData.get('thumb');
	const images = formData.getAll('images');

	formData = new FormData();

	formData.append('thumb', thumb);
	images.forEach((image) => formData.append('images', image));
}

// NOTE Clean furniture data
function cleanFurniture() {
	$('#checkbox-sofa').prop('checked', false);
	$('#checkbox-table').prop('checked', false);
	$('#checkbox-kitchen-cabinet').prop('checked', false);
	$('#checkbox-refrigerator').prop('checked', false);
	$('#checkbox-wardrobe').prop('checked', false);
	$('#checkbox-bed').prop('checked', false);
	$('#checkbox-garden').prop('checked', false);
	$('#checkbox-gas-shower').prop('checked', false);
	$('#checkbox-stove').prop('checked', false);
	$('#checkbox-microwave').prop('checked', false);
	$('#checkbox-fitness-studio').prop('checked', false);
	$('#checkbox-pool').prop('checked', false);
}

// NOTE Clean condo data
function cleanCondo() {
	$('#checkbox-condo-fitness-studio').prop('checked', false);
	$('#checkbox-condo-pool').prop('checked', false);
	$('#checkbox-condo-green-area').prop('checked', false);
	$('#checkbox-condo-party-room').prop('checked', false);
	$('#checkbox-condo-game-room').prop('checked', false);
	$('#checkbox-condo-sports-court').prop('checked', false);
	$('#checkbox-condo-laundry').prop('checked', false);
	$('#checkbox-condo-playground').prop('checked', false);
	$('#checkbox-condo-toy-room').prop('checked', false);
	$('#checkbox-condo-sauna').prop('checked', false);
	$('#checkbox-condo-pet-friendly').prop('checked', false);
	$('#field-condo').val('');
}
