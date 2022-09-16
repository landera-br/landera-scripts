const firebaseConfig = {
	apiKey: 'AIzaSyC5RGfMYnAaiAinPo47PurfFcjw23obinE',
	authDomain: 'landera-ff197.firebaseapp.com',
	databaseURL: 'https://landera-ff197.firebaseio.com',
	projectId: 'landera-ff197',
	storageBucket: 'landera-ff197.appspot.com',
	messagingSenderId: '830494589320',
	appId: '1:830494589320:web:efd2bdc7cff1b8afce7a3d',
};

const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();

$('#buying-tab').on('click', async function () {
	$('.chat').hide();
	$('.chat-placeholder').fadeIn();
});

$('#selling-tab').on('click', async function () {
	$('.chat').hide();
	$('.chat-placeholder').fadeIn();
});

$('.btn-channel').on('click', async function () {
	$('.chat-placeholder').hide();

	const channelId = $(this).attr('id');

	$('.header-channel').text(channelId);
	$('.header-chatter').text($(this).find('.chatter').text());
	$('.header-chatter-id').text($(this).find('.chatter').attr('id'));
	$('.header-date').text(`Atualizado em ${$(this).parent().parent().find('.updated-at').text()}`);
	$('.header-initials').text($(this).find('.initials').text());
	$('.header-initials').css('background-color', $(this).find('.initials').css('background-color'));

	$(this).find('.unread-status').css('background-color', 'white');

	db.collection('messages')
		.where('channel', '==', channelId)
		.orderBy('createdAt')
		.limit(100)
		.onSnapshot((querySnapshot) => {
			let messages = [];

			querySnapshot.forEach((doc) => {
				messages.push(doc.data());
			});

			displayChat(messages, window.location.pathname.split('/')[2]);
		});

	// NOTE Update CMS unread status
	const fields = $(this).hasClass('seller')
		? { 'seller-unread-status': 'white' }
		: { 'buyer-unread-status': 'white' };

	try {
		const response = await fetch(
			`https://landera-network-7ikj4ovbfa-uc.a.run.app/api/v1/webflow/62f7d6eed95bf7a0d5513a4a/${channelId}`,
			{
				method: 'PATCH',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					fields: fields,
				}),
			}
		);

		if (!response.ok) alert('Não foi possível recuperar os dados do cliente.');
	} catch (error) {
		alert('Não foi possível recuperar os dados do cliente.');
	}
});

$('.chat-form').submit(async (e) => {
	e.preventDefault();

	// NOTE Store message in the DB
	try {
		db.collection('messages').add({
			channel: $('.header-channel').text(),
			sender: window.location.pathname.split('/')[2],
			receiver: $('.header-chatter-id').text(),
			createdAt: new Date(Date.now()),
			text: $('#input-message').val(),
		});
	} catch (error) {
		alert('Não foi possível enviar a mensagem. Por favor, tente novamente mais tarde.');
	}

	// NOTE Clear input
	$('#input-message').val('');
});

function displayChat(messages, inboxId) {
	$('.messages').empty();

	// NOTE Create chat element and style according to inboxId
	messages.forEach((message) => {
		if (message.sender && message.receiver && message.text) {
			$(
				`<div class=${inboxId === message.sender ? 'sent-message' : 'received-message'}>${
					message.text
				}</div>`
			).appendTo('.messages');
		}
	});

	$('.chat').css('display', 'flex');

	// Scroll to bottom
	$('.chat').animate({ scrollTop: $(document).height() }, 1000);
}
