describe('ActionsController', function() {
	var scope, diaryServiceMock, stateMock, params, dateFilterMock, ionicPopupMock, ionicHistoryMock, actionTypeListMock, skillRatingsMock, idGeneratorMock, createController;

	beforeEach(function() {
		module('starter.controllers');
		module(function($provide) {

			$provide.value('ActionTypeList', {
				get: function() {
					return {
						then: function(callback) {return callback({type: 'test'});}
					};
				}
			});

			$provide.value('SkillRatings', {
				get: function() {
					return {
						then: function(callback) {return callback({rating: 'providerTest'});}
					};
				}
			});			
		});
	});

	beforeEach(inject(function($rootScope, _ActionTypeList_, _SkillRatings_, $controller) {
		scope = $rootScope.$new();

		diaryServiceMock = {
			getActionById: function(date, id, defaultValue) {
				if (id > 0)	{
					return {
						id: 1,
						name: 'test',
						date: 123456789,
						urge: 5,
						actedOn: true,
						skillRating: {rating: 'serviceTest'},
						notes: 'test note'
					};
				}
				else {
					return null;
				}
			},
			addAction: function(date, action) {
				return true;
			},
			editAction: function(date, action) {
				return true;
			}
		};

		ionicPopupMock = {
			alert: function(data) {
				return true;
			}
		};

		ionicHistoryMock = jasmine.createSpyObj('$ionicHistory', ['goBack']);

		actionTypeListMock = _ActionTypeList_;

		skillRatingsMock = _SkillRatings_;

		idGeneratorMock = {
			getNextId: function() {return 1}
		}

		createController = function(stateMock, dateFilterMock) {
			$controller('ActionsController', {$scope: scope, $state: stateMock, $filter: dateFilterMock, $ionicPopup: ionicPopupMock, $ionicHistory: ionicHistoryMock,
				DiaryService: diaryServiceMock, ActionTypeList: actionTypeListMock, SkillRatings: skillRatingsMock, IdGenerator: idGeneratorMock});
		};
	}));

	describe('Controller Initialization', function() {
		beforeEach(function() {
			spyOn(diaryServiceMock, 'getActionById').and.callThrough();
		});

		it('should define properties and methods', function() {
			params = {aDate: null, id: null};
			stateMock = {params: params};
			innerFilterMock = jasmine.createSpy();
			dateFilterMock = jasmine.createSpy().and.returnValue(innerFilterMock);
			createController(stateMock, dateFilterMock);

			expect(diaryServiceMock.getActionById).toHaveBeenCalled();
			expect(dateFilterMock).toHaveBeenCalled();
			expect(innerFilterMock).toHaveBeenCalled();
			expect(scope.actionTypeList).toBeDefined();
			expect(scope.skillRatings).toBeDefined();
			expect(scope.title).toBeDefined();
			expect(scope.myAction).toBeDefined();
			expect(scope.saveAction).toBeDefined();
		});	

		it('sets up new action page when current action is not set', function() {
			spyOn(Date, 'now').and.callFake(function() {
				return 9876;
			});
			params = { aDate: 123, aId: null };
			stateMock = { params: params };
			innerFilterMock = jasmine.createSpy().and.returnValue('New Date');
			dateFilterMock = jasmine.createSpy().and.returnValue(innerFilterMock);
			createController(stateMock, dateFilterMock);

			expect(diaryServiceMock.getActionById).toHaveBeenCalledWith(123, null, null);
			expect(dateFilterMock).toHaveBeenCalledWith('date');
			expect(innerFilterMock).toHaveBeenCalledWith(9876, 'EEEE, MMM d, yyyy');
			expect(scope.title).toEqual('New Action');
			expect(scope.myAction.id).not.toBeDefined();
			expect(scope.myAction.displayDate).toEqual('New Date');
			expect(scope.myAction.date).toEqual('9876');
			expect(scope.myAction.urge).toEqual(0);
			expect(scope.myAction.actedOn).toEqual(false);
			// TODO: Fix this
			//expect(scope.myAction.skillRating.rating).toEqual('providerTest');			
		});	

		it('sets up edit action page when current action is set', function() {
			params = { aDate: 1234, aId: 1 };
			stateMock = { params: params };
			innerFilterMock = jasmine.createSpy().and.returnValue('Edit Date');
			dateFilterMock = jasmine.createSpy().and.returnValue(innerFilterMock);			
			createController(stateMock, dateFilterMock);

			expect(diaryServiceMock.getActionById).toHaveBeenCalledWith(1234, 1, null);
			expect(dateFilterMock).toHaveBeenCalledWith('date');
			expect(innerFilterMock).toHaveBeenCalledWith(123456789, 'EEEE, MMM d, yyyy');			
			expect(scope.title).toEqual('Edit Action');
			expect(scope.myAction.id).toEqual(1);
			expect(scope.myAction.name).toEqual('test');
			expect(scope.myAction.displayDate).toEqual('Edit Date');
			expect(scope.myAction.date).toEqual(123456789);
			expect(scope.myAction.urge).toEqual(5);
			expect(scope.myAction.actedOn).toEqual(true);
			expect(scope.myAction.skillRating.rating).toEqual('serviceTest');
			expect(scope.myAction.notes).toEqual('test note');
		});	

		it('defines saveAction on the scope', function() {
			params = { aDate: 123, aId: null };
			stateMock = { params: params };
			innerFilterMock = jasmine.createSpy().and.returnValue('New Date');
			dateFilterMock = jasmine.createSpy().and.returnValue(innerFilterMock);
			createController(stateMock, dateFilterMock);

			expect(scope.saveAction).toBeDefined(true);
		});
	})

	describe('saveAction', function() {

		it('should present a popup warning if no action is chosen', function() {
			params = { aDate: 123, aId: null };
			stateMock = { params: params };
			innerFilterMock = jasmine.createSpy().and.returnValue('New Date');
			dateFilterMock = jasmine.createSpy().and.returnValue(innerFilterMock);
			createController(stateMock, dateFilterMock);			
			spyOn(ionicPopupMock, 'alert');
			scope.myAction = {name: null};

			scope.saveAction();

			expect(ionicPopupMock.alert).toHaveBeenCalled();
		});

		it('should add the action to the diary if it does not exist', function() {
			params = { aDate: 123, aId: null };
			stateMock = { params: params };
			innerFilterMock = jasmine.createSpy().and.returnValue('New Date');
			dateFilterMock = jasmine.createSpy().and.returnValue(innerFilterMock);
			createController(stateMock, dateFilterMock);			
			spyOn(diaryServiceMock, 'addAction');
			scope.myAction = {
								id: null,
								name: 'test',
								date: 123456789,
								urge: 5,
								actedOn: true,
								skillRating: {rating: 'serviceTest'},
								notes: 'test note'
							};

			scope.saveAction();
			
			var expectedAction = {
								id: 1,
								name: 'test',
								date: 123456789,
								urge: 5,
								actedOn: true,
								skillRating: {rating: 'serviceTest'},
								notes: 'test note'
							};
			expect(diaryServiceMock.addAction).toHaveBeenCalledWith(123, expectedAction);
		});

		it('should update the action in the diary if it already exists', function() {
			params = { aDate: 123, aId: 1 };
			stateMock = { params: params };
			innerFilterMock = jasmine.createSpy().and.returnValue('New Date');
			dateFilterMock = jasmine.createSpy().and.returnValue(innerFilterMock);
			createController(stateMock, dateFilterMock);			
			spyOn(diaryServiceMock, 'editAction');
			var testAction = {
								id: 1,
								name: 'test',
								date: 123456789,
								urge: 5,
								actedOn: true,
								skillRating: {rating: 'serviceTest'},
								notes: 'test note'
							};
			scope.myAction = testAction;

			scope.saveAction();
			
			expect(diaryServiceMock.editAction).toHaveBeenCalledWith(123, testAction);
		})
	});

});
