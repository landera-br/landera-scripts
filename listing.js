// NOTE When form is submitted
$('#btn-interest').on('click', async (e) => {
	$('#form-modal').css('display', 'flex').hide().fadeIn();

	$('#btn-interest-submit').on('click', async (e) => {
		console.log('Enviou form');
		$('#form-modal').fadeOut();
	});
});
