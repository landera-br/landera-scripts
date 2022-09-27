import { addDoc, collection } from 'https://www.gstatic.com/firebasejs/9.9.4/firebase-firestore.js';
import { db } from './main.js';

// NOTE When form is submitted
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
			$('#btn-interest-submit').addClass('sending-button');

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
				$('#btn-interest-submit').removeClass('sending-button');
				$('#btn-interest-submit').val('Enviar mensagem');
				return;
			}

			// NOTE Store message in Firestore
			try {
				await addDoc(collection(db, 'messages'), {
					channel: channel.id,
					sender: channel.buyer,
					receiver: channel.seller,
					createdAt: new Date(Date.now()),
					text: $('#field-message').val(),
				});
			} catch (error) {
				alert('Não foi possível enviar a mensagem. Por favor, tente novamente mais tarde.');

				$('#form-interest').css('pointer-events', 'auto');
				$('#btn-interest-submit').removeClass('sending-button');
				$('#btn-interest-submit').val('Enviar mensagem');
				return;
			}

			$('#btn-interest-submit').removeClass('sending-button');
			$('#form-interest').css('pointer-events', 'auto');
			$('#form-interest').hide();
			$('#success-message').show();
		});
	} else {
		window.location = '/login';
	}
});
