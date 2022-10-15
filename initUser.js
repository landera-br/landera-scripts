const searchParams = new URLSearchParams(window.location.search);

if (searchParams.has('plan')) {
	if (searchParams.get('plan') === 'basic') {
		$('#select-plan').val('basic');
		$('#cities-block').hide();
	}
	if (searchParams.get('plan') === 'standard') {
		$('#select-plan').val('standard');
		$('#label-name').text('Nome da imobiliária');
		$('#label-creci').text('CRECI-J');
		$('#cities-block').show();
	}
}

// NOTE When form is submitted
$('#btn-submit').on('click', async (e) => {
	e.preventDefault();

	$('#btn-submit').css('pointer-events', 'none');
	$('#btn-submit').val('Enviando...');

	// NOTE Update user
	const payload = {
		user: {
			business: {
				creci: $('#field-creci').val(),
			},
			phone: $('#field-phone').val(),
			stripe_customer_id: localStorage.getItem('stripe_customer_id'),
			states: ['SP'],
			cities: getCitiesNames(),
		},
		transaction: {
			subscription: {
				plan: $('#select-plan').val(),
			},
		},
	};

	try {
		const response = await fetch('https://landera-network-7ikj4ovbfa-uc.a.run.app/api/v1/users', {
			method: 'PATCH',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('fb_token')}`,
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
			$('#btn-submit').css('pointer-events', 'auto');
		}
	}
});

function getCitiesNames() {
	const cities = [];

	if ($('#checkbox-sao-paulo').is(':checked'))
		cities.push({ name: 'São Paulo', parsed_name: 'SAO_PAULO' });
	if ($('#checkbox-vgp').is(':checked'))
		cities.push({ name: 'Vargem Grande Paulista', parsed_name: 'VARGEM_GRANDE_PAULISTA' });
	if ($('#checkbox-cotia').is(':checked')) cities.push({ name: 'Cotia', parsed_name: 'COTIA' });
	if ($('#checkbox-sao-roque').is(':checked'))
		cities.push({ name: 'São Roque', parsed_name: 'SAO_ROQUE' });
	if ($('#checkbox-ibiuna').is(':checked')) cities.push({ name: 'Ibiúna', parsed_name: 'IBIUNA' });

	return cities;
}
