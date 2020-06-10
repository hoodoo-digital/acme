---
inject: true
to: stories/<%=name%>.stories.js
append: true
---
const <%= storyName %>TemplatePath = '<%= templatePath %>';
export const <%= storyName%> = () => {
  return {
    template: async () => {
        const response = await fetch(<%= storyName %>TemplatePath);
        return response.text();
    }
  }
}

<%= storyName %>.story = {
  parameters: {
    design: {
      artboardUrl: getArtboardUrl('')
    }
  }
};
