/*!
 * Portfolio enhancements — AOS, skills, gallery lightbox, testimonials
 */

(function ($) {
  "use strict";

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // AOS
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
      disable: function () {
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      }
    });
  } else {
    document.documentElement.classList.add("aos-fallback");
  }

  // Reveal any stuck AOS nodes (opacity 0 while in/near viewport)
  function revealStuckAos() {
    document.querySelectorAll("[data-aos]").forEach(function (el) {
      if (getComputedStyle(el).opacity === "0") {
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add("aos-animate");
        }
      }
    });
  }

  $(window).on("scroll load", revealStuckAos);
  window.setTimeout(revealStuckAos, 800);
  window.setTimeout(function () {
    if (typeof AOS === "undefined") {
      document.documentElement.classList.add("aos-fallback");
    }
  }, 2000);

  // Smooth scroll for hero CTAs and in-page links outside navbar
  $(document).on("click", 'a[href^="#"]', function (event) {
    var hash = this.hash;
    if (!hash || hash === "#") return;
    var $target = $(hash);
    if (!$target.length) return;
    if ($(this).closest(".navbar").length) return; // handled in fahim174.js

    event.preventDefault();
    $("html, body").animate({ scrollTop: $target.offset().top - 10 }, 700);
  });

  // Animated skill bars
  function animateSkills() {
    $("#skills .progress-bar, .card-body .progress-bar").each(function () {
      var $bar = $(this);
      if ($bar.hasClass("animated")) return;
      var rect = this.getBoundingClientRect();
      if (rect.top < window.innerHeight - 40) {
        $bar.addClass("animated");
      }
    });
  }

  $(window).on("scroll resize load", animateSkills);
  $(animateSkills);

  // Portfolio isotope — show all by default
  $(window).on("load", function () {
    var $grid = $(".portfolio-container");
    if (!$grid.length || typeof $.fn.isotope !== "function") return;

    $grid.isotope({
      itemSelector: ".portfolio-item",
      layoutMode: "fitRows",
      filter: "*",
      animationOptions: {
        duration: 750,
        easing: "linear",
        queue: false
      }
    });

    $(".filters a").off("click").on("click", function (e) {
      e.preventDefault();
      $(".filters .active").removeClass("active");
      $(this).addClass("active");
      $grid.isotope({ filter: $(this).attr("data-filter") });
    });
  });

  // Teaching gallery lightbox
  var $lightbox = $("#lightbox");
  var $lightboxImg = $("#lightboxImage");
  var $lightboxCaption = $("#lightboxCaption");

  $(".gallery-item").on("click", function () {
    var full = $(this).data("full") || $(this).find("img").attr("src");
    var caption = $(this).data("caption") || "";
    var alt = $(this).find("img").attr("alt") || caption;
    $lightboxImg.attr({ src: full, alt: alt });
    $lightboxCaption.text(caption);
    $lightbox.addClass("open").attr("hidden", false);
    $("body").css("overflow", "hidden");
  });

  function closeLightbox() {
    $lightbox.removeClass("open").attr("hidden", true);
    $lightboxImg.attr({ src: "", alt: "" });
    $("body").css("overflow", "");
  }

  $("#lightboxClose").on("click", closeLightbox);
  $lightbox.on("click", function (e) {
    if (e.target === this) closeLightbox();
  });
  $(document).on("keydown", function (e) {
    if (e.key === "Escape" && $lightbox.hasClass("open")) closeLightbox();
  });

  // Testimonials carousel
  var $track = $("#testimonialTrack");
  var scrollAmount = function () {
    var $card = $track.find(".testimonial-card").first();
    return $card.length ? $card.outerWidth(true) + 8 : 360;
  };

  $("#testimonialNext").on("click", function () {
    $track.animate({ scrollLeft: $track.scrollLeft() + scrollAmount() }, 400);
  });

  $("#testimonialPrev").on("click", function () {
    $track.animate({ scrollLeft: $track.scrollLeft() - scrollAmount() }, 400);
  });

})(jQuery);
