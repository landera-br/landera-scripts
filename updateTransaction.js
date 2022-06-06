window.addEventListener('load', async () => {
	try {
		const searchParams = new URLSearchParams(window.location.search);

		// TODO Loading time - could be removed
		await delay(5000);

		// TODO When switch to paid plans
		// if (!searchParams.has('session_id')) throw Error('Unable to update data');
		if (!searchParams.has('transaction_id')) throw Error('Unable to update data');

		const response = await fetch(
			`https://landera-network-7ikj4ovbfa-uc.a.run.app/api/v1/transactions/${searchParams.get(
				'transaction_id'
			)}`,
			{
				method: 'patch',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				// body: JSON.stringify({ checkout_session_id: searchParams.get('session_id') }),
			}
		);

		const responseData = await response.json();

		if (!response.ok || !Object.keys(responseData).length) throw Error('Unable to update data');

		document.querySelector('#loading-page').style.display = 'none';
		document.querySelector('#success-page').style.display = 'flex';
	} catch (error) {
		console.log(error);
		console.log(error.message);
		// window.location.replace('/form/error');
	}
});

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
