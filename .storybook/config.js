import { configure } from '@storybook/react';

function loadStories() {
    if (process.env.SERVICE_DEPENDENCIES === 'production') {
        require('../stories/production-like/stories');
    } else {
        require('../stories/mocked/index');
    }
}

configure(loadStories, module);
