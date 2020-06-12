---
to: stories/<%= name %>.stories.js
unless_exists: true
---
import { withXD } from 'storybook-addon-xd-designs';
import { StyleSystem } from 'storybook-aem-style-system';
import { aemMetadata } from '@storybook/aem';
import { acmeFetch } from '@hoodoo/acme';

export default {
  title: '<%= Name %>',
  decorators: [
    withXD,
    aemMetadata({
      decorationTag: {
        cssClasses: [StyleSystem]
      }
    })
  ],
  parameters: {
    aemStyleSystem: {
      policy: '<%= policiesPath%>/<%= name %>.json'
    }
  }
};

/**
 *
 * 1. Duplicate any example below to create a story for the specific use case
 * 2. Update the export function name as well as 'name' property
 * 3. Add the appropriate class to the 'cssClasses' array
 *
 */
