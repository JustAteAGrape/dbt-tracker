describe('DiaryService', function() {
	var localStorageMock, todaysDate;

	beforeEach(module('starter.services'));
	beforeEach(function() {
		todaysDate = Date.now();
		localStorageMock = {
			get: function() {
				var diaryData = [];
				diaryData.push({
					date: 1,
					actions:[{
						id: 1,
						name: 'action1',
						date: 'date1',
						urge: 5,
						actedOn: true,
						skillRating: 'skill rating 1',
						notes: 'notes 1'}],
					emotions:[{
						name: 'emotion1',
						src: 'emotion1.jpg',
						strength: 0
					}],
					copingSkills:[{
						name: 'category1',
						skills: [{
							name: 'skill1',
							used: true
						}]
					}]
				});

				diaryData.push({
					date: todaysDate,
					actions:[],
					emotions:[],
					copingSkills:[]
				});
				return diaryData;
			},
			set: function() {
				return true;
			}
		}

		module(function ($provide) {
			$provide.value('LocalStorage', localStorageMock);
		});
	});

	describe('Service Initialization', function() {

		describe('No Diary Data', function() {
			beforeEach(function() {
				spyOn(localStorageMock, 'get').and.returnValue([]);
			});

			it('should add todays date if not already in diary', inject(function(DiaryService) {
				// Use combination of gets to verify that todays entry exists and is empty
				var date = Date.now();
				var actionResult = DiaryService.getActionsByDate(date);
				var emotionResult = DiaryService.getEmotionsByDate(date);
				var copingResult = DiaryService.getCopingSkillsByDate(date);
				expect(actionResult).toEqual([]);
				expect(emotionResult).toEqual([]);
				expect(copingResult).toEqual([]);
			}));
		});

		describe('Existing diary data', function() {
			it('should sort diary data in decending order by date', inject(function(DiaryService) {
				// use getDiarySummary to get a list of all dates in the diary
				var result = DiaryService.getDiarySummary();
				expect(result[0].date).toEqual(todaysDate);
				expect(result[1].date).toEqual(1);
			}));
		});

	});

	describe('getDiarySummary', function() {

		describe('default case', function() {
			var mockDateFilterReturnValue;

			beforeEach(function() {
				spyOn(localStorageMock, 'get').and.returnValue([]);

				mockDateFilterReturnValue = 'testDate';
				mockDateFilter = function() {
					return mockDateFilterReturnValue;
				}

				module(function ($provide) {
					$provide.value('dateFilter', mockDateFilter);
				});
			});

			it('should return a summary with empty info for today when no data in diary', inject(function(DiaryService) {
				var result = DiaryService.getDiarySummary();
				expect(result).toBeDefined();
				expect(result[0].date).toBeDefined();
				expect(result[0].dateFormatted).toEqual(mockDateFilterReturnValue);
				expect(result[0].actionCount).toEqual(0);
			}));
		});

		describe('with diray data', function() {
			it('should return summary of all diary information', inject(function(DiaryService) {
				var result = DiaryService.getDiarySummary();

				expect(result.length).toEqual(2);
				expect(result[0].date).toEqual(todaysDate);
				expect(result[0].actionCount).toEqual(0);
				expect(result[1].date).toEqual(1);
				expect(result[1].actionCount).toEqual(1);
			}));
		});
	});

	describe('getActionsByDate', function() {
		it('should return array of actions for the given date', inject(function(DiaryService) {
			var result = DiaryService.getActionsByDate(1);
			expect(result.length).toEqual(1);
			expect(result[0].name).toEqual('action1');
		}));

		it('should return empty array when no actions for date', inject(function(DiaryService) {
			var result = DiaryService.getActionsByDate(todaysDate);
			expect(result).toBeDefined();
			expect(result).toEqual([]);
		}));
	});

	describe('getActionById', function() {
		it('should return an action by given date and id', inject(function(DiaryService) {
			var result = DiaryService.getActionById(1, 1, 'default');

			expect(result).toBeDefined();
			expect(result.name).toEqual('action1');
		}));

		it('should return the given default value when no action with specified id is found', inject(function(DiaryService) {
			var result = DiaryService.getActionById(todaysDate, 2, 'default');

			expect(result).toBeDefined();
			expect(result).toEqual('default');
		}));

		it('should return the given default value when no action with specified date is found', inject(function(DiaryService) {
			var result = DiaryService.getActionById(new Date("2016-01-01"), 1, 'default');

			expect(result).toBeDefined();
			expect(result).toEqual('default');
		}));
	});

	describe('addAction', function() {
		var newAction;

		beforeEach(function() {
			newAction = {
				id: 2,
				name: 'action2',
				date: 'date2',
				urge: 1,
				actedOn: false,
				skillRating: 'skill rating 2',
				notes: 'notes 2'
			};
		});

		it('should add a new action entry to the specified date', inject(function(DiaryService) {
			DiaryService.addAction(1, newAction);
			// use get action to verify the add worked
			var result = DiaryService.getActionsByDate(1);
			expect(result.length).toEqual(2);
		}));

		it('should take no action if the specified date is not found', inject(function(DiaryService) {
			var testDate = new Date('2016-01-01');
			DiaryService.addAction(testDate, newAction);
			// use get action to verify the add did nothing
			var result = DiaryService.getActionsByDate(testDate);
			expect(result).toEqual([]);
		}));
	});

	describe('editAction', function() {
		var updatedAction;

		beforeEach(function() {
			updatedAction = {
				id: 1,
				name: 'action2',
				date: 'date1',
				urge: 1,
				actedOn: false,
				skillRating: 'skill rating 2',
				notes: 'notes 2'
			};
		});

		it('should update the specified action for the given date', inject(function(DiaryService) {
			DiaryService.editAction(1, updatedAction);
			// use get action to verify the changes were made
			var result = DiaryService.getActionById(1, 1, []);
			expect(result).toBeDefined();
			expect(result.name).toEqual('action2');
			expect(result.urge).toEqual(1);
			expect(result.actedOn).toEqual(false);
			expect(result.skillRating).toEqual('skill rating 2');
			expect(result.notes).toEqual('notes 2');
		}));

		it('should perform no action if the action is not found for the given date', inject(function(DiaryService) {
			DiaryService.editAction(todaysDate, updatedAction);
			// use get action to verify that no change was made
			var result = DiaryService.getActionById(todaysDate, 1, []);
			expect(result).toEqual([]);
		}));

		it('should perform no action if there is no entry for the given date', inject(function(DiaryService) {
			var testDate = new Date('2016-01-01');
			DiaryService.editAction(testDate, updatedAction);
			// use get action to verify that no change was made
			var result = DiaryService.getActionById(testDate, updatedAction, []);
			expect(result).toEqual([]);
		}));
	});

	describe('removeAction', function() {
		var removedAction;

		beforeEach(function() {
			removedAction = {
				id: 1,
				name: 'action1',
				date: 'date1',
				urge: 5,
				actedOn: true,
				skillRating: 'skill rating 1',
				notes: 'notes 1'
			};
		});

		it('should remove the specified action for the given date', inject(function(DiaryService) {
			DiaryService.removeAction(1, removedAction);
			// use get action to verify the changes were made
			var result = DiaryService.getActionById(1, 1, []);
			expect(result).toBeDefined();
			expect(result).toEqual([]);
		}));

		it('should perform no action if the action is not found for the given date', inject(function(DiaryService) {
			DiaryService.removeAction(todaysDate, removedAction);
			// use get action to verify that no change was made
			var result = DiaryService.getActionById(todaysDate, 1, []);
			expect(result).toEqual([]);
		}));

		it('should perform no action if there is no entry for the given date', inject(function(DiaryService) {
			var testDate = new Date('2016-01-01');
			DiaryService.removeAction(testDate, removedAction);
			// use get action to verify that no change was made
			var result = DiaryService.getActionById(testDate, removedAction, []);
			expect(result).toEqual([]);
		}));
	});

	describe('getEmotionsByDate', function() {
		it('should return array of emotions for the given date', inject(function(DiaryService) {
			var result = DiaryService.getEmotionsByDate(1);
			expect(result.length).toEqual(1);
			expect(result[0].name).toEqual('emotion1');
		}));

		it('should return empty array when no emotions for date', inject(function(DiaryService) {
			var result = DiaryService.getEmotionsByDate(todaysDate);
			expect(result).toBeDefined();
			expect(result).toEqual([]);
		}));
	});

	describe('getEmotionByName', function() {
		it('should return an emotion by given date and name', inject(function(DiaryService) {
			var result = DiaryService.getEmotionByName(1, 'emotion1', 'default');

			expect(result).toBeDefined();
			expect(result.src).toEqual('emotion1.jpg');
		}));

		it('should return the given default value when no emotion with specified name is found', inject(function(DiaryService) {
			var result = DiaryService.getEmotionByName(todaysDate, 'emotion1', 'default');

			expect(result).toBeDefined();
			expect(result).toEqual('default');
		}));

		it('should return the given default value when no emotion with specified date is found', inject(function(DiaryService) {
			var result = DiaryService.getEmotionByName(new Date("2016-01-01"), 'emotion1', 'default');

			expect(result).toBeDefined();
			expect(result).toEqual('default');
		}));
	});

	describe('addEmotion', function() {
		var newEmotion;

		beforeEach(function() {
			newEmotion = {
				name: 'emotion2',
				src: 'emotion2.jpg',
				strength: 1
			};
		});

		it('should add a new emotion entry to the specified date', inject(function(DiaryService) {
			DiaryService.addEmotion(1, newEmotion);
			// use get emotion to verify the add worked
			var result = DiaryService.getEmotionsByDate(1);
			expect(result.length).toEqual(2);
		}));

		it('should take no action if the specified date is not found', inject(function(DiaryService) {
			var testDate = new Date('2016-01-01');
			DiaryService.addEmotion(testDate, newEmotion);
			// use get emotion to verify the add did nothing
			var result = DiaryService.getEmotionsByDate(testDate);
			expect(result).toEqual([]);
		}));
	});

	describe('editEmotion', function() {
		var updatedEmotion;

		beforeEach(function() {
			updatedEmotion = {
				name: 'emotion1',
				src: 'emotion1.jpg',
				strength: 5
			};
		});

		it('should update the specified emotion for the given date', inject(function(DiaryService) {
			DiaryService.editEmotion(1, updatedEmotion);
			// use get emotion to verify the changes were made
			var result = DiaryService.getEmotionByName(1, 'emotion1', []);
			expect(result).toBeDefined();
			expect(result.strength).toEqual(5);
		}));

		it('should perform no action if the emotion is not found for the given date', inject(function(DiaryService) {
			DiaryService.editEmotion(todaysDate, updatedEmotion);
			// use get emotion to verify that no change was made
			var result = DiaryService.getEmotionByName(todaysDate, 'emotion1', []);
			expect(result).toEqual([]);
		}));

		it('should perform no action if there is no entry for the given date', inject(function(DiaryService) {
			var testDate = new Date('2016-01-01');
			DiaryService.editEmotion(testDate, updatedEmotion);
			// use get emotion to verify that no change was made
			var result = DiaryService.getEmotionByName(testDate, 'emotion1', []);
			expect(result).toEqual([]);
		}));
	});

	describe('getCopingSkillCategoryByName', function() {
		it('should return a coping skill category by given date and name', inject(function(DiaryService) {
			var result = DiaryService.getCopingSkillCategoryByName(1, 'category1', 'default');

			expect(result).toBeDefined();
			expect(result.skills.length).toEqual(1);
		}));

		it('should return the given default value when no coping skill category with specified name is found', inject(function(DiaryService) {
			var result = DiaryService.getCopingSkillCategoryByName(todaysDate, 'category1', 'default');

			expect(result).toBeDefined();
			expect(result).toEqual('default');
		}));

		it('should return the given default value when no coping skill category with specified date is found', inject(function(DiaryService) {
			var result = DiaryService.getCopingSkillCategoryByName(new Date("2016-01-01"), 'category1', 'default');

			expect(result).toBeDefined();
			expect(result).toEqual('default');
		}));
	});

	describe('addCopingSkillCategory', function() {
		var newCopingSkillCategory;

		beforeEach(function() {
			newCopingSkillCategory = {
				name: 'category2',
				skills: [{
					name: 'skill2',
					used: false
				}]
			};
		});

		it('should add a new coping skill category to the specified date', inject(function(DiaryService) {
			DiaryService.addCopingSkillCategory(1, newCopingSkillCategory);
			// use get coping skills to verify the add worked
			var result = DiaryService.getCopingSkillsByDate(1);
			expect(result.length).toEqual(2);
		}));

		it('should take no action if the specified date is not found', inject(function(DiaryService) {
			var testDate = new Date('2016-01-01');
			DiaryService.addCopingSkillCategory(testDate, newCopingSkillCategory);
			// use get coping skills to verify the add did nothing
			var result = DiaryService.getCopingSkillsByDate(testDate);
			expect(result).toEqual([]);
		}));
	});

	describe('getCopingSkillByName', function() {
		it('should return a coping skill by given date and name', inject(function(DiaryService) {
			var result = DiaryService.getCopingSkillByName(1, 'category1', 'skill1', 'default');

			expect(result).toBeDefined();
			expect(result.used).toEqual(true);
		}));

		it('should return the given default value when no coping skill with specified name is found', inject(function(DiaryService) {
			var result = DiaryService.getCopingSkillByName(todaysDate, 'category1', 'skill2', 'default');

			expect(result).toBeDefined();
			expect(result).toEqual('default');
		}));

		it('should return the given default value when no coping skill with specified date is found', inject(function(DiaryService) {
			var result = DiaryService.getCopingSkillByName(new Date("2016-01-01"), 'category1', 'skill1', 'default');

			expect(result).toBeDefined();
			expect(result).toEqual('default');
		}));
	});

	describe('addCopgingSkill', function() {
		var newCopingSkill;

		beforeEach(function() {
			newCopingSkill = {
				name: 'skill2',
				used: false
				}
		});

		it('should add a new coping skill to the specified category and date', inject(function(DiaryService) {
			DiaryService.addCopgingSkill(1, 'category1', newCopingSkill);
			// use get coping skills to verify the add worked
			var result = DiaryService.getCopingSkillByName(1, 'category1', 'skill2', 'default');
			expect(result.used).toEqual(false);
		}));

		it('should take no action if the specified category is not found', inject(function(DiaryService) {
			DiaryService.addCopgingSkill(1, 'category2', newCopingSkill);
			// use get coping skills to verify the add did nothing
			var result = DiaryService.getCopingSkillByName(1, 'category2', 'skill2', 'default');
			expect(result).toEqual('default');
		}));

		it('should take no action if the specified date is not found', inject(function(DiaryService) {
			var testDate = new Date('2016-01-01');
			DiaryService.addCopgingSkill(testDate,'category1', newCopingSkill);
			// use get coping skills to verify the add did nothing
			var result = DiaryService.getCopingSkillByName(testDate, 'category1', 'skill2', 'default');
			expect(result).toEqual('default');
		}));
	});

	describe('getCopingSkillsByDate', function() {
		it('should return array of coping skill categories for the given date', inject(function(DiaryService) {
			var result = DiaryService.getCopingSkillsByDate(1);
			expect(result.length).toEqual(1);
			expect(result[0].skills.length).toEqual(1);
		}));

		it('should return empty array when no coping skill categories for date', inject(function(DiaryService) {
			var result = DiaryService.getCopingSkillsByDate(todaysDate);
			expect(result).toBeDefined();
			expect(result).toEqual([]);
		}));
	});

	describe('editCopingSkill', function() {
		var updatedCopingSkill;

		beforeEach(function() {
			updatedCopingSkill = {
				name: 'skill1',
				used: false
				}
		});

		it('should update the specified coping skill for the given category and date', inject(function(DiaryService) {
			DiaryService.editCopingSkill(1, 'category1', updatedCopingSkill);
			// use get coping skill to verify the changes were made
			var result = DiaryService.getCopingSkillByName(1, 'category1', 'skill1', []);
			expect(result).toBeDefined();
			expect(result.used).toEqual(false);
		}));

		it('should perform no action if the coping skill is not found for the given date', inject(function(DiaryService) {
			DiaryService.editCopingSkill(todaysDate, 'category1', updatedCopingSkill);
			// use get coping skill to verify that no change was made
			var result = DiaryService.getCopingSkillByName(todaysDate, 'category1', 'skill1', []);
			expect(result).toEqual([]);
		}));

		it('should perform no action if the coping skill is not found for the given category', inject(function(DiaryService) {
			DiaryService.editCopingSkill(1, 'category2', updatedCopingSkill);
			// use get coping skill to verify that no change was made
			var result = DiaryService.getCopingSkillByName(todaysDate, 'category2', 'skill1', []);
			expect(result).toEqual([]);
		}));

		it('should perform no action if there is no entry for the given date', inject(function(DiaryService) {
			var testDate = new Date('2016-01-01');
			DiaryService.editCopingSkill(testDate, 'category1', updatedCopingSkill);
			// use get coping skill to verify that no change was made
			var result = DiaryService.getCopingSkillByName(testDate, 'category1', 'skill1', []);
			expect(result).toEqual([]);
		}));
	});

	describe('saveUpdates', function() {
		var updatedEmotion;

		beforeEach(function() {
			updatedEmotion = {
				name: 'emotion1',
				src: 'emotion1.jpg',
				strength: 4
			}

			spyOn(localStorageMock, 'set');
		});

		it('should update local storage if changes were made', inject(function(DiaryService) {
			// use update emotion to trigger a change
			DiaryService.editEmotion(1, updatedEmotion);
			DiaryService.saveUpdates();

			expect(localStorageMock.set).toHaveBeenCalled();
		}));

		it('should not update local storage if no changes were made', inject(function(DiaryService) {
			// use update emotion to trigger a change
			DiaryService.editEmotion(todaysDate, updatedEmotion);
			DiaryService.saveUpdates();

			expect(localStorageMock.set).not.toHaveBeenCalled();
		}));
	});

});