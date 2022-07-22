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

$('#btn-submit').on('click', async (e) => {
	e.preventDefault();
	$('#btn-submit').val('Analisando...');
	$('#btn-submit').addClass('sending-button');

	const partnersIds = [];
	const listingUrls = [];
	const listings = [];
	let advertiser;

	$('.select-partners :selected')
		.map((i, el) => partnersIds.push($(el).val()))
		.get();

	$('.field-link')
		.map((i, el) => listingUrls.push($(el).val()))
		.get();

	if (partnersIds.length !== listingUrls.length || !localStorage.getItem('user_id')) {
		alert('Não foi possível enviar os dados do anúncio. Tente novamente mais tarde!');
		return false;
	} else {
		partnersIds.forEach((id, index) => {
			listings.push({
				advertiser_id: localStorage.getItem('user_id'),
				partner_id: id,
				listing_url: listingUrls[index],
			});
		});
	}

	const payload = { listed_on: listings };

	try {
		advertiser = await fetch(
			`https://landera-network-7ikj4ovbfa-uc.a.run.app/api/v1/listings/${getUrlParameter(
				'listing_id'
			)}`,
			{
				method: 'patch',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			}
		);
	} catch (error) {
		alert(
			error.display && error.message
				? error.message
				: 'Não foi possível enviar os dados do anúncio. Tente novamente mais tarde!'
		);
	}

	console.log(advertiser);

	$('#field-email').val(advertiser.email);
	$('#field-phone').val(advertiser.phone);

	$('#field-phone, #field-email').prop('disabled', true);
	$('#field-phone, #field-email').css('background-color', '#2c2366');

	$('#header-redeem').text('Seguem abaixo os dados de contato do(a) anunciante:');
	$('#form-reedem').hide();
	$('#form-contact').fadeIn();
});

function getUrlParameter(sParam) {
	var sPageURL = window.location.search.substring(1),
		sURLVariables = sPageURL.split('&'),
		sParameterName,
		i;

	for (i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split('=');

		if (sParameterName[0] === sParam) {
			return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
		}
	}
	return false;
}
