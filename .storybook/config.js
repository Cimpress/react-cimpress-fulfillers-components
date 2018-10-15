import { configure } from '@storybook/react';

function loadStories() {
    if (process.env.LOCAL_DEVELOPMENT === 'yes') {
        require('../stories/production-like/stories');
    } else {
        require('../stories/mocked/index');
    }
}

configure(loadStories, module);
