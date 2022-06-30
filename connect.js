let web3auth = null;
let provider = null;

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

	console.log('PROVIDER');
	console.log(web3auth.provider);
	if (web3auth.provider) {
		if (web3auth.connectedAdapterName === 'openlogin') {
			$('#btn-account').show();
		}
	} else {
		$('#btn-wallet-connect').show();
	}
})();

$('#btn-wallet-connect').click(async function (event) {
	console.log('conectando');
	try {
		const provider = await web3auth.connect();
		$('#btn-account').show();
		$('#btn-wallet-connect').hide();
	} catch (error) {
		console.error(error.message);
	}
});

// $('#get-user-info').click(async function (event) {
// 	try {
// 		const user = await web3auth.getUserInfo();
// 		console.log(user);
// 	} catch (error) {
// 		console.error(error.message);
// 	}
// });

// $('#get-accounts').click(async function (event) {
// 	try {
// 		const accounts = await rpc.getAccounts(web3auth.provider);
// 		console.log(accounts);
// 	} catch (error) {
// 		console.error(error.message);
// 	}
// });

// $('#get-balance').click(async function (event) {
// 	try {
// 		const balance = await rpc.getBalance(web3auth.provider);
// 		console.log(balance);
// 	} catch (error) {
// 		console.error(error.message);
// 	}
// });

// $('#sign-message').click(async function (event) {
// 	try {
// 		const signedMsg = await rpc.signMessage(web3auth.provider);
// 		console.log(signedMsg);
// 	} catch (error) {
// 		console.error(error.message);
// 	}
// });

$('#btn-wallet-disconnect').click(async function (event) {
	try {
		console.log('desconectando');
		await web3auth.logout();
		$('#btn-wallet-connect').show();
		$('#btn-account').hide();
	} catch (error) {
		console.error(error.message);
	}
});
