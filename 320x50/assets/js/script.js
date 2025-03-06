/* global TimelineMax, SlowMo, EB, EBG */

// Broadcast Events shim
// ====================================================================================================
(function() {
    if (typeof window.CustomEvent === 'function') { return false; }

    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
})();

// Timeline
// ====================================================================================================
var timeline = (function MasterTimeline() {

    var tl;
    var win = window;

    function doClickTag() { window.open(window.clickTag); }

    function initTimeline() {
        document.querySelector('#ad .banner').style.display = 'block';
        document.querySelector('#ad .content').style.display = 'block';
        document.getElementById('ad').addEventListener('click', doClickTag);
        createTimeline();
    }

    function createTimeline() {
        tl = new TimelineMax({delay: .5, onStart: updateStart, onComplete: updateComplete, onUpdate: updateStats});
        // ---------------------------------------------------------------------------

        tl.add('frame1')
            .from('.frame1-text', 1, {  opacity: 0, ease: SlowMo.easeInOut }, 'frame1');

        // ---------------------------------------------------------------------------

        tl.add('frame2', '+=2.5')
            .from('.frame2-text', 1.5, {  opacity: 0, ease: SlowMo.easeInOut }, 'frame2+=0.15');

        // ---------------------------------------------------------------------------

        // DEBUG:
        // tl.play('frame3'); // start playing at label:frame3
        // tl.pause('frame3'); // pause the timeline at label:frame3
    }

    function updateStart() {
        var start = new CustomEvent('start', {
            'detail': { 'hasStarted': true }
        });
        win.dispatchEvent(start);
    }

    function updateComplete() {
        var complete = new CustomEvent('complete', {
            'detail': { 'hasStopped': true }
        });
        win.dispatchEvent(complete);
    }

    function updateStats() {
        var statistics = new CustomEvent('stats', {
            'detail': { 'totalTime': tl.totalTime(), 'totalProgress': tl.totalProgress(), 'totalDuration': tl.totalDuration()
            }
        });
        win.dispatchEvent(statistics);
    }

    function getTimeline() {
        return tl;
    }

    return {
        init: initTimeline,
        get: getTimeline
    };

})();

// Banner Init
// ====================================================================================================
timeline.init();


//Iterations
// ====================================================================================================
/*(function() {

    var iterations = 1;

    document.getElementById('iteration').innerText = iterations;

    myVideo.addEventListener('ended', function () {

        if (iterations < 2) {
            console.log('worked');
            this.currentTime = 0;
            this.play();
            iterations ++;

            document.getElementById('iteration').innerText = iterations;

        }

    }, false);
    })();*/