import { addDoc, collection } from 'https://www.gstatic.com/firebasejs/9.9.4/firebase-firestore.js';
import { db } from './main.js';

// NOTE When interest button is pressed
$('#btn-interest').on('click', async (e) => {
	if (localStorage.getItem('fb_token') && localStorage.getItem('fb_token') !== 'undefined') {
		const pathArray = window.location.pathname.split('/');

		const listingId = pathArray[2];
		$('#field-listing-id').val(listingId);

		$('#form-modal').css('display', 'flex').show();

		$('#btn-interest-close').on('click', async () => $('#form-modal').hide());

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
	} else {
		window.location = '/login';
	}
});

// NOTE When subscribe button is pressed
$('.btn-subscribe').on('click', async (e) => {
	$('#subscription-modal').css('display', 'flex').show();
	const inputElement =
		'<input type="text" class="text-field-8 w-input subscription-links" maxlength="256" name="field-2" data-name="Field 2" placeholder="Link do anúncio" required="">';

	$('#btn-subscription-close').on('click', async () => {
		$('#subscription-modal').hide();
		$('#subscription-links-wrapper').html(inputElement);
	});

	$('#btn-add-link').on('click', async () => {
		$(inputElement).appendTo('#subscription-links-wrapper');
	});

	$('#form-subscription').submit(async (e) => {
		e.preventDefault();
		$('#form-subscription').css('pointer-events', 'none');
		$('#btn-subscription-submit').val('Enviando...');

		console.log('as');

		$('#form-subscription').css('pointer-events', 'auto');
		$('#form-subscription').hide();
		$('#subscription-success-message').show();
	});
});

// NOTE When download images button is pressed
$('#btn-download').on('click', (e) => {
	var zip = new JSZip();
	var zipFilename = 'imagens.zip';
	var count = 0;
	const urls = [
		'https://uploads-ssl.webflow.com/62752e31ab07d313f383c0b8/62e883cbfb220b495253dac3_bed71ba2-423a-4b8c-a4ae-ef47dad7bd51.png',
		'https://uploads-ssl.webflow.com/62752e31ab07d313f383c0b8/62e883cbfb220befac53db35_0e5f64ad-9a68-45f9-8951-81a4ed18f80d.png',
	];

	console.log(urls.length);
	urls.forEach(function (url, index) {
		var filename = `IMG_${index}.png`;
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
});
