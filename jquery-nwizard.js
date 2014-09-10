// Generated by CoffeeScript 1.7.1
var __slice = [].slice;

(function($) {
  var methods, _bindItemEvent, _defaultPanel, _defaultSettings, _formatPanels, _reGenerateItem;
  _defaultSettings = {
    clicked: false,
    panels: []
  };
  _defaultPanel = {
    tag: '',
    beforeNext: function() {
      return null;
    },
    beforeEnter: function() {
      return null;
    }
  };
  _formatPanels = [];
  _reGenerateItem = function(dom, index, canClick, first) {
    var name;
    if (first == null) {
      first = false;
    }
    name = dom.children('a').html();
    index += 1;
    dom.html(["<div class=\"title\">" + name + "</div>", "<div class=\"circle\">", "<span>" + index + "</span>", "</div>"].join(''));
    if (!first) {
      dom.append("<div class=\"horizontal-bar\"></div>");
    } else {
      dom.append("<div class=\"horizontal-bar hide\"></div>");
    }
    if (canClick) {
      return dom.children(".circle").css({
        cursor: "pointer"
      });
    }
  };
  _bindItemEvent = function(dom, canClicked, index) {
    var href;
    href = dom.children('a').attr('href');
    href = href ? href.split(':') : 'javascript:void(0)';
    return dom.on('click', 'div.circle', function(event, codeSource) {
      var error, i, _href, _i, _len, _panel, _ref;
      if (!codeSource && !canClicked) {
        return false;
      }
      if (((_ref = _formatPanels[index]) != null ? _ref.beforeEnter() : void 0) === false) {
        return false;
      }
      dom.siblings('.active, .on').removeClass('active').removeClass('on');
      dom.addClass('active').prevAll().addClass('on');
      for (i = _i = 0, _len = _formatPanels.length; _i < _len; i = ++_i) {
        _panel = _formatPanels[i];
        if (i === index) {
          $(_panel.tag).show();
        } else {
          $(_panel.tag).hide();
        }
      }
      _href = href;
      if (_href.length > 1 && _href[0].match(/^javascript$/gi)) {
        try {
          return eval(_href[1]);
        } catch (_error) {
          error = _error;
          return console.error(error);
        }
      } else {
        _href = _href.join(':');
        return window.location.href = _href;
      }
    });
  };
  methods = {
    init: function(options) {
      var settings, _i, _j, _len, _len1, _panel, _ref;
      settings = this.data('nwizard');
      settings = $.extend(true, {}, _defaultSettings, options);
      this.data('nwizard', settings);
      this.addClass('wizard');
      _ref = settings.panels;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _panel = _ref[_i];
        if (typeof _panel === "object") {
          if (!_panel.tag) {
            continue;
          } else {
            _panel = $.extend(true, {}, _defaultPanel, _panel);
          }
        } else if (typeof _panel === "string") {
          _panel = $.extend(true, {}, _defaultPanel, {
            tag: _panel
          });
        } else {
          continue;
        }
        _formatPanels.push(_panel);
      }
      for (_j = 0, _len1 = _formatPanels.length; _j < _len1; _j++) {
        _panel = _formatPanels[_j];
        $(_panel.tag).hide();
      }
      this.find('li').each((function(_this) {
        return function(idx, ele) {
          var $ele;
          $ele = $(ele);
          _bindItemEvent($ele, settings.clicked, idx);
          _reGenerateItem($ele, idx, settings.clicked, idx === 0);
          if ($ele.hasClass("active")) {
            $ele.children("div.circle").trigger("click", [true]);
          }
          return $ele;
        };
      })(this));
      return this;
    },
    current: function() {
      var $ele, ele, index, options, _i, _len, _ref;
      options = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _ref = this.find("li");
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        ele = _ref[index];
        $ele = $(ele);
        if ($ele.hasClass("active")) {
          return index;
        }
      }
      return null;
    },
    next: function() {
      var curIndex, nextIndex, options, _ref;
      options = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      curIndex = methods.current.apply(this, options);
      if (options.length > 0 && options[0].match(/\d+/)) {
        nextIndex = parseInt(options[0]);
        nextIndex = nextIndex > curIndex ? nextIndex : curIndex + 1;
      } else {
        nextIndex = curIndex + 1;
      }
      if (((_ref = _formatPanels[curIndex]) != null ? _ref.beforeNext() : void 0) === false) {
        return this;
      }
      this.find("li").each(function(index, ele) {
        var $ele;
        $ele = $(ele);
        if (index === nextIndex) {
          return $ele.children("div.circle").trigger("click", [true]);
        }
      });
      return this;
    },
    prev: function() {
      var curIndex, options, prevIndex;
      options = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      curIndex = methods.current.apply(this, options);
      if (options && options.length > 0 && options[0].match(/\d+/)) {
        prevIndex = parseInt(options[0]);
        prevIndex = prevIndex < curIndex ? prevIndex : curIndex - 1;
      } else {
        prevIndex = curIndex - 1;
      }
      this.find("li").each(function(index, ele) {
        var $ele;
        $ele = $(ele);
        if (index === prevIndex) {
          return $ele.children("div.circle").trigger("click", [true]);
        }
      });
      return this;
    },
    destroy: function() {
      var options;
      options = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    },
    val: function() {
      var options;
      options = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.data('nwizard');
    }
  };
  return $.fn.nwizard = function() {
    var args, method;
    method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    console.log(args);
    if (methods[method]) {
      method = methods[method];
    } else if (typeof method === 'object' || !method) {
      method = methods.init;
      args = arguments;
    } else {
      $.error('Method #{method} does not exist on jQuery.nwizard');
      return this;
    }
    return method.apply(this, args);
  };
})(jQuery);