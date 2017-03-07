import http from 'http';
import assert from 'assert';

import '../src/index';

describe('Example Node Server', () => {
  it('should return 200', done => {
    http.get('http://localhost:8080/api', res => {
      assert.equal(200, res.statusCode);
      done();
    });
  });
});