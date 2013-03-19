(function () {
  "use strict";

  console.log("Model Test");

  // ---
  var Memo = Backbone.Model.extend({
    urlRoot: "/memo",
    idAttribute: "_id",
    defaults: {
      "content": ""
    },
    validate: function (attributes) {
      if (attributes.content === "") {
        return "content must be not empty.";
      }
    }
  });

  var memo = new Memo();

  console.log("Before save: " + JSON.stringify(memo));
  console.log("isNew(): " + memo.isNew());

  memo.save({content: "Acroquest"}, {
    success: function () {
      console.log("After save(post) memo: " + JSON.stringify(memo));
      console.log("After save(post) memo.isNew(): " + memo.isNew());
    }
  }).pipe(function () {
      memo.set({content: "Acro"});

      console.log("Befroe fetch memo: " + JSON.stringify(memo));

      return memo.fetch({
        success: function () {
          console.log("After fecth memo: " + JSON.stringify(memo));
        }
      });
    }).pipe(function () {
      console.log("Befroe save(put) memo: " + JSON.stringify(memo));

      return memo.save({content: "Acroquest Technology"}, {
        success: function () {
          console.log("After save(put) memo: " + JSON.stringify(memo));
        }
      });
    }).done(function () {
      console.log("Before delete memo: " + JSON.stringify(memo));

      return memo.destroy({
        success: function () {
          console.log("After delete memo: " + JSON.stringify(memo));
        }
      });
    });

  console.log("After save: " + JSON.stringify(memo));
  console.log("isNew(): " + memo.isNew());

}());
