(function () {
  "use strict";

  console.log("Events Test");

  var Memo = Backbone.Model.extend({
    idAttribute:"_id",
    defaults:{
      "content":""
    },
    validate:function (attributes) {
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

  var observer = {
    showArguments:function () {
      console.log("+++observer.showArguments: ");
      _.each(arguments, function (item, index) {
        console.log("  +++arguments[" + index + "]: " + JSON.stringify(item));
      });
    }
  };

  _.extend(observer, Backbone.Events);

  observer.listenTo(memoList, "all", observer.showArguments);

  var memo = new Memo({content:"Acroquest"});

  console.log("add");

  memoList.add(memo);

  console.log("change");

  memo.set({content:"Acroquest Technology"});

  console.log("remove");

  memoList.remove(memo);

  console.log("reset");

  memoList.add([new Memo({content:"Acro1"}), new Memo({content:"Acro2"}), new Memo({content:"Acro3"})]);

  console.log("Before reset: " + JSON.stringify(memoList));

  memoList.reset([new Memo({content:"Acro"}), new Memo({content:"Technology"}), new Memo({content:"Acroquest"})]);

  console.log("After reset: " + JSON.stringify(memoList));

  console.log("sort");

  memoList.comparator = function (item) {
    return item.get("content");
  };

  memoList.sort();

  console.log("After sort: " + JSON.stringify(memoList));

  observer.stopListening();

  // ----

  memoList = new MemoList();

  observer.listenTo(memoList, "all", observer.showArguments);

  console.log("request, sync");

  memo = new Memo({content:"Murata"}, {collection:memoList});

  console.log("create");
  memo.save(null, {
    success:function () {
      console.log("After create memoList: " + JSON.stringify(memoList));
      console.log("After create memoList.length: " + memoList.length);
    }
  }).pipe(function () {
      console.log("fetch");
      return memoList.fetch({
        success:function () {
          console.log("After fetch memoList: " + JSON.stringify(memoList));
          console.log("After fetch memoList.length: " + memoList.length);
        }
      });
    }).pipe(function () {
      var tempMemo = memoList.find(function (item) {
        return item.get("content") === "Murata";
      });

      console.log("invalid");
      tempMemo.save({content:""});

      console.log("invalid wait:true");
      tempMemo.save({content:""}, {wait:true});

      console.log("re-save");

      return tempMemo.save({content:"Kenichiro"}, {
        success:function () {
          console.log("After save memoList: " + JSON.stringify(memoList));
          console.log("After save memoList.length: " + memoList.length);
        }
      });
    }).done(function () {
      console.log("destroy");

      var tempMemo = memoList.find(function (item) {
        return item.get("content") === "Kenichiro";
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
