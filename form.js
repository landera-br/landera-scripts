// NOTE External CDN URL https://cdn.jsdelivr.net/gh/landera-br/landera-scripts@latest/form.js
// NOTE 👆 Update CDN URL https://purge.jsdelivr.net/gh/landera-br/landera-scripts@latest/form.js

function updateInterface(provider = null, selectedAccount = null) {
	const formBlock = document.querySelector('#form-block');
	const helpBlock = document.querySelector('#help-block');

	if (provider) {
		helpBlock.style.display = 'none';
		formBlock.style.display = 'block';
	} else {
		formBlock.style.display = 'none';
		helpBlock.style.display = 'block';
	}

	// NOTE Get forms wallet data
	const chain = document.querySelector('#field-chain');
	const walletAddress = document.querySelector('#field-wallet-address');

	chain.value = 'Polygon';
	chain.disabled = true;
	walletAddress.value = selectedAccount;
	walletAddress.disabled = true;
}

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
		$('.furniture-props').css('display', 'grid');
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
		$('.condo-props').css('display', 'block');
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

if (searchParams.has('plan'))
	if (searchParams.get('plan') === 'premium') $('#select-plan').val('premium');

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

	for (let [key, value] of formData.entries()) {
		console.log(`${key}: ${value}`);
	}

	$('#btn-submit').val('Enviando...');
	$('#btn-submit').addClass('sending-button');

	try {
		const response = await fetch(
			'https://landera-network-7ikj4ovbfa-uc.a.run.app/api/v1/transactions',
			{
				method: 'post',
				body: formData,
			}
		);

		console.log(response);

		if (!Object.keys(response).length || response.ipfs_cid === '')
			throw Error('Unable to upload data');

		$('#ipfs-cid').val(response.ipfs_cid);

		// NOTE Redirect to Stripe
		$('#select-plan').val() === 'premium'
			? $('#form-block').attr('action', '/test1')
			: $('#form-block').attr('action', '/test2');

		$('#form-block').submit();
	} catch (error) {
		$('#btn-submit').addClass('error-button');
		$('#btn-submit').val('Ocorreu um erro');
	}
});

function getFormData() {
	if ($('#field-wallet-address').val())
		formData.append('mint_to_address', $('#field-wallet-address').val());

	if ($('#field-owner-email').val())
		formData.append('listing[owner_email]', $('#field-owner-email').val());

	if ($('#select-plan').val()) formData.append('listing[plan]', $('#select-plan').val());

	formData.append('listing[offer_type][sale]', $('#checkbox-sale').is(':checked') ? true : false);

	formData.append('listing[offer_type][rent]', $('#checkbox-rent').is(':checked') ? true : false);

	if ($('#field-listing-price').val())
		formData.append('listing[price]', $('#field-listing-price').val());

	if ($('#field-description').val())
		formData.append('listing[description]', $('#field-description').val());

	if ($('#field-area').val()) formData.append('listing[overview][area]', $('#field-area').val());

	if ($('#checkbox-condo').is(':checked') || $('#checkbox-no-condo').is(':checked'))
		formData.append(
			'listing[overview][in_condo]',
			$('#checkbox-condo').is(':checked') ? true : false
		);

	if ($('#checkbox-furnished').is(':checked') || $('#checkbox-unfurnished').is(':checked'))
		formData.append(
			'listing[overview][furnished]',
			$('#checkbox-furnished').is(':checked') ? true : false
		);

	if ($('#radio-occupied').is(':checked') || $('#radio-unoccupied').is(':checked'))
		formData.append(
			'listing[overview][occupied]',
			$('#radio-occupied').is(':checked') ? true : false
		);

	if ($('#field-parking-lots').val())
		formData.append('listing[overview][parking_lots]', $('#field-parking-lots').val());

	if ($('#radio-penthouse').is(':checked') || $('#radio-no-penthouse').is(':checked'))
		formData.append(
			'listing[overview][penthouse]',
			$('#radio-penthouse').is(':checked') ? true : false
		);

	if ($('#select-solar-face').val())
		formData.append('listing[overview][solar_face]', $('#select-solar-face').val());

	if ($('#field-total-floors').val())
		formData.append('listing[overview][total_floors]', $('#field-total-floors').val());

	if ($('#checkbox-house').is(':checked') || $('#checkbox-apartment').is(':checked'))
		formData.append(
			'listing[overview][prop_type]',
			$('#checkbox-house').is(':checked') ? 'house' : 'apartment'
		);

	if ($('#field-cep').val()) formData.append('listing[address][cep]', $('#field-cep').val());
	if ($('#field-city').val()) formData.append('listing[address][city]', $('#field-city').val());
	if ($('#field-hood').val()) formData.append('listing[address][hood]', $('#field-hood').val());
	if ($('#field-state').val()) formData.append('listing[address][state]', $('#field-state').val());
	if ($('#field-street-name').val())
		formData.append('listing[address][street_name]', $('#field-street-name').val());
	if ($('#field-street-number').val())
		formData.append('listing[address][street_number]', $('#field-street-number').val());
	if ($('#field-addon').val()) formData.append('listing[address][addon]', $('#field-addon').val());

	formData.append(
		'listing[condo_amn][fitness_studio]',
		$('#checkbox-checkbox-condo-fitness-studio').is(':checked') ? true : false
	);

	formData.append(
		'listing[condo_amn][pool]',
		$('#checkbox-checkbox-condo-pool').is(':checked') ? true : false
	);

	formData.append(
		'listing[condo_amn][green_area]',
		$('#checkbox-checkbox-condo-green-area').is(':checked') ? true : false
	);

	formData.append(
		'listing[condo_amn][party_room]',
		$('#checkbox-checkbox-condo-party-room').is(':checked') ? true : false
	);

	formData.append(
		'listing[condo_amn][game_room]',
		$('#checkbox-checkbox-condo-game-room').is(':checked') ? true : false
	);

	formData.append(
		'listing[condo_amn][sports_court]',
		$('#checkbox-checkbox-condo-sports-court').is(':checked') ? true : false
	);

	formData.append(
		'listing[condo_amn][laundry]',
		$('#checkbox-checkbox-condo-laundry').is(':checked') ? true : false
	);

	formData.append(
		'listing[condo_amn][playground]',
		$('#checkbox-checkbox-condo-playground').is(':checked') ? true : false
	);

	formData.append(
		'listing[condo_amn][toy_room]',
		$('#checkbox-checkbox-condo-toy-room').is(':checked') ? true : false
	);

	formData.append(
		'listing[condo_amn][sauna]',
		$('#checkbox-checkbox-condo-sauna').is(':checked') ? true : false
	);

	formData.append(
		'listing[condo_amn][pet_friendly]',
		$('#checkbox-pet-friendly').is(':checked') ? true : false
	);

	formData.append('listing[interior_amn][sofa]', $('#checkbox-sofa').is(':checked') ? true : false);

	formData.append(
		'listing[interior_amn][table]',
		$('#checkbox-table').is(':checked') ? true : false
	);

	formData.append(
		'listing[interior_amn][kitchen_cabinet]',
		$('#checkbox-kitchen-cabinet').is(':checked') ? true : false
	);

	formData.append(
		'listing[interior_amn][refrigerator]',
		$('#checkbox-refrigerator').is(':checked') ? true : false
	);

	formData.append(
		'listing[interior_amn][wardrobe]',
		$('#checkbox-wardrobe').is(':checked') ? true : false
	);

	formData.append('listing[interior_amn][bed]', $('#checkbox-bed').is(':checked') ? true : false);

	formData.append(
		'listing[interior_amn][garden]',
		$('#checkbox-garden').is(':checked') ? true : false
	);

	formData.append(
		'listing[interior_amn][gas_shower]',
		$('#checkbox-gas-shower').is(':checked') ? true : false
	);

	formData.append(
		'listing[interior_amn][stove]',
		$('#checkbox-stove').is(':checked') ? true : false
	);

	formData.append(
		'listing[interior_amn][microwave]',
		$('#checkbox-microwave').is(':checked') ? true : false
	);

	formData.append(
		'listing[interior_amn][fitness_studio]',
		$('#checkbox-fitness-studio').is(':checked') ? true : false
	);

	formData.append('listing[interior_amn][pool]', $('#checkbox-pool').is(':checked') ? true : false);

	if ($('#field-bedrooms').val())
		formData.append('listing[rooms][bedrooms]', $('#field-bedrooms').val());

	if ($('#field-suites').val()) formData.append('listing[rooms][suites]', $('#field-suites').val());

	if ($('#field-bathrooms').val())
		formData.append('listing[rooms][bathrooms]', $('#field-bathrooms').val());

	if ($('#field-toilets').val())
		formData.append('listing[rooms][toilets]', $('#field-toilets').val());

	if ($('#field-kitchens').val())
		formData.append('listing[rooms][kitchens]', $('#field-kitchens').val());

	if ($('#field-offices').val())
		formData.append('listing[rooms][offices]', $('#field-offices').val());

	if ($('#field-dining-rooms').val())
		formData.append('listing[rooms][dining_rooms]', $('#field-dining-rooms').val());

	if ($('#field-living-rooms').val())
		formData.append('listing[rooms][living_rooms]', $('#field-living-rooms').val());

	if ($('#field-toy-rooms').val())
		formData.append('listing[rooms][toy_rooms]', $('#field-toy-rooms').val());

	if ($('#field-eating-areas').val())
		formData.append('listing[rooms][eating_areas]', $('#field-eating-areas').val());

	if ($('#field-service-areas').val())
		formData.append('listing[rooms][service_areas]', $('#field-service-areas').val());

	if ($('#field-home-theaters').val())
		formData.append('listing[rooms][home_theaters]', $('#field-home-theaters').val());

	if ($('#field-condo').val()) formData.append('listing[taxes][condo]', $('#field-condo').val());

	if ($('#field-iptu').val()) formData.append('listing[taxes][iptu]', $('#field-iptu').val());

	if ($('#field-iptu-extra').val())
		formData.append('listing[taxes][others]', $('#field-iptu-extra').val());
}

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
}
