describe('ActionListController', function() {
	var scope, diaryServiceMock, locationMock, stateMock, ionicPopupMock, params, popupResponse, urlInput, urlContainsDiary;

	beforeEach(function() {
		module('starter.controllers');
		module(function($provide) {
			$provide.value('$ionicPopup', {
				confirm: function(popupData) {
					return {
						then: function(callback) { return callback(popupResponse);}
					};
				}
			});
		});
	});

	beforeEach(inject(function($rootScope, _$ionicPopup_, $controller) {
		scope = $rootScope.$new();
		ionicPopupMock = _$ionicPopup_;

		params = { aDate: null }
		stateMock = { params: params };

		diaryServiceMock = {
			getActionsByDate: function(date) {
				return {
					name: 'test'
				};
			},
			removeAction: function(date, action) {
				return true;
			}
		};

		urlInput = "";
		locationMock = {
			url: function (path) {
				urlInput = path;
				return {
					includes: function(subString) {
						return urlContainsDiary;
					}
				};
			}
		}

		spyOn(diaryServiceMock, 'getActionsByDate').and.callThrough();

		$controller('ActionListController', {$location: locationMock, $scope: scope, $state: stateMock, $ionicPopup: ionicPopupMock, DiaryService: diaryServiceMock});
	}));

	describe('Controller Initialization', function() {

		it('should define properties and methods', function() {
			expect(diaryServiceMock.getActionsByDate).toHaveBeenCalled();
			expect(scope.actionList).toBeDefined();
			expect(scope.tapAction).toBeDefined();
			expect(scope.removeAction).toBeDefined();
			expect(scope.newAction).toBeDefined();
		});			
	})

	describe('Tap Action', function() {
		
		beforeEach(function() {			
			spyOn(locationMock, 'url').and.callThrough();
		});

		it('should go to the diary action when url contains diary', function() {
			urlContainsDiary = true;
			scope.tapAction();
			expect(locationMock.url).toHaveBeenCalled();
			expect(urlInput.indexOf('diary')).toBeGreaterThan(-1);
		});

		it('should go to todays action when url contains today', function() {
			urlContainsDiary = false;
			scope.tapAction();
			expect(locationMock.url).toHaveBeenCalled();
			expect(urlInput.indexOf('today')).toBeGreaterThan(-1);
		});
	});

	describe('Remove Action', function() {
		beforeEach(function() {
			spyOn(ionicPopupMock, 'confirm').and.callThrough();
			spyOn(diaryServiceMock, 'removeAction');
		});

		it('should remove the action entry when user confirms', function() {
			popupResponse = true;
			scope.removeAction();
			expect(ionicPopupMock.confirm).toHaveBeenCalled();
			expect(diaryServiceMock.removeAction).toHaveBeenCalled();
		});

		it('should not remove the action entry when user declines', function() {
			popupResponse = false;
			scope.removeAction();
			expect(ionicPopupMock.confirm).toHaveBeenCalled();
			expect(diaryServiceMock.removeAction).not.toHaveBeenCalled();
		});
	});

	describe('New Action', function() {
		
		beforeEach(function() {			
			spyOn(locationMock, 'url').and.callThrough();
		});

		it('should create new diary action when url contains diary', function() {
			urlContainsDiary = true;
			scope.newAction();
			expect(locationMock.url).toHaveBeenCalled();
			expect(urlInput.indexOf('diary')).toBeGreaterThan(-1);
		});

		it('should create new todays action when url contains today', function() {
			urlContainsDiary = false;
			scope.newAction();
			expect(locationMock.url).toHaveBeenCalled();
			expect(urlInput.indexOf('today')).toBeGreaterThan(-1);
		});
	});	
});
