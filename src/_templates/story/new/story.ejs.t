---
inject: true
to: stories/<%=name%>.stories.js
append: true
skip_if: "name: '<%= storyName %>'"
---
<%
    const path = funcName + '_TemplatePath'
%>
// Start of story
const <%= path %> = '<%= templatePath %>';
export const <%= funcName%> = () => {
  return {
    template: acmeFetch(<%= path %>),
    aemMetadata: {
      decorationTag: {
        cssClasses: [StyleSystem]  // Add additional css class(es) applicable to this story as needed
      }
    }
  }
}

<%= funcName %>.story = {
  name: '<%= storyName %>',
  parameters: {
    design: {
      artboardUrl: getArtboardUrl('')
    }
  }
};

// End of story
