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
    "componentsContentPath": "/content/my-site/storybook-sample-content",
    "componentsContainer": "jcr:content/root/container",
    "policyPath": "/conf/my-site/settings/wcm/policies/my-site/components"
}
```

### Configuration Parameters

1. `username` - Username for AEM instance
2. `password` - Password for AEM instance
3. `baseURL` - Base url for the AEM instance
4. `componentsContentPath` - Path to the parent page for all component content pages
5. `componentsContainer` - The JCR parent node for component content on a given page
6. `policyPath` - The JCR node that contains all component policies

## AEM Content

Each page under `componentsContentPath` represents all the stories for a single component. To allow `acme` to correctly generate stories for each use case from a given page, the page must maintain a specific structure; each component use case must be preceded by a `title` component describing that use case.

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

## Command line reference
```bash
acme-storybook-sample-project git:(master) npx acme --help
Usage: acme <command> <options>

Commands:
  acme pull    Pull content from AEM
  acme create  Create stories from AEM content

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
```
```bash
acme-storybook-sample-project git:(master) npx acme pull --help
acme pull

Pull content from AEM

Options:
  --help             Show help                                         [boolean]
  --version          Show version number                               [boolean]
  --destination, -d  Destination directory for AEM assets
                                                [string] [default: "aem-assets"]
  --config           Path to JSON config file                         [required]
```
```bash
acme-storybook-sample-project git:(master) npx acme create --help
acme create

Create stories from AEM content

Options:
  --help        Show help                                              [boolean]
  --version     Show version number                                    [boolean]
  --source, -s  Path to downloaded AEM assets   [string] [default: "aem-assets"]
```

## Generated assets

Running `acme pull` "pulls" generated component markup, referenced images, js and css as well as component policies. This command generates the following directories and files under the destination directory provided by the `--destination` or `-d` option.

1. `components`
   Contains sub-directories for each component which in turn contains html files of each component variation. These files are referenced as templates in the respective stories.

2. `content`
   This directory contains all image resources referenced in the component variations. The path to the resource will be the same as that used in the component markup to ensure proper rendering in Storybook.

3. `policies`
   All component policies are saved here as `json` files. These policies are referenced in the respective component stories to optionally apply any defined style system.

4. `resources`
   This directory contains the `clientlib-base` js and css which includes the AEM Core Component client libraries as well as AEM Grid. Any other resources defined on the page are also included. For example, the sample project references `https://use.fontawesome.com/db86937673.js` to load icons.

`acme create` generates stories for each component variation under the `components` directory of the source directory defined by `--source` or `-s` option. The source directory would be the same as the destination directory in the `pull` command. The following assets are created:

1. `stories`
   Contains `.stories.js` files for each component. Each file in turn contains individual stories for that component.

2. `.storybook/preview.js`
   This file imports the assets added to the `resources` directory as well as the entry point to the webpack application at `/src/main/webpack/site/main.ts`--this enables storybook to render the components with the default CSS and JavaScript from the AEM Core Components along with your own custom CSS and JavaScript.
