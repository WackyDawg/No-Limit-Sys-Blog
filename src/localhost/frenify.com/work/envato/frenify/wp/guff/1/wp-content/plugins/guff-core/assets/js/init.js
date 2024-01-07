(function($, fnFrontend) {
    "use strict";



    var FrenifyGuff = {

        isAdmin: false,
        adminBarH: 0,

        ajaxClicksForAjaxGridPosts: 0,

        init: function() {

            if ($('body').hasClass('admin-bar')) {
                FrenifyGuff.isAdmin = true;
                FrenifyGuff.adminBarH = $('#wpadminbar').height();
            }

            var widgets = {
                'frel-posts.default': FrenifyGuff.postsFunction,
                'frel-categories.default': FrenifyGuff.categories,
                'frel-partners.default': FrenifyGuff.partners,
                'frel-podcasts.default': FrenifyGuff.bgAndSvg,
                'frel-episodes.default': FrenifyGuff.bgAndSvg,
                'frel-hosts.default': FrenifyGuff.BgImg,
            };

            $.each(widgets, function(widget, callback) {
                fnFrontend.hooks.addAction('frontend/element_ready/' + widget, callback);
            });
        },


        bgAndSvg: function() {
            FrenifyGuff.BgImg();
            FrenifyGuff.ImgToSVG();
        },

        partners: function() {
            $(".fn_cs_partners .marquee").each(function() {
                var e = $(this);
                if (!e.hasClass('ready')) {
                    e.addClass('ready').marquee({
                        duplicated: true,
                        duration: parseInt(e.data('speed')) * 1000,
                        delayBeforeStart: 0,
                        direction: 'left',
                        pauseOnHover: true,
                        startVisible: true
                    });
                }
            });
        },
        categories: function() {
            $(".fn_cs_catlist_beta .marquee").each(function() {
                var e = $(this);
                if (!e.hasClass('ready')) {
                    e.addClass('ready').marquee({
                        duplicated: true,
                        duration: parseInt(e.data('speed')) * 1000,
                        delayBeforeStart: 0,
                        direction: 'left',
                        pauseOnHover: true,
                        startVisible: true
                    });
                }
            });
            FrenifyGuff.ImgToSVG();
        },

        postSlider: function() {

            var rtl = false;
            if ($("body").hasClass("rtl")) {
                rtl = true;
            }
            $('.fn_cs_posts_layout_slider .owl-carousel').each(function() {
                var owl = $(this);
                var parent = owl.closest('.fn_cs_posts_layout_slider');
                owl.owlCarousel({
                    items: 1,
                    loop: true,
                    rtl: rtl,
                    margin: 80,
                    autoplay: true,
                    dots: false,
                    smartSpeed: 1500,
                    autoplayTimeout: 7000,
                    autoplayHoverPause: true
                });
                parent.find('.slider_nav_btn.prev').off().on('click', function() {
                    owl.trigger('prev.owl.carousel', [1500]);
                    owl.trigger('stop.owl.autoplay');
                    owl.trigger('play.owl.autoplay');

                    return false;
                });
                parent.find('.slider_nav_btn.next').off().on('click', function() {
                    owl.trigger('next.owl.carousel');
                    owl.trigger('stop.owl.autoplay');
                    owl.trigger('play.owl.autoplay');
                    return false;
                });
            });
        },

        postAlpha: function() {
            $('.fn_cs_posts_layout_alpha').each(function() {
                var element = $(this);
                var children = element.find('.classic_item .date');
                var maxWidth = 0;
                children.each(function() {
                    var elementWidth = $(this).width(); // Get the width of the current element
                    maxWidth = Math.max(maxWidth, elementWidth); // Compare and update the maximum width
                });
                children.css({
                    minWidth: maxWidth
                });
            });
            $('.fn_cs_posts_layout_alpha .classic_item_wrapper').each(function() {
                var element = $(this);
                element.waypoint({
                    handler: function() {
                        if (!element.hasClass('active')) {
                            element.addClass('active');
                        }
                    },
                    offset: '90%'
                });
            });
        },

        postsFunction: function() {
            FrenifyGuff.postAlpha();
            FrenifyGuff.isotopeFunction();
            FrenifyGuff.postSlider();
            FrenifyGuff.BgImg();
            FrenifyGuff.ImgToSVG();
        },


        /* COMMMON FUNCTIONS */
        BgImg: function() {
            var div = $('*[data-fn-bg-img]');
            div.each(function() {
                var element = $(this);
                var attrBg = element.attr('data-fn-bg-img');
                var dataBg = element.data('fn-bg-img');
                if (typeof(attrBg) !== 'undefined') {
                    element.addClass('frenify-ready');
                    element.css({
                        backgroundImage: 'url(' + dataBg + ')'
                    });
                }
            });
            var div2 = $('*[data-bg-img]');
            div2.each(function() {
                var element = $(this);
                var attrBg = element.attr('data-bg-img');
                var dataBg = element.data('bg-img');
                if (typeof(attrBg) !== 'undefined') {
                    element.addClass('frenify-ready');
                    element.css({
                        backgroundImage: 'url(' + dataBg + ')'
                    });
                }
            });
        },

        isotopeFunction: function() {
            var masonry = $('.fn_cs_masonry');
            if ($().isotope) {
                masonry.each(function() {
                    $(this).isotope({
                        itemSelector: '.fn_cs_masonry_in',
                        masonry: {}
                    });
                    $(this).isotope('reloadItems').isotope();
                });
            }
        },

        ImgToSVG: function() {

            $('img.fn__svg').each(function() {
                var $img = $(this);
                var imgClass = $img.attr('class');
                var imgURL = $img.attr('src');

                $.get(imgURL, function(data) {
                    var $svg = $(data).find('svg');
                    if (typeof imgClass !== 'undefined') {
                        $svg = $svg.attr('class', imgClass + ' replaced-svg');
                    }
                    $img.replaceWith($svg);

                }, 'xml');
            });
        },

        lightGallery: function() {
            if ($().lightGallery) {
                // FIRST WE SHOULD DESTROY LIGHTBOX FOR NEW SET OF IMAGES
                var gallery = $('.fn_cs_lightgallery');

                gallery.each(function() {
                    var element = $(this);
                    element.lightGallery(); // binding
                    if (element.length) {
                        element.data('lightGallery').destroy(true);
                    } // destroying
                    $(this).lightGallery({
                        selector: ".lightbox",
                        thumbnail: 1,
                        loadYoutubeThumbnail: !1,
                        loadVimeoThumbnail: !1,
                        showThumbByDefault: !1,
                        mode: "lg-fade",
                        download: !1,
                        getCaptionFromTitleOrAlt: !1,
                    });
                });
            }
        },
    };

    $(window).on('elementor/frontend/init', FrenifyGuff.init);


    $(window).on('resize', function() {
        FrenifyGuff.isotopeFunction();
        setTimeout(function() {
            FrenifyGuff.isotopeFunction();
        }, 700);
    });
    $(window).on('load', function() {
        FrenifyGuff.isotopeFunction();
        FrenifyGuff.partners();
    });

    $(window).on('scroll', function() {

    });

})(jQuery, window.elementorFrontend);