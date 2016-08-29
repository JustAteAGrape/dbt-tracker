describe('NavBarController', function() {
	var ionicHistoryMock, scope, diaryServiceMock;

	beforeEach(module('starter.controllers'));

	beforeEach(inject(function($rootScope) {
		scope = $rootScope.$new();
	}));


	beforeEach(inject(function($controller) {
		ionicHistoryMock = jasmine.createSpyObj('$ionicHistory', ['goBack']);
		diaryServiceMock = jasmine.createSpyObj('DiaryService', ['saveUpdates']);

		$controller('NavBarController', {$scope: scope, $ionicHistory: ionicHistoryMock, DiaryService: diaryServiceMock});
	}));

	it('should have onBack defined', function() {
		expect(scope.onBack).toBeDefined(true);
	});

	it('saves on go back', function() {
		scope.onBack();
		expect(ionicHistoryMock.goBack).toHaveBeenCalled();
		expect(diaryServiceMock.saveUpdates).toHaveBeenCalled();
	});
});
