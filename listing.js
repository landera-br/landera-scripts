// NOTE When form is submitted
$('#btn-interest').on('click', async (e) => {
	const pathArray = window.location.pathname.split('/');

	const listingId = pathArray[2];
	$('#field-listing-id').val(listingId);

	$('#form-modal').css('display', 'flex').show();

	$('#btn-interest-close').on('click', async () => $('#form-modal').hide());

	$('#form-interest').submit(async (e) => {
		e.preventDefault();
		let channel;

		// NOTE Create inbox advertiser
		try {
			const response = await fetch(
				`https://landera-network-7ikj4ovbfa-uc.a.run.app/api/v1/channels/${listingId}`,
				{
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						listing_id: window.location.pathname.split('/')[2],
						wf_inbox_id: localStorage.getItem('wf_inbox_id'),
					}),
				}
			);

			if (response.status !== 200) throw new Error('Unable to send notification');

			channel = await response.json();
		} catch (error) {
			error.display && error.message
				? error.message
				: alert('Não foi possível enviar seus dados de contato. Tente novamente mais tarde.');
		}

		// NOTE Store message in the DB
		try {
			db.collection('messages').add({
				channel: channel.id,
				sender: channel.buyer,
				receiver: channel.seller,
				createdAt: new Date(Date.now()),
				text: $('#field-message').val(),
			});
		} catch (error) {
			alert('Não foi possível enviar a mensagem. Por favor, tente novamente mais tarde.');
		}
	});
});
