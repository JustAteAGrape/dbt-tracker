describe('AboutController', function() {
	var scope, aboutInfoMock;

	beforeEach(module('starter.controllers'));

	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();

		aboutInfoMock = {
			get: function() {
				return {
					then: function(callback) {
						return callback({
							author: 'testAuthor',
							company: 'testCompany',
							department: 'testDepartment',
							phone: 'testPhone',
							email: 'testEmail',
							address1: 'testAddress1',
							address2: 'testAddress2',
							city: 'testCity',
							state: 'testState',
							zip: 'testZip'
						});
					}
				};
			}
		};

		spyOn(aboutInfoMock, 'get').and.callThrough();

		$controller('AboutController', {$scope: scope, AboutInfo: aboutInfoMock});
	}));

	describe('Controller Initialization', function() {

		it('should load about info into scope', function() {
			expect(aboutInfoMock.get).toHaveBeenCalled();
			expect(scope.about).toBeDefined();
			expect(scope.about.author).toEqual('testAuthor');
			expect(scope.about.company).toEqual('testCompany');
			expect(scope.about.department).toEqual('testDepartment');
			expect(scope.about.phone).toEqual('testPhone');
			expect(scope.about.email).toEqual('testEmail');
			expect(scope.about.address1).toEqual('testAddress1');
			expect(scope.about.address2).toEqual('testAddress2');
			expect(scope.about.city).toEqual('testCity');
			expect(scope.about.state).toEqual('testState');
			expect(scope.about.zip).toEqual('testZip');
		});
	});
});