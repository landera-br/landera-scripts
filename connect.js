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
			const accounts = await rpc.getAccounts(web3auth.provider);
			walletAddress.value = accounts[0];
			walletAddress.disabled = true;
		} else {
			showForm(false);
			const provider = await web3auth.connect();
			showForm(true);
			$('#btn-account').show();
			$('#btn-wallet-connect').hide();
		}
	}
})();

if ($('#w3a-container')[0]) $('#w3a-container').css({ position: 'relative', 'z-index': 1001 });

// NOTE Form login button
if ($('#btn-init-form')[0]) {
	const walletAddress = document.querySelector('#field-wallet-address');

	$('#btn-init-form').on('click', async function (event) {
		event.stopPropagation();
		event.stopImmediatePropagation();

		try {
			await web3auth.connect();

			$('#btn-account').show();
			$('#btn-wallet-connect').hide();
			showForm(true);

			// NOTE Wallet field
			const accounts = await rpc.getAccounts(web3auth.provider);
			walletAddress.value = accounts[0];
			walletAddress.disabled = true;
		} catch (error) {
			console.error(error.message);
		}
	});
}

$('#btn-wallet-connect').click(async function (event) {
	try {
		const provider = await web3auth.connect();
		$('#btn-account').show();
		$('#btn-wallet-connect').hide();

		if (window.location.pathname === '/form/listing' || window.location.pathname === '/form/user')
			showForm(true);
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

// $('#get-user-info').click(async function (event) {
// 	try {
// 		const user = await web3auth.getUserInfo();
// 	} catch (error) {
// 		console.error(error.message);
// 	}
// });

// $('#get-accounts').click(async function (event) {
// 	try {
// 		const accounts = await rpc.getAccounts(web3auth.provider);
// 	} catch (error) {
// 		console.error(error.message);
// 	}
// });

// $('#get-balance').click(async function (event) {
// 	try {
// 		const balance = await rpc.getBalance(web3auth.provider);
// 	} catch (error) {
// 		console.error(error.message);
// 	}
// });

// $('#sign-message').click(async function (event) {
// 	try {
// 		const signedMsg = await rpc.signMessage(web3auth.provider);
// 	} catch (error) {
// 		console.error(error.message);
// 	}
// });

function showForm(show) {
	const helpBlock = document.querySelector('#help-block');
	const formBlock = document.querySelector('#form-block');

	helpBlock.style.display = show ? 'none' : 'flex';
	formBlock.style.display = show ? 'flex' : 'none';
}
