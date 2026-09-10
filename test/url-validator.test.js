const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeUrl } = require('../src/utils/url-validator');

test('normalizes a bare hostname to HTTPS', () => {
  assert.equal(normalizeUrl('example.com'), 'https://example.com/');
});

test('keeps an allowed HTTP protocol', () => {
  assert.equal(normalizeUrl('http://example.com/path'), 'http://example.com/path');
});

test('rejects unsafe protocols and malformed URLs', () => {
  assert.throws(() => normalizeUrl('javascript:alert(1)'));
  assert.throws(() => normalizeUrl('not a url'));
});
