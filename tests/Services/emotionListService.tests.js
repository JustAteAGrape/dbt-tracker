describe('EmotionList', function() {
	var $httpBackend;

	beforeEach(module('starter.services'));
	beforeEach(inject(function($injector) {
	     // Set up the mock http service responses
	     $httpBackend = $injector.get('$httpBackend');
	 }));

	it('should use http service to get emotion data', inject(function(EmotionList) {
		$httpBackend.when('GET', 'data/emotions.json').respond(200, {test: 'pass'});
		var skillResult = 'fail';
		var skillRatingPromise = EmotionList.get();
		skillRatingPromise.then(function(result){
			skillResult = result;
		});
		$httpBackend.flush();
		expect(skillResult).toEqual({test: 'pass'});
	}));
});