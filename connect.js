let web3auth = null;

(async function init() {
	$('#btn-wallet-connect').hide();

	const clientId =
		'BEIlC0DVBSTTKgxcU6a_GtWNxBVnPRlPmCRuoxObJIRqIGKjZgEgyxckkrMuj4rWLbEIDSbbOEWdqDGbwBMjG0A';

	web3auth = new window.Web3auth.Web3Auth({
		clientId,
		uiConfig: {
			appLogo:
				'https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/62752e31ab07d394b483c18e_landera-icon.png',
			loginMethodsOrder: ['google', 'apple', 'facebook', 'twitter', 'reddit'],
		},
		chainConfig: {
			chainNamespace: 'eip155',
			chainId: '0x1',
			rpcTarget: 'https://rpc.ankr.com/eth', // This is the testnet RPC we have added, please pass on your own endpoint while creating an app
		},
	});

	await web3auth.initModal();

	if (web3auth.provider && web3auth.connectedAdapterName === 'openlogin') {
		// NOTE Logged
		$('#btn-account').show();
	} else {
		// NOTE Not Logged
		$('#btn-wallet-connect').show();
	}

	// NOTE Form Pages
	if (window.location.pathname === '/form/listing' || window.location.pathname === '/form/user') {
		if (web3auth.provider && web3auth.connectedAdapterName === 'openlogin') {
			showForm(true);

			// NOTE Wallet field
			const walletAddressElement = document.querySelector('#field-wallet-address');
			const accounts = await rpc.getAccounts(web3auth.provider);
			walletAddressElement.value = accounts[0];
			walletAddressElement.disabled = true;
		} else {
			showForm(false);
			await web3auth.connect();

			$('#btn-account').show();
			$('#btn-wallet-connect').hide();
			showForm(true);

			// NOTE Set user with wallet address, name and email
			const walletAddress = (await rpc.getAccounts(web3auth.provider))[0];
			const user = await web3auth.getUserInfo();

			await setUser(walletAddress, user.email, user.name);

			// NOTE Wallet field
			const walletAddressElement = document.querySelector('#field-wallet-address');
			const accounts = await rpc.getAccounts(web3auth.provider);
			walletAddressElement.value = accounts[0];
			walletAddressElement.disabled = true;
		}
	}
})();

if ($('#w3a-container')[0]) $('#w3a-container').css({ position: 'relative', 'z-index': 1001 });

// NOTE Form login button
if ($('#btn-init-form')[0]) {
	$('#btn-init-form').on('click', async function (event) {
		event.stopPropagation();
		event.stopImmediatePropagation();

		try {
			await web3auth.connect();

			$('#btn-account').show();
			$('#btn-wallet-connect').hide();
			showForm(true);

			// NOTE Wallet field
			const walletAddressElement = document.querySelector('#field-wallet-address');
			const accounts = await rpc.getAccounts(web3auth.provider);
			walletAddressElement.value = accounts[0];
			walletAddressElement.disabled = true;
		} catch (error) {
			console.error(error.message);
		}
	});
}

$('#btn-wallet-connect').click(async function (event) {
	try {
		await web3auth.connect();

		$('#btn-account').show();
		$('#btn-wallet-connect').hide();

		// NOTE Set user with wallet address, name and email
		const walletAddress = (await rpc.getAccounts(web3auth.provider))[0];
		const user = await web3auth.getUserInfo();

		await setUser(walletAddress, user.email, user.name);

		if (window.location.pathname === '/form/listing' || window.location.pathname === '/form/user') {
			showForm(true);

			const walletAddressElement = document.querySelector('#field-wallet-address');
			walletAddressElement.value = walletAddress;
			walletAddressElement.disabled = true;
		}
	} catch (error) {
		console.error(error.message);
	}
});

$('#btn-wallet-disconnect').click(async function (event) {
	try {
		await web3auth.logout();
		$('#btn-wallet-connect').show();
		$('#btn-account').hide();

		if (window.location.pathname === '/form/listing' || window.location.pathname === '/form/user')
			showForm(false);
	} catch (error) {
		console.error(error.message);
	}
});

function showForm(show) {
	const helpBlock = document.querySelector('#help-block');
	const formBlock = document.querySelector('#form-block');

	helpBlock.style.display = show ? 'none' : 'flex';
	formBlock.style.display = show ? 'flex' : 'none';
}

async function setUser(wallet_address, email, name) {
	const payload = { wallet_address };

	if (email) payload.email = email;
	if (name) payload.name = name;

	try {
		const response = await fetch('https://landera-network-7ikj4ovbfa-uc.a.run.app/api/v1/users', {
			method: 'post',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		});

		const responseData = await response.json();

		// NOTE Save stripe_customer_id in cache
		localStorage.setItem('stripe_customer_id', responseData.stripe_customer_id);
	} catch (error) {
		alert('Não foi possível recuperar os dados do cliente.');
	}
}
