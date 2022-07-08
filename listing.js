// NOTE When form is submitted
$('#btn-interest').on('click', async (e) => {
	$('#form-modal').css('display', 'flex').hide().fadeIn();

	$('#btn-interest-close').on('click', async (e) => $('#form-modal').hide());

	$('#btn-interest-submit').on('click', async (e) => {
		$('#form-modal').hide();
		$('#form-modal').fadeOut();
	});
});
