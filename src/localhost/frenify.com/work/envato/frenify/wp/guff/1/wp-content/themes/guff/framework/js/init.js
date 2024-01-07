/*
 * Copyright (c) 2023 Frenify
 * Author: Frenify
 * This file is made for CURRENT THEME
 */


/*

	@Author: Frenify
	@URL: https://frenify.com/


	This file contains the jquery functions for the actual theme, this
	is the file you need to edit to change the structure of the
	theme.

	This files contents are outlined below.

*/


jQuery.fn.isInViewportByFrenify = function() {
    "use strict";
    var element = jQuery(this),
        windoww = jQuery(window);
    var elementTop = element.offset().top;
    var elementBottom = elementTop + element.outerHeight();

    var viewportTop = windoww.scrollTop();
    var viewportBottom = viewportTop; // + windoww.height();
    var percentage = (viewportTop - elementTop) / element.outerHeight() * 100;
    return [(elementBottom > viewportTop) && (elementTop < viewportBottom), percentage];
};

jQuery.fn.isInViewportByFrenifyBottom = function() {
    "use strict";
    var element = jQuery(this),
        windoww = jQuery(window);
    var elementTop = element.offset().top;
    var elementBottom = elementTop + element.outerHeight();

    var viewportTop = windoww.scrollTop();
    var viewportBottom = viewportTop + windoww.height();
    var percentage = (viewportTop - elementTop) / element.outerHeight() * 100;
    return [(elementBottom > viewportTop) && (elementTop < viewportBottom), percentage];
};


var GuffAjax = GuffAjaxObject;
var GuffBody = jQuery('body');
var GuffWrapper = jQuery('.guff-fn-wrapper');
var GuffVoteWait = false;
var GuffReactionWait = false;
var GuffNextPostWait = false;
var GuffQuickNav = 0;
var GuffCounterAjaxPost = 1;
var GuffSearch = {
    search: '',
    text: '',
    onlyTitle: false,
    onlyPost: false
};
var PoptioEntityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};

// All other theme functions
(function($) {

    "use strict";


    var GuffInit = {


        pageNumber: 1,

        init: function() {
            this.cursor();
            this.fixShareAvoidAccidentalClick();
            this.blog_info();
            this.url_fixer();
            this.hamburgerOpener__Mobile();
            this.submenu__Mobile();
            this.imgToSVG();
            this.isotopeMasonry();
            this.dataFnBgImg();
            this.widget__pages();
            this.widget__archives();
            this.inputCheckBoxInComment();


            this.totopWinScroll();
            this.widgetTitle();
            this.fixAdminBar();
            this.minHeightPages();

            // since guff
            this.ready();
            this.totopScroll();
            this.seachSomething();
            this.reversedMenu();
            this.commentOpener();
            this.voteOpener();
            this.reaction();
            this.ajaxNextPost();
            this.nowReading();
            this.transformReading();
            this.stickyHeader();
            this.stickyTopBar();
            this.mobile__Menu();
            this.getSidePopupPost();
            this.embedOpener();
            this.topQuickNav();
            this.blogPageFeatured();
            this.removePaddingFromWidgetsIfNoTitle();
            this.marquee();
            this.shareBox();
            this.moreLessCategories();
            this.newPlayer();
            this.bodyOverflow();
            this.fnTooltip();
        },

        fnTooltip: function() {
            $('.fn__tooltip_item .t_text').each(function() {
                var e = $(this),
                    p = e.closest('.fn__tooltip_item');
                if ((p.offset().left + (p.width() / 2)) < (e.outerWidth() / 2)) {
                    p.addClass('left_aligned');
                } else {
                    p.removeClass('left_aligned');
                }
            });
        },

        bodyOverflow: function() {
            if ($('.fn_cs_posts_layout_delta,.fn_cs_catlist_alpha .alpha_left .post_item').length) {
                GuffBody.addClass('frenify_auto_overflow');
            }
        },

        runPlayer: function() {
            var parent = $('.guff_fn_main_audio');
            var audioVideo = parent.find('audio,video');
            audioVideo.each(function() {
                var element = $(this);
                if (parent.find('.mejs-audio').length) {
                    parent.find('.mejs-audio').remove();
                }
                element.mediaelementplayer({
                    // Do not forget to put a final slash (/)
                    pluginPath: 'https://cdnjs.com/libraries/mediaelement/',
                    // this will allow the CDN to use Flash without restrictions
                    // (by default, this is set as `sameDomain`)
                    shimScriptAccess: 'always',
                    //					features: ['playpause','skipback','jumpforward','progress','current','duration','tracks','volume'],
                    features: ['skipback', 'jumpforward', 'progress', 'current', 'duration', 'tracks', 'volume'],
                    skipBackInterval: 10,
                    jumpForwardText: '10s',
                    skipBackText: '10s',
                    jumpForwardInterval: 10,
                    classPrefix: 'mejs__',
                    timeAndDurationSeparator: ' / ',
                    audioVolume: 'vertical',
                    success: function(mediaElement) {
                        mediaElement.addEventListener('play', function() {
                            parent.removeClass('fn_pause').addClass('fn_play');
                        }, false);
                        mediaElement.addEventListener('pause', function() {
                            parent.removeClass('fn_play').addClass('fn_pause');
                        }, false);
                    },
                });
            });
        },

        newPlayer: function() {
            var audiobox = $('.guff_fn_main_audio');
            var playButton = $('.guff_fn_audio_button');
            var boxCloser = audiobox.find('.closer');
            var audioOpener = $('.guff_fn_audio_opener');
            var playOfAudiobox = audiobox.find('.podcast_icon');
            var playPauseOfOpener = audioOpener.find('.icon_bar');
            var openBtn = audioOpener.find('.text');
            var closeBtn = audioOpener.find('.closer');
            var self = this;

            self.runPlayer();

            // close button of audiobox on click action
            boxCloser.off().on('click', function() {

                if (audiobox.hasClass('fn_play')) {
                    // открыть кнопку "открыть"
                    audiobox.addClass('closed');
                    audioOpener.addClass('opened');
                } else {
                    // action #shutup
                    audiobox.removeClass('fn_play').addClass('fn_pause closed').find('audio,video')[0].pause();
                    GuffBody.removeClass('music-play music-pause');
                    $('.fn__mp3_item.active').removeClass('fn_pause active fn_play');
                }
                return false;
            });

            // open button (fixed to right with equalizer) on click action
            openBtn.off().on('click', function() {
                // open audiobox
                audiobox.removeClass('closed');
                // close open button
                audioOpener.removeClass('opened');

                return false;
            });

            // Отключить все звуки и проигрыватель + закрыть кнопку "открыть"
            closeBtn.off().on('click', function() {
                audioOpener.removeClass('opened');

                // action #shutup
                audiobox.removeClass('fn_play').addClass('fn_pause closed').find('audio,video')[0].pause();
                GuffBody.removeClass('music-play music-pause');
                $('.fn__mp3_item.active').removeClass('fn_pause active fn_play');

                return false;
            });

            // play/pause button of audiobox on click action
            playOfAudiobox.off().on('click', function() {
                if (audiobox.find('audio,video').length) {
                    if (audiobox.hasClass('fn_pause')) {
                        // action #play_mp3
                        audiobox.removeClass('fn_pause').addClass('fn_play').find('audio,video')[0].play();
                        GuffBody.addClass('music-play').removeClass('music-pause');
                        $('.fn__mp3_item.active').addClass('fn_play').removeClass('fn_pause');
                    } else {
                        // action #pause_mp3
                        audiobox.removeClass('fn_play').addClass('fn_pause').find('audio,video')[0].pause();
                        GuffBody.removeClass('music-play').addClass('music-pause');
                        $('.fn__mp3_item.active').addClass('fn_pause').removeClass('fn_play');
                    }
                }
            });

            // play/pause button of "open" button on click action
            playPauseOfOpener.off().on('click', function() {
                if (audiobox.find('audio,video').length) {
                    if (audiobox.hasClass('fn_pause')) {
                        // action #play_mp3
                        audiobox.removeClass('fn_pause').addClass('fn_play').find('audio,video')[0].play();
                        GuffBody.addClass('music-play').removeClass('music-pause');
                        $('.fn__mp3_item.active').addClass('fn_play').removeClass('fn_pause');
                    } else {
                        // action #pause_mp3
                        audiobox.removeClass('fn_play').addClass('fn_pause').find('audio,video')[0].pause();
                        GuffBody.removeClass('music-play').addClass('music-pause');
                        $('.fn__mp3_item.active').addClass('fn_pause').removeClass('fn_play');
                    }
                }
            });

            // play/pause button of mp3 in any place on click action
            playButton.off().on('click', function() {
                var button = $(this);


                // if it is mp3 item
                if (button.closest('.fn__mp3_item').length) {
                    var mp3Item = button.closest('.fn__mp3_item');

                    if (!mp3Item.hasClass('active')) {
                        $('.fn__mp3_item').removeClass('active fn_play fn_pause');
                        mp3Item.addClass('active');
                    }

                    if (mp3Item.hasClass('fn_pause')) {
                        // action #play_mp3
                        audiobox.removeClass('fn_pause').addClass('fn_play').find('audio,video')[0].play();
                        GuffBody.addClass('music-play').removeClass('music-pause');
                        mp3Item.removeClass('fn_pause').addClass('fn_play');
                    } else if (mp3Item.hasClass('fn_play')) {
                        // action #pause_mp3
                        audiobox.removeClass('fn_play').addClass('fn_pause').find('audio,video')[0].pause();
                        GuffBody.removeClass('music-play').addClass('music-pause');
                        mp3Item.removeClass('fn_play').addClass('fn_pause');
                    } else {
                        // action #new_play_mp3
                        mp3Item.addClass('fn_play');
                        audioOpener.removeClass('opened');
                        GuffBody.addClass('music-play').removeClass('music-pause');
                        $('.guff_fn_main_audio .audio_player').html('<audio controls><source src="' + button.attr('data-mp3') + '" type="audio/mpeg"></audio>');
                        self.runPlayer();
                        setTimeout(function() {
                            audiobox.removeClass('fn_pause closed').addClass('fn_play').find('audio,video')[0].play();
                        }, 50);
                    }
                } else {
                    button.addClass('fn_play');
                    audioOpener.removeClass('opened');
                    GuffBody.addClass('music-play').removeClass('music-pause');
                    $('.guff_fn_main_audio .audio_player').html('<audio controls><source src="' + button.attr('data-mp3') + '" type="audio/mpeg"></audio>');
                    self.runPlayer();
                    setTimeout(function() {
                        audiobox.removeClass('fn_pause closed').addClass('fn_play').find('audio,video')[0].play();
                    }, 50);
                }

                return false;
            });
        },


        moreLessCategories: function() {
            $('.fn__episodes_short_list').each(function() {
                var element = $(this),
                    ul = element.find('.episodes_list'),
                    li = element.find('.item'),
                    height = li.height(),
                    spacing = 20,
                    button = element.find('.fn__read_more a'),
                    limit = 2,
                    all = li.length;
                element.addClass('ready');
                if (limit < all) {
                    var h = height * limit + (limit - 1) * spacing + 'px';
                    var h2 = height * all + (all - 1) * spacing + 'px';
                    ul.attr('data-limit-height', h).height(h);
                    ul.attr('data-max-height', h2).height(h);
                }
                var speed = all - limit < 5 ? 500 : 1000;
                button.off().on('click', function() {
                    if (element.hasClass('clicked')) {
                        element.removeClass('clicked');
                        ul.animate({
                            height: ul.data('limit-height')
                        }, speed);
                        button.find('.text').text(button.data('more'));
                    } else {
                        element.addClass('clicked');
                        ul.animate({
                            height: ul.data('max-height')
                        }, speed);
                        button.find('.text').text(button.data('less'));
                    }
                    return false;
                });
            });
            $('.guff_fn_ccategories').each(function() {
                var element = $(this),
                    ul = element.find('ul'),
                    li = element.find('li'),
                    height = li.height(),
                    spacing = 10,
                    button = element.find('.show_others a'),
                    limit = parseInt(element.data('limit')),
                    all = li.length;
                if (limit < all) {
                    var h = height * limit + (limit - 1) * spacing + 'px';
                    var h2 = height * all + (all - 1) * spacing + 'px';
                    ul.attr('data-limit-height', h).height(h);
                    ul.attr('data-max-height', h2).height(h);
                }
                button.off().on('click', function() {
                    if (element.hasClass('clicked')) {
                        element.removeClass('clicked');
                        ul.animate({
                            height: ul.data('limit-height')
                        }, 1000);
                        button.text(button.data('more'));
                    } else {
                        element.addClass('clicked');
                        ul.animate({
                            height: ul.data('max-height')
                        }, 1000);
                        button.text(button.data('less'));
                    }
                    return false;
                });
            });
        },

        shareBox: function() {
            var sharebox = $('.guff_fn_sharebox');
            var sharebutton = $('.fn_share_button');
            var closer = sharebox.find('.share_closer');
            sharebutton.off().on('click', function() {
                var e = $(this),
                    box = e.siblings('.guff_fn_sharebox');
                if (e.hasClass('clicked')) {
                    e.removeClass('clicked');
                    box.removeClass('opened');
                } else {
                    e.addClass('clicked');
                    box.addClass('opened');
                }
                return false;
            });
            closer.off().on('click', function() {
                var e = $(this),
                    box = e.closest('.guff_fn_sharebox'),
                    btn = box.siblings('.fn_share_button');
                btn.removeClass('clicked');
                box.removeClass('opened');

                return false;
            });
            $(window).on('click', function() {
                sharebutton.removeClass('clicked');
                sharebox.removeClass('opened');
            });
            sharebox.on('click', function(e) {
                e.stopPropagation();
            });
        },


        marquee: function() {
            $(".fn__ticker_list .marquee").each(function() {
                var e = $(this);
                if (!e.hasClass('ready')) {
                    e.addClass('ready').marquee({
                        duplicated: true,
                        duration: 17000,
                        delayBeforeStart: 0,
                        pauseOnHover: true,
                        startVisible: true
                    });
                }
            });
        },

        infiniteScrollBlogList: function() {
            var e = $('#guff_fn_footer');
            $(window).on('resize scroll', function() {
                var f = e.isInViewportByFrenifyBottom();
                if (f[0]) {
                    console.log('asd');
                }
            });
        },

        fixShareAvoidAccidentalClick: function() {
            $('.icon_bar__share > a').off().on('click', function() {
                return false;
            });
        },

        removePaddingFromWidgetsIfNoTitle: function() {
            $('.guff_fn_hassidebar .widget_block').each(function() {
                if (!$(this).find('.wid-title .text').length) {
                    $(this).addClass('widget-no-title');
                }
            });
            if ($('.guff_fn_hassidebar').length) {
                GuffBody.addClass('guff-has-sidebar');
            }
        },

        blogPageFeatured: function() {
            var rtl = false;
            if ($("body").hasClass("rtl")) {
                rtl = true;
            }
            $('.fn__bp_slider .owl-carousel').each(function() {
                var owl = $(this);
                var parent = owl.closest('.fn__bp_slider');
                owl.owlCarousel({
                    items: 1,
                    loop: true,
                    rtl: rtl,
                    margin: 10,
                    autoplay: true,
                    dots: false,
                    smartSpeed: 1500,
                    autoplayTimeout: 7000,
                    autoplayHoverPause: true
                });
                GuffInit.imgToSVG();
                parent.find('.slider_nav.prev').off().on('click', function() {
                    owl.trigger('prev.owl.carousel', [1500]);
                    return false;
                });
                parent.find('.slider_nav.next').off().on('click', function() {
                    owl.trigger('next.owl.carousel');
                    return false;
                });
            });
            $('.fn__gallery_format .owl-carousel').each(function() {
                var owl = $(this);
                var parent = owl.closest('.fn__gallery_format');
                owl.owlCarousel({
                    items: 1,
                    loop: true,
                    margin: 0,
                    rtl: rtl,
                    autoplay: true,
                    dots: false,
                    smartSpeed: 1500,
                    autoplayTimeout: 7000,
                    autoplayHoverPause: true
                });
                GuffInit.imgToSVG();
                parent.find('.slider_nav.prev').off().on('click', function() {
                    owl.trigger('prev.owl.carousel', [1500]);
                    return false;
                });
                parent.find('.slider_nav.next').off().on('click', function() {
                    owl.trigger('next.owl.carousel');
                    return false;
                });
            });
            $('.fn__cat_slider .owl-carousel').each(function() {
                var owl = $(this);

                owl.owlCarousel({
                    items: 4,
                    loop: true,
                    rtl: rtl,
                    margin: 60,
                    autoplay: true,
                    dots: false,
                    smartSpeed: 1500,
                    autoplayTimeout: 7000,
                    autoplayHoverPause: true,
                    responsive: {
                        0: {
                            items: 1,
                        },
                        480: {
                            items: 2,
                            margin: 30,
                        },
                        1041: {
                            items: 3,
                        },
                        1201: {
                            items: 4,
                            margin: 60,
                        },
                    }
                });
                GuffInit.dataFnBgImg();
            });

        },


        quickNavResize: function() {
            $('.fn__blog_anchor').css({
                top: '100%',
                left: '100%'
            });
        },

        handle_mousedown: function(e) {
            var my_dragging = {};
            my_dragging.pageX0 = e.pageX;
            my_dragging.pageY0 = e.pageY;
            my_dragging.elem = this;
            my_dragging.offset0 = $(this).offset();

            function handle_dragging(e) {
                var left = my_dragging.offset0.left + (e.pageX - my_dragging.pageX0);
                var top = my_dragging.offset0.top + (e.pageY - my_dragging.pageY0);
                $(my_dragging.elem).offset({
                    top: top,
                    left: left
                });
            }

            function handle_mouseup() {
                $('body')
                    .off('mousemove', handle_dragging)
                    .off('mouseup', handle_mouseup);
            }

            $('body')
                .on('mouseup', handle_mouseup)
                .on('mousemove', handle_dragging);
        },

        topQuickNav: function() {
            $('.fn__blog_anchor').mousedown(GuffInit.handle_mousedown);
            $('.fn__blog_anchor .closer').off().on('click', function() {
                $('.fn__blog_anchor').removeClass('active').css({
                    left: '100%'
                });
                GuffBody.removeClass('blog-anchor-active');
                GuffQuickNav = 0;
                return false;
            });

            var stickyH = 0;
            if ($('.guff_fn_stickynav').length) {
                stickyH = $('.guff_fn_stickynav').outerHeight();
            }

            $('.fn__blog_anchor .ba_item').off().on('click', function() {
                var id = $(this).data('id');
                $([document.documentElement, document.body]).animate({
                    scrollTop: $('.guff_fn_blog_single[data-post-id="' + id + '"]').offset().top - 80 - stickyH
                }, 600);
            });
        },

        embedOpener: function() {
            var box = $('.fn__popupbox_iframe');
            var content = box.find('.iframe_content');
            $('.fn__video_popup,.fn__audio_popup').off().on('click', function() {
                var embed = $(this).siblings('.embed_code').html();
                content.html('').html(embed);
                box.addClass('active');
                return false;
            });
            box.find('.iframe_closer').off().on('click', function() {
                box.removeClass('active');
                setTimeout(function() {
                    content.html('');
                }, 400);
                return false;
            });
        },


        mobile__Menu: function() {
            var mobNav = $('.guff_fn_mobnav');
            var trigger = mobNav.find('.mobmenu_opener');
            var featured = mobNav.find('.item_featured a');
            var mobBottom = mobNav.find('.mob_bot');
            var featuredBar = mobNav.find('.mob_featured_bar');
            trigger.off().on('click', function() {
                if (mobNav.hasClass('menu_opened')) {
                    mobNav.removeClass('menu_opened');
                    mobBottom.slideUp();
                } else {
                    mobNav.addClass('menu_opened').removeClass('featured_bar_opened');
                    featuredBar.slideUp();
                    mobBottom.slideDown();
                }
                return false;
            });
            featured.off().on('click', function() {
                if (mobNav.hasClass('featured_bar_opened')) {
                    mobNav.removeClass('featured_bar_opened');
                    featuredBar.slideUp();
                } else {
                    mobNav.addClass('featured_bar_opened').removeClass('menu_opened');
                    mobBottom.slideUp();
                    featuredBar.slideDown();
                }
                return false;
            });
        },


        stickyTopBar: function() {
            var stickyHeader = $('.guff_fn_stickynav');
            if (stickyHeader.length) {
                stickyHeader.on('mouseenter', function() {
                    stickyHeader.addClass('hover');
                }).on('mouseleave', function() {
                    stickyHeader.removeClass('hover');
                });
            }
        },

        stickyHeader: function() {
            var stickyHeader = $('.guff_fn_stickynav');
            if (stickyHeader.length) {
                var scrollTop = $(window).scrollTop();
                if (scrollTop > $('.guff_fn_header').outerHeight() + 50) {
                    GuffBody.addClass('sticky-active');
                } else {
                    GuffBody.removeClass('sticky-active');
                }
            }
        },

        transformReading: function() {
            var stickyHeader = $('.guff_fn_stickynav.ajax_enable');
            if (stickyHeader.length && (GuffBody.hasClass('single-post') || GuffBody.hasClass('single-frenify-podcast'))) {
                var lastScrollTop = 0;
                $(window).scroll(function() {
                    var st = $(this).scrollTop();
                    if (st > lastScrollTop) {
                        // downscroll
                        stickyHeader.addClass('active');
                    }
                    lastScrollTop = st;
                });
            }

        },

        nowReading: function() {
            var title = $('.header_post_reading .reading_post .title');
            var progress = $('.guff_fn_stickynav .progress');
            $(window).on('resize scroll', function() {
                var bs = $('.guff_fn_blog_single');
                bs.each(function() {
                    var e = $(this);
                    var f = e.isInViewportByFrenify();
                    var p = f[1];
                    if (f[0]) {
                        var newPostTitle = e.data('post-title');
                        if (title.html() !== newPostTitle) {
                            title.html(e.data('post-title'));
                        }
                        var currentURL = window.location.href;
                        var newURL = e.data('post-url');
                        if (currentURL !== newURL) {
                            window.history.pushState("", newPostTitle, newURL);
                        }
                    }
                    if (p >= 0 && p <= 100) {
                        progress.css({
                            width: p + '%'
                        });
                    }
                });
            });
        },

        getSidePopupPost: function() {
            var sidepp = $('.fn__fixed_bottom_post');
            if (sidepp.length) {
                $(document).scroll(function() {
                    var footerHeight = $('#guff_fn_footer').length > 1 ? $('#guff_fn_footer').outerHeight() : 0;
                    if (((window.innerHeight + window.scrollY + 400) >= document.body.offsetHeight - footerHeight) && !sidepp.hasClass('remove')) {
                        sidepp.addClass('active');
                    }
                });
                sidepp.find('.fbp_closer a').off().on('click', function() {
                    sidepp.removeClass('active').delay(500).addClass('remove');
                    return false;
                });
            }
        },

        ajaxNextPost: function() {
            var singlePost = $('.guff_fn_singleajax');
            if ($('.guff_fn_singleajax').length && !GuffNextPostWait) {
                $(document).scroll(function() {
                    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - $('#guff_fn_footer').outerHeight()) {
                        if (!GuffNextPostWait) {
                            var single = $('.guff_fn_blog_single');
                            var ID = single.last().data('get-post-id');
                            if (ID === '') {
                                GuffNextPostWait = true;
                                GuffBody.addClass('no-prev-post');
                                return false;
                            }
                            GuffBody.addClass('prev-post-loading');
                            GuffNextPostWait = true;
                            var requestData = {
                                action: 'guff_fn_get_prev_post',
                                ID: ID,
                                security: GuffAjax.nonce
                            };

                            $.ajax({
                                type: 'POST',
                                url: GuffAjax.ajax_url,
                                cache: false,
                                data: requestData,
                                success: function(data) {
                                    GuffQuickNav++;
                                    if (GuffQuickNav === 1) {
                                        $('.fn__blog_anchor').addClass('active');
                                        GuffBody.addClass('blog-anchor-active');
                                    }
                                    var fnQueriedObj = $.parseJSON(data); //get the data object
                                    singlePost.append(fnQueriedObj.output);
                                    GuffInit.init();
                                    GuffBody.removeClass('prev-post-loading');


                                    GuffCounterAjaxPost++;
                                    var appendedElement = singlePost.children().last();
                                    $('.fn__blog_anchor ul').append('<li><div class="ba_item" data-id="' + appendedElement.data('post-id') + '"><span class="ba_count"><span>' + GuffCounterAjaxPost + '</span></span><h4><span>' + appendedElement.data('post-title') + '</span></h4></div></li>');
                                    $('.fn__blog_anchor li').addClass('ready');
                                    GuffInit.topQuickNav();
                                    setTimeout(function() {
                                        GuffNextPostWait = false;
                                    }, 800);
                                },
                                error: function(MLHttpRequest, textStatus, errorThrown) {
                                    console.log(MLHttpRequest);
                                    console.log(textStatus);
                                    console.log(errorThrown);
                                }
                            });
                        }
                    }
                });
            }

        },

        voteOpener: function() {
            $('.guff_fn_votes').off().on('click', function() {
                var e = $(this);
                var b = e.find('.vote_info');
                if (e.hasClass('opened')) {
                    e.removeClass('opened');
                    b.slideUp(300);
                } else {
                    e.addClass('opened');
                    b.slideDown(300);
                }
            });

            $('.guff_fn_vote_up').off().on('click', function(e) {
                e.preventDefault();
                var element = $(this);
                if (element.closest('.guff_fn_votes').hasClass('up_action')) {
                    return false;
                }
                GuffInit.vote(element, 'up');
                return false;
            });


            $('.guff_fn_vote_down').off().on('click', function(e) {
                e.preventDefault();
                var element = $(this);
                if (element.closest('.guff_fn_votes').hasClass('down_action')) {
                    return false;
                }
                GuffInit.vote(element, 'down');

                return false;
            });
        },

        vote: function(element, action) {
            if (GuffVoteWait === true) {
                return false;
            }
            var parent = element.closest('.guff_fn_votes');
            parent.addClass('loading');
            GuffVoteWait = true;
            var ID = parent.data('id');
            var requestData = {
                action: 'guff_fn_vote',
                ID: ID,
                voteAction: action,
                security: GuffAjax.nonce
            };

            $.ajax({
                type: 'POST',
                url: GuffAjax.ajax_url,
                cache: false,
                data: requestData,
                success: function(data) {
                    var fnQueriedObj = $.parseJSON(data); //get the data object
                    parent.find('.result_vote .count').text(fnQueriedObj.count__result);
                    parent.find('.vote_info').html(fnQueriedObj.result__text);
                    parent.removeClass('loading');
                    parent.find('.result_vote .action').text(fnQueriedObj.difference);
                    parent.removeClass('up_action down_action').addClass(action + '_action');
                    GuffVoteWait = false;
                },
                error: function(MLHttpRequest, textStatus, errorThrown) {
                    console.log(MLHttpRequest);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        },

        escapeHTML: function(string) {
            return String(string).replace(/[&<>"'`=\/]/g, function(s) {
                return PoptioEntityMap[s];
            });
        },

        reaction: function() {
            $('.guff_fn_reaction_btn').off().on('click', function() {
                var element = $(this);
                if (GuffReactionWait === true) {
                    return false;
                }
                var parent = element.closest('.guff_fn_reactions');
                parent.addClass('loading');
                GuffReactionWait = true;
                var ID = element.data('id');
                var requestData = {
                    action: 'guff_fn_reactions',
                    ID: parseInt(ID),
                    ajax_action: GuffInit.escapeHTML(element.data('action')),
                    security: GuffAjax.nonce
                };


                $.ajax({
                    type: 'POST',
                    url: GuffAjax.ajax_url,
                    cache: false,
                    data: requestData,
                    success: function(data) {
                        var fnQueriedObj = $.parseJSON(data); //get the data object
                        var newReaction = fnQueriedObj.reaction;
                        var ajaxAction = fnQueriedObj.ajax_action;
                        element = $('.guff_fn_reaction_btn[data-id="' + ID + '"][data-action="' + newReaction + '"]');
                        element.find('.count').html(fnQueriedObj.count);
                        if (ajaxAction === 'add') {
                            element.addClass('active');
                        } else {
                            element.removeClass('active');
                        }
                        GuffReactionWait = false;
                    },
                    error: function(MLHttpRequest, textStatus, errorThrown) {
                        console.log(MLHttpRequest);
                        console.log(textStatus);
                        console.log(errorThrown);
                    }
                });

                return false;
            });

        },

        commentOpener: function() {
            $('.guff_fn_comments .comment_opener a').off().on('click', function() {
                var element = $(this);
                var parent = element.closest('.guff_fn_comments');
                var comment = parent.find('.fn__comments');
                if (parent.hasClass('comment-active')) {
                    parent.removeClass('comment-active');
                    comment.slideUp();
                } else {
                    parent.addClass('comment-active');
                    comment.slideDown();
                }
                return false;
            });
        },

        moreMenu: function() {
            $('.guff_fn_nav').each(function() {
                var nav = $(this);
                var menu = nav.find('.menu');
                var more = menu.find('.more');
                var moreBtn = more.find('a');
                var moreBtnWidth = moreBtn.width();
                var w = 0,
                    a = 0,
                    html = '',
                    padding = 60;
                if (nav.parent().hasClass('bottom_fixer')) {
                    menu = $('.guff_fn_header .bottom_fixer');
                    padding = 120;
                }
                nav.find('.guff_fn_main_nav > li').each(function() {
                    var e = $(this);
                    a += parseInt(e.outerWidth(true));
                    a += moreBtnWidth;
                    if (w + a > menu.width() - padding) {
                        e.addClass('disabled');
                        html += '<li class="' + e.attr('class') + '">' + e.html() + '</li>';
                    } else {
                        e.removeClass('disabled');
                    }
                    a -= moreBtnWidth;
                    w += a;
                    a = 0;
                });
                if (html !== '') {
                    more.addClass('active');
                    more.find('.sub-menu').html(html);
                } else {
                    more.removeClass('active');
                }
                $('.guff_fn_header .guff_fn_nav').addClass('ready');
            });


        },

        reversedMenu: function() {
            $('.guff_fn_main_nav ul').each(function() {
                var e = $(this),
                    w = e.offset().left + 240,
                    W = $('body').width();
                if (w > W) {
                    e.addClass('reverse');
                }
            });
        },




        seachSomething: function() {
            var searchOpener = $('.guff_fn_header .search_opener a,.guff_fn_mobnav .mobsearch_opener, .icon_bar__search a');
            var searchbox = $('.guff_fn_searchbox');
            var input = searchbox.find('form input[type="text"]');
            var resultBox = searchbox.find('.resultbox');
            var infoBox = resultBox.find('.result_info');
            var resultList = resultBox.find('.result_list ul');

            searchOpener.off().on('click', function() {
                if (GuffBody.hasClass('search-active')) {
                    GuffBody.removeClass('search-active');
                } else {
                    GuffBody.addClass('search-active');
                    input.val('');
                    setTimeout(function() {
                        input[0].focus();
                    }, 100);
                }
                return false;
            });

            searchbox.find('.search_closer').off().on('click', function() {
                GuffBody.removeClass('search-active');
                resultList.html('');
                searchbox.removeClass('ajax_result');
                infoBox.html('<p>' + infoBox.data('info') + '</p>');
                return false;
            });
            input.on("keypress", function(event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    $('.guff_fn_searchbox form input[type="submit"]').trigger('click');
                }
            });

            // filter search
            var timeout = null;
            input.on('keyup', function() {
                var field = $(this);
                var text = field.val();

                clearTimeout(timeout);

                timeout = setTimeout(function() {
                    GuffSearch.search = text;
                    if (text === GuffSearch.text) {
                        return false;
                    }
                    GuffSearch.text = text;
                    GuffInit.filterAjaxSearch();
                }, 700);
            });

            searchbox.find('input[type="checkbox"]').change(function() {
                GuffInit.filterAjaxSearch();
            });
        },

        filterAjaxSearch: function() {
            var searchBox = $('.guff_fn_searchbox');
            var resultBox = searchBox.find('.resultbox');
            var infoBox = resultBox.find('.result_info');
            var resultList = resultBox.find('.result_list ul');
            if (GuffSearch.text === '') {
                resultList.html('');
                searchBox.removeClass('ajax_result');
                infoBox.html('<p>' + infoBox.data('info') + '</p>');
                return false;
            }
            searchBox.addClass('loading ajax_result');
            var titleFilter = searchBox.find('.title_filter input').prop('checked') ? 1 : 0;
            var postFilter = searchBox.find('.post_filter input').prop('checked') ? 1 : 0;


            var requestData = {
                action: 'guff_fn_ajax_search',
                security: GuffAjax.nonce,
                text: GuffSearch.text,
                titleFilter: titleFilter,
                postFilter: postFilter,
            };



            $.ajax({
                type: 'POST',
                url: GuffAjax.ajax_url,
                cache: false,
                data: requestData,
                success: function(data) {
                    var fnQueriedObj = $.parseJSON(data);

                    // append new items into grid 
                    resultList.html(fnQueriedObj.list);
                    infoBox.html(fnQueriedObj.info);


                    // recall some functions
                    GuffInit.dataFnBgImg();
                    GuffInit.imgToSVG();

                    searchBox.removeClass('loading');
                },
                error: function(xhr, textStatus, errorThrown) {
                    console.log(errorThrown);
                    console.log(textStatus);
                    console.log(xhr);
                }
            });
        },


        totopScroll: function() {
            var minSpeed = 500;
            var maxSpeed = 1500;
            $(".guff_fn_totop,.guff_fn_footer .footer_totop").off().on('click', function(e) {
                e.preventDefault();
                var speed = ($(window).scrollTop() - $(window).height()) / 2;
                if (speed < minSpeed) {
                    speed = minSpeed;
                }
                if (speed > maxSpeed) {
                    speed = maxSpeed;
                }
                $("html, body").animate({
                    scrollTop: 0
                }, speed);
                return false;
            });
        },

        ready: function() {
            $('.guff_fn_walletbox, .guff_fn_wallet_closer, .guff_fn_leftnav, .guff_fn_leftnav_closer').removeClass('ready');
        },


        minHeightPages: function() {
            var adminBar = $('#wpadminbar');
            var adminBarHeight = 0;
            var footer = $('#guff_fn_footer');
            var header = $('#guff_fn_header');
            var footerHeight = 0;
            var headerHeight = 0;
            if (adminBar.length) {
                adminBarHeight = adminBar.height();
            }
            if (window.matchMedia('(max-width: 600px)').matches) {
                adminBarHeight = 0;
            }
            if (header.length) {
                headerHeight = header.outerHeight();
            }
            if (footer.length) {
                footerHeight = footer.outerHeight();
            }
            $('.guff_fn_page_ajax').css({
                minHeight: ($(window).height() - adminBarHeight - footerHeight - headerHeight) + 'px'
            });
        },

        fixAdminBar: function() {
            if (GuffBody.hasClass('admin-bar')) {
                $('html').addClass('frenify-html');
            }
            if ($('.guff_fn_author_info .info_img img').length) {
                $('.guff_fn_author_info .info_in').css({
                    marginTop: 0
                });
            }
        },


        preloader: function() {
            $('.guff_fn_preloader').addClass('ready');
        },


        widgetTitle: function() {
            $('.wp-block-group__inner-container > h1,.wp-block-group__inner-container > h2,.wp-block-group__inner-container > h3,.wp-block-group__inner-container > h4,.wp-block-group__inner-container > h5,.wp-block-group__inner-container > h6').each(function() {
                var e = $(this);
                e.after('<div class="wid-title"><span class="text"><span>' + e.text() + '</span></span></div>');
                e.remove();
            });
        },


        totopWinScroll: function() {
            var WinOffset = $(window).scrollTop();
            var totop = $('a.guff_fn_totop');
            if (totop.length) {
                if (WinOffset > 300) {
                    totop.addClass('active');
                } else {
                    totop.removeClass('active');
                }
            }

            var documentHeight = $(document).height();
            var windowHeight = $(window).height();
            var remainingHeight = documentHeight - (WinOffset + windowHeight);


            if (remainingHeight < (200 + $('.guff_fn_footer').height())) {
                totop.addClass('footer-soon');
            } else {
                totop.removeClass('footer-soon');
            }
        },



        // ************************************************************************
        // ************************************************************************
        // ************************************************************************
        blog_info: function() {
            if ($('.blog_info').height() === 0) {
                $('.guff_fn_comment').addClass('margin-no-top');
            }
            if ($('.wp-calendar-nav').length) {
                $('.wp-calendar-nav').each(function() {
                    var e = $(this);
                    if (!e.find('a').length) {
                        e.remove();
                    }
                });
            }
        },

        projectPopup: function() {
            $('.guff_popup_gallery').each(function() { // the containers for all your galleries
                $(this).magnificPopup({
                    delegate: 'a.zoom', // the selector for gallery item
                    type: 'image',
                    gallery: {
                        enabled: true
                    },
                    removalDelay: 300,
                    mainClass: 'mfp-fade'
                });

            });
            $('.guff_popup_youtube, .guff_popup_vimeo').each(function() { // the containers for all your galleries
                $(this).magnificPopup({
                    disableOn: 700,
                    type: 'iframe',
                    mainClass: 'mfp-fade',
                    removalDelay: 160,
                    preloader: false,
                    fixedContentPos: false
                });
            });

            $('.guff_popup_soundcloude').each(function() {
                $(this).magnificPopup({
                    type: 'image',
                    gallery: {
                        enabled: true,
                    },
                });
            });
        },



        inputCheckBoxInComment: function() {
            if ($('p.comment-form-cookies-consent input[type=checkbox]').length) {
                $('p.comment-form-cookies-consent input[type=checkbox]').wrap('<label class="fn_checkbox"></label>').after('<span></span>');
            }
        },

        url_fixer: function() {
            $('a[href*="fn_ex_link"]').each(function() {
                var oldUrl = $(this).attr('href'),
                    array = oldUrl.split('fn_ex_link/'),
                    newUrl = GuffAjax.siteurl + "/" + array[1];
                $(this).attr('href', newUrl);
            });
            if ($('.guff-fn-protected').length) {
                $('.guff_fn_pagein').css({
                    paddingTop: 0
                });
            }
        },

        cursor: function() {
            var myCursor = $('.frenify-cursor');
            if (myCursor.length) {
                if ($("body").length) {
                    const e = document.querySelector(".cursor-inner"),
                        t = document.querySelector(".cursor-outer");
                    var n, i = 0,
                        W = 0,
                        intro = 0,
                        o = !1;
                    if ($('.guff_fn_intro').length) {
                        intro = 1;
                    }

                    var buttons = ".fn__blog_anchor .closer,.fn__blog_anchor .ba_item,.modal_ux_closer, .guff_fn_nav .trigger,.guff_fn_header .trigger,.fn_cs_intro_testimonials .prev, .fn_cs_intro_testimonials .next, .fn_cs_swiper_nav_next, .fn_cs_swiper_nav_prev, .fn_dots, .swiper-button-prev, .swiper-button-next, .fn_cs_accordion .acc_head, .guff_fn_popupshare .share_closer, .guff_fn_header .fn_finder, .guff_fn_header .fn_trigger, a, input[type='submit'], .cursor-link, button";
                    var sliders = ".owl-carousel, .swiper-container, .cursor-link";
                    // link mouse enter + move
                    window.onmousemove = function(s) {
                        o || (t.style.transform = "translate(" + s.clientX + "px, " + s.clientY + "px)"), e.style.transform = "translate(" + s.clientX + "px, " + s.clientY + "px)", n = s.clientY, i = s.clientX
                    }, $("body").on("mouseenter", buttons, function() {
                        e.classList.add("cursor-hover"), t.classList.add("cursor-hover")
                    }), $("body").on("mouseleave", buttons, function() {
                        $(this).is("a") && $(this).closest(".cursor-link").length || (e.classList.remove("cursor-hover"), t.classList.remove("cursor-hover"))
                    }), e.style.visibility = "visible", t.style.visibility = "visible";


                    // slider mouse enter
                    GuffBody.on('mouseenter', sliders, function() {
                        e.classList.add('cursor-slider');
                        t.classList.add('cursor-slider');
                    }).on('mouseleave', sliders, function() {
                        e.classList.remove('cursor-slider');
                        t.classList.remove('cursor-slider');
                    });

                    // slider mouse hold
                    GuffBody.on('mousedown', sliders, function() {
                        e.classList.add('mouse-down');
                        t.classList.add('mouse-down');
                    }).on('mouseup', sliders, function() {
                        e.classList.remove('mouse-down');
                        t.classList.remove('mouse-down');
                    });
                }
            }
        },

        widget__archives: function() {
            $('.widget_archive li').each(function() {
                var e = $(this);
                var a = e.find('a').clone();
                GuffBody.append('<div class="frenify_hidden_item"></div>');
                $('.frenify_hidden_item').html(e.html());
                $('.frenify_hidden_item').find('a').remove();
                var suffix = $('.frenify_hidden_item').html().match(/\d+/); // 123456
                $('.frenify_hidden_item').remove();
                suffix = parseInt(suffix);
                if (isNaN(suffix)) {
                    return false;
                }
                suffix = '<span class="count">' + suffix + '</span>';
                e.html(a);
                e.append(suffix);
            });
        },




        widget__pages: function() {
            var nav = $('.widget_pages ul');
            nav.each(function() {
                $(this).find('a').off().on('click', function(e) {
                    var element = $(this);
                    var parentItem = element.parent('li');
                    var parentItems = element.parents('li');
                    var parentUls = parentItem.parents('ul.children');
                    var subMenu = element.next();
                    var allSubMenusParents = nav.find('li');

                    allSubMenusParents.removeClass('opened');

                    if (subMenu.length) {
                        e.preventDefault();

                        if (!(subMenu.parent('li').hasClass('active'))) {
                            if (!(parentItems.hasClass('opened'))) {
                                parentItems.addClass('opened');
                            }

                            allSubMenusParents.each(function() {
                                var el = $(this);
                                if (!el.hasClass('opened')) {
                                    el.find('ul.children').slideUp();
                                }
                            });

                            allSubMenusParents.removeClass('active');
                            parentUls.parent('li').addClass('active');
                            subMenu.parent('li').addClass('active');
                            subMenu.slideDown();


                        } else {
                            subMenu.parent('li').removeClass('active');
                            subMenu.slideUp();
                        }
                        return false;
                    }
                });
            });
        },

        submenu__Mobile: function() {
            var nav = $('.wp-block-page-list, ul.vert_menu_list, .widget_nav_menu ul.menu, .guff_fn_mobnav .mob_bot .mobile_menu');
            var mobileAutoCollapse = GuffWrapper.data('mobile-autocollapse');
            nav.each(function() {
                $(this).find('a').off().on('click', function(e) {
                    var element = $(this);
                    var parentItem = element.parent('li');
                    var parentItems = element.parents('li');
                    var parentUls = parentItem.parents('ul.sub-menu');
                    var subMenu = element.next();
                    var allSubMenusParents = nav.find('li');

                    allSubMenusParents.removeClass('opened');

                    if (subMenu.length) {
                        e.preventDefault();

                        if (!(subMenu.parent('li').hasClass('active'))) {
                            if (!(parentItems.hasClass('opened'))) {
                                parentItems.addClass('opened');
                            }

                            allSubMenusParents.each(function() {
                                var el = $(this);
                                if (!el.hasClass('opened')) {
                                    el.find('ul.sub-menu').slideUp();
                                }
                            });

                            allSubMenusParents.removeClass('active');
                            parentUls.parent('li').addClass('active');
                            subMenu.parent('li').addClass('active');
                            subMenu.slideDown();


                        } else {
                            subMenu.parent('li').removeClass('active');
                            subMenu.slideUp();
                        }
                        return false;
                    }
                    if (mobileAutoCollapse === 'enable') {
                        if (nav.parent().parent().hasClass('opened')) {
                            nav.parent().parent().removeClass('opened').slideUp();
                            $('.guff_fn_mobilemenu_wrap .hamburger').removeClass('is-active');
                        }
                    }
                });
            });
        },

        hamburgerOpener__Mobile: function() {
            var hamburger = $('.guff_fn_mobilemenu_wrap .hamburger');
            hamburger.off().on('click', function() {
                var element = $(this);
                var menupart = $('.guff_fn_mobilemenu_wrap .mobilemenu');
                if (element.hasClass('is-active')) {
                    element.removeClass('is-active');
                    menupart.removeClass('opened');
                    menupart.slideUp(500);
                } else {
                    element.addClass('is-active');
                    menupart.addClass('opened');
                    menupart.slideDown(500);
                }
                return false;
            });
        },



        imgToSVG: function() {
            $('img.fn__svg').each(function() {
                var img = $(this);
                var imgClass = img.attr('class');
                var imgURL = img.attr('src');

                $.get(imgURL, function(data) {
                    var svg = $(data).find('svg');
                    if (typeof imgClass !== 'undefined') {
                        svg = svg.attr('class', imgClass + ' replaced-svg');
                    }
                    img.replaceWith(svg);

                }, 'xml');
            });
        },



        dataFnBgImg: function() {
            $('*[data-fn-bg-img], *[data-bg-img]').each(function() {
                var element = $(this);
                var attrBg = element.attr('data-fn-bg-img') || element.attr('data-bg-img');
                var bgImg = element.data('fn-bg-img') || element.data('bg-img');

                if (typeof attrBg !== 'undefined' && bgImg !== '') {
                    element.addClass('frenify-ready').css({
                        backgroundImage: 'url(' + bgImg + ')'
                    });
                }
            });
        },

        isotopeMasonry: function() {
            var masonry = $('.fn__masonry');
            if ($().isotope) {
                masonry.each(function() {
                    $(this).isotope({
                        itemSelector: '.mas__in',
                        masonry: {}
                    });
                });
            }
            var masonry2 = $('.fn__blog_list_layout_masonry, .fn__blog_list_layout_list');
            if ($().isotope) {
                masonry2.each(function() {
                    $(this).isotope({
                        itemSelector: '.post_item',
                        masonry: {}
                    });
                });
            }
        },
    };



    // ready functions
    $(document).ready(function() {
        GuffInit.init();
    });

    // resize functions
    $(window).on('resize', function(e) {
        e.preventDefault();
        GuffInit.isotopeMasonry();
        GuffInit.minHeightPages();
        GuffInit.moreMenu();
        GuffInit.quickNavResize();
        GuffInit.blogPageFeatured();
        GuffInit.fnTooltip();
    });

    // scroll functions
    $(window).on('scroll', function(e) {
        e.preventDefault();
        GuffInit.totopWinScroll();
        GuffInit.stickyHeader();
    });

    // load functions
    $(window).on('load', function(e) {
        e.preventDefault();
        GuffInit.preloader();
        GuffInit.isotopeMasonry();
        setTimeout(function() {
            GuffInit.isotopeMasonry();
            GuffInit.blogPageFeatured();
        }, 200);
    });


    window.addEventListener("load", function() {
        GuffInit.preloader();
        GuffInit.moreMenu();
    });


    $(window).on('elementor/frontend/init', GuffInit.rippleEffect);

})(jQuery);