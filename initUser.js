const searchParams = new URLSearchParams(window.location.search);

if (searchParams.has('plan')) {
	if (searchParams.get('plan') === 'basic') {
		$('#select-plan').val('basic');
	}
	if (searchParams.get('plan') === 'standard') {
		$('#select-plan').val('standard');
		$('#label-name').text('Nome da imobiliária');
		$('#label-creci').text('CRECI-J');
	}
}

// NOTE When form is submitted
$('#btn-submit').on('click', async (e) => {
	e.preventDefault();

	if ($('#btn-submit').hasClass('error-button') || $('#btn-submit').hasClass('sending-button'))
		return false;

	$('#btn-submit').val('Enviando...');
	$('#btn-submit').addClass('sending-button');

	// NOTE Update user
	const payload = {
		user: {
			name: $('#field-name').val(),
			email: $('#field-email').val(),
			creci: $('#field-creci').val(),
			phone: $('#field-phone').val(),
			stripe_customer_id: localStorage.getItem('stripe_customer_id'),
			wallet_address: $('#field-wallet-address').val(),
		},
		transaction: {
			subscription: {
				plan: $('#select-plan').val(),
			},
		},
	};

	try {
		const response = await fetch('https://landera-network-7ikj4ovbfa-uc.a.run.app/api/v1/users', {
			method: 'patch',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		});

		const responseData = await response.json();

		if (!response.ok || !Object.keys(responseData).length)
			throw responseData.display && responseData.message
				? responseData
				: 'Ocorreu um erro ao preencher o formulário. Por favor, preencha todos os campos e tente novamente.';

		window.location.replace(responseData.checkout_url);
	} catch (error) {
		if (!alert(error.display && error.message ? error.message : error)) {
			$('#btn-submit').val('Registrar');
			$('#btn-submit').removeClass('sending-button');
		}
	}
});
