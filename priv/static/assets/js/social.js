/* used to have several scripts here, hence the name, but now it's just the everbutton script, not bothering with renaming it because I don't wanna. So there, future self. 😜 */
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
