import { tokenize, parseTokens, buildGameObject } from './sgf/parse-sgf.js';
import { rawSgfs } from './test/sampleSGFs.js';
import { psTokenize } from './test/expected-test-results.js';

const testSGF = rawSgfs[0];
console.log('testSGF:',testSGF);
tokenize(testSGF).then(result => {
    console.log('result:',result,'expected:',psTokenize);
    parseTokens(result).then(nodes => {
        console.log('parsed tokens:',nodes);
        buildGameObject(nodes).then(gameTree => {
            console.log('game object:',gameTree);
            console.log('game tree:',JSON.stringify(gameTree,null,2));
        });
    });
});