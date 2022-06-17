
import $ from 'jquery';

export default class Progress {

    isDisable = false;

    constructor(el, callback) {
        this.$el = $(el);
        this.$progress = this.$el.find('.progress');
        // console.log(this.$el);
        // console.log( this.$el.find('.progress'));
    }

    progressEvent(callback) {
        var _that = this;
        this.$el.find('.progress').on('click', function (evnt) {
            callback && callback(_that.computeDis(evnt.clientX));
            // evnt.preventDefault();
        });
    }

    dotEvent(callback) {

        var _that = this;

        this.$el.find('.progress_bar_dot').on('touchstart', function (evnt) {
            _that.canMove = true;
            $(this).css({
                transform: 'translate(0, -50%) scale(2)'
            });
            evnt.stopPropagation();
        });

        this.$el.find('.progress_bar_dot').on('touchend', function (evnt) {
            $(this).css({
                transform: 'translate(0, -50%) scale(1)'
            });
            evnt.preventDefault();
        });

        $(document).on('touchmove', function (evnt) {

            if (_that.canMove) {
                var { clientX } = evnt.targetTouches[0],
                    percent = _that.computeDis(clientX);  
                callback && callback(percent);
                $(this).css({
                    transform: 'translate(0, -50%) scale(2)'
                });
            }
            // evnt.stopPropagation();
            // evnt.preventDefault();
        });


        $(document).on('touchend', function (evnt) {

            if (_that.canMove) {
                var { clientX } = evnt.changedTouches[0],
                    percent = _that.computeDis(clientX);
                _that.canMove = false;
                callback && callback(percent);
            }
            evnt.stopPropagation();
            // evnt.preventDefault();
        });
    }

    // 计算距离
    computeDis(clientX) {
        var dis_x = clientX - this.$progress.offset().left,
            percent = dis_x / this.$progress.width();
        return this.filterVal(percent);
    }

    progressMove() {
        var _that = this;
    }

    filterVal(val) {
        // val => 0 - 1
        return val > 1 ? 1 : val < 0 ? 0 : val;
    }

    changeProgressBar(val) {
        if (this.isDisable) return;
        // val => 0 - 1
        var val = val * 100;

        if (val > 100) {
            val = 100;
        } else if (val < 0) {
            val = 0;
        }
        this.$el.find('.progress_bar').css('width', val + '%');
    }

    setPlayTime(timeStr) {
        this.$el.find('.now_time').text(timeStr);
    }

    setEndTime(timeStr) {
        this.$el.find('.end_time').text(timeStr);
    }

    reset() {
        this.setPlayTime(0);
        this.setEndTime(0);
        this.changeProgressBar(0);
    }
}