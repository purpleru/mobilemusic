
import $ from 'jquery';

import { getPlayAddress } from './utils';

function setMusicInfo(music) {
    var $song_name = $('.song_name'),
        $song_author = $('.song_author'),
        $cover = $('#cover'),
        $bj = $('#bj');

    var author = music.ar && music.ar[0],
        cover = music.al;

    $song_name.text(music.name);
    $song_author.text(author.name);
    $cover.css('background-image', 'url("' + cover.picUrl + '")');
    $bj.css('background-image', 'url("' + cover.picUrl + '")');
}

class Player {

    playerLists = [];
    playMusic = {};
    musicId = -1;

    constructor(options) {
        this.$playerEl = $(options.el);
        this.$audioEl = $(options.audioEl);
        this.$play_btn = this.$playerEl.find('.play_btn');
        this.$prev = this.$playerEl.find('.play_prev');
        this.$next = this.$playerEl.find('.play_next');
        this.$playListsEl = $(options.playListsEl);
        this.progress = options.progress;
        this.playMode = 0;
        this.init();
    }

    init() {
      
    }

    initPlayMode(el) {
        var _this = this;
        $(el).on('click', function () {
            // 0 顺序   1 随机  2 单曲
            var mode = _this.playMode;
            mode++;
            if (mode > 2) {
                mode = 0;
            }
            switch (mode) {
                case 1:
                    $(this).addClass('random').removeClass('order');
                    break;
                case 2:
                    $(this).addClass('loop').removeClass('random');
                    break;
                default:
                    $(this).addClass('order').removeClass('loop');
                    break;
            }
            _this.playMode = mode;
        });
    }

    prevMusic() {
        var index = this.playerLists.findIndex(musicItem => musicItem.id === this.musicId);
        index--;
        if (index < 0) {
            index = this.playerLists.length - 1;
        }

        return index;
    }

    nextMusic() {
        var index = this.playerLists.findIndex(musicItem => musicItem.id === this.musicId);
        index++;
        if (index < 0 || index > this.playerLists.length - 1) {
            index = 0;
        }
        return index;
    }

    playMusicFun(music) {

        var audio = this.$audioEl.get(0);

        if (music !== this.playMusic) {
            getPlayAddress(music.id, function (data) {
                var [addressData] = data;
                this.playMusic = music;
                this.musicId = music.id;
                if (addressData.code === 200 && addressData.url) {
                    audio.src = addressData.url;
                    audio.play();
                    this.$play_btn.removeClass('play');
                } else {
                    audio.src = '';
                    music.isDisable = true;
                    this.progress.reset();
                    this.$play_btn.addClass('play');
                    alert('此音乐无版权');
                }
            }.bind(this));
            setMusicInfo(music);
        } else {
            if (music.isDisable) return;
            if (audio.paused) {
                this.$play_btn.removeClass('play');
                audio.play();
            } else {
                this.$play_btn.addClass('play');
                audio.pause();
            }
        }
    }

    audioTimeupdate(callback) {
        this.$audioEl.on('timeupdate', function () {
            var val = this.currentTime / this.duration;
            // console.log(val);
            callback && callback(val);
        });
    }

    audioEnded(callback) {
        var _this = this;
        this.$audioEl.on('ended', function () {
            console.log('结束了');
            _this.$play_btn.addClass('play');
            switch (_this.playMode) {
                case 1:
                    var index = Math.floor(Math.random() * _this.playerLists.length);
                    _this.playMusicFun(_this.playerLists[index]);
                    break;
                case 2:
                    _this.$play_btn.click();
                    break;
                default:
                    _this.$next.click();
                    break;
            }
            // callback && callback();
        });
    }

    setAudioProgress(val) {
        if (!this.$audioEl.prop('src')) return false;
        // autoplay
        var duration = this.$audioEl.prop('duration');
        this.$audioEl.prop('currentTime', parseInt(val * duration));
        return true;
    }

}

export default Player;