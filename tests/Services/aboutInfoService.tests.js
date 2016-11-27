describe('AboutInfo', function() {
	var $httpBackend;

	beforeEach(module('starter.services'));
	beforeEach(inject(function($injector) {
	     // Set up the mock http service responses
	     $httpBackend = $injector.get('$httpBackend');
	 }));

	it('should use http service to get skills list data', inject(function(AboutInfo) {
		$httpBackend.when('GET', 'data/about.json').respond(200, {test: 'pass'});
		var aboutResult = 'fail';
		var aboutPromise = AboutInfo.get();
		aboutPromise.then(function(result){
			aboutResult = result;
		});
		$httpBackend.flush();
		expect(aboutResult).toEqual({test: 'pass'});
	}));
});