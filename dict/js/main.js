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
var _fb_add_explanation = function(term_key, id, type, explanation, question) {
  _fb_terms.child(term_key + '/explanations').push({
    id: id,
    type: type,
    explanation: explanation,
    question: question,
  });
}

// firebase -> ui
var terms = [];
_fb_terms.on('child_added', function(snapshot) {
  terms.push(snapshot.val().name);
  ui_add_term(snapshot.key(), snapshot.val());
  snapshot.ref().child('explanations').on('child_added', function(snapshot) {
    var term_key = snapshot.ref().parent().parent().key();
    var fields = snapshot.val();
    var $explanations = $('.term#' + term_key + ' > .explanations');
    var $entry = $('<div>').addClass('entry').prependTo($explanations);
    var $fields = $('<ul>').addClass('fields').appendTo($entry);
    $('<li>').addClass('field id').html(fields.id).appendTo($fields);
    $('<li>').addClass('field type').html(fields.type).appendTo($fields);
    $('<li>').addClass('field explanation').html(fields.explanation).appendTo($fields);
    if(fields.question && fields.question != '') {
      $('<li>').addClass('field question').html(fields.question).appendTo($fields);
    }
  });
});
var $cloud = $('#cloud');
_fb_terms.on('value', function() {
  $cloud.empty();
  for(var term of terms) {
    $('<li>').html('<a href="#' + term + '">' + term + '</a>').appendTo($cloud);
  }
})

// ui
var $body;
var $term_list;
var $add_explanation_form;

var ui_add_term = function(key, val) {
  var name = val.name;
  var $term = $('<section>').addClass('term').attr('id', key).prependTo($term_list);
  $('<h1>').html('<a name="' + name + '">' + name + '</a>').appendTo($term);
  $('<a>').addClass('explain').attr('href', '#').html('<span class="activate">explain this term...</span><span class="activated">explaining...</span>')
    .click(function() {
      var $a = $(this);
      target_term_key = $a.parents('.term').attr('id');
      $a.toggleClass('active');
      if($a.hasClass('active')) {
        $('.explain').not($a).removeClass('active');
        $add_explanation_form.find('.prompt > .term').html(get_target_term());
        $add_explanation_form.removeClass('hide');
      }
      else {
        ui_dismiss_form();
      }
      return false;
    }).appendTo($term);
  $('<div>').addClass('explanations').appendTo($term);
}

var ui_reset_all_input = function($form) {
  $form.find('input[type="text"], textarea').val('');
}
var ui_dismiss_form = function() {
  $('.term > .explain').removeClass('active');
  $add_explanation_form.addClass('hide');
  ui_reset_all_input($add_explanation_form);
}

// ui callback binding
var target_term_key;
var get_target_term = function() {
  return $('.term#' + target_term_key + ' > h1').text();
}
$(function() {
  // selecting
  $body = $('body');
  $term_list = $('#term_list');
  $add_explanation_form = $('#add_explanation');

  // binding
  $('form#add_term').submit(function() {
    var $form = $(this);
    var term = $form.find('[name="term"]').val().trim();
    if(term && term != '') {
      console.log('add', term);
      _fb_add_term(term);
      ui_reset_all_input($form);
    }
    return false;
  });
  $('form#add_explanation').submit(function() {
    var $form = $(this);
    var id = $form.find('[name="id"]').val().trim();
    var type = $form.find('[name="type"]').val().trim();
    var explanation = $form.find('[name="explanation"]').val().trim();
    var question = $form.find('[name="question"]').val().trim();

    if(target_term_key && id && type && explanation && target_term_key != '' && id != '' && type != '' && explanation != '') {
      console.log('add explanation');
      _fb_add_explanation(target_term_key, id, type, explanation, question);
      ui_dismiss_form();
    }
    return false;
  });
  $('form#add_explanation').find('[name="cancel"]').click(function() {
    ui_dismiss_form();
  })
});
