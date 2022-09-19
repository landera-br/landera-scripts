let web3auth = null;

(async function init() {
	window.addEventListener('load', function () {
		setCookie();
	});

	$('.btn-wallet-connect').hide();

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
		$('.btn-logged').css('display', 'block');
		$('.btn-wallet-disconnect').css('display', 'block');

		const user = await web3auth.getUserInfo();
		const accounts = await rpc.getAccounts(web3auth.provider);

		await setUser(accounts[0], user.email, user.name);
	} else {
		// NOTE Not Logged
		$('.btn-wallet-connect').css('display', 'block');
		$('.btn-logged').css('display', 'none');
		$('.btn-wallet-disconnect').css('display', 'none');
	}

	// NOTE Form Pages
	if (
		window.location.pathname === '/form/listing' ||
		window.location.pathname === '/form/user' ||
		window.location.pathname === '/form/redeem-advertiser'
	) {
		if (web3auth.provider && web3auth.connectedAdapterName === 'openlogin') {
			const user = await web3auth.getUserInfo();
			const accounts = await rpc.getAccounts(web3auth.provider);

			if (window.location.pathname === '/form/listing' || window.location.pathname === '/form/user')
				setForm(accounts[0], user, window.location.pathname === '/form/user');

			showForm(true);
		} else {
			showForm(false);

			await web3auth.connect();

			$('#btn-account').show();
			$('.btn-logged').css('display', 'block');
			$('.btn-wallet-disconnect').css('display', 'block');
			$('.btn-wallet-connect').css('display', 'none');

			const user = await web3auth.getUserInfo();
			const accounts = await rpc.getAccounts(web3auth.provider);

			if (window.location.pathname === '/form/listing' || window.location.pathname === '/form/user')
				setForm(accounts[0], user, window.location.pathname === '/form/user');

			showForm(true);

			await setUser(accounts[0], user.email, user.name);
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
			const user = await web3auth.getUserInfo();

			$('#btn-account').show();
			$('.btn-logged').css('display', 'block');
			$('.btn-wallet-disconnect').css('display', 'block');
			$('.btn-wallet-connect').css('display', 'none');

			showForm(true);

			// NOTE Wallet field
			const accounts = await rpc.getAccounts(web3auth.provider);
			setForm(accounts[0], user, window.location.pathname === '/form/user');
		} catch (error) {
			console.error(error.message);
		}
	});
}

$('.btn-wallet-connect').click(async function (event) {
	try {
		await web3auth.connect();
		const user = await web3auth.getUserInfo();

		$('#btn-account').show();
		$('.btn-logged').css('display', 'block');
		$('.btn-wallet-connect').css('display', 'none');
		$('.btn-wallet-disconnect').css('display', 'block');

		// NOTE Set user with wallet address, name and email
		const accounts = await rpc.getAccounts(web3auth.provider);

		if (
			window.location.pathname === '/form/listing' ||
			window.location.pathname === '/form/user' ||
			window.location.pathname === '/form/redeem-advertiser'
		) {
			showForm(true);
			if (window.location.pathname === '/form/listing' || window.location.pathname === '/form/user')
				setForm(accounts[0], user, window.location.pathname === '/form/user');
		}

		await setUser(accounts[0], user.email, user.name);
	} catch (error) {
		console.error(error.message);
	}
});

$('.btn-wallet-disconnect').click(async function (event) {
	try {
		await web3auth.logout();
		$('.btn-wallet-connect').css('display', 'block');
		$('.btn-wallet-disconnect').css('display', 'none');
		$('.btn-logged').css('display', 'none');
		$('#btn-account').hide();

		if (
			window.location.pathname === '/form/listing' ||
			window.location.pathname === '/form/user' ||
			window.location.pathname === '/form/redeem-advertiser'
		)
			showForm(false);
	} catch (error) {
		console.error(error.message);
	}
});

$('.btn-stripe-session').on('click', async function () {
	// NOTE Get stripe_session_url
	try {
		const response = await fetch(
			'https://landera-network-7ikj4ovbfa-uc.a.run.app/api/v1/users/sessions/portal',
			{
				method: 'POST',
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

$('.btn-chat').on('click', () => {
	if (localStorage.getItem('wf_inbox_id')) {
		window.location.replace(`/inbox/${localStorage.getItem('wf_inbox_id')}`);
	} else {
		alert(
			'Não foi possível encontrar as suas conversas. Por favor, entre em contato com o suporte!'
		);
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
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		});

		const responseData = await response.json();

		// NOTE Save stripe_customer_id in cache
		localStorage.setItem('stripe_customer_id', responseData.stripe_customer_id);
		localStorage.setItem('user_id', responseData.user_id);
		localStorage.setItem('wf_inbox_id', responseData.wf_inbox_id);
	} catch (error) {
		alert('Não foi possível recuperar os dados do cliente.');
	}
}

function setForm(wallet_address, user, hasColor) {
	const walletAddressElement = document.querySelector('#field-wallet-address');
	walletAddressElement.value = wallet_address;
	walletAddressElement.disabled = true;
	if (hasColor) walletAddressElement.style.backgroundColor = '#2c2366';

	if ($('#field-email').length && user.email) $('#field-email').val(user.email);
}

function getCookie(cookie) {
	var cookieArr = document.cookie.split(';');
	for (var i = 0; i < cookieArr.length; i++) {
		var cookiePair = cookieArr[i].split('=');
		if (cookie == cookiePair[0].trim()) return decodeURIComponent(cookiePair[1]);
	}
	return null;
}

function setCookie() {
	// NOTE Handlers
	$('.btn-cookie-accept').click(() => {
		$('#cookie-popup').hide();
		$('#cookie-preference').hide();
		document.cookie = 'consent=all';
		$('#cookie-tab').show();
	});

	$('.btn-interest-submit').click(() => {
		$('#cookie-popup').hide();
		$('#cookie-preference').hide();
		document.cookie = 'consent=all';
		$('#cookie-tab').show();
	});

	$('#btn-cookie-save').click(() => {
		$('#cookie-preference').hide();
		document.cookie = 'consent=all';
		$('#cookie-tab').show();
	});

	$('.btn-cookie-close').click(() => {
		$('#cookie-popup').hide();
		$('#cookie-preference').hide();
	});

	$('.btn-cookie-settings').click(() => {
		$('#cookie-popup').hide();
		$('#cookie-preference').css('display', 'flex').show();
	});

	// NOTE Cookies
	if (getCookie('consent')) {
		$('#cookie-tab').show();
	} else {
		$('#cookie-tab').hide();
		$('#cookie-popup').show();
	}
}
