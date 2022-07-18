// NOTE When form is submitted
$('#btn-interest').on('click', async (e) => {
	const pathArray = window.location.pathname.split('/');

	const listingId = pathArray[2];
	$('#field-listing-id').val(listingId);

	$('#form-modal').css('display', 'flex').show();

	$('#btn-interest-close').on('click', async () => $('#form-modal').hide());

	$('#form-interest').submit(async (e) => {
		e.preventDefault();

		// NOTE Notify advertiser
		const payload = {
			name: $('#field-name').val(),
			email: $('#field-email').val(),
			phone: $('#field-phone').val(),
		};

		try {
			const response = await fetch(
				`https://landera-network-7ikj4ovbfa-uc.a.run.app/api/v1/notifications/${listingId}`,
				{
					method: 'post',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(payload),
				}
			);

			if (response.status !== 200) throw new Error('Unable to send notification');
		} catch (error) {
			error.display && error.message
				? error.message
				: alert('Não foi possível enviar seus dados de contato. Tente novamente mais tarde.');
		}
	});
});
