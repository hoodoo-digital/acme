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
        cssClasses: []  // Add css class(es) applicable to this story
      }
    }
  }
}

<%= funcName %>.story = {
  name: '<%= storyName %>',
  parameters: {
    design: {
      //artboardUrl: 'https://xd.adobe.com/view/a23a5b3e-a93d-4063-5532-cd55043e0488-d40b/screen/10bcabef-3186-433b-b5fb-ed8a56aacd0d/Button-Default',
    }
  }
};

// End of story
