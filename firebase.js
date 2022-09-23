// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.9.4/firebase-app.js';
import {
	getAuth,
	GoogleAuthProvider,
	sendSignInLinkToEmail,
	signInWithPopup,
} from 'https://www.gstatic.com/firebasejs/9.9.4/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.9.4/firebase-firestore.js';

import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyC5RGfMYnAaiAinPo47PurfFcjw23obinE',
	authDomain: 'landera.com.br',
	databaseURL: 'https://landera-ff197.firebaseio.com',
	projectId: 'landera-ff197',
	storageBucket: 'landera-ff197.appspot.com',
	messagingSenderId: '830494589320',
	appId: '1:830494589320:web:efd2bdc7cff1b8afce7a3d',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const db = getFirestore(app);

// NOTE Listener assigners
let formSignUp = document.getElementById('form-sign-up');
let formSignIn = document.getElementById('form-sign-in');
let btnGoogleSignIn = document.getElementById('btn-google-sign-in');
let btnSignOut = document.getElementById('btn-sign-out');

if (formSignUp !== null) formSignUp.addEventListener('submit', signUpHandler, true);

if (formSignIn !== null) formSignIn.addEventListener('submit', signInHandler, true);

if (btnGoogleSignIn !== null) btnGoogleSignIn.addEventListener('click', googleSignInHandler, true);

if (btnSignOut !== null) btnSignOut.addEventListener('click', signOutHandler, true);

// NOTE Sign Up Handler
function signUpHandler(e) {
	e.preventDefault();
	e.stopPropagation();

	createUserWithEmailAndPassword(auth, $('#field-email').val(), $('#field-password').val())
		.then((userCredential) => {
			const user = userCredential.user;
			console.log('User created successfully: ' + user.email);
		})
		.catch((error) => {
			console.log(error.message);
		});
}

// NOTE Sign In Handler
function signInHandler(e) {
	e.preventDefault();
	e.stopPropagation();

	const actionCodeSettings = {
		// URL you want to redirect back to. The domain (www.example.com) for this
		// URL must be in the authorized domains list in the Firebase Console.
		url: 'https://www.landera.com.br/finishSignUp?cartId=1234',
		handleCodeInApp: true,
		iOS: {
			bundleId: 'com.example.ios',
		},
		android: {
			packageName: 'com.example.android',
			installApp: true,
			minimumVersion: '12',
		},
		dynamicLinkDomain: 'landera.com.br',
	};

	sendSignInLinkToEmail(auth, $('#field-email').val(), actionCodeSettings)
		.then(() => {
			// The link was successfully sent. Inform the user.
			// Save the email locally so you don't need to ask the user for it again
			// if they open the link on the same device.
			window.localStorage.setItem('emailForSignIn', $('#field-email').val());
			console.log('Armazenado');
		})
		.catch((error) => {
			console.log(error.message);
		});
}

function googleSignInHandler(e) {
	e.preventDefault();
	e.stopPropagation();

	signInWithPopup(auth, provider)
		.then((result) => {
			// This gives you a Google Access Token. You can use it to access the Google API.
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential.accessToken;
			// The signed-in user info.
			const user = result.user;
			console.log('User logged in: ' + user.email);
		})
		.catch((error) => {
			console.log(error.message);
		});
}

// NOTE Signout Handler
function signOutHandler() {
	signOut(auth)
		.then(() => {
			console.log('User signed out');
		})
		.catch((error) => {
			console.log(error.message);
		});
}

onAuthStateChanged(auth, (user) => {
	// NOTE Hide/Show elements
	let publicElements = document.querySelectorAll("[data-onlogin='hide']");
	let privateElements = document.querySelectorAll("[data-onlogin='show']");

	if (user) {
		// NOTE User has signed in
		const uid = user.uid;

		privateElements.forEach(function (element) {
			element.style.display = 'initial';
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
