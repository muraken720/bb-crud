(function () {
  "use strict";

  console.log("Model & Collection Test");

  // ---
  var Memo = Backbone.Model.extend({
    idAttribute:"_id",
    defaults:{
      "content":""
    }, validate:function (attributes) {
      if (attributes.content === "") {
        return "content must be not empty.";
      }
    }
  });

  var MemoList = Backbone.Collection.extend({
    model:Memo,
    url:"/memo"
  });

  var memoList = new MemoList();

  console.log("Initial memoList.length: " + memoList.length);

  /**
   var memo = memoList.create({content: "Acro1"}, {
    success: function() {
      console.log("After create memoList: " + JSON.stringify(memoList));
      console.log("After create memoList.length: " + memoList.length);
    }
  });
   */

  var memo = new Memo({content:"Acro2"}, {collection:memoList});

  memo.save(null, {
    success:function () {
      console.log("After save memoList: " + JSON.stringify(memoList));
      console.log("After save memoList.length: " + memoList.length);
    }
  }).pipe(function () {
      return memoList.fetch({
        success:function () {
          console.log("After fetch memoList: " + JSON.stringify(memoList));
          console.log("After fetch memoList.length: " + memoList.length);
        }
      });
    }).pipe(function () {
      var tempMemo = memoList.find(function (item) {
        return item.get("content") === "Acro2";
      });

      return tempMemo.save({content:"Acro3"}, {
        success:function () {
          console.log("After save memoList: " + JSON.stringify(memoList));
          console.log("After save memoList.length: " + memoList.length);
        }
      });
    }).done(function () {
      var tempMemo = memoList.find(function (item) {
        return item.get("content") === "Acro3";
      });

      return tempMemo.destroy({
        success:function () {
          console.log("After destroy memoList: " + JSON.stringify(memoList));
          console.log("After destroy memoList.length: " + memoList.length);
        }
      });
    });

  memoList.add(memo);

  console.log("After add memo: " + JSON.stringify(memo));
  console.log("After add memoList.length: " + memoList.length);

}());
