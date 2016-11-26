describe('DiaryController', function() {
	var scope, diaryServiceMock, urlPath, locationMock;

	beforeEach(module('starter.controllers'));

	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();

		params = { eDate: 123 }
		stateMock = { params: params };

		diaryServiceMock = {
			getDiarySummary: function() {
				return 'test';
			}
		};

		urlPath = "";
		locationMock = {
			url: function (path) {
				urlPath = path;
			}
		}

		spyOn(diaryServiceMock, 'getDiarySummary').and.callThrough();
		spyOn(locationMock, 'url').and.callThrough();

		$controller('DiaryController', {$location: locationMock, $scope: scope, DiaryService: diaryServiceMock});
	}));

	describe('Controller Initialization', function() {
		it('should define diarySummary on the scope', function() {
			expect(diaryServiceMock.getDiarySummary).toHaveBeenCalled();
			expect(scope.diarySummary).toBeDefined();
		});

		it('should define scope functions', function() {
			expect(scope.tapAction).toBeDefined();
			expect(scope.tapEmotion).toBeDefined();
			expect(scope.tapCoping).toBeDefined();
			expect(scope.toggleEntry).toBeDefined();
			expect(scope.isEntryShown).toBeDefined();
		});
	});

	describe('tapAction', function() {
		it('sets the url path to the tapped action', function() {
			scope.tapAction(123);
			expect(locationMock.url).toHaveBeenCalled();
			expect(urlPath).toEqual('/tab/diary/actions/123')			
		});
	});

	describe('tapEmotion', function() {
		it('sets the url path to the emotions for the date', function() {
			scope.tapEmotion(123);
			expect(locationMock.url).toHaveBeenCalled();
			expect(urlPath).toEqual('/tab/diary/emotions/123')			
		});
	});

	describe('tapCoping', function() {
		it('sets the url path to the soping skills used for the date', function() {
			scope.tapCoping(123);
			expect(locationMock.url).toHaveBeenCalled();
			expect(urlPath).toEqual('/tab/diary/coping/123')			
		});
	});

	describe('toggleEntry', function() {

		it('toggles the shownSummaryEntry value to null', function() {
			scope.shownSummaryEntry = 3;
			scope.toggleEntry(3);
			expect(scope.shownSummaryEntry).toEqual(null);			
		});

		it('toggles the shownSummaryEntry value to defined', function() {
			scope.shownSummaryEntry = null;
			scope.toggleEntry(3);
			expect(scope.shownSummaryEntry).toEqual(3);			
		});
	});

	describe('isEntryShown', function() {
		it('returns true when requested entry matches currently shown entry', function() {
			scope.shownSummaryEntry = 1;
			var result = scope.isEntryShown(1);
			expect(result).toEqual(true);	
		});

		it('returns false when requested entry does not match currently shown entry', function() {
			scope.shownSummaryEntry = 1;
			var result = scope.isEntryShown(3);
			expect(result).toEqual(false);	
		});
	});

});