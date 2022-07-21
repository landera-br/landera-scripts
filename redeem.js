let partners;

$(document).ready(async function () {
	let options = '';

	try {
		const response = await fetch(
			'https://landera-network-7ikj4ovbfa-uc.a.run.app/api/v1/users?redeem=true',
			{ method: 'get' }
		);

		partners = await response.json();
	} catch (error) {
		alert('Não foi possível recuperar os dados do cliente.');
	}

	$('.select-partners').append(
		$('<option>', {
			value: 'option',
			text: 'Escolha uma opção',
		})
	);

	$.each(partners, function (i, partner) {
		options = options + `<option value="${partner._id}">${partner.name}</option>`;

		$('.select-partners').append(
			$('<option>', {
				value: partner._id,
				text: partner.name,
			})
		);
	});

	$('#btn-add-partner').click(() => {
		// NOTE Append fields
		$('#additional-partners').append(
			`<div class="line-divider margin-vertical margin-medium redeem"></div>`
		);
		$('#additional-partners').append(
			`<label class="signin-field-level">portal imobiliário</label>`
		);
		$('#additional-partners').append(
			`<select name="Partners" data-name="Partners" required="" class="select-field-dark select-partners w-select"><option value="option">Escolha uma opção</option>${options}</select>`
		);
		$('#additional-partners').append(
			`<label for="field-wallet-address" class="signin-field-level">link do anúncio</label>`
		);
		$('#additional-partners').append(
			`<input type="text" class="signin-text-field-2 w-input field-link" maxlength="256" name="Wallet-Address" data-name="Wallet Address" placeholder="e.g. https://www.imobiliaria.com/anúncio/123abc" required="">`
		);
	});
});

$('form').submit(async (e) => {
	e.preventDefault();

	$('#header-redeem').text(
		'Analisaremos sua solicitação e muito em breve enviaremos o contato do anunciante via e-mail.'
	);

	const partnersIds = [];
	const listingUrls = [];
	const user = [];

	$('.select-partners :selected')
		.map((i, el) => partnersIds.push($(el).val()))
		.get();

	$('.field-link')
		.map((i, el) => listingUrls.push($(el).val()))
		.get();

	if (partnersIds.length !== listingUrls.length) {
		alert('Não foi possível enviar os dados do anúncio. Tente novamente mais tarde!');
	} else {
		// const listings = [];

		// try {
		// 	user = await web3auth.getUserInfo();
		// } catch (error) {
		// 	alert('Não foi possível enviar os dados do anúncio. Tente novamente mais tarde!');
		// 	return false;
		// }

		console.log(userData);

		// partnersIds.forEach((id, index) => {
		// 	listings.push({ user_id: '', partner_id: id, listing_url: listingUrls[index] });
		// });

		// console.log(listings);

		// console.log(web3auth.provider && web3auth.connectedAdapterName === 'openlogin');
	}

	return false;

	const payload = { listed_on: listings };

	try {
		await fetch('https://landera-network-7ikj4ovbfa-uc.a.run.app/api/v1/users', {
			method: 'patch',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		});
	} catch (error) {
		alert(
			error.display && error.message
				? error.message
				: 'Não foi possível enviar os dados do anúncio. Tente novamente mais tarde!'
		);
	}
});
