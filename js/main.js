$(function() {
  /*smooth scroll*/
  $('a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });

  /*get user country*/
  $.getJSON('http://freegeoip.net/json/', function(result) {
    if(result.country_code == 'AU') {
      $('.charities.trekstock').remove()
    } else {
      $('.charities.heart-foundation').remove()
    }
  })
  .fail(function() {
    $('.charities.heart-foundation').remove()
  });

  // get VMG fundraising amount -- can't make call via JS :(
/*  var trekstockUrl = "https://api.virginmoneygiving.com/fundraisers/v1/account/e59f279d-0ffa-47fc-a25d-706c45668bfc/pages/2?api_key=8m7dr543bmkp66rnaa9trg7y";
  $.get(trekstockUrl, function( data ) {
    var trekstockTotal = data.pageDetails[0].donationTotalNet.toFixed(2)
    var trekstockSupporters = data.pageDetails[0].numberOfDonations

    $('.trekstock-raised').text('£' + trekstockTotal);
    $('.trekstock-supporters').text(trekstockSupporters);
  }, "json");*/

  // get everydayhero fundraising amount
  var hfUrl = "https://everydayhero.com/api/v2/pages/1513079";
  $.get(hfUrl, function( data ) {
    var hfTotal = data.page.amount.cents / 100;
    var hfSupporters = data.page.meta.totals.total_donations;
    $('.heart-foundation-raised').text('$' + hfTotal.toFixed(2));
    $('.heart-foundation-supporters').text(hfSupporters);
  }, "json");
});


