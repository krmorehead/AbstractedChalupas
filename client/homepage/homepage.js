angular.module("homepage", [])

.controller("HomepageController", function ($scope, $state, searchFactory, userData, $mdSidenav, getVideo, auth){

  $scope.messageBoxes = userData.messageBoxes
  $scope.showSideNav = true;
  $scope.friends;
  $scope.friendRequests;
      
  var initialize = function(){
    $scope.userData = userData.getUserData()
    $scope.currentStatus = userData.getMyCurrentStatus()

    userData.getFriendRequests()
    .then(function(){
      $scope.friendRequests = userData.localFriendRequests()
    })

    userData.getFriends()
    .then(function (){
      $scope.friends = userData.localFriends()
    })
  }

  $scope.displayOptions = function(){
    if($scope.searchQuery.length){
      $scope.searchOptions = [{name:"people", article:"in"}, {name:"email",article:"by"}, {name:"youtube",article:"on"}]
    } else {
      $scope.searchOptions = []
    }
  }

  $scope.select = function(index){
    if($scope.searchOptions[$scope.selected]) {
      $scope.searchOptions[$scope.selected].selected = false;
    }
    $scope.selected = index
    $scope.searchOptions[index].selected = true;
  }

  $scope.changeSelected = function(){
    if($scope.searchOptions){
      if(event.keyCode === 38) {
        var newSelect = $scope.selected - 1 || 0
        if(newSelect < 0){
          newSelect = 0
        }
        $scope.select(newSelect)
      } else if (event.keyCode === 40) {
        var newSelect = $scope.selected + 1 || 0
        if(newSelect >= $scope.searchOptions.length){
          newSelect = $scope.searchOptions.length - 1
        }
        $scope.select(newSelect)
      }
    }
  }

  $scope.fullSearch = function(searchType){
    $scope.searchOptions = []
    $state.go('home.search', {searchQuery: $scope.searchQuery, searchType: searchType})
  }

  $scope.addFriend = function (targetId){
    userData.addFriend(targetId)
  }

  $scope.cancelFriendRequest = function(targetId){
    userData.cancelFriendRequest(targetId)
  }

  $scope.joinRoom = function(friendStatus){
    var roomId = friendStatus.inRoom
    var videoTitle = friendStatus.watching
    var videoId = friendStatus.videoId
    getVideo.submitRoom(videoId, videoTitle, false, roomId)
  }

  $scope.toggleSideNav = function(){
    $mdSidenav('left').toggle()
  }

  $scope.sendMessage = function ($event, messageBox){
    if($event.which === 13){
      userData.peerToPeerMessage(messageBox.userData.id, messageBox.newMessage)
      messageBox.newMessage = ""
      
    }
  }

  $scope.newMessageBox = function(targetData){
    userData.tryNewMessageBox(targetData)
  } 

  $scope.closeMessageBox = function(index){
    userData.closeMessageBox(index)
  }

  $scope.logout = function(){
    auth.logout()
  }

  initialize()

})