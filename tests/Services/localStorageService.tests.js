describe('LocalStorage', function() {
	var windowMock;

	beforeEach(module('starter.services'));
	beforeEach(function() {
		windowMock = {
			localStorage: {}
		}

		module(function ($provide) {
			$provide.value('$window', windowMock);
		});
	});

	describe('set', function() {
		it ('should store value in window localStorage', inject(function(LocalStorage) {
			LocalStorage.set('key', 'value');
			expect(windowMock.localStorage['key']).toEqual('value');
		}));
	});

	describe('get', function() {
		it('should return value from window localStorage', inject(function(LocalStorage) {
			windowMock.localStorage['testKey'] = 'testValue';
			var result = LocalStorage.get('testKey', 'testDefault');
			expect(result).toEqual('testValue');
		}));

		it('should return default value when no key found', inject(function(LocalStorage) {
			var result = LocalStorage.get('testKey', 'testDefault');
			expect(result).toEqual('testDefault');
		}));
	});

	describe('setObject', function() {
		it('should store object in window localStorage', inject(function(LocalStorage) {
			var testObject = {name: 'testName', value: 'testValue'};
			LocalStorage.setObject('objectKey', testObject);
			expect(windowMock.localStorage['objectKey']).toEqual('{"name":"testName","value":"testValue"}');
		}));
	});

	describe('getObject', function() {
		it('should return object version of string in window localStorage', inject(function(LocalStorage) {
			windowMock.localStorage['testKey'] = '{"name":"testName","value":"testValue"}';
			var resultObject = LocalStorage.getObject('testKey');
			expect(resultObject).toEqual({name: 'testName', value: 'testValue'});
		}));

		it('should return empty object when key not found in window localStorage', inject(function(LocalStorage) {
			var resultObject = LocalStorage.getObject('testKey');
			expect(resultObject).toEqual({});
		}));
	});
});