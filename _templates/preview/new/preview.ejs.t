---
to: .storybook/preview-head.html
---
<%_
    const resources = resourceList.split(',')
    for (let resource of resources) {
        if (resource.endsWith('.css')) {
        _%><link rel="stylesheet" href="<%= resource %>">
    <%_ } else if (resource.endsWith('.js')) {
            _%><script src="<%= resource %>"></script>
    <%_ }
    }
_%>
