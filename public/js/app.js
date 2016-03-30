var socket = io();

socket.on('connect', function() {
	console.log('Connected to socket.io server!');
});

socket.on('message', function (message) {
	console.log('New message:');
	console.log(message.text);
});


var $form = jQuery('#message-form');

//监听表格submit事件触发
$form.on('submit', function (event) {
//preventDefault()函数用于阻止当前触发事件的默认行为。
//在HTML文档中，当我们触发某些DOM元素的特定事件时，可以执行该元素的默认行为。
//比如链接的click事件：当我们点击一个链接时，就会跳转到指定的URL。再比如：<form>表单元素的submit事件，当我们触发表单的提交事件时，就可以提交当前表单。
//使用preventDefault()函数可以阻止该元素的默认行为。
//该函数属于jQuery的Event对象。

	event.preventDefault();

//定位到提交信息元素
	var $message = $form.find('input[name=message]');

	//触发通过socket发送相关文本信息到server
	socket.emit('message', {
		text: $message.val()
	});

	$message.val('');
});