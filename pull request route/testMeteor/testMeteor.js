if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to testMeteor.";
  };

  Template.hello.events({
    'click #test' : function () {
      console.log("clicked ");
      Meteor.call("addExtraService", "facebook", function (error, result) {
        console.log(result);
        Meteor.loginWithTwitter();
      });
    }
  });
}



if (Meteor.isServer) {
  Meteor.methods({
    addExtraService: function (service) {
      return service + " is catched";
    }
  })
}
