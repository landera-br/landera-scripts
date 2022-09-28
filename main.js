// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.9.4/firebase-app.js';
import {
	createUserWithEmailAndPassword,
	FacebookAuthProvider,
	getAuth,
	GoogleAuthProvider,
	onAuthStateChanged,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
} from 'https://www.gstatic.com/firebasejs/9.9.4/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.9.4/firebase-firestore.js';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyC5RGfMYnAaiAinPo47PurfFcjw23obinE',
	authDomain: 'landera-ff197.firebaseapp.com',
	databaseURL: 'https://landera-ff197.firebaseio.com',
	projectId: 'landera-ff197',
	storageBucket: 'landera-ff197.appspot.com',
	messagingSenderId: '830494589320',
	appId: '1:830494589320:web:efd2bdc7cff1b8afce7a3d',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const fbProvider = new FacebookAuthProvider();
export const db = getFirestore(app);

const ERRORS = [
	{
		code: 'other',
		message: 'Não foi possível acessar sua conta. Tente novamente mais tarde.',
	},
	{
		code: 'auth/email-already-exists',
		message: 'Usuário já existe. Faça o login ou crie uma outra conta.',
	},
	{
		code: 'auth/internal-error	',
		message: 'Não foi possível acessar sua conta. Tente novamente mais tarde.',
	},
	{
		code: 'auth/invalid-email	',
		message: 'E-mail inválido.',
	},
	{
		code: 'auth/invalid-password	',
		message: 'Senha inválida.',
	},
	{
		code: 'auth/project-not-found	',
		message: 'Não foi possível acessar sua conta. Tente novamente mais tarde.',
	},
	{
		code: 'auth/account-exists-with-different-credential',
		message: 'Você já possui uma conta com outro provedor. Por favor, tente outra forma de login.',
	},
	{
		code: 'auth/wrong-password',
		message: 'Senha inválida.',
	},
	{
		code: 'auth/email-already-in-use',
		message: 'E-mail já cadastrado.',
	},
];

// NOTE Login header listeners
let btnsLogin = document.getElementsByClassName('btn-login');
let btnsLogout = document.getElementsByClassName('btn-logout');
if (btnsLogin !== null) {
	Array.from(btnsLogin).forEach(function (btnLogin) {
		btnLogin.addEventListener('click', loginHandler, true);
	});
}
if (btnsLogout !== null) {
	Array.from(btnsLogout).forEach(function (btnLogout) {
		btnLogout.addEventListener('click', logoutHandler, true);
	});
}

// NOTE Login page listeners
let formSignUp = document.getElementById('form-sign-up');
let formSignIn = document.getElementById('form-sign-in');
let btnGoogleSignIn = document.getElementById('btn-google-sign-in');
let btnFbSignIn = document.getElementById('btn-facebook-sign-in');
let btnPassReset = document.getElementById('btn-password-reset');
if (formSignUp !== null) formSignUp.addEventListener('submit', signUpHandler, true);
if (formSignIn !== null) formSignIn.addEventListener('submit', signInHandler, true);
if (btnGoogleSignIn !== null) btnGoogleSignIn.addEventListener('click', googleSignInHandler, true);
if (btnFbSignIn !== null) btnFbSignIn.addEventListener('click', fbSignInHandler, true);
if (btnPassReset !== null) btnPassReset.addEventListener('click', passwordResetHandler, true);

window.addEventListener('load', function () {
	setCookie();
});

if ($('#w3a-container')[0]) $('#w3a-container').css({ position: 'relative', 'z-index': 1001 });

// NOTE Login button handler
function loginHandler(e) {
	e.preventDefault();
	e.stopPropagation();
	window.location = '/login';
}

// NOTE Logout handler
function logoutHandler() {
	signOut(auth)
		.then(() => {
			localStorage.clear();
			window.location = '/';
		})
		.catch((error) => {
			console.log(error.message);
			$('#btn-sign-in').val('Entrar');
			alert(
				ERRORS.find((item) => item.code === error.code)?.message
					? ERRORS.find((item) => item.code === error.code)?.message
					: ERRORS.find((item) => item.code === 'other')?.message
			);
		});
}

// NOTE Sign up handler
async function signUpHandler(e) {
	e.preventDefault();
	e.stopPropagation();
	$('#btn-sign-in').val('Aguarde...');
	let user;

	try {
		user = (
			await createUserWithEmailAndPassword(
				auth,
				$('#field-email').val(),
				$('#field-password').val()
			)
		).user;
	} catch (error) {
		console.log(error.message);
		$('#btn-sign-in').val('Entrar');
		alert(
			ERRORS.find((item) => item.code === error.code)?.message
				? ERRORS.find((item) => item.code === error.code)?.message
				: ERRORS.find((item) => item.code === 'other')?.message
		);
		return;
	}

	// NOTE Set MongoDB user
	try {
		await setUser(user, `${$('#field-firstname').val()} ${$('#field-lastname').val()}`);
	} catch (error) {
		console.log(error);
		$('#btn-sign-in').val('Entrar');
		alert('Não foi possível cadastrar conta. Por favor, tente novamente mais tarde.');
		return;
	}

	window.location = '/';
}

// NOTE Sign in handler
function signInHandler(e) {
	e.preventDefault();
	e.stopPropagation();
	$('#btn-sign-in').val('Aguarde...');

	signInWithEmailAndPassword(auth, $('#field-email').val(), $('#field-password').val())
		.then((userCredential) => {
			window.location = document.referrer;
		})
		.catch((error) => {
			console.log(error.message);
			$('#btn-sign-in').val('Entrar');
			alert(
				ERRORS.find((item) => item.code === error.code)?.message
					? ERRORS.find((item) => item.code === error.code)?.message
					: ERRORS.find((item) => item.code === 'other')?.message
			);
		});
}

// NOTE Sign in with Google
async function googleSignInHandler(e) {
	e.preventDefault();
	e.stopPropagation();
	$('#btn-sign-in').val('Aguarde...');
	let user;

	try {
		user = (await signInWithPopup(auth, googleProvider)).user;
	} catch (error) {
		console.log(error.message);
		$('#btn-sign-in').val('Entrar');
		if (error.code !== 'auth/popup-closed-by-user') {
			alert(
				ERRORS.find((item) => item.code === error.code)?.message
					? ERRORS.find((item) => item.code === error.code)?.message
					: ERRORS.find((item) => item.code === 'other')?.message
			);
		}
		return;
	}

	// NOTE Set MongoDB user
	try {
		await setUser(user, user.displayName);
	} catch (error) {
		console.log(error);
		$('#btn-sign-in').val('Entrar');
		alert('Não foi possível cadastrar conta. Por favor, tente novamente mais tarde.');
		return;
	}

	window.location = document.referrer;
}

// NOTE Sign in with Facebook
async function fbSignInHandler(e) {
	e.preventDefault();
	e.stopPropagation();
	$('#btn-sign-in').val('Aguarde...');
	let user;

	try {
		user = (await signInWithPopup(auth, fbProvider)).user;
	} catch (error) {
		if (error.code !== 'auth/popup-closed-by-user') {
			alert(
				ERRORS.find((item) => item.code === error.code)?.message
					? ERRORS.find((item) => item.code === error.code)?.message
					: ERRORS.find((item) => item.code === 'other')?.message
			);
		}
		return;
	}

	// NOTE Set MongoDB user
	try {
		await setUser(user, user.displayName);
	} catch (error) {
		console.log(error);
		$('#btn-sign-in').val('Entrar');
		alert('Não foi possível cadastrar conta. Por favor, tente novamente mais tarde.');
		return;
	}

	window.location = document.referrer;
}

// NOTE Password reset handler
function passwordResetHandler() {
	const email = window.prompt('Por favor, informe o endereço de e-mail cadastrado:');

	sendPasswordResetEmail(auth, email)
		.then(() => {
			alert('Uma notificação de reset de senha foi enviado ao seu e-mail!');
		})
		.catch((error) => {
			console.log(error.message);
			$('#btn-sign-in').val('Entrar');
			alert(
				ERRORS.find((item) => item.code === error.code)?.message
					? ERRORS.find((item) => item.code === error.code)?.message
					: ERRORS.find((item) => item.code === 'other')?.message
			);
		});
}

// NOTE Show/Hide elements
onAuthStateChanged(auth, async (user) => {
	let publicElements = document.querySelectorAll("[data-onlogin='hide']");
	let privateElements = document.querySelectorAll("[data-onlogin='show']");

	if (user) {
		// NOTE User has signed in
		const idToken = await user.getIdToken(true);

		localStorage.setItem('fb_token', idToken);

		privateElements.forEach(function (element) {
			element.style.display = 'inherit';
		});

		publicElements.forEach(function (element) {
			element.style.display = 'none';
		});
	} else {
		// NOTE User has signed out
		publicElements.forEach(function (element) {
			element.style.display = 'inherit';
		});

		privateElements.forEach(function (element) {
			element.style.display = 'none';
		});
	}
});

// NOTE Set user in DB
async function setUser(user, name) {
	const idToken = await user.getIdToken(true);

	if (idToken && idToken !== 'undefined') {
		localStorage.setItem('fb_token', idToken);
	} else {
		alert('Não foi possível recuperar os dados do cliente.');
		return;
	}

	const payload = { fb_uid: user.uid, email: user.email, name };

	try {
		const response = await fetch('https://landera-network-7ikj4ovbfa-uc.a.run.app/api/v1/users', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('fb_token')}`,
			},
			body: JSON.stringify(payload),
		});

		const responseData = await response.json();

		// NOTE Save stripe_customer_id in cache
		localStorage.setItem('stripe_customer_id', responseData.stripe_customer_id);
		localStorage.setItem('wf_inbox_id', responseData.wf_inbox_id);
		localStorage.setItem('user_id', responseData.user_id);
	} catch (error) {
		alert('Não foi possível recuperar os dados do cliente.');
	}
}

// NOTE Stripe Handler
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
					Authorization: `Bearer ${localStorage.getItem('fb_token')}`,
				},
				body: JSON.stringify({ stripe_customer_id: localStorage.getItem('stripe_customer_id') }),
			}
		);

		const responseData = await response.json();

		if (!response.ok || !responseData.stripe_session_url)
			if (!alert('Não foi possível recuperar os dados do cliente.')) return;

		window.location = responseData.stripe_session_url;
	} catch (error) {
		alert('Não foi possível recuperar os dados do cliente.');
	}
});

// NOTE Chat Redirect
$('.btn-chat').on('click', () => {
	if (localStorage.getItem('wf_inbox_id') && localStorage.getItem('wf_inbox_id') !== 'undefined') {
		window.location = `/inbox/${localStorage.getItem('wf_inbox_id')}`;
	} else {
		alert(
			'Não foi possível encontrar as suas conversas. Por favor, entre em contato com o suporte!'
		);
	}
});

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

function getCookie(cookie) {
	var cookieArr = document.cookie.split(';');
	for (var i = 0; i < cookieArr.length; i++) {
		var cookiePair = cookieArr[i].split('=');
		if (cookie == cookiePair[0].trim()) return decodeURIComponent(cookiePair[1]);
	}
	return null;
}
