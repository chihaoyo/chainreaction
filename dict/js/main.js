// firebase references
var _fb = new Firebase("https://chain-reaction-tw.firebaseio.com/");
_fb.update({title: "cr"});
var _fb_terms = _fb.child('terms');

// user input -> firebase
var _fb_add_term = function(term) {
  _fb_terms.push({
    name: term,
  });
}

// firebase -> ui
_fb_terms.on('child_added', function(snapshot) {
  var term = snapshot.val();
  ui_add_term(term.name);
});

// ui
var $term_list;
var ui_add_term = function(term) {
  var $li = $('<li>').appendTo($term_list);
  $('<h1>').html(term).appendTo($li);
}

// ui callback binding
$(function() {
  $term_list = $('#term_list');
  $('form#add_term').submit(function() {
    var $this = $(this);
    var term = $this.find('[name="term"]').val();
    if(term && term != '') {
      console.log('add', term);
      _fb_add_term(term);
    }
    return false;
  });
});
