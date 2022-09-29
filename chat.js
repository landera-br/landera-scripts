import {
	addDoc,
	collection,
	limit,
	onSnapshot,
	orderBy,
	query,
	where,
} from 'https://www.gstatic.com/firebasejs/9.9.4/firebase-firestore.js';
import { db } from './main.js';

window.addEventListener('load', async function () {
	// NOTE Check if has authorization to read
	try {
		const response = await fetch(
			`https://landera-network-7ikj4ovbfa-uc.a.run.app/api/v1/users?inbox_id=${
				window.location.pathname.split('/')[2]
			}`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('fb_token')}`,
				},
			}
		);

		if (response.status !== 200) window.location = '/';
	} catch (error) {
		window.location = '/';
	}
});

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

	const channelId = $(this).attr('data-channelId');

	$('#header-channel').text(channelId);
	$('#header-chatter-name').text($(this).find('.chatter-name').text());
	$('#header-chatter-uid').text($(this).find('.chatter-name').attr('data-fbUid'));
	$('#header-chatter-inbox-id').text($(this).find('.chatter-name').attr('data-inboxId'));
	$('#header-date').text(`Atualizado em ${$(this).parent().parent().find('.updated-at').text()}`);
	$('#header-initials').text($(this).find('.initials').text());
	$('#header-initials').css('background-color', $(this).find('.initials').css('background-color'));

	$(this).find('.unread-status').css('background-color', 'white');

	// NOTE Listen to Firestore data
	const q = query(
		collection(db, 'messages'),
		where('channel', '==', channelId),
		where('text', '==', 'Aqui'),
		orderBy('createdAt'),
		limit(100)
	);

	onSnapshot(q, (querySnapshot) => {
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
					Authorization: `Bearer ${localStorage.getItem('fb_token')}`,
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
	$('.chat-form').css('pointer-events', 'none');

	// NOTE Store message in the DB
	try {
		await addDoc(collection(db, 'messages'), {
			channel: $('#header-channel').text(),
			sender: {
				fb_uid: localStorage.getItem('fb_uid'),
				inbox_id: window.location.pathname.split('/')[2],
			},
			receiver: {
				fb_uid: $('#header-chatter-uid').text(),
				inbox_id: $('#header-chatter-inbox-id').text(),
			},
			createdAt: new Date(Date.now()),
			text: $('#input-message').val(),
		});
	} catch (error) {
		alert('Não foi possível enviar a mensagem. Por favor, tente novamente mais tarde.');
	}

	// NOTE Clear input
	$('#input-message').val('');

	// NOTE Update seller/buyer unread status
	try {
		const response = await fetch(
			`https://landera-network-7ikj4ovbfa-uc.a.run.app/api/v1/channels/${$(
				'#header-channel'
			).text()}`,
			{
				method: 'PATCH',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('fb_token')}`,
				},
				body: JSON.stringify({
					wf_sender_inbox_id: window.location.pathname.split('/')[2],
				}),
			}
		);

		if (!response.ok) alert('Não enviar a mensagem. Por favor, tente novamente mais tarde!');
	} catch (error) {
		alert('Não enviar a mensagem. Por favor, tente novamente mais tarde!');
	}

	$('.chat-form').css('pointer-events', 'auto');
});

function displayChat(messages, inboxId) {
	$('#messages').empty();

	// NOTE Create chat element and style according to inboxId
	messages.forEach((message) => {
		if (message.sender && message.receiver && message.text) {
			$(
				`<div class=${inboxId === message.sender.inbox_id ? 'sent-message' : 'received-message'}>${
					message.text
				}</div>`
			).appendTo('#messages');
		}
	});

	$('.chat').css('display', 'flex');

	// Scroll to bottom
	$('.chat').animate({ scrollTop: $(document).height() }, 1000);
}
