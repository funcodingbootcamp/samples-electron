const Application = require('spectron').Application;
const assert = require('assert');
const electronPath = require('electron');
const path = require('path');

describe('Application launch', function() {
    this.timeout(10000);

    beforeEach(function() {
        this.app = new Application({
            path: electronPath,
            args: [path.join(__dirname, '..')]
        });
        return this.app.start();
    });

    afterEach(function() {
        if (this.app && this.app.isRunning()) {
            return this.app.stop();
        }
    });

    it('shows an initial window', function() {
        return this.app.client.getWindowCount().then(function(count) {
            assert.strictEqual(count, 1);
            // Please note that getWindowCount() will return 2 if `dev tools` are opened.
            // assert.equal(count, 2)
        });
    });

    it('clicks button', function() {
        const client = this.app.client;
        return client
            .getText('#test-value')
            .then(text => {
                assert.strictEqual(text, 'not clicked');
                const buttonEl = client.$('#test-button');
                buttonEl.click();
                return client.getText('#test-value');
            })
            .then(newText => {
                assert.strictEqual(newText, 'clicked 1 times');
            });
    });
});
