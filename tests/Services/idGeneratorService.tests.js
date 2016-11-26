describe('IdGenerator', function() {
	var localStorageMock;

	beforeEach(module('starter.services'));
	beforeEach(function() {
		localStorageMock = {
			get: function() {
				return 1000;
			},
			set: function() {
				return true;
			}
		}

		module(function ($provide) {
			$provide.value('LocalStorage', localStorageMock);
		});
	});

	it ('should return next value', inject(function(IdGenerator) {
		var result = IdGenerator.getNextId();
		expect(result).toEqual(1001);
	}));

	it ('should increment stored id for future use', inject(function(IdGenerator) {
		var result1 = IdGenerator.getNextId();
		var result2 = IdGenerator.getNextId();
		expect(result1).toEqual(1001);
		expect(result2).toEqual(1002);
	}));
});