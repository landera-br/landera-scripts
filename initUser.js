// const searchParams = new URLSearchParams(window.location.search);

// if (searchParams.has('plan'))
// 	if (searchParams.get('plan') === 'standard') $('#select-plan').val('standard');

function updateInterface(provider = null, selectedAccount = null) {
	const formBlock = document.querySelector('#form-block');
	const helpBlock = document.querySelector('#help-block');

	if (provider) {
		helpBlock.style.display = 'none';
		formBlock.style.display = 'flex';
	} else {
		formBlock.style.display = 'none';
		helpBlock.style.display = 'flex';
		return;
	}

	// NOTE Get forms wallet data
	const walletAddress = document.querySelector('#field-wallet-address');

	walletAddress.value = selectedAccount;
	walletAddress.disabled = true;
	walletAddress.style.backgroundColor = '#2c2366';
}

// NOTE When form is submitted
$('#btn-submit').on('click', async (e) => {
	e.preventDefault();

	if ($('#btn-submit').hasClass('error-button') || $('#btn-submit').hasClass('sending-button'))
		return false;

	$('#btn-submit').val('Enviando...');
	$('#btn-submit').addClass('sending-button');

	// NOTE Get form data
	const data = {
		user: {
			name: $('#field-name').val(),
			email: $('#field-email').val(),
			creci: $('#field-creci').val(),
			phone: $('#field-phone').val(),
		},
		subscription: {
			plan: $('#select-plan').val(),
		},
		mint_to_address: $('#field-wallet-address').val(),
	};

	try {
		const response = await fetch('https://landera-network-7ikj4ovbfa-uc.a.run.app/api/v1/users', {
			method: 'post',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		const responseData = await response.json();

		if (!response.ok || !Object.keys(responseData).length) throw Error('Unable to upload data');

		// NOTE Redirecting to Stripe
		const redirectUrl =
			$('#select-plan').val() === 'standard'
				? `https://buy.stripe.com/test_6oEg1Wd3q8v1eJy8wF?client_reference_id=${responseData.transaction_id}`
				: `https://buy.stripe.com/test_00g8zu3sQfXtbxm008?client_reference_id=${responseData.transaction_id}`;

		window.location.replace(redirectUrl);
	} catch (error) {
		if (!alert('Ocorreu um erro ao preencher o formulário. Por favor, preencha todos os campos!')) {
			$('#btn-submit').val('Registrar');
			$('#btn-submit').removeClass('sending-button');
		}
	}
});
