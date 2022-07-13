

import './less/index.less';

import $ from 'jquery';

import { scale, timeFormat, getPlayLists } from './js/utils';

import Player from './js/player';

import Progress from './js/progress';

var progress = new Progress('.progress_box');

var player = new Player({
    el: '.play_bar',
    audioEl: '#audio',
    progress: progress
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
        var htmlStrs = [];
        $.each(musicLists, function (index, item) {
            htmlStrs.push(`
            <li>
            <span>${item.name}</span>
            <a class="icon-del" href="javascript:;"></a>
            </li>
            `);
        });
        $('#play-lists > ul').html(htmlStrs.join(''));
    });
}

setMusicList(null);

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

    $('#masking').on('click', function () {
        $(this).fadeOut(100);
    });

    $('.play_fun').on('click', function () {
        $('#masking').fadeIn(100);

    });
});

