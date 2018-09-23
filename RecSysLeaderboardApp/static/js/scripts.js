//most of the code is taken from http://sarasoueidan.com/blog/creative-list-effects/
(function(){

  var lastdeletedID, lastdeletedTEXT, lastdeletedINDEX, lastdeletedMOVIEID, lastdeletedRATING, count = 0;
  var dl = $('#searchresults')

  function updateCounter(){
    $('.count').text(count);
    var deleteButton = $('.clear-all');
    if(count === 0){
      deleteButton.attr('disabled', 'disabled').addClass('disabled');
    }
    else{
      deleteButton.removeAttr('disabled').removeClass('disabled');
    }
  }
  //generates a unique id
  function generateId(){
     return "reminder-" + +new Date();
  }
  //saves an item to localStorage
  var saveMovie = function(id, movieName, movieId, movieRating){
    var movieInfo = {movieName: movieName, movieId: movieId, movieRating: movieRating};
    var movieJSON = JSON.stringify(movieInfo);
    localStorage.setItem(id, movieJSON);
  };

   //removes item from localStorage
   var deleteReminder = function(id, content){
     localStorage.removeItem(id);
     count--;
     updateCounter();
   };

   var UndoOption = function(){
      var undobutton = $('.undo-button');
      setTimeout(function(){
        undobutton.fadeIn(300).on('click', function(){
          createReminder(lastdeletedID, lastdeletedTEXT, lastdeletedMOVIEID, lastdeletedRATING, lastdeletedINDEX);
          $(this).fadeOut(300);
        });
        setTimeout(function(){
          undobutton.fadeOut(1000);
        }, 3000);
      },1000)

   };

   var removeReminder = function(id){
      var item = $('#' + id );
      lastdeletedID = id;
      lastdeletedTEXT = item.text();
      lastdeletedINDEX = item.index();
      lastdeletedMOVIEID = item.val();
      lastdeletedRATING = $('input[name=' + lastdeletedMOVIEID + ']:checked').val()

      item.addClass('removed-item')
          .one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
              $(this).remove();
           });

      deleteReminder(id);
     //add undo option only if the edited item is not empty
      if(lastdeletedTEXT){
        UndoOption();
      }
    };

    var postUpdates = function() {
      xhr = new XMLHttpRequest();
      var url = "recommendations";
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/json");

      if(localStorage.length!==0){
        var data = '';
        for(var key in localStorage){
          var movieJSON = localStorage.getItem(key);
          var movieInfo = JSON.parse(movieJSON);
          if(key.indexOf('reminder') === 0){
            data = data + movieInfo.movieId + ', ' + movieInfo.movieRating + '\r\n';
          }
        }
        if(data.length > 0){
          xhr.send(data);
        }
      }
    };

    //global function - used in recommendations
    appendStars = function(movieItem, movieId) {
      var id = generateId();
      movieItem.attr("id", id);
      movieItem.attr("value", movieId);
      var ratingField = document.createElement('fieldset');
      ratingField.className = "rating";
      ratingField.action = "";
      ratingField.method ="post";
      ratingField.contenteditable = "true";
      // ratingField.position = "absolute"

      var handleClick = function(myRadio) {
        var movieItem = myRadio.parentElement.parentElement
        var id = movieItem.id
        var content = $(movieItem).text()
        var movieId = myRadio.name
        var mvRating = myRadio.value

        saveMovie(id, content, movieId, mvRating);

        $('[value=' + movieId + ']').each(function(i, obj){
          $(obj).addClass('removed-item')
          .one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
              $(this).remove();
           });
        });

        postUpdates();
        setTimeout(function () { window.location.reload(); }, 10);
      };

      for(var i = 10;i > 0;i--){
          var uniqueId =  "star" + "-" + movieId + "-" + i.toString()
          var newInput = document.createElement('input');

          newInput.type = "radio";
          newInput.id = uniqueId;
          newInput.name = movieId;
          newInput.value = i;
          newInput.onchange = function() { handleClick(this); };

          var newLabel = document.createElement('label');
          if(i & 1)
          {
              newLabel.className = "half";
          }
          else
          {
              newLabel.className = "full";
          }
          newLabel.htmlFor = uniqueId;

          ratingField.appendChild(newInput);
          ratingField.appendChild(newLabel);
      }
      movieItem.append(ratingField);
    };


    var createReminder = function(id, content, movieId, movieRating, index){
      var reminder = '<li id="' + id + '" value="' + movieId + '">' + content + '</li>',
          list = $('.reminders li');


      if(!$('#'+ id).length){

        if(index && index < list.length){
          var i = index +1;
          reminder = $(reminder).addClass('restored-item');
          $('.reminders li:nth-child(' + i + ')').before(reminder);
        }
        if(index === 0){
          reminder = $(reminder).addClass('restored-item');
          $('.reminders').prepend(reminder);
        }
        if(index === list.length){
          reminder = $(reminder).addClass('restored-item');
          $('.reminders').append(reminder);
        }
        if(index === undefined){
          reminder = $(reminder).addClass('new-item');
          $('.reminders').append(reminder);
        }

        var createdItem = $('#'+ id);

        createdItem.append($('<button />', {
                               "class" :"icon-trash delete-button",
                               "contenteditable" : "false",
                               "type": "button", //prevents from submitting the form
                               click: function(){
                                        var confirmation = true;
                                        //confirm('Delete this item?');
                                        if(confirmation) {
                                           removeReminder(id);
                                         }
                                      }
                  }));

        var ratingField = document.createElement('fieldset');
        ratingField.className = "rating";
        ratingField.action = ""
        ratingField.method ="post"
        // ratingField.id = id;
        ratingField.contenteditable = "true";

        var handleClick = function(myRadio) {
          var mvRating = myRadio.value
          saveMovie(id, content, movieId, mvRating)
        };

        for(var i = 10;i > 0;i--){
            var uniqueId = "star" + "-" + count.toString() + "-" + i.toString()
            var newInput = document.createElement('input');

            newInput.type = "radio";
            newInput.id = uniqueId;
            newInput.name = movieId;
            newInput.value = i;
            newInput.onchange = function() { handleClick(this); };

            if(movieRating && i == movieRating)
            {
              newInput.checked="checked";
            }
            else if(i === 10)
            {
              newInput.checked="checked";
            }

            var newLabel = document.createElement('label');
            if(i & 1)
            {
                newLabel.className = "half";
            }
            else
            {
                newLabel.className = "full";
            }
            newLabel.htmlFor = uniqueId;

            ratingField.appendChild(newInput);
            ratingField.appendChild(newLabel);
        }

        createdItem.append(ratingField);

        // createdItem.append($('<button />', {
        //                       "class" :"icon-pencil edit-button",
        //                       "contenteditable" : "false",
        //                       click: function(){
        //                               createdItem.attr('contenteditable', 'false');
        //                               editReminder(id);
        //                               $(this).hide();
        //                       }
        //          }));
        createdItem.on('keydown', function(ev){
            if(ev.keyCode === 13) return false;
        });

        var mvRating = movieRating || "10"
        saveMovie(id, content, movieId, mvRating);
        count++;
        updateCounter();
      }
    };
//handler for input
    var handleInput = function(){
          $('#input-form').on('submit', function(event){
             var input = $('#text'),
              value = input.val();
              event.preventDefault();
              if (value){
                  var text = value;
                  var id = generateId();
                  var movie = $(dl).find('option[value="' + text + '"]')
                  var movieId = movie[0].dataset.movieId
                  createReminder(id, text, movieId);
                  input.val('');
              }
          });
     };

     var loadMovies = function(){
       if(localStorage.length!==0){
         for(var key in localStorage){
           var movieJSON = localStorage.getItem(key);
           var movieInfo = JSON.parse(movieJSON);
           if(key.indexOf('reminder') === 0){
             createReminder(key, movieInfo.movieName, movieInfo.movieId, movieInfo.movieRating);
           }
         }
       }
     };

  //handler for the "delete all" button
     var handleDeleteButton = function(){
          $('.clear-all').on('click', function(){
            if(confirm('Are you sure you want to delete all the items in the list? There is no turning back after that.')){                 //remove items from DOM
              var items = $('li[id ^= reminder]');
              items.addClass('removed-item').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
                $(this).remove();
             });

              //look for items in localStorage that start with reminder- and remove them
              var keys = [];
              for(var key in localStorage){
                 if(key.indexOf('reminder') === 0){

                   localStorage.removeItem(key);
                 }
              }
              count = 0;
              updateCounter();
            }
          });
      };

    var init = function(){
           $('#text').focus();
           loadMovies();
           handleDeleteButton();
           handleInput();
           updateCounter();
    };
  //start all
  init();

})();
