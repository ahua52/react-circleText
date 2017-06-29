
/**
  options = {
    tagName:"demo", // 目标元素的类名
    radius:60       // 圆半径
    dir: 1,         // 文字环绕方向[1，-1]
    position: 'relative',
    fitText: false,   //自适应屏幕
    fontSizeUnit:'px',  //自适应屏幕字体单位
    kompressor:1, //自适应缩放比
    fontSize: 20  //默认文字大小
  }
 */

export function circleText(options) {

    function injector(t='', splitter='', klass='char', after='') {
        if(t=='') return;
        var text = t.textContent
        , a = text.split(splitter)
        , inject = '';
        if (a.length) {
            a.map(function(item, i) {
                inject += '<span class="'+klass+(i+1)+'" aria-hidden="true">'+item+'</span>'+after;
            });
            t.setAttribute("aria-label",text);
            t.textContent = "";
            t.innerHTML = inject;

        }
    }

    function fitText(options) {
        let target = document.getElementsByClassName(options.tagName)[0];
        // Setup options
        var compressor = options.kompressor || 1,
            settings = Object.assign({
              'minFontSize' : Number.NEGATIVE_INFINITY,
              'maxFontSize' : Number.POSITIVE_INFINITY
            }, options);
        

        target.style.fontSize = Math.max(Math.min(target.clientWidth / (compressor*10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)) + options.fontSizeUnit;

        window.onresize =function(){
            target.style.fontSize = Math.max(Math.min(target.clientWidth / (compressor*10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)) + options.fontSizeUnit;
        }

    };

    if(!options.tagName) return;

    var target = document.getElementsByClassName(options.tagName)[0];

    var self = this,
        settings = {
        dir: 1,
        position: 'relative',
        fitText: false,
        fontSizeUnit:'px',
        kompressor:1,
        fontSize: 20
    };

    function init(options) {
    
        if (options) { 
           settings = Object.assign(settings, options);
        }

        let elem = target, 
            delta = (180 / Math.PI),
            fs = parseInt(target.style.fontSize || settings.fontSize, 10),
            ch = parseInt(target.style.lineHeight, 10) || fs,
            txt = elem.innerHTML.replace(/^\s+|\s+$/g, '').replace(/\s/g, '&nbsp;'),
            letters, 
            center;

        elem.innerHTML = txt;
        //$(elem).lettering();
        injector(target);

        elem.style.position =  settings.position;

        letters = elem.getElementsByTagName('span');
        center = Math.floor(letters.length / 2)
                
        let layout = function () {
            let tw = 0, 
                i,
                offset = 0,
                minRadius, 
                origin, 
                innerRadius,
                l, style, r, transform;
                                                
            for (i = 0; i < letters.length; i++) {
                tw += letters[i].offsetWidth;
            }
            debugger;
            minRadius = (tw / Math.PI) / 2 + ch;
            
            if (settings.fluid && !settings.fitText) {
                settings.radius = Math.max(elem.offsetWidth / 2, minRadius);
            }    
            else if (!settings.radius) {
                settings.radius = minRadius;
            }   
            
            if (settings.dir === -1) {
                origin = 'center ' + (-settings.radius + ch) / fs + 'em';
            } else {
                origin = 'center ' + settings.radius / fs + 'em';
            }

            innerRadius = settings.radius - ch;
                
            for (i = 0; i < letters.length; i++) {
                l = letters[i];
                offset += l.offsetWidth / 2 / innerRadius * delta;
                l.rot = offset;                      
                offset += l.offsetWidth / 2 / innerRadius * delta;
            }   
            for (i = 0; i < letters.length; i++) {
                l = letters[i]
                style = l.style
                r = (-offset * settings.dir / 2) + l.rot * settings.dir            
                transform = 'rotate(' + r + 'deg)';
                    
                style.position = 'absolute';
                style.left = '50%';
                style.marginLeft = -(l.offsetWidth / 2) / fs + 'em';

                style.webkitTransform = transform;
                style.MozTransform = transform;
                style.OTransform = transform;
                style.msTransform = transform;
                style.transform = transform;

                style.webkitTransformOrigin = origin;
                style.MozTransformOrigin = origin;
                style.OTransformOrigin = origin;
                style.msTransformOrigin = origin;
                style.transformOrigin = origin;
                if(settings.dir === -1) {
                    style.bottom = 0;
                }
            }
            
            if (settings.fitText) {
                fitText(settings);

                window.onresize = function() {
                  updateHeight();
                }
            }  

            updateHeight();
            
            if (typeof settings.callback === 'function') {
                // Execute our callback with the element we transformed as `this`
                settings.callback.apply(elem);
            }
        };
        
        var getBounds = function (elem) {
            var docElem = document.documentElement,
                box = elem.getBoundingClientRect();
            return {
                top: box.top + window.pageYOffset - docElem.clientTop,
                left: box.left + window.pageXOffset - docElem.clientLeft,
                height: box.height
            };
        };       
        
        var updateHeight = function () {
            var mid = getBounds(letters[center]),
                first = getBounds(letters[0]),
                h;
            if (mid.top < first.top) {
                h = first.top - mid.top + first.height;
            } else {
                h = mid.top - first.top + first.height;
            }
            elem.style.height = h + 'px';  
        }

        if (settings.fluid && !settings.fitText) {
            window.onresize = function() {
              layout();
            }
        }    

        if (document.readyState !== "complete") {
            elem.style.visibility = 'hidden';
            window.onload = function() {
              elem.style.visibility = 'visible';
              layout();
            }
            
        } else {
            layout();
        }
    };

    init(options)
};


