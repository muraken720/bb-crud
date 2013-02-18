(function(){
	
	console.log("Model Test");
	
	// ---
	var Memo = Backbone.Model.extend({
   urlRoot: "/memo",
		idAttribute: "_id",
	  defaults: {
		  "content": ""
		}
		,validate: function(attributes) {
			if(attributes.content == "") {
				return "content must be not empty."
			}
		}
	});

	var memo = new Memo();

/**	
  var observer = {
		showArguments: function(){
			console.log("observer.showArguments: " + JSON.stringify(arguments));
		}
	};
  _.extend(observer, Backbone.Events);

  observer.listenTo(memo, "all", observer.showArguments);
*/

/**
	console.log("Before save: " + JSON.stringify(memo));
	console.log("isNew(): " + memo.isNew());

	memo.save({content: "Acroquest"}, {
		success: function(model, response) {
			console.log("After save(post) model: " + JSON.stringify(model));
			console.log("After save(post) memo: " + JSON.stringify(memo));
			console.log("After save(post) isNew(): " + model.isNew());	
			console.log("After save(post) memo.isNew(): " + memo.isNew());	
		}
	});

	console.log("After save: " + JSON.stringify(memo));
	console.log("isNew(): " + memo.isNew());
*/

	memo.fetch({
		success: function(model, response) {
			console.log("After fetch(get) memo: " + JSON.stringify(memo));
			console.log("After fetch(get) response: " + JSON.stringify(response));
			
			memo.save({content: "Acroquest Technology"}, {
				success: function(model, response) {
					console.log("After save(put) memo: " + JSON.stringify(memo));
				}
			});
		}
	});

/**
  var memoList = new MemoList();


	var memo2 = memoList.create({content: "Acro2"}, {wait: true, 
		success: function(model, response) {
			console.log("After save(post) model: " + JSON.stringify(model));
			console.log("After save(post) response: " + JSON.stringify(response));
			console.log("After save(post) isNew(): " + model.isNew());	
		}
	});
	
	memoList.fetch({
		success: function(collection) {
			console.log("After fetch collection: " + JSON.stringify(collection));

			var tmpMemo = collection.at(0);
			console.log(JSON.stringify(tmpMemo));
			tmpMemo.save({content: "Acroquest"},{
				success: function(model, response) {
					console.log("After save(put) model: " + JSON.stringify(model));
					console.log("After save(put) response: " + JSON.stringify(response));
				}
			});
			tmpMemo.fetch({
				success: function(model, response) {
					console.log("Model fetch(get) model: " + JSON.stringify(model));
					console.log("Model fetch(get) response: " + JSON.stringify(response));
				}
			});
			tmpMemo.destroy({
				success: function(model, response) {
					console.log("Model destory(delete) model: " + JSON.stringify(model));
					console.log("Model destory(delete) response: " + JSON.stringify(response));
					memoList.fetch({
						success: function(collection) {
							console.log("After destroy fetch collection: " + JSON.stringify(collection));
						}
					});
				}
			});
		}
	});
*/	
	// memoList.fetch({
	// 	success: function(collection) {
	// 		console.log("After fetch collection: " + JSON.stringify(collection));
	// 
	// 		var tmpMemo = collection.at(0);
	// 		console.log(JSON.stringify(tmpMemo));
	// 		tmpMemo.save({content: "Acroquest"},{
	// 			success: function(model, response) {
	// 				console.log("After save(put) model: " + JSON.stringify(model));
	// 				console.log("After save(put) response: " + JSON.stringify(response));
	// 			}
	// 		});
	// 		tmpMemo.fetch({
	// 			success: function(model, response) {
	// 				console.log("Model fetch(get) model: " + JSON.stringify(model));
	// 				console.log("Model fetch(get) response: " + JSON.stringify(response));
	// 			}
	// 		});
	// 		tmpMemo.destroy({
	// 			success: function(model, response) {
	// 				console.log("Model destory(delete) model: " + JSON.stringify(model));
	// 				console.log("Model destory(delete) response: " + JSON.stringify(response));
	// 				memoList.fetch({
	// 					success: function(collection) {
	// 						console.log("After destroy fetch collection: " + JSON.stringify(collection));
	// 					}
	// 				});
	// 			}
	// 		});
	// 	}
	// });	

}());