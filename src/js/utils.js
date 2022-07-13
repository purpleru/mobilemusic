
import $ from 'jquery';

export function scale(el) {

    var isAnimationend = $(el).attr('data-isAnimationend');

    if (!isAnimationend) {
        $(el).on('animationend', function () {
            $(this).removeClass('animation_elScale');
        });
    }

    $(el).addClass('animation_elScale');

}

export function timeFormat(totalsecond) {

    var m = parseInt(totalsecond / 60);
    var s = parseInt(totalsecond % 60);

    if (isNaN(m)) {
        m = 0;
    }

    if (isNaN(s)) {
        s = 0;
    }

    m = m < 10 ? '0' + m : m;

    s = s < 10 ? '0' + s : s;

    return m + ':' + s;
}

// const baseURL = 'http://192.168.1.5:3000';

const baseURL = 'http://tools.wgudu.com:3000';

$.ajaxSetup({
    beforeSend(options) {
        var address = new URL(this.url, baseURL);
        address.searchParams.set('version', '3.0');
        this.url = address.toString();
    }
});


export function getPlayLists(id, callback) {

    try {
        var playerData = JSON.parse(window.localStorage.getItem('player') || '{}');
    } catch (err) {
        playerData = {};
    }

    if (playerData && id === playerData.id && playerData.playlist) {
        callback && callback(playerData.playlist);
        return;
    }


    $.get('/playlist/detail', {
        id: id || 4970728784
    }, function (data) {
        var { code, playlist } = data;
        if (code === 200) {
            console.log(playlist.tracks);
            window.localStorage.setItem('player', JSON.stringify({
                id: id,
                playlist: playlist.tracks
            }));
            callback && callback(playlist.tracks);
        } else {
            alert('获取歌单列表失败');
        }
    });
}


// 获取音乐播放地址
export function getPlayAddress(id, callback) {
    $.get('/api/song/url', {
        ids: id
    }, function (data) {
        if (data.code === 200) {
            callback && callback(data.data)
        } else {
            console.log(data);
            alert('获取播放地址失败');
        }
    });
}

export default {
    scale,
    timeFormat,
    getPlayLists,
    getPlayAddress
}