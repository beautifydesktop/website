/*** Created by Derrick on 05/08/2015. */

var contentLocker = function(options) {

    this.interval;

    //default Vars
    var defaults = {
        id: 'contentLocker',
        timerDelay: 0,
        requestDelay: 10000,
        requestLink: false,
        blockContextMenu: true,
        blockContextMenuDelay: 0,
        clickTarget: document.getElementsByTagName('body')[0],
        onShow: false,
        onHide: false,
        pageCloseMessage: false,
        conversionsRequired: 1,
        redirectUrl: false
    };
	this.extend = function(a, b){
		for(var key in b)
			if(b.hasOwnProperty(key))
				a[key] = b[key];
		return a;
	}
    this.options = this.extend(defaults, options);

    //initiation function
    this.init = function(){
        this.id = this.options.id;
        this.backgroundId = 'contentLockerBackground';

        if (this.options.pageCloseMessage !== false){
            window.onbeforeunload = function() {
                //show confirm dialog only if content is locked
                if (self.isVisible())
                    return self.options.pageCloseMessage;
            }
        }

        //select action aka what locker type
        var type = this.options.type;
        var timer = 0;
        if ( type == 'onTimer' ){
            timer = this.options.timerDelay;
        }
        setTimeout(function(){
            self.showLocker();
            if(self.options.requestLink) self.startRequests();
        }, timer);
        //if need to block context menu
        if (this.options.blockContextMenu){
            this.blockContext();
            //this.blockScroll();
        }
    }


    this.isVisible = function(){
		var elem = document.getElementById("contentLocker");
        if (elem != null){
			return elem.style.display != 'none';
		}
        return false;
    }


    //ask if user completed action periodically
    this.startRequests = function(){
		  if (this.interval) return;
		  //create interval for requests
		  this.interval = setInterval(function(){
			var xhr= new XMLHttpRequest();
			xhr.open('GET', self.options.requestLink, true);
			xhr.onreadystatechange= function() {
				if (this.readyState!==4) return;
				if (this.status!==200) return;
				var data = JSON.parse(this.responseText);
				if (! data.IsError && data.Result){
					self.actionCompleted();
				}
			};
			xhr.send();
		  }, this.options.requestDelay);
		}

    //user completed action
    this.actionCompleted = function() {
        clearInterval(self.interval);
        self.unblockContext();
        //self.unblockScroll();
        self.hideLocker();
        window.parent.postMessage('close', "*");
        if(self.options.redirectUrl) {
            window.location.replace(self.options.redirectUrl);
        }
    }

    this.unblockContext = function(){
		var body = document.getElementsByTagName('body')[0];
		body.removeAttribute('oncontextmenu');
    }

    this.blockContext = function(){
        var delay = this.options.blockContextMenuDelay;
        setTimeout(function(){
			var body = document.getElementsByTagName('body')[0];
			body.setAttribute('oncontextmenu', 'shake(); return false;');
            body.classList.add("stop-scrolling");
        }, delay);
    }

    this.preventDefault = function(e)    {
        e = e || window.event;
        if (e.preventDefault)
            e.preventDefault();
        e.returnValue = false;
    }

    this.preventDefaultForScrollKeys = function(e) {
        if (keys[e.keyCode]) {
            preventDefault(e);
            return false;
        }
    }

    this.blockScroll = function ()  {
        if (window.addEventListener) // older FF
            window.addEventListener('DOMMouseScroll', this.preventDefault, false);
        window.onwheel = this.preventDefault; // modern standard
        window.onmousewheel = document.onmousewheel = this.preventDefault; // older browsers, IE
        window.ontouchmove  = this.preventDefault; // mobile
        document.onkeydown  = this.preventDefaultForScrollKeys;
    }

    this.unblockScroll = function ()  {
        if (window.removeEventListener)
            window.removeEventListener('DOMMouseScroll', this.preventDefault, false);
        window.onmousewheel = document.onmousewheel = null;
        window.onwheel = null;
        window.ontouchmove = null;
        document.onkeydown = null;
    }

    this.showLocker = function(){
		document.getElementById(this.backgroundId).style.display = 'block';
		document.getElementById("contentLocker").style.display = 'block';
        if (this.options.onShow !== false)
            this.options.onShow();
        window.parent.postMessage('hide_scrollbar', "*");
    }

    this.hideLocker = function(){
		document.getElementById(this.backgroundId).style.display = 'none';
		document.getElementById("contentLocker").style.display = 'none';
        if (this.options.onHide !== false)
            this.options.onHide();
		
		var ua = window.navigator.userAgent;
            var msie = ua.indexOf("MSIE ");
            if (msie > 0)     location.reload(); else return false;
    }

	window.lockerCallback = function(data){
		if (! data.IsError && data.Result){
            self.actionCompleted();
        }
	}

	window.shake = function(){
		var e = document.getElementById("contentLocker");
		var time = 500;
		var distance = 10;

		var originalStyle = e.style.cssText;
		var start = (new Date()).getTime();
		animate();

		function animate() {
			var now = (new Date()).getTime();
			var elapsed = now-start;
			var fraction = elapsed/time;
			if (fraction < 1) {
				var x = distance * Math.sin(fraction*4*Math.PI);
				e.style['margin-left'] = x + "px";
				setTimeout(animate, Math.min(25, time-elapsed));
			}
			else {
				e.style.cssText = originalStyle // Restore the original style
			}
		}
	}

    var self = this;
    this.init();
};