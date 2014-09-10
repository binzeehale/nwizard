(($) ->

    _defaultSettings =
        clicked: off
        panels: []

    _defaultPanel =
        tag: ''
        beforeNext: () ->
            return null
        beforeEnter: () ->
            return null

    _formatPanels = []

    _reGenerateItem = (dom, index, canClick, first=false) ->

        name = dom.children 'a'
                .html()
        index += 1

        dom.html [
            "<div class=\"title\">#{name}</div>"
            "<div class=\"circle\">"
                "<span>#{index}</span>"
            "</div>"
        ].join ''

        if not first
            dom.append "<div class=\"horizontal-bar\"></div>"
        else
            dom.append "<div class=\"horizontal-bar hide\"></div>"

        if canClick
            dom.children ".circle"
                .css cursor: "pointer"

    _bindItemEvent = (dom, canClicked, index) ->

        # trigger a tag event
        href = dom.children 'a'
                .attr 'href'
        href = if href then href.split ':' else 'javascript:void(0)'

        dom.on 'click', 'div.circle', (event, codeSource) ->

            if not codeSource and not canClicked
                return false

            if _formatPanels[index]?.beforeEnter() is false
                return false

            # change the css
            dom.siblings '.active, .on'
                .removeClass 'active'
                .removeClass 'on'

            dom.addClass('active')
                .prevAll()
                    .addClass('on')

            # toggle the relate panels
            for _panel, i in _formatPanels
                if i is index
                    $ _panel.tag
                        .show()
                else
                    $ _panel.tag
                        .hide()

            _href = href
            if _href.length > 1 and _href[0].match /^javascript$/gi
                try
                    eval(_href[1])
                catch error
                    console.error error
            else
                _href = _href.join ':'
                window.location.href = _href

    methods =
        init: (options) ->

            settings = @data 'nwizard'
            settings =  $.extend true, {}, _defaultSettings, options

            @data 'nwizard', settings

            # Add plugin class
            @addClass 'wizard'

            # recode the real panels
            for _panel in settings.panels
                if typeof _panel is "object"
                    if not _panel.tag
                        continue
                    else
                        _panel = $.extend true, {}, _defaultPanel, _panel
                else if typeof _panel is "string"
                    _panel = $.extend true, {}, _defaultPanel, {tag: _panel}
                else
                    continue
                _formatPanels.push _panel

            for _panel in _formatPanels
                $ _panel.tag
                    .hide()

            @find 'li'
                .each (idx, ele) =>
                    $ele = $ ele
                    # bind function or link
                    _bindItemEvent $ele, settings.clicked, idx
                    # reGenerate the html
                    _reGenerateItem $ele, idx, settings.clicked, idx is 0

                    # trigger click event
                    if $ele.hasClass "active"
                        $ele.children "div.circle"
                                .trigger "click", [true]

                    return $ele

            return this

        current: (options...) ->

            for ele, index in @find "li"
                $ele = $ ele
                if $ele.hasClass "active"
                    return index
            return null

        next: (options...) ->

            curIndex = methods.current.apply @, options

            if options.length > 0 and options[0].match /\d+/
                nextIndex = parseInt(options[0])
                nextIndex = if nextIndex > curIndex then nextIndex else curIndex + 1
            else
                nextIndex = curIndex + 1

            # trigger beforeNext event
            if _formatPanels[curIndex]?.beforeNext() is false
                return this

            @find "li"
                .each (index, ele) ->
                    $ele = $ ele
                    if index is nextIndex
                        $ele.children "div.circle"
                            .trigger "click", [true]
            return this

        prev: (options...) ->

            curIndex = methods.current.apply @, options

            if options and options.length > 0 and options[0].match /\d+/
                prevIndex = parseInt(options[0])
                prevIndex = if prevIndex < curIndex then prevIndex else curIndex - 1
            else
                prevIndex = curIndex - 1

            @find "li"
                .each (index, ele) ->
                    $ele = $ ele
                    if index is prevIndex
                        $ele.children "div.circle"
                            .trigger "click", [true]
            return this

        destroy: (options...) ->
            # TODO
            return

        val: (options...) ->
            return @data 'nwizard'

    $.fn.nwizard = (method, args...) ->

        console.log args

        if methods[method]
            method = methods[method]
        else if typeof method == 'object' or !method
            method = methods.init
            args = arguments
        else
            $.error 'Method #{method} does not exist on jQuery.nwizard'
            return this

        method.apply @, args
) jQuery

