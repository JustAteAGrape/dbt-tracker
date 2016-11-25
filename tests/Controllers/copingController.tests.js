describe('CopingController', function() {
	var scope, diaryServiceMock, skillListMock;

	beforeEach(function() {
		module('starter.controllers');
		module(function($provide) {
			$provide.value('SkillList', {
				get: function() {
					return {
						then: function(callback) {
							return callback([
								{
									"id" : 0,
									"name" : "test category",
									"skills" : [
									{
									  "id" : 0,
									  "name" : "test skill"
									}]
								}]
							);
						}
					};
				}
			});
		});
	});

	beforeEach(inject(function($rootScope, $controller, _SkillList_) {
		scope = $rootScope.$new();

		params = { cDate: 123 }
		stateMock = { params: params };

		diaryServiceMock = {
			getCopingSkillCategoryByName: function(date, name, defaultValue) {
				return true;
			},
			addCopingSkillCategory: function(date, category) {
				return true;
			},
			getCopingSkillByName: function(date, name, skill, defaultValue) {
				return true;
			},
			addCopgingSkill: function(date, name) {
				return true;
			},
			getCopingSkillsByDate: function(date) {
				return true;
			},
			editCopingSkill: function(date, category, skill) {
				return true;
			}
		};

		skillListMock = _SkillList_;

		createController = function() {
			$controller('CopingController', {$scope: scope, $state: stateMock, DiaryService: diaryServiceMock, SkillList: skillListMock});
		};
	}));

	describe('Controller Initialization', function() {
		it('defines properties on scope', function() {
			spyOn(diaryServiceMock, 'getCopingSkillCategoryByName').and.returnValue(null);
			createController();
			expect(scope.copingSkills).toBeDefined();
		});

		it('defines functions on scope', function() {
			spyOn(diaryServiceMock, 'getCopingSkillCategoryByName').and.returnValue(null);
			createController();
			expect(scope.onSkillChange).toBeDefined();
			expect(scope.toggleCategory).toBeDefined();
			expect(scope.isCategoryShown).toBeDefined();
		});

		it('adds new skill categories to the diary', function() {
			spyOn(diaryServiceMock, 'getCopingSkillCategoryByName').and.returnValue(null);
			spyOn(diaryServiceMock, 'addCopingSkillCategory');
			createController();
			expect(diaryServiceMock.addCopingSkillCategory).toHaveBeenCalled;
		});

		it('adds new skills to existing categories in the diary', function() {
			spyOn(diaryServiceMock, 'getCopingSkillCategoryByName').and.returnValue([
																			{
																				"id" : 0,
																				"name" : "test category",
																				"skills" : []
																			}]);
			spyOn(diaryServiceMock, 'getCopingSkillByName').and.returnValue(null);
			spyOn(diaryServiceMock, 'addCopgingSkill');
			createController();
			expect(diaryServiceMock.getCopingSkillByName).toHaveBeenCalled();
			expect(diaryServiceMock.addCopgingSkill).toHaveBeenCalled();
		});
	});
	
	describe('Coping Skill Functions', function() {
		beforeEach(function(){
			spyOn(diaryServiceMock, 'getCopingSkillCategoryByName').and.returnValue(null);
			createController();
		});

		describe('onSkillChange', function() {
			it('edits coping skill in diary', function() {
				spyOn(diaryServiceMock, 'editCopingSkill');
				scope.onSkillChange('catName', 'skillName', true);
				expect(diaryServiceMock.editCopingSkill).toHaveBeenCalledWith(123, 'catName', {name: 'skillName', used: true});
			});
		});

		describe('toggleCategory', function() {

			it('toggles the shownCopingCategory value to null', function() {
				scope.shownCopingCategory = 3;
				scope.toggleCategory(3);
				expect(scope.shownCopingCategory).toEqual(null);			
			});

			it('toggles the shownCopingCategory value to defined', function() {
				scope.shownCopingCategory = null;
				scope.toggleCategory(3);
				expect(scope.shownCopingCategory).toEqual(3);			
			});
		});

		describe('isCategoryShown', function() {
			it('returns true when requested entry matches currently shown entry', function() {
				scope.shownCopingCategory = 1;
				var result = scope.isCategoryShown(1);
				expect(result).toEqual(true);	
			});

			it('returns false when requested entry does not match currently shown entry', function() {
				scope.shownCopingCategory = 1;
				var result = scope.isCategoryShown(3);
				expect(result).toEqual(false);	
			});
		});
	});
});