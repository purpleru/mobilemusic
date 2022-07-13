

import './less/index.less';

import $ from 'jquery';

import { scale, timeFormat, getPlayLists } from './js/utils';

import Player from './js/player';

import Progress from './js/progress';

var progress = new Progress('.progress_box');

var player = new Player({
    el: '.play_bar',
    audioEl: '#audio',
    progress: progress,
    playListsEl: '#play-lists > ul'
});

player.initPlayMode('.play_bar > .play_order');


progress.progressEvent(function (percent) {
    console.log(player.playMusic);

    if (player.musicId !== -1 && player.playMusic.isDisable != true) {
        progress.changeProgressBar(percent);
        player.setAudioProgress(percent);
    }
});

progress.dotEvent(function (percent) {
    if (player.musicId !== -1 && player.playMusic.isDisable != true) {
        // 进度条在拉动的时候禁止设置音频播放时间
        if (!progress.canMove) {
            player.setAudioProgress(percent);
        }
        var duration = player.$audioEl.prop('duration');
        progress.changeProgressBar(percent);
        progress.setPlayTime(timeFormat(percent * duration));
    }
});

console.log(player);

player.audioTimeupdate(function (percent) {
    if (!progress.canMove) {
        progress.changeProgressBar(percent);
        progress.setPlayTime(timeFormat(player.$audioEl.prop('currentTime')));
        progress.setEndTime(timeFormat(player.$audioEl.prop('duration')));
    }
});

player.audioEnded(function () {
    // progress.changeProgressBar(0);
});

function setMusicList(id) {

    getPlayLists(id, function (musicLists) {
        player.playerLists = musicLists;
        $('#play-lists > ul').empty();
        $('#play-lists > header em').html('(' + musicLists.length + ')');
        $.each(musicLists, function (index, item) {
            var $li = $(`<li data-musicId="${item.id}">
            <span>${item.name}</span>
            <a class="icon-del" href="javascript:;"></a>
           </li>`).get(0);
            $li.music = item;
            $('#play-lists > ul').append($li);
        });
    });
}

try {
    var playerData = JSON.parse(window.localStorage.getItem('player') || '{}');
} catch (err) {
    playerData = {};
}

setMusicList(playerData.id);

// console.log(new Audio('http://192.168.1.4:8080/mp3/g.mp3'));


// animationend
$(function () {

    $('.fun_bar_love').click(function () {
        scale(this);

        var w = window.screen.width;

        alert(`
        screen:${w},
        devicePixelRatio:${window.devicePixelRatio}
        `);
    });

    $('.fun_bar_enj').click(function () {
        var listId = window.prompt('设置播放歌单,请输入歌单ID');

        if (!listId) return;

        try {
            if (isNaN(listId)) {
                var parseURL = listId.match(/http[s]*:\/\/[0-9\.A-z\/\?\=\&]+/g);

                var url = new URL(parseURL);

                listId = url.searchParams.get('id');

                if (!listId) {
                    // var str = `/playlist/2854035681`;
                    parseURL = url.pathname.match(/playlist\/[0-9]+/)[0] || '';

                    listId = parseURL.replace('playlist/', '');
                }

            }
        } catch (err) {
            console.warn('设置播放歌单列表失败,输入值:', listId);
            return false;
        }

        listId && setMusicList(listId);

    });


    var lis = $('#play-lists > ul').get(0).getElementsByTagName('li');

    // 播放/暂停
    $('.play_btn').on('click', function (evnt) {

        if (evnt.offsetY < 10) return;
        if (player.musicId === -1) {
            $(lis).eq(0).click();
        } else {
            player.playMusicFun(player.playMusic);
        }
    });

    // 上一首
    $('.play_prev').on('click', function () {
        $(lis).eq(player.prevMusic()).click();
    });

    // 下一首
    $('.play_next').on('click', function () {
        $(lis).eq(player.nextMusic()).click();
    });

    $('#masking').on('click', function () {
        $(this).fadeOut(100);
    });


    $('#play-lists > ul').on('click', 'li', function (e) {
        console.log(this.music);

        $(this).addClass('active').siblings().removeClass('active');
        player.playMusicFun(this.music);

        // console.log($(this).siblings());
        e.stopPropagation();
    });

    $('.play_fun').on('click', function () {
        $('#masking').fadeIn(100);
    });
});

