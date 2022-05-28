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

async function onConnect() {
	try {
		provider = await web3Modal.connect();
	} catch (e) {
		console.log('Could not get a wallet connection', e);
		document.querySelector('#wallet-popup').style.display = 'none';
		document.querySelector('#wallet-popup').style.opacity = 0;
		document.querySelector('#btn-wallet').style.pointerEvents = 'all';
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

	document.querySelector('#btn-wallet').classList.add('btn-connected');
	document.querySelector('#btn-wallet').innerHTML = 'Desconectar';

	if (window.location.pathname === '/nft/form') updateInterface();
	document.querySelector('#wallet-popup').style.display = 'none';
	document.querySelector('#wallet-popup').style.opacity = 0;
	document.querySelector('#btn-wallet').style.pointerEvents = 'all';
}

async function onDisconnect() {
	document.querySelector('#btn-wallet').innerHTML = 'Criar/Conectar Conta';
	document.querySelector('#btn-wallet').classList.remove('btn-connected');

	console.log('AQUIIIIIII');
	console.log(window.torus);

	if (window.torus) {
		await window.torus.logout();
		await window.torus.cleanUp();
	}

	if (provider?.close) await provider.close();

	await web3Modal.clearCachedProvider();
	provider = null;

	selectedAccount = null;
	if (window.location.pathname === '/nft/form') updateInterface();
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
		document.querySelector('#btn-wallet').style.pointerEvents = 'none';
		await onConnect();
	}
}

// NOTE Main entry point
window.addEventListener('load', async () => {
	await init();
	if (localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER')) await onConnect();

	document.querySelector('#btn-wallet').addEventListener('click', btnHandler);
});
