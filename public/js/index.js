$(document).ready(function (){
  
  // addListener back to top
  //首先将#back-to-top隐藏
  $(".back-to-top").hide();
  //当滚动条的位置处于距顶部100像素以下时，跳转链接出现，否则消失
  $(window).scroll(function () {
    if ($(window).scrollTop() > 500) {
      $(".back-to-top").fadeIn(500);
    }
    else {
      $(".back-to-top").fadeOut(500);
    }
  });
  //当点击跳转链接后，回到页面顶部位置
  $(".back-to-top").click(function () {
    $('body,html').animate({ scrollTop: 0 }, 250);
    return false;
  });

  
  // addListener main nav
  $('.nav-list a').click(function () {
    // change the style first
    $('.nav-list a').css({fontWeight: 'normal'});
    $(this).css({fontWeight: 'bold'});
    
    if ($(this).attr('id') == 'homepage') {
      // switch the main display content
      $('.homepage-content').css({display: 'block'});
      $('.article-content').css({display: 'none'});
    } else {
      // switch the main display content
      $('.homepage-content').css({display: 'none'});
      $('.article-content').css({display: 'block'});
      // send request
      var chpt = $(this).attr('id').split('-')[1];
      sendContentRequest(chpt);
    }
    
  });
  
  // handle sub-nav click
  bindSubNavClick($('.sub-nav ul li'));
});

function sendContentRequest(chpt) {
  var url = '/api/content?section=' + chpt;
  
  $.ajax({
    type: 'GET',
    url: url
  })
  .done(function(resData) {
    var data = JSON.parse(resData);
    handleContentRequest(data);
    
    // scroll the page
    var currPosY = $(document).scrollTop();
    var articlePosY = $('article').offset().top;
    
    if (currPosY > articlePosY) {
      $('body').animate({scrollTop: articlePosY});
    }
  })
}

function handleContentRequest(data) {
  var sA = data.section.split('.');
  var currChpt = [];
  currChpt.push(parseInt(sA[0]));
  currChpt.push(parseInt(sA[1]));
  
  // Change the sub-list first
  if (!isSameChapter(currChpt)) {
    $('.sub-nav ul').html("");
    
    for (var i = 0; i < data.sectList.length; ++i) {
      // add class name
      var list = new $('<li class="s-' + currChpt[0] + '.' + i + '"></li>');
      // add the list
      list.html(data.sectList[i]);
      $('.sub-nav ul').append(list);
    }
    bindSubNavClick($('.sub-nav ul li')); // Bind sub-nav click
  }
  // change sub-nav style
  $('.sub-nav ul li').removeClass('curr-list');
  $($('.sub-nav ul li')[currChpt[1]]).addClass('curr-list');
  
  // Change the content
  $('article .title').html(data.sectList[currChpt[1]]);  // change title
  var content = new $('<p></p>');  // change content
  var imgsSet = new $('<div class="imgs-set"></div>');
  for (var i = 0, lastIsImg = false; i < data.content.length; ++i) {
    // judge whether is img
    if (data.content[i].indexOf('imgs/') >= 0) {
      lastIsImg = true;
      var newImg = new $('<img src="' + data.content[i] + '">');
      imgsSet.append(newImg);
    }
    // not img
    else {
      if (lastIsImg) {
        // push the imgs-set fist
        content.append(imgsSet);
        var imgsSet = new $('<div class="imgs-set"></div>');
        // then push the img explain
        var imgExplain = new $('<p class="img-explain"></p>');
        imgExplain.html(data.content[i]);
        content.append(imgExplain);
        lastIsImg = false;
        
        content.append('<br/>');
      }
      else {
        content.append(data.content[i]);
        lastIsImg = false;
        content.append('<br/><br/>');
      }
      
    }
  }
  $('article .content').html(content);
  
  // add prev and next
  $('.page-tuning').html("");
  
  var prev = $('<a href="javascript:;" id="prev"></a>');
  var next = $('<a href="javascript:;" id="next"></a>');
  
  if (data.prev.sectTitle != "") {
    $(prev).addClass('s-' + data.prev.section);
    $(prev).html('&lt; ' + data.prev.sectTitle);
    bindSubNavClick($(prev));
  }
  if (data.next.sectTitle != "") {
    $(next).addClass('s-' + data.next.section);
    $(next).html(data.next.sectTitle + ' &gt;');
    bindSubNavClick($(next));
  }
  $('.page-tuning').append(prev).append(next);
}

function isSameChapter(chpt) {
  var oneClassName = $($('.sub-nav ul li')[0]).attr('class');
  var curr = oneClassName.split(' ')[0].split('-')[1].split('.');
  if (chpt[0] == parseInt(curr)) {
    return true;
  }
  return false;
}

function isSameSection() {
  
}

//$('.sub-nav ul li')
function bindSubNavClick(elements) {
  elements.click(function () {
    var chpt = $(this).attr('class').split('-')[1];
    
    // send request
    sendContentRequest(chpt);
  });
}