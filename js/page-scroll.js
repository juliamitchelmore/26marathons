jQuery(document).ready(function($) {
  //variables
  var hijacking = $('body').data('hijacking'),
    animationType = $('body').data('animation'),
    delta = 0,
    scrollThreshold = 5,
    actual = 1,
    animating = false;

  //DOM elements
  var sectionsAvailable = $('.cd-section'),
    verticalNav = $('.cd-vertical-nav')

  /*  prevArrow = verticalNav.find('a.cd-prev'),
    nextArrow = verticalNav.find('a.cd-next');*/

  //check the media query and bind corresponding events
  var MQ = deviceType(),
    bindToggle = false;

  bindEvents(MQ, true);

  $(window).on('resize', function() {
    MQ = deviceType();
    bindEvents(MQ, bindToggle);
    if (MQ == 'mobile') bindToggle = true;
    if (MQ == 'desktop') bindToggle = false;
  });

  function bindEvents(MQ, bool) {

    if (MQ == 'desktop' && bool) {
      //bind the animation to the window scroll event, arrows click and keyboard
      initHijacking();
      $(window).on('DOMMouseScroll mousewheel', scrollHijacking);

      /*    prevArrow.on('click', prevSection);
          nextArrow.on('click', nextSection);*/

      //let navigation occur via arrow keys
      /*$(document).on('keydown', function(event) {
        if (event.which == '40' && !nextArrow.hasClass('inactive')) {
          event.preventDefault();
          nextSection();
        } else if (event.which == '38' && (!prevArrow.hasClass('inactive') || (prevArrow.hasClass('inactive') && $(window).scrollTop() != sectionsAvailable.eq(0).offset().top))) {
          event.preventDefault();
          prevSection();
        }
      });*/
      //set navigation arrows visibility
      //checkNavigation();
    } else if (MQ == 'mobile') {
      //reset and unbind
      resetSectionStyle();
      $(window).off('DOMMouseScroll mousewheel', scrollHijacking);
      /*prevArrow.off('click', prevSection);
        nextArrow.off('click', nextSection);*/
      $(document).off('keydown');
    }
  }

  function transformSection(element, translateY, scaleValue, rotateXValue, opacityValue) {
    //transform sections - normal scroll
    element.velocity({
      translateY: translateY + 'vh',
      scale: scaleValue,
      rotateX: rotateXValue,
      opacity: opacityValue,
      translateZ: 0
    }, 0);
  }

  function initHijacking() {
    // initialize section style - scrollhijacking
    var visibleSection = sectionsAvailable.filter('.visible'),
      topSection = visibleSection.prevAll('.cd-section'),
      bottomSection = visibleSection.nextAll('.cd-section'),
      animationParams = selectAnimation(animationType, false),
      animationVisible = animationParams[0],
      animationTop = animationParams[1],
      animationBottom = animationParams[2];

    visibleSection.children('div').velocity(animationVisible, 1, function() {
      visibleSection.css('opacity', 1);
      topSection.css('opacity', 1);
      bottomSection.css('opacity', 1);
    });
    topSection.children('div').velocity(animationTop, 0);
    bottomSection.children('div').velocity(animationBottom, 0);
  }

  function scrollHijacking(event) {
    // on mouse scroll - check if animate section
    if (event.originalEvent.detail < 0 || event.originalEvent.wheelDelta > 0) {
      delta--;
      (Math.abs(delta) >= scrollThreshold) && prevSection();
    } else {
      delta++;
      (delta >= scrollThreshold) && nextSection();
    }

    return false;
  }

  function prevSection(event) {
    //go to previous section
    typeof event !== 'undefined' && event.preventDefault();

    var visibleSection = sectionsAvailable.filter('.visible');

    var animationParams = selectAnimation(animationType, 'prev');

    if (!animating && !visibleSection.is(":first-child")) {
      animating = true;
      visibleSection.removeClass('visible').children('div').velocity(animationParams[2], animationParams[3], animationParams[4])
        .end().prev('.cd-section').addClass('visible').children('div').velocity(animationParams[0], animationParams[3], animationParams[4], function() {
          animating = false;
        });

      actual = actual - 1;
      updateBackground();
    }

    resetScroll();
  }

  function nextSection(event) {
    //go to next section
    typeof event !== 'undefined' && event.preventDefault();

    var visibleSection = sectionsAvailable.filter('.visible');

    var animationParams = selectAnimation(animationType, 'next');

    if (!animating && !visibleSection.is(":last-of-type")) {
      animating = true;
      visibleSection.removeClass('visible').children('div').velocity(animationParams[1], animationParams[3], animationParams[4])
        .end().next('.cd-section').addClass('visible').children('div').velocity(animationParams[0], animationParams[3], animationParams[4], function() {
          animating = false;
        });

      actual = actual + 1;
      updateBackground();
    }
    resetScroll();
  }

  function updateBackground() {
    var bgColor;

    switch(actual) {
      case(1):
        bgColor = "#7E828D"
        break;
      case(2):
        if ($('.charities').hasClass('trekstock')) {
          bgColor = "mediumturquoise"
        } else {
          bgColor = "darkred"
        }
        break;
      case(3):
        bgColor = "#b5b5b5"
        break;
      case(4):
        bgColor = "#002b72"
        break;
    }

    $("body").css('background-color', bgColor);
  }

  function resetScroll() {
    delta = 0;
    checkNavigation();
  }

  function checkNavigation() {
    //update navigation arrows visibility
    /*(sectionsAvailable.filter('.visible').is(':first-of-type')) ? prevArrow.addClass('inactive'): prevArrow.removeClass('inactive');
    (sectionsAvailable.filter('.visible').is(':last-of-type')) ? nextArrow.addClass('inactive'): nextArrow.removeClass('inactive');*/
  }

  function resetSectionStyle() {
    //on mobile - remove style applied with jQuery
    sectionsAvailable.children('div').each(function() {
      $(this).attr('style', '');
    });
  }

  function deviceType() {
    //detect if desktop/mobile
    return window.getComputedStyle(document.querySelector('body'), '::before').getPropertyValue('content').replace(/"/g, "").replace(/'/g, "");
  }

  function selectAnimation(animationName, direction) {
    // select section animation - scrollhijacking
    var animationVisible = (direction == 'next') ? 'scaleUp.moveUp' : 'scaleUp.moveDown',
      animationTop = 'scaleDown.moveUp',
      animationBottom = 'scaleDown.moveDown',
      easing = 'ease',
      animDuration = 1500;

    return [animationVisible, animationTop, animationBottom, animDuration, easing];
  }

  function setSectionAnimation(sectionOffset, windowHeight, animationName) {
    // select section animation - normal scroll
    var scale = 1,
      translateY = 100,
      rotateX = '0deg',
      opacity = 1;
 
    if (sectionOffset >= -windowHeight && sectionOffset <= 0) {
      // section entering the viewport
      translateY = (-sectionOffset) * 100 / windowHeight;

      if (sectionOffset >= -windowHeight && sectionOffset < -0.9 * windowHeight) {
        scale = -sectionOffset / windowHeight;
        translateY = (-sectionOffset) * 100 / windowHeight;
      } else if (sectionOffset >= -0.9 * windowHeight && sectionOffset < -0.1 * windowHeight) {
        scale = 0.9;
        translateY = -(9 / 8) * (sectionOffset + 0.1 * windowHeight) * 100 / windowHeight;
      } else {
        scale = 1 + sectionOffset / windowHeight;
        translateY = 0;
      }

    } else if (sectionOffset > 0 && sectionOffset <= windowHeight) {
      //section leaving the viewport - still has the '.visible' class
      translateY = (-sectionOffset) * 100 / windowHeight;

      if (sectionOffset >= 0 && sectionOffset < 0.1 * windowHeight) {
        scale = (windowHeight - sectionOffset) / windowHeight;
        translateY = -(sectionOffset / windowHeight) * 100;
      } else if (sectionOffset >= 0.1 * windowHeight && sectionOffset < 0.9 * windowHeight) {
        scale = 0.9;
        translateY = -(9 / 8) * (sectionOffset - 0.1 * windowHeight / 9) * 100 / windowHeight;
      } else {
        scale = sectionOffset / windowHeight;
        translateY = -100;
      }
    } else if (sectionOffset < -windowHeight) {
      //section not yet visible
      translateY = 100;
      scale = 1;
    } else {
      //section not visible anymore
      translateY = -100;
      scale = 1;
    }

    return [translateY, scale, rotateX, opacity];
  }
});

/* Custom effects registration - feature available in the Velocity UI pack */
//gallery
$.Velocity
  .RegisterEffect("scaleDown.moveUp", {
    defaultDuration: 1,
    calls: [
      [{ translateY: '-10%', scale: '0.9' }, 0.20],
      [{ translateY: '-100%' }, 0.60],
      [{ translateY: '-100%', scale: '1' }, 0.20]
    ]
  });
$.Velocity
  .RegisterEffect("scaleDown.moveUp.scroll", {
    defaultDuration: 1,
    calls: [
      [{ translateY: '-100%', scale: '0.9' }, 0.60],
      [{ translateY: '-100%', scale: '1' }, 0.40]
    ]
  });
$.Velocity
  .RegisterEffect("scaleUp.moveUp", {
    defaultDuration: 1,
    calls: [
      [{ translateY: '90%', scale: '0.9' }, 0.20],
      [{ translateY: '0%' }, 0.60],
      [{ translateY: '0%', scale: '1' }, 0.20]
    ]
  });
$.Velocity
  .RegisterEffect("scaleUp.moveUp.scroll", {
    defaultDuration: 1,
    calls: [
      [{ translateY: '0%', scale: '0.9' }, 0.60],
      [{ translateY: '0%', scale: '1' }, 0.40]
    ]
  });
$.Velocity
  .RegisterEffect("scaleDown.moveDown", {
    defaultDuration: 1,
    calls: [
      [{ translateY: '10%', scale: '0.9' }, 0.20],
      [{ translateY: '100%' }, 0.60],
      [{ translateY: '100%', scale: '1' }, 0.20]
    ]
  });
$.Velocity
  .RegisterEffect("scaleDown.moveDown.scroll", {
    defaultDuration: 1,
    calls: [
      [{ translateY: '100%', scale: '0.9' }, 0.60],
      [{ translateY: '100%', scale: '1' }, 0.40]
    ]
  });
$.Velocity
  .RegisterEffect("scaleUp.moveDown", {
    defaultDuration: 1,
    calls: [
      [{ translateY: '-90%', scale: '0.9' }, 0.20],
      [{ translateY: '0%' }, 0.60],
      [{ translateY: '0%', scale: '1' }, 0.20]
    ]
  });
