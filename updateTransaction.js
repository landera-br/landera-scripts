window.addEventListener('load', async () => {
	try {
		const searchParams = new URLSearchParams(window.location.search);

		if (!searchParams.has('session_id')) throw Error('Unable to update data');

		const data = { checkout_session_id: searchParams.get('session_id') };

		const response = await fetch(
			'https://landera-network-7ikj4ovbfa-uc.a.run.app/api/v1/transactions',
			{
				method: 'patch',
				body: data,
			}
		);

		const responseData = await response.json();

		if (!Object.keys(responseData).length) throw Error('Unable to update data');

		document.querySelector('#loading-page').style.display = 'none';
		document.querySelector('#success-page').style.display = 'flex';
	} catch (error) {
		// console.log(error);
		window.location.replace('/nft/error');
	}
});
