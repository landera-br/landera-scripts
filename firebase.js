// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.9.4/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.9.4/firebase-firestore.js';

import {
	createUserWithEmailAndPassword,
	getAuth,
	onAuthStateChanged,
	signInWithEmailAndPassword,
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';

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

// Initialize Firebase and declare "global" variables. all variables declared in this section are accessible to functions that follow.
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const db = getFirestore(app);

// NOTE Listener assigners
if (typeof $('#form-signup') !== null) formSignup.addEventListener('submit', signupHandler, true);

if (typeof $('#form-signin') !== null) formSignin.addEventListener('submit', signinHandler, true);

if (typeof $('#btn-signout') !== null) btnSignout.addEventListener('click', signoutHandler);

// NOTE Signup Handler
function signupHandler(e) {
	e.preventDefault();
	e.stopPropagation();

	console.log($('#field-email').val());
	console.log($('#field-password').val());

	createUserWithEmailAndPassword(auth, $('#field-email').val(), $('#field-password').val())
		.then((userCredential) => {
			const user = userCredential.user;
			console.log('User created successfully: ' + user.email);
		})
		.catch((error) => {
			alert('Não foi possível criar uma conta. Por favor, tente novamente mais tarde!');
			console.log(error.message);
		});
}

// NOTE Signin Handler
function signinHandler(e) {
	e.preventDefault();
	e.stopPropagation();

	const email = document.getElementById('signin-email').value;
	const password = document.getElementById('signin-password').value;

	signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			// Signed in
			const user = userCredential.user;
			console.log('user logged in: ' + user.email);
			// ...
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			var errorText = document.getElementById('signin-error-message');
			console.log(errorMessage);
			errorText.innerHTML = errorMessage;
		});
}

// NOTE Signout Handler
// function signoutHandler() {
// 	signOut(auth)
// 		.then(() => {
// 			console.log('user signed out');
// 			// Sign-out successful.
// 		})
// 		.catch((error) => {
// 			const errorMessage = error.message;
// 			console.log(errorMessage);
// 			// An error happened.
// 		});
// }

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
