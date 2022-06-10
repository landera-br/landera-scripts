// NOTE External CDN URL https://cdn.jsdelivr.net/gh/landera-br/landera-scripts@latest/connect.js
// NOTE 👆 Update CDN URL https://purge.jsdelivr.net/gh/landera-br/landera-scripts@latest/connect.js

const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
let web3Modal;
let selectedAccount;
let provider;

async function init() {
	const providerOptions = {
		walletconnect: {
			package: WalletConnectProvider,
			options: {
				infuraId: '4ed15298cf794fedab6f66295357984f',
			},
		},
		torus: {
			package: Torus,
		},
	};

	web3Modal = new Web3Modal({
		network: 'rinkeby',
		cacheProvider: true,
		providerOptions,
	});
}

async function onConnect(auto = false) {
	if (auto) {
		document.querySelector('#btn-wallet-connect').style.display = 'none';
		document.querySelector('#btn-account').style.display = 'flex';
	} else {
		document.querySelector('#btn-wallet-connect').style.display = 'none';
		document.querySelector('#btn-account').style.display = 'none';

		setTimeout(() => {
			$('#wallet-popup').css('display', 'flex').css('opacity', 1).hide().fadeIn();
		}, 500);
	}

	try {
		provider = await web3Modal.connect();
		document.querySelector('#wallet-popup').style.display = 'none';
		document.querySelector('#btn-account').style.display = 'flex';
	} catch (e) {
		console.log('Could not get a wallet connection', e);
		document.querySelector('#wallet-popup').style.display = 'none';
		document.querySelector('#btn-wallet-connect').style.display = 'block';
		document.querySelector('#btn-account').style.display = 'none';
		await onDisconnect();
		if (window.location.pathname === '/form/listing' || window.location.pathname === '/form/agency')
			updateInterface();
		return;
	}

	// Subscribe to accounts change
	provider.on('accountsChanged', async (accounts) => {
		await fetchAccountData();
	});

	// Subscribe to chainId change
	provider.on('chainChanged', async (chainId) => {
		await fetchAccountData();
	});

	// Subscribe to networkId change
	provider.on('chainChanged', async (networkId) => {
		await fetchAccountData();
	});

	await fetchAccountData();

	// NOTE btn-stripe-session and btn-wallet-disconnect
	$('#btn-stripe-session').on('click', async function () {
		// NOTE Get stripe_customer_id
		try {
			const response = await fetch(
				'https://landera-network-7ikj4ovbfa-uc.a.run.app/api/v1/users/sessions',
				{
					method: 'post',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ stripe_customer_id: localStorage.getItem('stripe_customer_id') }),
				}
			);

			const responseData = await response.json();

			if (!response.ok || !responseData.stripe_session_url)
				if (!alert('Não foi possível recuperar os dados do cliente.')) return;

			window.location.replace(responseData.stripe_session_url);
		} catch (error) {
			alert('Não foi possível recuperar os dados do cliente.');
		}
	});

	$('#btn-wallet-disconnect').on('click', function (event) {
		event.stopPropagation();
		event.stopImmediatePropagation();
		onDisconnect();
	});

	if (window.location.pathname === '/form/listing' || window.location.pathname === '/form/agency')
		updateInterface(provider, selectedAccount);
}

async function onDisconnect() {
	document.querySelector('#btn-wallet-connect').style.display = 'none';
	document.querySelector('#btn-account').style.display = 'none';

	if (window.torus) {
		await window.torus.logout();
		await window.torus.cleanUp();
	}

	if (provider?.close) await provider.close();

	await web3Modal.clearCachedProvider();

	provider = null;
	selectedAccount = null;

	if (window.location.pathname === '/form/listing' || window.location.pathname === '/form/agency')
		updateInterface(provider, selectedAccount);

	document.querySelector('#btn-wallet-connect').style.display = 'block';
}

async function fetchAccountData() {
	// Get a Web3 instance for the wallet
	const web3 = new Web3(provider);

	// Get connected chain id from Ethereum node
	const chainId = await web3.eth.getChainId();

	// Get list of accounts of the connected wallet
	const accounts = await web3.eth.getAccounts();

	// MetaMask does not give you all accounts, only the selected account
	selectedAccount = accounts[0];

	if (!localStorage.getItem('stripe_customer_id')) {
		// NOTE Get/Create user and get stripe_customer_id
		try {
			const response = await fetch('https://landera-network-7ikj4ovbfa-uc.a.run.app/api/v1/users', {
				method: 'post',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ wallet_address: selectedAccount }),
			});

			const responseData = await response.json();

			// NOTE Save stripe_customer_id in cache
			localStorage.setItem('stripe_customer_id', responseData.stripe_customer_id);
		} catch (error) {
			alert('Não foi possível recuperar os dados do cliente.');
		}
	}
}

// NOTE Main entry point
window.addEventListener('load', async () => {
	await init();
	if (localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER')) {
		await onConnect(true);
	} else {
		await onDisconnect(); // clean cached data
	}

	$('#btn-wallet-connect').on('click', function (event) {
		event.stopPropagation();
		event.stopImmediatePropagation();
		onConnect();
	});

	if (window.location.pathname === '/form/listing' || window.location.pathname === '/form/agency') {
		$('#btn-init-form').on('click', function (event) {
			event.stopPropagation();
			event.stopImmediatePropagation();
			onConnect();
		});
	}
});
