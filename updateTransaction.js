window.addEventListener('load', async () => {
	try {
		const searchParams = new URLSearchParams(window.location.search);

		// NOTE Loading time - could be removed
		await delay(5000);

		// NOTE transaction_id is only used on free plans
		if (!searchParams.has('session_id') && !searchParams.has('transaction_id'))
			throw new Error('Unable to update data');

		const response = await fetch(
			'https://landera-network-7ikj4ovbfa-uc.a.run.app/api/v1/transactions',
			{
				method: 'PATCH',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: searchParams.has('session_id')
					? JSON.stringify({ checkout_session_id: searchParams.get('session_id') })
					: JSON.stringify({ transaction_id: searchParams.get('transaction_id') }),
			}
		);

		console.log('Deu pau aqui');
		console.log(response);

		if (!response.ok) throw new Error('Unable to update data');

		document.querySelector('#loading-page').style.display = 'none';
		document.querySelector('#success-page').style.display = 'flex';
	} catch (error) {
		console.log(error);
		window.location.replace('/form/error');
	}
});

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
