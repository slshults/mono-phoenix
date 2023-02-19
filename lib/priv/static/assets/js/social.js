/* begin G+ mobile content rec stuff */
  (function() {
    var po = document.createElement("script"); po.type = "text/javascript"; po.async = true;
    po.src = "https://apis.google.com/js/plusone.js?publisherid=106045313819632308693";
    var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(po, s);
  })();
/* end G+ mobile content rec stuff */

/* begin everbutton script */
var EB = EB || {};
EB.button_stack = EB.button_stack || [];
EB.button_stack.push( {
anchor_id: "everbutton-693-1398040059-85",
button_id: 693,
button_type: "donate",
button_options: {
donor_chooses: false,
allow_cover_fee: false,
enable_recurring: false,
allow_anonymous: true,
reference_id: "",
redirect_uri: ""
}
});
if (!EB.script) {
EB.script = document.createElement('script');
EB.script.type = 'text/javascript';
EB.script.async = true;
EB.script.src = 'https://www.everbutton.com/assets/everbutton.v1.js?button_id=693';
var s = document.getElementsByTagName('script')[0];
s.parentNode.insertBefore(EB.script, s);
} else if (EB.load_buttons) {
EB.load_buttons();
}
/* end everbutton script */

/* begin twitter follow button */
!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
/* end twitter follow button */

/* begin G+ button script */
(function() {
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/platform.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
  })();
/* end G+ button script */

/* begin AddThis button script */

var addthis_share = {
      url_transforms : {
          shorten: {
               twitter: 'bitly',
               facebook: 'bitly'
          }
     },
     shorteners : {
          bitly : {}
     }
}

/* end AddThis button script */


/* Begin FB Like button script */
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=38794938300&version=v2.0";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
/* End FB Like button script */
