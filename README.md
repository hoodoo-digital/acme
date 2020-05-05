# Introduction

`acme` is a simple command-line tool to generate Storybook stories from content defined in an AEM instance.


## Usage

```
npm i
npx acme pull --config settings.json -d storybook-assets
npx acme create -s storybook-assets
```

Set the `DEBUG` environment variable to output log messages

```
DEBUG=acme:* npx acme pull --config settings.json -d storybook-assets
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
