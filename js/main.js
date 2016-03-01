'use strict'
var result = $('#result .coderoom');
var menuBtn = $('.pure-menu-link');
var removeBtn = $('.remove');
var addBtn = $('.add');
var generateBtn = $('.generate');
var item = $('#form .panel:visible .item').prop('outerHTML');

$(function() {
	sync();
})

for (var i = 0; i < menuBtn.length; i++) {
	menuBtn[i].onclick = function() {
		var role = $(this).attr('data-role');
		$('#form .panel').hide();
		$('#form [data-role=' + role + ']').show();
		item = $('#form .panel:visible .item').prop('outerHTML');
		sync();
	}
}

removeBtn.click(function() {
	$(this).parent().remove();
})

addBtn.click(function() {
	$(this).prev().append(item);
	$(this).prev().find('.remove').click(function() {
		$(this).parent().remove();
	})
})

generateBtn.click(function() {
	var role = $(this).parent().parent().attr('data-role');
	switch (role) {
		case 'text-barrage':
			createTextBarrage();
			break;
		case 'barrage':
			createBarrage();
	}
})

function createTextBarrage() {
	var obj = renderBarrage();
	var svg = obj.svg;
	$('.showroom:visible').append(svg.node);
	$('.showroom:visible').html($('.showroom:visible').html());
	sync();
}

function createBarrage() {
	var obj = renderBarrage();
	var svg = obj.svg;
	var src = $('.editroom:visible [data-role="svg-bg"] input').val();
	$('.showroom:visible').append('<section></section>');
	$('.showroom:visible section').css({
		display: 'inline-block',
		width: obj.width,
		height: obj.height
	}).append('<img src="' + src + '" />').append(svg.node);
	$('.showroom:visible svg').css({
		height: parseInt(obj.height) + 14,
		marginTop: -obj.height
	});
	$('.showroom:visible').html($('.showroom:visible').html());
	sync();
}

function renderBarrage() {
	$('.showroom:visible').html('');
	var width = getWidth();
	var height = getHeight();
	var svg = Snap(width, height);
	var items = $('.editroom:visible .item');
	for (var i = 0; i < items.length; i++) {
		var x, y, From, To;
		var content = items.eq(i).find('.pure-control-group:nth-child(1) input').val();
		var fontSize = getFontSize(items.eq(i).find('.pure-control-group:nth-child(2) input'));
		var fontColor = getFontColor(items.eq(i).find('.pure-control-group:nth-child(3) input'));
		var orient = getOrient(items.eq(i).find('.pure-controls input'));
		if (orient === 'x') {
			x = '100%',
				y = (height - 2 * fontSize) * Math.random(),
				From = '100%',
				To = '-100%'
		} else {
			x = (width - 2 * fontSize) * Math.random(),
				y = -fontSize,
				From = -fontSize,
				To = '100%'
		}
		var text = svg.paper.text(x, y, content).attr({
			fontSize: fontSize,
			fill: fontColor,
			fontFamily: 'microsoft yahei, sans-serif'
		});
		var animate = svg.paper.el('animate', {
			attributename: orient,
			from: From,
			to: To,
			begin: i + 's',
			dur: '3s',
			repeatcount: 'indefinite'
		});
		text.append(animate);
	}
	return {
		svg: svg,
		width: width,
		height: height
	};
}

function sync() {
	result.removeClass('prettyprinted');
	result.text($('.showroom:visible').html());
	prettyPrint();
}

function getWidth() {
	var width = $('.editroom:visible [data-role="svg-width"] input').val();
	if (width > 0) {
		return width;
	} else {
		return 320;
	}
}

function getHeight() {
	var height = $('.editroom:visible [data-role="svg-height"] input').val();
	if (height > 0) {
		return height;
	} else {
		return 200;
	}
}

function getFontSize(el) {
	var size = el.val();
	if (size > 0) {
		return size;
	} else {
		return 16;
	}
}

function getFontColor(el) {
	var color = el.val();
	if (color) {
		return color;
	} else {
		return '#000';
	}
}

function getOrient(el) {
	if (el[0].checked) {
		return 'y'
	} else {
		return 'x'
	}
}