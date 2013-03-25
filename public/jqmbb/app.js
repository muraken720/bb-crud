$(function () {
  "use strict";

  var app = app || {};

  var Memo = Backbone.Model.extend({
    idAttribute: "_id",
    defaults: {
      "title": "",
      "content": ""
    },
    validate: function (attributes) {
      if (attributes.content === "" || attributes.title === "") {
        return "title and content must be not empty.";
      }
    }
  });

  var MemoList = Backbone.Collection.extend({
    model: Memo,
    url: "/memo"
  });

  var ListView = Backbone.View.extend({
    initialize: function () {
      _.bindAll(this);
      this.$list = $("#memolist");
      this.listenTo(this.collection, "add", this.onAdd);
      this.listenTo(this.collection, "change", this.onChange);
      this.listenTo(this.collection, "remove", this.refresh);
      var _this = this;
      this.collection.fetch().done(function () {
        _this.render();
      });
    },
    render: function () {
      this.collection.each(function (item) {
        this.addItemView(item);
      }, this);
      this.refresh();
      return this;
    },
    addItemView: function (item) {
      this.$list.append(new ItemView({model: item}).render().el);
    },
    onAdd: function (item) {
      this.addItemView(item);
      this.refresh();
    },
    onChange: function () {
      this.$list.empty();
      this.render();
    },
    refresh: function () {
      this.$list.listview("refresh");
    }
  });

  var ItemView = Backbone.View.extend({
    tagName: "li",
    tmpl: _.template($("#tmpl-itemview").html()),
    events: {
      "tap .view": "onView"
    },
    initialize: function () {
      _.bindAll(this);
      this.listenTo(this.model, "destroy", this.onDestroy);
    },
    onView: function () {
      app.router.navigate("view/" + this.model.get("_id"), {trigger: true});
    },
    onDestroy: function () {
      this.remove();
    },
    render: function () {
      this.$el.html(this.tmpl(this.model.toJSON()));
      return this;
    }
  });

  var ShowView = Backbone.View.extend({
    events: {
      "tap #view-editbtn": "onEdit",
      "tap #view-delbtn": "onDelete"
    },
    initialize: function () {
      _.bindAll(this);
      this.$title = $("#view-title");
      this.$content = $("#view-content");
    },
    render: function () {
      this.$title.html(this.model.get("title"));
      this.$content.html(this.model.get("content"));
      return this;
    },
    onEdit: function () {
      app.router.navigate("edit/" + this.model.get("_id"), {trigger: true});
    },
    onDelete: function () {
      this.model.destroy();
      app.router.navigate("", {trigger: true});
    }
  });

  var AddView = Backbone.View.extend({
    events: {
      "tap #save-addbtn": "onSave"
    },
    initialize: function () {
      this.$title = $("#add-title");
      this.$content = $("#add-content");
    },
    render: function () {
      this.$title.val(this.model.get("title"));
      this.$content.val(this.model.get("content"));
      return this;
    },
    onSave: function () {
      var _this = this;
      this.model.save({title: this.$title.val(), content: this.$content.val()}).done(function () {
        _this.collection.add(_this.model, {merge: true});
      });
      app.router.navigate("", {trigger: true});
    }
  });

  var EditView = AddView.extend({
    events: {
      "tap #save-editbtn": "onSave"
    },
    initialize: function () {
      this.$title = $("#edit-title");
      this.$content = $("#edit-content");
    }
  });

  var AboutView = Backbone.View.extend({

  });

  var AppRouter = Backbone.Router.extend({
    routes: {
      "": "home",
      "add": "add",
      "view/:id": "show",
      "edit/:id": "edit",
      "info-dialog": "about"
    },
    initialize: function () {
      _.bindAll(this);

      $("a[data-rel='back']").on('tap', function (event) {
        window.history.back();
        return false;
      });

      this.collection = new MemoList();

      this.listView = new ListView({el: $("#index"), collection: this.collection});

      this.showView = new ShowView({el: $("#view")});

      this.addView = new AddView({el: $("#add"), collection: this.collection});

      this.editView = new EditView({el: $("#edit"), collection: this.collection});

      this.aboutView = new AboutView({el: $("#info-dialog")});

    },
    home: function () {
      this.changePage(this.listView);
    },
    show: function (id) {
      this.showView.model = this.collection.get(id);
      this.changePage(this.showView.render());
    },
    add: function () {
      this.addView.model = new Memo(null, {collection: this.collection});
      this.changePage(this.addView.render());
    },
    edit: function (id) {
      this.editView.model = this.collection.get(id);
      this.changePage(this.editView.render());
    },
    about: function () {
     this.showDialog(this.aboutView);
    },
    changePage: function (view) {
      $.mobile.changePage(view.$el, {changeHash: false});
    },
    showDialog: function (view) {
      $.mobile.changePage(view.$el, {changeHash: false, role: "dialog"});
    }
  });

  app.router = new AppRouter();

  Backbone.history.start();

}());
