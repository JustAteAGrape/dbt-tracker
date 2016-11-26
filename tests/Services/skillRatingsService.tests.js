describe('SkillRatings', function() {
	var $httpBackend;

	beforeEach(module('starter.services'));
	beforeEach(inject(function($injector) {
	     // Set up the mock http service responses
	     $httpBackend = $injector.get('$httpBackend');
	 }));

	it('should use http service to get skill rating data', inject(function(SkillRatings) {
		$httpBackend.when('GET', 'data/copingUsage.json').respond(200, {test: 'pass'});
		var skillResult = 'fail';
		var skillRatingPromise = SkillRatings.get();
		skillRatingPromise.then(function(result){
			skillResult = result;
		});
		$httpBackend.flush();
		expect(skillResult).toEqual({test: 'pass'});
	}));
});