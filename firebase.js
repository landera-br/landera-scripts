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
	let user;

	createUserWithEmailAndPassword(auth, $('#field-email').val(), $('#field-password').val())
		.then((userCredential) => {
			user = userCredential.user;
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

	console.log('passou');
	try {
		await setUser(user.uid, user.email, user.displayName);
	} catch (error) {
		console.log(error);
		alert('Não foi possível cadastrar conta. Por favor, tente novamente mais tarde.');
	}
	// window.location = '/';
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
function googleSignInHandler(e) {
	e.preventDefault();
	e.stopPropagation();

	signInWithPopup(auth, googleProvider)
		.then((result) => {
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

// NOTE Sign in with Facebook
function fbSignInHandler(e) {
	e.preventDefault();
	e.stopPropagation();

	signInWithPopup(auth, fbProvider)
		.then((result) => {
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
onAuthStateChanged(auth, (user) => {
	let publicElements = document.querySelectorAll("[data-onlogin='hide']");
	let privateElements = document.querySelectorAll("[data-onlogin='show']");

	if (user) {
		// NOTE User has signed in
		const uid = user.uid;

		privateElements.forEach(function (element) {
			element.style.display = 'inherit';
		});

		publicElements.forEach(function (element) {
			element.style.display = 'none';
		});
	} else {
		// User has signed out
		publicElements.forEach(function (element) {
			element.style.display = 'initial';
		});

		privateElements.forEach(function (element) {
			element.style.display = 'none';
		});
	}
});

// NOTE Set user in DB
async function setUser(uid, email, name) {
	const payload = { fb_uid: uid, email, name };

	console.log(payload);
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
		localStorage.setItem('wf_inbox_id', responseData.wf_inbox_id);
		localStorage.setItem('user_id', responseData.user_id);
	} catch (error) {
		alert('Não foi possível recuperar os dados do cliente.');
	}
}
