# Introduction

`acme` is a simple command-line tool to generate Storybook stories from content defined in an AEM instance.


## Usage

```
npm install @hoodoo/acme
npx acme pull --config <config json file> -d storybook-assets
npx acme create -s storybook-assets
```

Set the `DEBUG` environment variable to output log messages

```
DEBUG=acme:* npx acme pull --config <config json file> -d storybook-assets
DEBUG=acme:* npx acme create -s storybook-assets
```
or
```
export DEBUG=acme:*
```

## Configuration file

This is the format for the expected config file. As of now, all fields are required.
```json
{
    "username": "admin",
    "password": "admin",
    "baseURL": "https://localhost:4502",
    "storybookContentPath": "/content/my-site/storybook-sample-content",
    "componentsContainer": "jcr:content/root/container",
    "policyPath": "/conf/my-site/settings/wcm/policies/my-site/components"
}
```

### Configuration Parameters

1. `username` - Username for AEM instance
2. `password` - Password for AEM instance
3. `baseURL` - Base url for the AEM instance
4. `storybookContentPath` - Path to the parent page for all component content pages
5. `componentsContainer` - The JCR parent node for component content on a given page
6. `policyPath` - The JCR node that contains all component policies

## AEM Content

Each page under `storybookContentPath` represents all the stories for a single component. To allow `acme` to correctly generate stories for each use case from a given page, the page must maintain a specific structure; each component use case must be preceded by a `title` component describing that use case.

For example, if we have two use cases for the `button` component, say "Simple Button" and "Fancy Button", the jcr content would look something like this:
```
content
|--my-site
    |-- storybook-sample-content
        |-- button
            |-- jcr:content
                |-- root
                    |-- container
                        |-- title       // Simple Button
                        |-- button
                        |-- title_1     // Fancy Button
                        |-- button_1
```

You can reference the [acme sample project](https://github.com/hoodoo-digital/acme-storybook-sample-project) for details.
