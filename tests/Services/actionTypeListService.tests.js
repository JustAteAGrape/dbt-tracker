describe('ActionTypeList', function() {
	var $httpBackend;

	beforeEach(module('starter.services'));
	beforeEach(inject(function($injector) {
	     // Set up the mock http service responses
	     $httpBackend = $injector.get('$httpBackend');
	 }));

	it('should use http service to get action type data', inject(function(ActionTypeList) {
		$httpBackend.when('GET', 'data/actions.json').respond(200, {test: 'pass'});
		var skillResult = 'fail';
		var skillRatingPromise = ActionTypeList.get();
		skillRatingPromise.then(function(result){
			skillResult = result;
		});
		$httpBackend.flush();
		expect(skillResult).toEqual({test: 'pass'});
	}));
});