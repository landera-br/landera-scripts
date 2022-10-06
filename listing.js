import { addDoc, collection } from 'https://www.gstatic.com/firebasejs/9.9.4/firebase-firestore.js';
import { db } from './main.js';

const inputElement =
	'<input type="text" class="text-field-8 w-input subscription-links" maxlength="256" name="field-2" data-name="Field 2" placeholder="Link do anúncio" required="">';

// NOTE Interest open
$('#btn-interest').on('click', async (e) => {
	if (localStorage.getItem('fb_token') && localStorage.getItem('fb_token') !== 'undefined') {
		const pathArray = window.location.pathname.split('/');
		const listingId = pathArray[2];

		$('#field-listing-id').val(listingId);
		$('#form-modal').css('display', 'flex').show();
	} else {
		window.location = '/login';
	}
});

// NOTE Interest close
$('#btn-interest-close').on('click', async () => $('#form-modal').hide());

// NOTE Interest send
$('#form-interest').submit(async (e) => {
	e.preventDefault();
	let channel;

	$('#form-interest').css('pointer-events', 'none');
	$('#btn-interest-submit').val('Enviando...');

	// NOTE Create channel
	try {
		const response = await fetch(
			`https://landera-network-7ikj4ovbfa-uc.a.run.app/api/v1/channels/${listingId}`,
			{
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('fb_token')}`,
				},
				body: JSON.stringify({ wf_inbox_id: localStorage.getItem('wf_inbox_id') }),
			}
		);

		if (response.status !== 201) throw new Error('Unable to create channel');

		channel = await response.json();
	} catch (error) {
		alert('Não foi possível enviar a mensagem. Por favor, tente novamente mais tarde.');

		$('#form-interest').css('pointer-events', 'auto');
		$('#btn-interest-submit').val('Enviar mensagem');
		return;
	}

	// NOTE Store message in Firestore
	try {
		await addDoc(collection(db, 'messages'), {
			channel: channel.id,
			sender: {
				fb_uid: localStorage.getItem('fb_uid'),
				inbox_id: channel.buyer_inbox_id,
			},
			receiver: {
				fb_uid: channel.seller_fb_uid,
				inbox_id: channel.seller_inbox_id,
			},
			allowed_uids: [localStorage.getItem('fb_uid'), channel.seller_fb_uid],
			created_at: new Date(Date.now()),
			text: $('#field-message').val(),
		});
	} catch (error) {
		alert('Não foi possível enviar a mensagem. Por favor, tente novamente mais tarde.');

		$('#form-interest').css('pointer-events', 'auto');
		$('#btn-interest-submit').val('Enviar mensagem');
		return;
	}

	$('#form-interest').css('pointer-events', 'auto');
	$('#form-interest').hide();
	$('#success-message').show();
});

// NOTE Subscription open
$('.btn-subscribe').on('click', async (e) => {
	$('#subscription-modal').css('display', 'flex').show();
});

// NOTE Subscription close
$('#btn-subscription-close').on('click', async () => {
	$('#subscription-modal').hide();
	$('#subscription-links-wrapper').html(inputElement);
});

// NOTE Subscription link add
$('#btn-add-link').on('click', async () => {
	$(inputElement).appendTo('#subscription-links-wrapper');
});

// NOTE Subscription send
$('#form-subscription').submit(async (e) => {
	e.preventDefault();

	const listingUrls = [];
	let query = '';
	let payload;

	$('#btn-subscription-submit').val('Aguarde...');
	$('#btn-subscription-submit').css('pointer-events', 'none');

	// NOTE Get URLs
	$('.subscription-links')
		.map((i, el) => listingUrls.push($(el).val()))
		.get();

	listingUrls.forEach((url) => {
		query += `listings_urls[]=${url}&`;
	});

	// NOTE Check if URLs are valid and get partner id
	try {
		const response = await fetch(
			`https://landera-network-7ikj4ovbfa-uc.a.run.app/api/v1/users?${query}`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('fb_token')}`,
				},
			}
		);

		if (response.status !== 200) throw new Error();

		payload = await response.json();
	} catch (error) {
		alert(
			error.display && error.message
				? error.message
				: 'Não foi possível realizar inscrição. Tente novamente mais tarde!'
		);
		$('#btn-subscription-submit').val('Inscrever-se');
		$('#btn-subscription-submit').css('pointer-events', 'auto');
		return false;
	}

	// NOTE Add broker_id to payload
	payload.forEach((item) => (item.broker_id = localStorage.getItem('user_id')));

	console.log(payload);

	// NOTE Update listing with listed_on
	try {
		const response = await fetch(
			`https://landera-network-7ikj4ovbfa-uc.a.run.app/api/v1/listings/${
				window.location.pathname.split('/')[2]
			}`,
			{
				method: 'PATCH',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('fb_token')}`,
				},
				body: JSON.stringify(payload),
			}
		);

		if (response.status !== 200) {
			throw new Error('Não foi possível realizar inscrição. Tente novamente mais tarde!');
		}
	} catch (error) {
		alert(
			error.display && error.message
				? error.message
				: 'Não foi possível realizar inscrição. Tente novamente mais tarde!'
		);
		$('#btn-subscription-submit').val('Inscrever-se');
		$('#btn-subscription-submit').css('pointer-events', 'auto');
		return false;
	}

	$('#btn-subscription-submit').css('pointer-events', 'auto');
	$('#form-subscription').hide();
	$('#subscription-success-message').show();
});

// NOTE When download images button is pressed
$('#btn-download').on('click', async (e) => {
	const urls = [];

	try {
		const response = await fetch(
			`https://landera-network-7ikj4ovbfa-uc.a.run.app/api/v1/listings/${
				window.location.pathname.split('/')[2]
			}`,
			{
				method: 'GET',
			}
		);

		if (response.status !== 200) {
			throw new Error('Não foi fazer o download das imagens. Tente novamente mais tarde!');
		} else {
			const responseJson = await response.json();

			if (responseJson?.['primary-image']?.url) urls.push(responseJson?.['primary-image']?.url);

			if (responseJson?.['secondary-images'] && responseJson?.['secondary-images'] !== []) {
				responseJson['secondary-images'].forEach((file) => urls.push(file.url));
			}

			console.log(urls);
		}
	} catch (error) {
		alert(
			error.display && error.message
				? error.message
				: 'Não foi fazer o download das imagens. Tente novamente mais tarde!'
		);
		return;
	}

	downloadImages(urls);
});

function downloadImages(urls) {
	var zip = new JSZip();
	var zipFilename = 'imagens.zip';
	var count = 0;

	urls.forEach(function (url, index) {
		var filename = `imagem_${index}.png`;
		// loading a file and add it in a zip file
		JSZipUtils.getBinaryContent(url, function (err, data) {
			if (err) throw err;
			zip.file(filename, data, { binary: true });
			count++;
			if (count == urls.length) {
				zip.generateAsync({ type: 'blob' }).then(function (content) {
					saveAs(content, zipFilename);
				});
			}
		});
	});
}
