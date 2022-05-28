function updateInterface() {
	console.log('Atualizou');
	const formTitle = document.querySelector('#help-title');
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

	chain.value = 'Ethereum';
	chain.disabled = true;
	walletAddress.value = selectedAccount;
	walletAddress.disabled = true;
}

// NOTE Checkboxes
$('#checkbox-house').click(function () {
	$('#checkbox-house-field').toggleClass('checkbox-selected');
	if ($('#checkbox-house').is(':checked')) {
		$('#checkbox-apartment').prop('checked', false);
		$('#checkbox-apartment-field').removeClass('checkbox-selected');
	} else {
		$('#checkbox-house').prop('checked', false);
	}
});

$('#checkbox-apartment').click(function () {
	$('#checkbox-apartment-field').toggleClass('checkbox-selected');
	if ($('#checkbox-apartment').is(':checked')) {
		$('#checkbox-house').prop('checked', false);
		$('#checkbox-house-field').removeClass('checkbox-selected');
	} else {
		$('#checkbox-apartment').prop('checked', false);
	}
});

$('#checkbox-furniture').click(function () {
	$('#checkbox-furniture-field').toggleClass('checkbox-selected');
	if ($('#checkbox-furniture').is(':checked')) {
		$('#checkbox-no-furniture').prop('checked', false);
		$('#checkbox-no-furniture-field').removeClass('checkbox-selected');
	} else {
		$('#checkbox-furniture').prop('checked', false);
	}
});

$('#checkbox-no-furniture').click(function () {
	$('#checkbox-no-furniture-field').toggleClass('checkbox-selected');
	if ($('#checkbox-no-furniture').is(':checked')) {
		$('#checkbox-furniture').prop('checked', false);
		$('#checkbox-furniture-field').removeClass('checkbox-selected');
	} else {
		$('#checkbox-no-furniture').prop('checked', false);
	}
});

$('#checkbox-condo').click(function () {
	$('#checkbox-condo-field').toggleClass('checkbox-selected');
	if ($('#checkbox-condo').is(':checked')) {
		$('#checkbox-no-condo').prop('checked', false);
		$('#checkbox-no-condo-field').removeClass('checkbox-selected');
	} else {
		$('#checkbox-condo').prop('checked', false);
	}
});

$('#checkbox-no-condo').click(function () {
	$('#checkbox-no-condo-field').toggleClass('checkbox-selected');
	if ($('#checkbox-no-condo').is(':checked')) {
		$('#checkbox-condo').prop('checked', false);
		$('#checkbox-condo-field').removeClass('checkbox-selected');
	} else {
		$('#checkbox-no-condo').prop('checked', false);
	}
});

// NOTE Counters

$('#input-bedrooms').val(0);
$('#input-suites').val(0);
$('#input-bathrooms').val(0);
$('#input-toilets').val(0);
$('#input-kitchens').val(0);
$('#input-offices').val(0);
$('#input-dining-rooms').val(0);
$('#input-living-rooms').val(0);
$('#input-toy-rooms').val(0);
$('#input-eating-areas').val(0);
$('#input-service-areas').val(0);
$('#input-home-theaters').val(0);

$('#plus-bedrooms').on('click', () =>
	$('#input-bedrooms').val() !== ''
		? $('#input-bedrooms').val(parseInt($('#input-bedrooms').val()) + 1)
		: $('#input-bedrooms').val(1)
);

$('#minus-bedrooms').on('click', () => {
	if ($('#input-bedrooms').val() > 0)
		$('#input-bedrooms').val(parseInt($('#input-bedrooms').val()) - 1);
});

$('#plus-suites').on('click', () =>
	$('#input-suites').val() !== ''
		? $('#input-suites').val(parseInt($('#input-suites').val()) + 1)
		: $('#input-suites').val(1)
);

$('#minus-suites').on('click', () => {
	if ($('#input-suites').val() > 0) $('#input-suites').val(parseInt($('#input-suites').val()) - 1);
});

$('#plus-bathrooms').on('click', () =>
	$('#input-bathrooms').val() !== ''
		? $('#input-bathrooms').val(parseInt($('#input-bathrooms').val()) + 1)
		: $('#input-bathrooms').val(1)
);

$('#minus-bathrooms').on('click', () => {
	if ($('#input-bathrooms').val() > 0)
		$('#input-bathrooms').val(parseInt($('#input-bathrooms').val()) - 1);
});

$('#plus-toilets').on('click', () =>
	$('#input-toilets').val() !== ''
		? $('#input-toilets').val(parseInt($('#input-toilets').val()) + 1)
		: $('#input-toilets').val(1)
);

$('#minus-toilets').on('click', () => {
	if ($('#input-toilets').val() > 0)
		$('#input-toilets').val(parseInt($('#input-toilets').val()) - 1);
});

$('#plus-kitchens').on('click', () =>
	$('#input-kitchens').val() !== ''
		? $('#input-kitchens').val(parseInt($('#input-kitchens').val()) + 1)
		: $('#input-kitchens').val(1)
);

$('#minus-kitchens').on('click', () => {
	if ($('#input-kitchens').val() > 0)
		$('#input-kitchens').val(parseInt($('#input-kitchens').val()) - 1);
});

$('#plus-offices').on('click', () =>
	$('#input-offices').val() !== ''
		? $('#input-offices').val(parseInt($('#input-offices').val()) + 1)
		: $('#input-offices').val(1)
);

$('#minus-offices').on('click', () => {
	if ($('#input-offices').val() > 0)
		$('#input-offices').val(parseInt($('#input-offices').val()) - 1);
});

$('#plus-dining-rooms').on('click', () =>
	$('#input-dining-rooms').val() !== ''
		? $('#input-dining-rooms').val(parseInt($('#input-dining-rooms').val()) + 1)
		: $('#input-dining-rooms').val(1)
);

$('#minus-dining-rooms').on('click', () => {
	if ($('#input-dining-rooms').val() > 0)
		$('#input-dining-rooms').val(parseInt($('#input-dining-rooms').val()) - 1);
});

$('#plus-living-rooms').on('click', () =>
	$('#input-living-rooms').val() !== ''
		? $('#input-living-rooms').val(parseInt($('#input-living-rooms').val()) + 1)
		: $('#input-living-rooms').val(1)
);

$('#minus-living-rooms').on('click', () => {
	if ($('#input-living-rooms').val() > 0)
		$('#input-living-rooms').val(parseInt($('#input-living-rooms').val()) - 1);
});

$('#plus-toy-rooms').on('click', () =>
	$('#input-toy-rooms').val() !== ''
		? $('#input-toy-rooms').val(parseInt($('#input-toy-rooms').val()) + 1)
		: $('#input-toy-rooms').val(1)
);

$('#minus-toy-rooms').on('click', () => {
	if ($('#input-toy-rooms').val() > 0)
		$('#input-toy-rooms').val(parseInt($('#input-toy-rooms').val()) - 1);
});

$('#plus-eating-areas').on('click', () =>
	$('#input-eating-areas').val() !== ''
		? $('#input-eating-areas').val(parseInt($('#input-eating-areas').val()) + 1)
		: $('#input-eating-areas').val(1)
);

$('#minus-eating-areas').on('click', () => {
	if ($('#input-eating-areas').val() > 0)
		$('#input-eating-areas').val(parseInt($('#input-eating-areas').val()) - 1);
});

$('#plus-service-areas').on('click', () =>
	$('#input-service-areas').val() !== ''
		? $('#input-service-areas').val(parseInt($('#input-service-areas').val()) + 1)
		: $('#input-service-areas').val(1)
);

$('#minus-service-areas').on('click', () => {
	if ($('#input-service-areas').val() > 0)
		$('#input-service-areas').val(parseInt($('#input-service-areas').val()) - 1);
});

$('#plus-home-theaters').on('click', () =>
	$('#input-home-theaters').val() !== ''
		? $('#input-home-theaters').val(parseInt($('#input-home-theaters').val()) + 1)
		: $('#input-home-theaters').val(1)
);

$('#minus-home-theaters').on('click', () => {
	if ($('#input-home-theaters').val() > 0)
		$('#input-home-theaters').val(parseInt($('#input-home-theaters').val()) - 1);
});

// NOTE File upload
const thumbInput = document.querySelector('#thumb-input');
const thumbFilename = document.querySelector('#thumb-filename');
const thumbDropzone = document.querySelector('#thumb-dropzone');

const imagesInput = document.querySelector('#images-input');
const imagesFilename = document.querySelector('#images-filename');
const imagesDropzone = document.querySelector('#images-dropzone');

let formData = new FormData();

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
	// formData.append('mint_to_address', $('#field-wallet-address').val());
	// formData.append('listing[owner_email]', $('#').val());
	// formData.append('listing[offer_type]', $('#').val());
	// formData.append('listing[price]', $('#field-listing-price').val());
	// formData.append('listing[description]', $('#field-description').val());
	// formData.append('listing[overview][area]', $('#field-area').val());
	// formData.append('listing[overview][furnished]', $('#').val());
	// formData.append('listing[overview][occupied]', $('#').val());
	// formData.append('listing[overview][parking_lots]', $('#field-parking-lots').val());
	// formData.append('listing[overview][penthouse]', $('#').val());
	// formData.append('listing[overview][solar_face]', $('#field-solar-face').val());
	// formData.append('listing[overview][total_floors]', $('#field-total-floors').val());
	// formData.append('listing[overview][prop_type]', $('#').val());
	// formData.append('listing[address][cep]', $('#field-cep').val());
	// formData.append('listing[address][city]', $('#field-city').val());
	// formData.append('listing[address][hood]', $('#field-hood').val());
	// formData.append('listing[address][state]', $('#field-state').val());
	// formData.append('listing[address][street_name]', $('#field-street-name').val());
	// formData.append('listing[address][street_number]', $('#field-street-number').val());
	// formData.append('listing[address][addon]', $('#field-addon').val());
	// formData.append('listing[condo_amn][fitness_studio]', $('#').val());
	// formData.append('listing[condo_amn][game_room]', $('#').val());
	// formData.append('listing[condo_amn][green_area]', $('#').val());
	// formData.append('listing[condo_amn][laundry]', $('#').val());
	// formData.append('listing[condo_amn][party_room]', $('#').val());
	// formData.append('listing[condo_amn][pet_friendly]', $('#').val());
	// formData.append('listing[condo_amn][playground]', $('#').val());
	// formData.append('listing[condo_amn][pool]', $('#').val());
	// formData.append('listing[condo_amn][sauna]', $('#').val());
	// formData.append('listing[condo_amn][sports_court]', $('#').val());
	// formData.append('listing[condo_amn][toy_room]', $('#').val());
	// formData.append('listing[interior_amn][bed]', $('#').val());
	// formData.append('listing[interior_amn][fitness_studio]', $('#').val());
	// formData.append('listing[interior_amn][garden]', $('#').val());
	// formData.append('listing[interior_amn][gas_shower]', $('#').val());
	// formData.append('listing[interior_amn][kitchen_cabinet]', $('#').val());
	// formData.append('listing[interior_amn][microwave]', $('#').val());
	// formData.append('listing[interior_amn][pool]', $('#').val());
	// formData.append('listing[interior_amn][refrigerator]', $('#').val());
	// formData.append('listing[interior_amn][sofa]', $('#').val());
	// formData.append('listing[interior_amn][stove]', $('#').val());
	// formData.append('listing[interior_amn][table]', $('#').val());
	// formData.append('listing[interior_amn][wardrobe]', $('#').val());
	// formData.append('listing[rooms][bedrooms]', $('#').val());
	// formData.append('listing[rooms][suites]', $('#').val());
	// formData.append('listing[rooms][bathrooms]', $('#').val());
	// formData.append('listing[rooms][kitchens]', $('#').val());
	// formData.append('listing[rooms][toilets]', $('#').val());
	// formData.append('listing[rooms][offices]', $('#').val());
	// formData.append('listing[rooms][dining_rooms]', $('#').val());
	// formData.append('listing[rooms][living_rooms]', $('#').val());
	// formData.append('listing[rooms][toy_rooms]', $('#').val());
	// formData.append('listing[rooms][eating_areas]', $('#').val());
	// formData.append('listing[rooms][home_theaters]', $('#').val());
	// formData.append('listing[rooms][service_areas]', $('#').val());
	// formData.append('listing[taxes][condo]', $('#field-condo').val());
	// formData.append('listing[taxes][iptu]', $('#field-iptu').val());
	// formData.append('listing[taxes][others]', $('#field-iptu-extra').val());

	$('#btn-submit').val('Enviando...');
	$('#btn-submit').addClass('sending-button');

	// NOTE Upload images
	fetch('https://landera-network-7ikj4ovbfa-uc.a.run.app/api/v1/images', {
		method: 'post',
		body: formData,
	})
		.then((response) => {
			if (!response.ok) {
				$('#btn-submit').addClass('error-button');
				$('#btn-submit').val('Ocorreu um erro');
				throw Error(response.statusText);
			}

			return response.json();
		})
		.then((data) => {
			if (!Object.keys(data).length || data.ipfs_cid === '') {
				$('#btn-submit').addClass('error-button');
				$('#btn-submit').val('Ocorreu um erro');
				throw Error('Unable to upload data');
			}
			$('#ipfs-cid').val(data.ipfs_cid);
			$('#form-block').submit();
		});
});
