do ->
  app = app || {}

  class Memo extends Backbone.Model
    idAttribute: "_id"

    defaults:
      title: ""
      content: ""

    validate: (attributes) ->
      if(attributes.title is "" or attributes.content is "")
        return "title and content must be not empty."

  class MemoList extends Backbone.Collection
    model: Memo
    url: "/memo"

  class EditView extends Backbone.View
    events:
       "click #saveBtn":"onSave"
       "click #cancelBtn":"hideView"

    initialize: ->
      @$title = $("#editForm [name='title']")
      @$content = $("#editForm [name='content']")

    render: ->
      @$title.val(@model.get("title"))
      @$content.val(@model.get("content"))
      @$el.show()

    onSave: =>
      @model.save(
        title:@$title.val()
        content:@$content.val()
      ).done( => @collection.add(@model, {merge:true}))
      @hideView()

    hideView: ->
      @$el.hide()
      app.router.navigate("", {trigger:true})

  class ItemView extends Backbone.View
    tmpl:_.template($("#tmpl-itemview").html())

    events:
      "click .edit":"onEdit"
      "click .delete":"onDelete"

    initialize: ->
      @listenTo(@model, "change", @render)
      @listenTo(@model, "destroy", @onDestroy)

    render: ->
      @$el.html(@tmpl(@model.toJSON()));
      @

    onEdit: =>
      app.router.navigate(@model.get("_id") + "/edit", {trigger:true})

    onDelete: =>
      @model.destroy()

    onDestroy: =>
      @remove()


  class ListView extends Backbone.View
    initialize: ->
      @listenTo(@collection, "add", @addItemView)
      @collection.fetch().done( => @render() )

    render: ->
      @collection.each( (item) => @addItemView(item) )

    addItemView: (item) ->
      @$el.append(new ItemView({model:item}).render().el)


  class HeaderView extends Backbone.View
    events:
      "click .create":"onCreate"

    onCreate: =>
      app.router.navigate("create", {trigger:true})

  class AppRouter extends Backbone.Router
    routes:
      "": "home"
      "create": "add"
      ":id/edit": "edit"

    initialize: ->
      @collection = new MemoList

      @headerView = new HeaderView
        el:$(".navbar")

      @editView = new EditView
        el:$("#editForm")
        collection:@collection

      @listView = new ListView
        el:$("#memoList")
        collection:@collection

    home: =>
      @editView.hideView()

    add: =>
      @editView.model = new Memo(null, {collection:@collection})
      @editView.render()

    edit: (id) =>
      @editView.model = @collection.get(id)
      @editView.render() if @editView.model


  app.router = new AppRouter

  Backbone.history.start()
  # Backbone.history.start({pushState: true, root:"/appcs/"})

  return
