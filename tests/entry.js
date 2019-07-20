const entry = require('../entry');
const fc = require('fast-check');
const assert = require('assert');


// Properties
describe('parseSelector', () => {

    it('sample test', () => {
        assert.deepEqual(entry.parseSelector(''), {});
        assert.deepEqual(entry.parseSelector('span'), {tagName: 'span'});
        assert.deepEqual(entry.parseSelector('.span'), {classList: ['span']});
        assert.deepEqual(entry.parseSelector('#span'), {id: 'span'});
        assert.deepEqual(entry.parseSelector('div#id.a.b.c'), {id: 'id', tagName: 'div', classList: ['a', 'b', 'c']});
        assert.deepEqual(entry.parseSelector('p a'), {tagName: 'p', children: [{tagName: 'a'}]});

    });
});

describe('mergeObjects', () => {

    it('sample test', () => {
        assert.deepEqual(entry.mergeObjects({}, {}), {});
        assert.deepEqual(entry.mergeObjects({a: 1}, {b: 2}), {a: 1, b: 2});
        assert.deepEqual(entry.mergeObjects({a: 1}, {a: 2}), {a: 2});
        assert.deepEqual(entry.mergeObjects({children: ['div']}, {children: ['span', 'span']}), {children: ['div', 'span', 'span']});
        assert.deepEqual(entry.mergeObjects({data: {b: 1}}, {data: {c: 2}}), {data: {b: 1, c: 2}});
        assert.deepEqual(entry.mergeObjects({className: 'ab cd'}, {classList: ['ef', 'gh']}), {classList: ['ab', 'cd', 'ef', 'gh']});
        assert.deepEqual(entry.mergeObjects({classList: ['ab', 'cd']}, {classList: ['ef', 'gh']}), {classList: ['ab', 'cd', 'ef', 'gh']});
    });
    it('random objects', () => {
        fc.assert(fc.property(fc.object(), fc.object(), (a, b) => {

            let result = entry.mergeObjects(a, b);
            return typeof result === 'object' && result.constructor === Object && Object.keys(result).length <= Object.keys(a).length + Object.keys(b).length && Object.keys(result).length >= Math.max(Object.keys(a).length, Object.keys(b).length);
        }));
    });
});

