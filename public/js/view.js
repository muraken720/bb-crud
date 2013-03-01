(function () {
  "use strict";

  var Memo = Backbone.Model.extend({
    idAttribute:"_id",
    defaults:{
      "title":"",
      "content":""
    },
    validate:function (attributes) {
      if (attributes.content === "" || attributes.title === "") {
        return "title and content must be not empty.";
      }
    }
  });

  var MemoList = Backbone.Collection.extend({
    model:Memo,
    url:"/memo"
  });

  var ItemView = Backbone.View.extend({
    tmpl:_.template($("#tmpl-itemview").html()),
    events:{
      "click .delete":"onDelete"
    },
    initialize:function () {
      _.bindAll(this);
      this.listenTo(this.model, "change", this.render);
      this.listenTo(this.model, "destroy", this.onDestroy);
    },
    onDelete:function () {
      this.model.destroy();
    },
    onDestroy:function () {
      this.remove();
    },
    render:function () {
      this.$el.html(this.tmpl(this.model.toJSON()));
      return this;
    }
  });

  var ListView = Backbone.View.extend({
    initialize:function () {
      this.listenTo(this.collection, "add", this.addItemView);
      var _this = this;
      this.collection.fetch().done(function () {
        _this.render();
      });
    },
    render:function () {
      this.collection.each(function (item) {
        this.addItemView(item);
      }, this);
      return this;
    },
    addItemView:function (item) {
      this.$el.append(new ItemView({model:item}).render().el);
    }
  });

  var AppView = Backbone.View.extend({
    events:{
      "click #addBtn":"onAdd"
    },
    initialize:function () {
      _.bindAll(this);

      this.$title = $("#addForm [name='title']");
      this.$content = $("#addForm [name='content']");

      this.collection = new MemoList();

      this.listView = new ListView({el:$("#memoList"), collection:this.collection});

      this.render();
    },
    render:function () {
      this.$title.val('');
      this.$content.val('');
    },
    onAdd:function () {
      this.collection.create({title:this.$title.val(), content:this.$content.val()}, {wait:true});
      this.render();
    }
  });

  var appView = new AppView({el:$("#main")});

}());
