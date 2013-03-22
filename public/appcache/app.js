(function () {
  "use strict";

  var app = {};

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

  var EditView = Backbone.View.extend({
    events: {
      "click #saveBtn": "onSave",
      "click #cancelBtn": "hideView"
    },
    initialize: function () {
      _.bindAll(this);

      this.$title = $("#editForm [name='title']");
      this.$content = $("#editForm [name='content']");
    },
    render: function () {
      this.$title.val(this.model.get("title"));
      this.$content.val(this.model.get("content"));
      this.$el.show();
    },
    onSave: function () {
      var _this = this;
      this.model.save({title: this.$title.val(), content: this.$content.val()}).done(function () {
        _this.collection.add(_this.model, {merge: true});
      });
      this.hideView();
    },
    hideView: function () {
      this.$el.hide();
      app.router.navigate("", {trigger: true});
    }
  });

  var ItemView = Backbone.View.extend({
    tmpl: _.template($("#tmpl-itemview").html()),
    events: {
      "click .edit": "onEdit",
      "click .delete": "onDelete"
    },
    initialize: function () {
      _.bindAll(this);
      this.listenTo(this.model, "change", this.render);
      this.listenTo(this.model, "destroy", this.onDestroy);
    },
    onEdit: function () {
      app.router.navigate(this.model.get("_id") + "/edit", {trigger: true});
    },
    onDelete: function () {
      this.model.destroy();
    },
    onDestroy: function () {
      this.remove();
    },
    render: function () {
      this.$el.html(this.tmpl(this.model.toJSON()));
      return this;
    }
  });

  var ListView = Backbone.View.extend({
    initialize: function () {
      this.listenTo(this.collection, "add", this.addItemView);
      var _this = this;
      this.collection.fetch().done(function () {
        _this.render();
      });
    },
    render: function () {
      this.collection.each(function (item) {
        this.addItemView(item);
      }, this);
      return this;
    },
    addItemView: function (item) {
      this.$el.append(new ItemView({model: item}).render().el);
    }
  });

  var HeaderView = Backbone.View.extend({
    events: {
      "click .create": "onCreate"
    },
    initialize: function () {
      _.bindAll(this);
    },
    onCreate: function () {
      app.router.navigate("create", {trigger: true});
    }
  });

  var MessageView = Backbone.View.extend({
     events: {
       "click .reload": "onReload"
     },
    initialize: function() {
      _.bindAll(this);
      window.applicationCache.addEventListener("updateready", this.render, false);
    },
    render: function() {
      this.$el.append("<div class='alert alert-info'>" +
          "<a href='#' class='close' data-dismiss='alert'>&times;</a>" +
          "アプリケーションが更新されています。アップデートしますか？ " +
          "<a class='reload'>Update Now!</a></div>");
    },
    onReload: function(){
      location.reload();
    }
  });

  var AppRouter = Backbone.Router.extend({
    routes: {
      "": "home",
      "create": "add",
      ":id/edit": "edit"
    },
    initialize: function () {
      _.bindAll(this);

      this.collection = new MemoList();

      this.headerView = new HeaderView({el: $(".navbar")});

      this.messageView = new MessageView({el: $("#message")});

      this.editView = new EditView({el: $("#editForm"), collection: this.collection});

      this.listView = new ListView({el: $("#memoList"), collection: this.collection});
    },
    home: function () {
      this.editView.hideView();
    },
    add: function () {
      this.editView.model = new Memo(null, {collection: this.collection});
      this.editView.render();
    },
    edit: function (id) {
      this.editView.model = this.collection.get(id);
      if (this.editView.model) {
        this.editView.render();
      }
    }
  });

  app.router = new AppRouter();

  Backbone.history.start();
//  Backbone.history.start({pushState: true, root:"/app/"});
}());
