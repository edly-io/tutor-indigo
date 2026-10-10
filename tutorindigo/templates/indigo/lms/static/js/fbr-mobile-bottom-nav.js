// Runs inline after the bar's markup (not on document ready) so the body class is
// set before first paint.
(function ($) {
  'use strict';

  var $trigger = $('#fbr-mobile-nav-profile');
  var $sheet = $('#fbr-mobile-nav-sheet');
  var $backdrop = $('#fbr-mobile-nav-backdrop');

  if (!$trigger.length || !$sheet.length || !$backdrop.length) {
    return;
  }

  $('body').addClass('has-fbr-mobile-bottom-nav');

  function setOpen(isOpen) {
    $sheet.toggleClass('is-open', isOpen);
    $backdrop.toggleClass('is-open', isOpen);
    $trigger.toggleClass('is-active', isOpen).attr('aria-expanded', isOpen ? 'true' : 'false');
  }

  $trigger.on('click', function () {
    setOpen(!$sheet.hasClass('is-open'));
  });
  $backdrop.on('click', function () {
    setOpen(false);
  });
  $(document).on('keydown', function (event) {
    if (event.key === 'Escape') {
      setOpen(false);
    }
  });

  // Move (not copy) the header's theme toggle into the sheet: dark-theme.js binds it by id.
  var $themeSlot = $('#fbr-mobile-nav-theme-slot');
  var $themeToggle = $('header.global-header .theme-toggle-button').first();
  var $themeToggleHome = $('<span class="fbr-theme-toggle-home" hidden></span>');
  var desktopQuery = window.matchMedia('(min-width: 992px)');

  if ($themeToggle.length && $themeSlot.length) {
    $themeToggleHome.insertBefore($themeToggle);
  }

  function placeThemeToggle() {
    if (!$themeToggle.length || !$themeSlot.length) {
      return;
    }
    if (desktopQuery.matches) {
      $themeToggleHome.after($themeToggle);
    } else {
      $themeSlot.append($themeToggle);
    }
  }

  function onBreakpointChange() {
    placeThemeToggle();
    if (desktopQuery.matches) {
      setOpen(false);
    }
  }

  placeThemeToggle();
  // Safari < 14 only supports addListener.
  if (desktopQuery.addEventListener) {
    desktopQuery.addEventListener('change', onBreakpointChange);
  } else {
    desktopQuery.addListener(onBreakpointChange);
  }
}(jQuery));
