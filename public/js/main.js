/*
* Jeff McGirr CS546 Final Project
* 20180803
* I pledge my honor that I have abided by the Stevens Honor System
* */

// login form
//handle submitting
const $un = $('#username');
const $pw = $('#password');
const $errbox = $('#loginWarning');

$('#login-form').submit(function (e) {
	// console.log('submitting');
	if ($un.val().length === 0 || $pw.val().length === 0) {
		e.preventDefault();
		$errbox.removeClass('d-none');
		if ($un.val().length === 0) {
			$un.addClass('is-invalid');
		}
		if ($pw.val().length === 0) {
			$pw.addClass('is-invalid');
		}
	}
});

// reg form
//handle submitting
// const $unreg = $('#username');
// const $pwreg = $('#password');
const $emailreg = $('#email');
// const $errboxreg = $('#loginWarning');

$('#register-form').submit(function (e) {
	// console.log('submitting');
	if ($un.val().length === 0 || $pw.val().length === 0 || $emailreg.val().length === 0) {
		e.preventDefault();
		$errbox.removeClass('d-none');
		if ($un.val().length === 0) {
			$un.addClass('is-invalid');
		}
		if ($pw.val().length === 0) {
			$pw.addClass('is-invalid');
		}
		if ($emailreg.val().length === 0) {
			$emailreg.addClass('is-invalid');
		}
	}
});

// post forms
//handle submitting
const $title = $('#title');
const $content = $('#content');
const bLockTitle = $('#locktitle').val();
const $errboxpost = $('#postWarning');

$('#post-form').submit(function (e) {
	// console.log('submitting');
	if ($content.val().length === 0) {
		e.preventDefault();
		$errboxpost.removeClass('d-none');
		$content.addClass('is-invalid');
	}
	if (bLockTitle === '0' && $title.val().length === 0) {
		e.preventDefault();
		$errboxpost.removeClass('d-none');
		$title.addClass('is-invalid');
	}
});

$('#update-form').submit(function (e) {
	// console.log('submitting');
	if ($content.val().length === 0) {
		e.preventDefault();
		$errboxpost.removeClass('d-none');
		$content.addClass('is-invalid');
	}
});