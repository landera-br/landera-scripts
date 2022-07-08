// NOTE When form is submitted
$('#btn-interest').on('click', async (e) => {
	const pathArray = window.location.pathname.split('/');
	$('#listing-id').val(pathArray[2]);

	$('#form-modal').css('display', 'flex').show();

	$('#btn-interest-close').on('click', async () => $('#form-modal').hide());

	$('#form-interest').submit(() => {
		$('#form-modal').hide();
		$('#form-modal').hide();
	});
});
