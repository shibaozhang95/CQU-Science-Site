'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AlertWindow = function () {
  function AlertWindow() {
    _classCallCheck(this, AlertWindow);

    // the wrapper of the alert window
    this.wrapper = new $('<div id="extra-module"></div>');

    // the window in the center
    this.windows = new $('<div class="window"></div>');

    // the message for user
    this.content = new $('<div class="content">您获得了 <span class="score"></span> 分！</div>');

    // input name
    this.inputs = new $('<div class="inputs">留下您的姓名： </div>');
    this.clientName = new $('<input type="text" class="name">');
    this.errMessage = new $('<p class="error-message></p>');
    this.inputs.append(this.clientName).append(this.errMessage);

    // button group
    this.buttons = new $('<div class="buttons"></div');
    this.btnCancel = new $('<button class="cancel btn btn-default">取消</button>');
    this.btnSend = new $('<button class="send btn btn-info">确定</button>');
    this.buttons.append(this.btnCancel).append(this.btnSend);
    // bind click event
    var that = this;
    this.btnCancel.click(function () {
      that.wrapper.css('display', 'none');
    });
    this.btnSend.click(function () {
      var count = 5;
      var score = that.content.find('.score').text();
      var name = that.clientName.val();

      // hidden
      that.wrapper.css('display', 'none');

      // send request
      request.sendRankingRequest(count, name, score, function (resData) {
        if (resData.errcode == 0) {
          alert('您的成绩上传成功！');
        }
        handleRankingList(resData);
      });
    });

    // package
    this.windows.append(this.content).append(this.inputs).append(this.buttons);
    this.wrapper.append(this.windows);

    return this;
  }

  _createClass(AlertWindow, [{
    key: 'node',
    value: function node() {
      return this.wrapper;
    }
  }]);

  return AlertWindow;
}();

var RankingContainer = function () {
  function RankingContainer() {
    _classCallCheck(this, RankingContainer);

    this.container = new $('<div class="ranking-container"></div>');
    this.title = new $('<h3 class="title">排行榜</h3>');
    this.rankingList = new $('<div class="ranking-list"></div>');
    this.rankerArry = [];

    // package
    this.container.append(this.title).append(this.rankingList);

    return this;
  }

  _createClass(RankingContainer, [{
    key: 'refreshRankerList',
    value: function refreshRankerList(_rankerArry) {
      // completion
      while (this.rankerArry.length < _rankerArry.length) {
        var ranker = new Ranker();
        // console.log(ranker.node().html());
        this.rankerArry.push(ranker);
        // push to ranking list
        this.rankingList.append(ranker.node());
      }
      // reset
      for (var i = 0; i < this.rankerArry.length; ++i) {

        this.rankerArry[i].reset(i + 1, _rankerArry[i].username, _rankerArry[i].score);
      }
    }
  }, {
    key: 'requestRankerList',
    value: function requestRankerList(count) {
      request.sendRankingRequest(count, null, null, function (resData) {
        handleRankingList(resData);
      });
    }
  }, {
    key: 'node',
    value: function node() {
      return this.container;
    }
  }]);

  return RankingContainer;
}();

var Ranker = function () {
  function Ranker() {
    _classCallCheck(this, Ranker);

    var pos = "";
    var name = "";
    var score = "";

    this.rankerNode = new $('<div class="one-ranker"></div>');

    this.pos = new $('<div class="pos col-xs-2"></div>');
    this.posSpan = new $('<span>' + pos + '</span>');
    this.pos.append(this.posSpan);

    this.info = new $('<div class="info col-xs-9"></div>');
    this.nameNode = new $('<span class="name">' + name + '</span>');
    this.scoreNode = new $('<span class="score">' + (score + '.0 分') + '</span>');
    this.info.append(this.nameNode).append(this.scoreNode);

    // for the format
    this.clear = new $('<div class="clear"></div>');
    // package
    this.rankerNode.append(this.pos).append(this.info).append(this.clear);

    return this;
  }

  _createClass(Ranker, [{
    key: 'reset',
    value: function reset(pos, name, score) {
      this.posSpan.html(pos);
      this.nameNode.html(name);
      this.scoreNode.html(score + '.0 分');
    }
  }, {
    key: 'node',
    value: function node() {
      return this.rankerNode;
    }
  }]);

  return Ranker;
}();

function handleRankingList(resData) {
  if (resData.errcode == 1) {
    alert(resData.errmsg);
    return;
  }

  var rankingContainer = createSingleRankingContainer();
  rankingContainer.refreshRankerList(resData.rankers);
}

var createSingleRankingContainer = function () {
  var rankingContainer;
  return function () {
    if (!rankingContainer) {
      rankingContainer = new RankingContainer();
    }
    return rankingContainer;
  };
}();

$(document).ready(function () {

  // for ranking list
  var rankingContainer = createSingleRankingContainer();
  rankingContainer.requestRankerList(5);

  console.log(rankingContainer.node());
  $('.quiz-ranking').append(rankingContainer.node());

  // for test
  var alertWindow = new AlertWindow();
  $('body').append(alertWindow.node());

  // alert the window
  $('.btn-finish').click(function () {
    setTimeout(function () {
      if ($('.results-container').css('display') == 'block') {
        $('#extra-module').css('display', 'block');
        // get the point
        var score = $('.results-container .score').text();
        $('#extra-module .score').html(score);
      }
    }, 600);
  });
});