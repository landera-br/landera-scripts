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
		setTimeout(() => {
			$('#wallet-popup').css('display', 'flex').css('opacity', 1).hide().fadeIn();
		}, 500);
	}

	document.querySelector('#btn-wallet-connect').style.display = 'none';
	document.querySelector('#btn-wallet-disconnect').style.display = 'none';

	try {
		provider = await web3Modal.connect();
	} catch (e) {
		console.log('Could not get a wallet connection', e);
		document.querySelector('#wallet-popup').style.display = 'none';
		document.querySelector('#btn-wallet-connect').style.display = 'block';
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

	if (window.location.pathname === '/nft/form') updateInterface(provider, selectedAccount);

	document.querySelector('#wallet-popup').style.display = 'none';
	document.querySelector('#btn-wallet-disconnect').style.display = 'block';
}

async function onDisconnect() {
	document.querySelector('#btn-wallet-connect').style.display = 'none';
	document.querySelector('#btn-wallet-disconnect').style.display = 'none';

	if (window.torus) {
		await window.torus.logout();
		await window.torus.cleanUp();
	}

	if (provider?.close) await provider.close();

	await web3Modal.clearCachedProvider();

	provider = null;
	selectedAccount = null;

	if (window.location.pathname === '/nft/form') updateInterface(provider, selectedAccount);

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
}

async function btnHandler() {
	if (selectedAccount) {
		await onDisconnect();
	} else {
		await onConnect();
	}
}

// NOTE Main entry point
window.addEventListener('load', async () => {
	await init();
	if (localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER')) await onConnect(true);
	$('.nav-button').on('click', function (event) {
		event.stopPropagation();
		event.stopImmediatePropagation();
		btnHandler();
	});
});
