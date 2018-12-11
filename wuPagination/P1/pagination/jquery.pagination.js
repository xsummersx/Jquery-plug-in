/**
 * This jQuery plugin displays pagination links inside the selected elements.
 *
 * @author Gabriel Birke (birke *at* d-scribe *dot* de)
 * @version 1.1
 * @param {int} maxentries Number of entries to paginate
 * @param {Object} opts Several options (see README for documentation)
 * @return {Object} jQuery Object
 */
jQuery.fn.pagination = function (maxentries, opts) {
    opts = jQuery.extend({
        items_per_page: 10,
        num_display_entries: 10,
        current_page: 0,
        num_edge_entries: 0,
        link_to: "javascript:void(0)",
        prev_text: "Prev",
        next_text: "Next",
        ellipse_text: "...",
        prev_show_always: true,
        next_show_always: true,
        jumpTo:'',
        callback: function () { consolo.log(2);return false; }
    }, opts || {});

    return this.each(function () {
        /**
        * Calculate the maximum number of pages
        */
        //获取分页的最大页码
        var changedIndex = numPages();
        function numPages() {
            return Math.ceil(maxentries / opts.items_per_page);
        }
        /**
        * Calculate start and end point of pagination links depending on 
        * current_page and num_display_entries.
        * @return {Array}
        */
        //获取分页的最小页码和最大页码
        function getInterval() {
            var ne_half = Math.ceil(opts.num_display_entries / 2);
            var np = numPages();
            var upper_limit = np - opts.num_display_entries;
            var start = current_page > ne_half ? Math.max(Math.min(current_page - ne_half, upper_limit), 0) : 0;
            var end = current_page > ne_half ? Math.min(current_page + ne_half, np) : Math.min(opts.num_display_entries, np);
            return [start, end];
        }

        /**
        * This is the event handling function for the pagination links. 
        * @param {int} page_id The new page number
        */
        //选择页码
        function pageSelected(page_id, evt) {
            current_page = page_id;
            drawLinks();
            var continuePropagation = opts.callback(page_id, panel);
            if (!continuePropagation) {
                if (evt.stopPropagation) {
                    evt.stopPropagation();
                }
                else {
                    evt.cancelBubble = true;
                }
            }
            return continuePropagation;
        };

        //如果页码在分页范围内直接跳转，如果不在给出提示
        var getClickHandler1 = function (page_id) {
            return function (evt) {
                changedIndex = document.getElementById(opts.jumpTo+"id_ShowIndex").value;
               
                if (changedIndex == '' || changedIndex == null||changedIndex == undefined) {
                    //znbkxxLayer.msg('请输入页码', 7);
                    alert('请输入页码')
                }
                else if (changedIndex > numPages() || changedIndex < 1) {
                    if (typeof (znbkxxLayer) == 'object')
                        //znbkxxLayer.msg('不在页码范围内', 7);
                        alert('不在页码范围内')
                    else
                        //znbkxxLayer.msg('不在页码范围内', 7);
                        alert('不在页码范围内')
                    return;
                }
                else {
                    return pageSelected(changedIndex - 1, evt);
                }
            }
        };

        $("#"+opts.jumpTo).empty();
        var lnk1 = $("<span class='font1'>跳至</span>");
        $("#"+opts.jumpTo).append(lnk1);

        //var lnk2 = $('<input type="tel" id="id_ShowIndex" class="cls_ShowIndex" value="' + changedIndex + '" onkeyup="(this.v=function(){console.log(1);this.value=this.value.replace(/[^0-9]+/,\'\');}).call(this)" />');
        var lnk2 = $('<input type="tel" id="'+opts.jumpTo+'id_ShowIndex" class="cls_ShowIndex" value="' + changedIndex + '"/>');
        $("#"+opts.jumpTo).append(lnk2);

        $('#'+opts.jumpTo+'id_ShowIndex').bind('keyup', function (e) {
            var keynum = null;
            if (window.event) // IE 
            {
                keynum = e.keyCode;
            }
            else if (e.which) // Netscape/Firefox/Opera 
            {
                keynum = e.which;
            }

            if (keynum == 13) {
                changedIndex = document.getElementById(opts.jumpTo+"id_ShowIndex").value;

                if (changedIndex == '' || changedIndex == null || changedIndex == undefined) {
                    znbkxxLayer.msg('请输入页码', 7);
                }
                else if (changedIndex > numPages() || changedIndex < 1) {
                    if (typeof (znbkxxLayer) == 'object')
                        znbkxxLayer.msg('不在页码范围内', 7);
                    else

                        znbkxxLayer.msg('不在页码范围内', 7);
                    return;
                }
                else {
                    return pageSelected(changedIndex - 1, e);
                }
            }
        });

        var lnk11 = $("<span class='font2'>页</span>");
        $("#"+opts.jumpTo).append(lnk11);

        var lnk3 = $("<span class='Jump'>GO</span>").bind("click", getClickHandler1(7))
        $("#"+opts.jumpTo).append(lnk3);

        var explorer = navigator.userAgent;
        if (explorer.indexOf("Chrome") >= 0) {        //谷歌浏览器下padding长度计算方式不一样
            $(".cls_ShowIndex").css({ "padding-left": "5px" });
        }




        /**
        * This function inserts the pagination links into the container element
        */
        function drawLinks() {
            panel.empty();
            var interval = getInterval();
            var np = numPages();
            // This helper function returns a handler function that calls pageSelected with the right page_id
            var getClickHandler = function (page_id) {
                return function (evt) {
                    return pageSelected(page_id, evt);
                }
            }
            // Helper function for generating a single link (or a span tag if it'S the current page)
            var appendItem = function (page_id, appendopts) {
                page_id = page_id < 0 ? 0 : (page_id < np ? page_id : np - 1); // Normalize page id to sane value
                appendopts = jQuery.extend({ text: page_id + 1, classes: "current" }, appendopts || {});
                if (page_id == current_page) {
                    var lnk = $("<span class='current'>" + (appendopts.text) + "</span>");
                }
                else {
                    var lnk = $("<a>" + (appendopts.text) + "</a>")
						.bind("click", getClickHandler(page_id))
						.attr('href', opts.link_to.replace(/__id__/, page_id));


                }
                if (appendopts.classes) { lnk.removeAttr('class'); lnk.addClass(appendopts.classes); }
                panel.append(lnk);
            }
            //
            var appendItemExtend = function (page_id, appendopts) {

            }

            // Generate "Previous"-Link
            if (opts.prev_text && (current_page > 0 || opts.prev_show_always)) {
                appendItem(current_page - 1, { text: opts.prev_text, classes: "disabled" });
            }
            // Generate starting points
            if (interval[0] > 0 && opts.num_edge_entries > 0) {
                var end = Math.min(opts.num_edge_entries, interval[0]);
                for (var i = 0; i < end; i++) {
                    appendItem(i);
                }
                if (opts.num_edge_entries < interval[0] && opts.ellipse_text) {
                    jQuery("<span class='ellipse_text'>" + opts.ellipse_text + "</span>").appendTo(panel);
                }
            }
            // Generate interval links
            for (var i = interval[0]; i < interval[1]; i++) {
                appendItem(i);
            }
            // Generate ending points
            if (interval[1] < np && opts.num_edge_entries > 0) {
                if (np - opts.num_edge_entries > interval[1] && opts.ellipse_text) {
                    jQuery("<span class='ellipse_text'>" + opts.ellipse_text + "</span>").appendTo(panel);
                }
                var begin = Math.max(np - opts.num_edge_entries, interval[1]);
                for (var i = begin; i < np; i++) {
                    appendItem(i);
                }

            }
            // Generate "Next"-Link
            if (opts.next_text && (current_page < np - 1 || opts.next_show_always)) {
                appendItem(current_page + 1, { text: opts.next_text, classes: "disabled" });
            }

        }

        // Extract current_page from options
        var current_page = opts.current_page;
        // Create a sane value for maxentries and items_per_page
        maxentries = (!maxentries || maxentries < 0) ? 1 : maxentries;
        opts.items_per_page = (!opts.items_per_page || opts.items_per_page < 0) ? 1 : opts.items_per_page;
        // Store DOM element for easy access from all inner functions
        var panel = jQuery(this);

        //添加跳转至第几页

        // Attach control functions to the DOM element 
        this.selectPage = function (page_id) { pageSelected(page_id); }
        this.prevPage = function () {
            if (current_page > 0) {
                pageSelected(current_page - 1);
                return true;
            }
            else {
                return false;
            }
        }
        this.nextPage = function () {
            if (current_page < numPages() - 1) {
                pageSelected(current_page + 1);
                return true;
            }
            else {
                return false;
            }
        }
        // When all initialisation is done, draw the links
        drawLinks();
    });
}


