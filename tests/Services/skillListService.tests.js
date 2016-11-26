describe('SkillList', function() {
	var $httpBackend;

	beforeEach(module('starter.services'));
	beforeEach(inject(function($injector) {
	     // Set up the mock http service responses
	     $httpBackend = $injector.get('$httpBackend');
	 }));

	it('should use http service to get skills list data', inject(function(SkillList) {
		$httpBackend.when('GET', 'data/copingSkills.json').respond(200, {test: 'pass'});
		var skillResult = 'fail';
		var skillRatingPromise = SkillList.get();
		skillRatingPromise.then(function(result){
			skillResult = result;
		});
		$httpBackend.flush();
		expect(skillResult).toEqual({test: 'pass'});
	}));
});