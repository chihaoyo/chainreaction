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
var $body;
var $term_list;
var ui_add_term = function(term) {
  var $section = $('<section>').appendTo($term_list);
  $('<h1>').html(term).appendTo($section);
  $('<a>').addClass('explain').attr('href', '#').html('<span class="activate">explain this...</span><span class="activated">explaining this...</span>').click(function() {
    var $a = $(this);
    var $f = $('form#add_explanation').detach();
    $a.toggleClass('active');
    if($a.hasClass('active')) {
      $('a.explain').not($a).removeClass('active');
      $f.removeClass('hide').insertBefore($a);
    }
    else {
      $f.addClass('hide').appendTo($body);
    }
    return false;
  }).appendTo($section);
}

// ui callback binding
$(function() {
  // selecting
  $body = $('body');
  $term_list = $('#term_list');

  // binding
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
