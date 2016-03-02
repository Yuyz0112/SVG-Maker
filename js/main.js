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
			break;
		case 'pattern':
			renderPattern();
			break;
		case 'textflow':
			createTextFlow();
			break;
		case 'clock':
			createClock();
			break;
		case 'divide':
			renderDivide();
			break;
	}
})

var clipboard = new Clipboard('#copy');
clipboard.on('success', function(e) {
    alert('已复制。')
    e.clearSelection();
});
clipboard.on('error', function(e) {
    alert('当前浏览器不支持自动复制，请手动复制。')
});

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
	var width = getWidth(320);
	var height = getHeight(200);
	var svg = Snap(width, height);
	var items = $('.editroom:visible .item');
	for (var i = 0; i < items.length; i++) {
		var x, y, From, To;
		var content = items.eq(i).find('.pure-control-group:nth-child(1) input').val();
		var fontSize = getValue(items.eq(i).find('.pure-control-group:nth-child(2) input'), 16);
		var fontColor = getValue(items.eq(i).find('.pure-control-group:nth-child(3) input'), '#000');
		var orient = getOrient(items.eq(i).find('.pure-controls input'));
		if (orient === 'x') {
			x = '100%',
				y = (height - 2 * fontSize) * Math.random() + fontSize,
				From = '100%',
				To = '-100%'
		} else {
			x = (width - 2 * fontSize) * Math.random() + fontSize,
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

function renderPattern() {
	var svg = Snap('#heart');
	var width = getWidth(160);
	var height = getHeight(160);
	var color = getValue($('.editroom:visible .pure-control-group').eq(2).find('input'), 'rgb(206, 30, 0)');
	var initOpacity = getValue($('.editroom:visible .pure-control-group').eq(3).find('input'), 0);
	var finalOpacity = getValue($('.editroom:visible .pure-control-group').eq(4).find('input'), 1);
	var time = getValue($('.editroom:visible .pure-control-group').eq(5).find('input'), 4)
	svg.attr({
		width: width,
		height: height
	});
	svg.select('path').attr({
		fill: color
	});
	svg.select('animate').attr({
		from: initOpacity,
		to: finalOpacity,
		dur: time
	});
	sync();
}

function createTextFlow() {
	$('.showroom:visible').html('');
	var width = getWidth(320);
	var height = getHeight(200);
	var svg = Snap(width, height);
	var fontColor = getValue($('.editroom:visible .pure-control-group').eq(2).find('input'), '#ff44336');
	var content = $('.editroom:visible .pure-control-group').eq(3).find('input').val();
	var items = getValue($('.editroom:visible .pure-control-group').eq(4).find('input'), 6);
	var fontSize = getValue($('.editroom:visible .pure-control-group').eq(5).find('input'), 16);
	for (var i = 0; i < items; i++) {
		var text = svg.paper.text('35%', fontSize * 1.25 * (i + 1), content).attr({
			fontSize: fontSize,
			fill: fontColor,
			fontFamily: 'microsoft yahei, sans-serif'
		});
		var animate = svg.paper.el('animate', {
			attributename: 'opacity',
			from: 0,
			to: 1,
			begin: 0.4 * i + 's',
			dur: 0.4 * items + 's',
			repeatcount: 'indefinite'
		});
		text.append(animate);
	}
	$('.showroom:visible').append(svg.node);
	$('.showroom:visible').html($('.showroom:visible').html());
	sync();
}

function createClock() {
	$('.showroom:visible').html('');
	var width = getWidth(320);
	var height = getHeight(200);
	var svg = Snap(width, height);
	var strokeColor = getValue($('.editroom:visible .pure-control-group').eq(2).find('input'), '#01579b');
	var fillColor = getValue($('.editroom:visible .pure-control-group').eq(3).find('input'), '#b2ebf2');
	var rectColor = getValue($('.editroom:visible .pure-control-group').eq(4).find('input'), '#1a237e');
	var time = getValue($('.editroom:visible .pure-control-group').eq(5).find('input'), 10);
	var circle = svg.paper.circle(width / 2, height / 2, height * 0.9 / 2).attr({
		stroke: strokeColor,
		fill: fillColor,
		strokeWidth: 2
	});
	var rect = svg.paper.rect(width / 2, height / 2, 10, height * 0.8 / 2).attr({
		fill: rectColor
	});
	var animate = svg.paper.el('animateTransform', {
		attributename: 'transform',
		begin: '0s',
		dur: time + 's',
		type: 'rotate',
		from: '0 ' + width / 2 + ' ' + height / 2,
		to: '360 ' + width / 2 + ' ' + height / 2,
		repeatcount: 'indefinite'
	})
	var group = svg.paper.g(rect, animate);
	$('.showroom:visible').append(svg.node);
	$('.showroom:visible').html($('.showroom:visible').html());
	sync();
}

function renderDivide() {
	var svg = Snap('#divide');
	var color = getValue($('.editroom:visible .pure-control-group').eq(0).find('input'), '#009688');
	var time = getValue($('.editroom:visible .pure-control-group').eq(1).find('input'), 1.5)
	svg.attr({
		fill: color
	});
	svg.selectAll('animateTransform').attr({
		dur: time
	});
	sync();
}

function sync() {
	result.removeClass('prettyprinted');
	result.text($('.showroom:visible').html());
	prettyPrint();
}

function getWidth(val) {
	var width = $('.editroom:visible [data-role="svg-width"] input').val();
	if (width > 0) {
		return width;
	} else {
		return val;
	}
}

function getHeight(val) {
	var height = $('.editroom:visible [data-role="svg-height"] input').val();
	if (height > 0) {
		return height;
	} else {
		return val;
	}
}

function getOrient(el) {
	if (el[0].checked) {
		return 'y'
	} else {
		return 'x'
	}
}

function getValue(el, val) {
	var setValue = el.val();
	if (setValue) {
		return setValue;
	} else {
		return val;
	}
}