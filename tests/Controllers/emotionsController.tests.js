describe('EmotionsController', function() {
	var scope, diaryServiceMock, stateMock, params, emotionListMock;

	beforeEach(module('starter.controllers'));

	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();

		params = { eDate: 123 }
		stateMock = { params: params };

		diaryServiceMock = {
			getEmotionByName: function(date, name, defaultValue) {
				return null;
			},
			getEmotionsByDate: function(date) {
				return [{name: 'name1', src: 'src1', strength: 'strength1'}, {name: 'name2', src: 'src2', strength: 'strength2'}];
			},
			addEmotion: function(date, emotion) {
				return true;
			},
			editEmotion: function(date, emotion) {
				return true;
			}
		};

		emotionListMock = {
			get: function() {
				return {
					then: function(callback) {return callback([{name: 'name1', src: 'src1', strength: 'strength1'}, {name: 'name2', src: 'src2', strength: 'strength2'}]);}
				};
			}
		};

		spyOn(emotionListMock, 'get').and.callThrough();
		spyOn(diaryServiceMock, 'getEmotionByName');
		spyOn(diaryServiceMock, 'getEmotionsByDate').and.callThrough();
		spyOn(diaryServiceMock, 'addEmotion');
		spyOn(diaryServiceMock, 'editEmotion');

		$controller('EmotionsController', {$scope: scope, $state: stateMock, DiaryService: diaryServiceMock, EmotionList: emotionListMock});
	}));

	describe('Controller Initialization', function() {

		it('should load emotions into scope', function() {
			expect(emotionListMock.get).toHaveBeenCalled();
			expect(diaryServiceMock.getEmotionByName).toHaveBeenCalled;
			expect(diaryServiceMock.addEmotion).toHaveBeenCalled;
			expect(diaryServiceMock.getEmotionsByDate).toHaveBeenCalledWith(123);
			expect(scope.emotions).toBeDefined();
			expect(scope.emotions).toEqual([{name: 'name1', src: 'src1', strength: 'strength1'}, {name: 'name2', src: 'src2', strength: 'strength2'}]);
		});

		it('should define onEmotionChange', function() {
			expect(scope.onEmotionChange).toBeDefined();
		});

	});

	describe('onEmotionChange', function() {
		it('should update the emotion in the diary with the new values', function() {
			scope.onEmotionChange('anger', 5);

			expect(diaryServiceMock.editEmotion).toHaveBeenCalledWith(123, {name: 'anger', strength: 5});
		});
	});
});