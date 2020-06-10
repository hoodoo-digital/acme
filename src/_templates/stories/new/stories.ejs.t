---
to: stories/<%= name %>.stories.js
---
import { withXD } from 'storybook-addon-xd-designs';
import { StyleSystem } from 'storybook-aem-style-system';
import { aemMetadata } from '@storybook/aem';
import { getArtboardUrl } from '@hoodoo/acme';

export default {
  title: '<%= Name %>',
  decorators: [
    withXD,
    aemMetadata({
      decorationTag: {
        cssClasses: ['<%= name %>', StyleSystem]
      }
    })
  ],
  parameters: {
    aemStyleSystem: {
      policy: '<%= policiesPath%>/<%= name %>.json'
    }
  }
};
