// NOTE When form is submitted
$('#btn-interest').on('click', async (e) => {
	$('#form-modal').css('display', 'flex').show();

	$('#btn-interest-close').on('click', async (e) => $('#form-modal').hide());

	$('#form-interest').submit((e) => {
		e.preventDefault();
		console.log('Foi');
		$('#form-modal').hide();
		$('#form-modal').hide();
	});

	// $('#btn-interest-submit').on('click', async (e) => {

	// 	$('#form-interest').submit();
	// });
});
