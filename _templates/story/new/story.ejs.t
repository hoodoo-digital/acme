---
inject: true
to: stories/<%=name%>.stories.js
append: true
---
const <%= storyName %>TemplatePath = '<%= templatePath %>';
export const <%= storyName%> = () => {
  return {
    template: async () => {
        let response = await fetch(<%= storyName %>TemplatePath);
        return response.text();
    }
  }
}

<%= storyName %>.story = {
  parameters: {
    design: {
      //artboardUrl: 'https://xd.adobe.com/view/a23a5b3e-a93d-4063-5532-cd55043e0488-d40b/screen/10bcabef-3186-433b-b5fb-ed8a56aacd0d/Button-Default',
    }
  }
};
