function updateInterface(provider = null, selectedAccount = null) {
	console.log('Entrou');
	const formBlock = document.querySelector('#form-block');
	const helpBlock = document.querySelector('#help-block');

	if (provider) {
		helpBlock.style.display = 'none';
		formBlock.style.display = 'block';
	} else {
		formBlock.style.display = 'none';
		helpBlock.style.display = 'flex';
		return;
	}

	// NOTE Get forms wallet data
	const walletAddress = document.querySelector('#field-wallet-address');

	walletAddress.value = selectedAccount;
	walletAddress.disabled = true;
}

// NOTE When form is submitted
$('#btn-submit').on('click', async (e) => {
	e.preventDefault();

	// NOTE Get form data
	const data = {
		name: $('#field-name').val(),
		email: $('#field-email').val(),
		creci: $('#field-creci').val(),
		phone: $('#field-phone').val(),
		plan: $('#select-plan').val(),
	};

	console.log(data);

	try {
		const response = await fetch('https://landera-network-7ikj4ovbfa-uc.a.run.app/api/v1/users', {
			method: 'post',
			body: data,
		});

		const responseData = await response.json();

		console.log(responseData);

		if (!response.ok || !Object.keys(responseData).length) throw Error('Unable to upload data');

		// NOTE Redirecting to Stripe
		const redirectUrl =
			$('#select-plan').val() === 'standard'
				? `https://buy.stripe.com/test_6oEg1Wd3q8v1eJy8wF?client_reference_id=${responseData.user_id}`
				: `https://buy.stripe.com/test_00g8zu3sQfXtbxm008?client_reference_id=${responseData.user_id}`;

		$('#form-block').submit();

		window.location.replace(redirectUrl);
	} catch (error) {
		alert('Ocorreu um erro ao preencher o formulário. Por favor, preencha todos os campos!');
	}
});
