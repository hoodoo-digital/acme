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

## Configuration File

This is the format for the expected config file. As of now, all fields are required. You can use the `acme init` command to trigger a prompt that will automatically create the config file, which is named `acme.settings.json` by default.
```json
{
    "username": "admin",
    "password": "admin",
    "baseURL": "https://localhost:4502",
    "homePage": "/content/<project appId>/us/en",
    "policyPath": "/conf/<project appId>/settings/wcm/policies/<project appId>/components",
    "componentsContentPath": "/content/core-components-examples/library",
    "pageContentContainerPath": "/jcr:content/root/responsivegrid",
    "componentsContainerType": "core-components-examples/components/demo/component",
    "titleResourceType": "core/wcm/components/title/v2/title"
}
```

### Configuration Parameters

1. `username` - Username for AEM instance
2. `password` - Password for AEM instance
3. `baseURL` - Base url for the AEM instance
4. `homePage` - Home page for the site being developed
5. `policyPath` - The JCR node that contains all component policies
6. `componentsContentPath` - Path to the parent page for all Core Component example content pages
7. `pageContentContainerPath` - Used for parsing the HTML of the Core Component example pages
8. `componentsContainerType` - Component type that contains each example component
9. `titleResourceType` - `acme` uses the Title component text on the example content pages to name each of the stories


## AEM Content

`acme` parses the rendered HTML of the Core Components example pages to generate stories based on those components. `acme` uses the Title component before each example to name each story and looks for the Demo container component to know where each individual component begins and ends. The AEM Core Component examples must be installed on the instance configured in the `baseURL` parameter of the `acme.settings.json` file.

Instructions for installing the AEM Core Components can be found here: [AEM WCM Core Components](https://github.com/adobe/aem-core-wcm-components)

## Command Line Reference
```bash
Usage: acme <command> <options>

Commands:
  acme init [file]  Generate the configuration file
  acme pull         Pull content from AEM
  acme create       Create stories from AEM content

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
```
```bash
acme init [file]

Generate the configuration file

Positionals:
  file  Configuration file path         [string] [default: "acme.settings.json"]

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
```
```bash
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
acme create

Create stories from AEM content

Options:
  --help        Show help                                              [boolean]
  --version     Show version number                                    [boolean]
  --source, -s  Path to downloaded AEM assets   [string] [default: "aem-assets"]
```

## Generated Assets

Running `acme pull` "pulls" generated component markup, referenced images, js and css as well as component policies. This command generates the following directories and files under the destination directory provided by the `--destination` or `-d` option.

1. `components`
   Contains sub-directories for each component which in turn contains html files of each component variation. These files are referenced as templates in the respective stories.

2. `content`
   This directory contains all image resources referenced in the component variations. The path to the resource will be the same as that used in the component markup to ensure proper rendering in Storybook.

3. `policies`
   All component policies are saved here as `json` files. These policies are referenced in the respective component stories to optionally apply any defined style system.

4. `resources`
   This directory contains the `clientlib-base` js and css which includes the AEM Core Component client libraries as well as AEM Grid.

`acme create` generates stories for each component variation under the `components` directory of the source directory defined by `--source` or `-s` option. The source directory would be the same as the destination directory in the `pull` command. The following assets are created:

1. `stories`
   Contains `.stories.js` files for each component. Each file in turn contains individual stories for that component.

2. `.storybook/preview.js`
   This file imports the assets added to the `resources` directory as well as the entry point to the webpack application at `/src/main/webpack/site/main.ts`--this enables storybook to render the components with the default CSS and JavaScript from the AEM Core Components along with your own custom CSS and JavaScript.

## Example Setup

Steps to get up and running with `acme` on a fresh AEM archetype project.

1. From the `ui.frontend` directory run the following commands:
    ```
    npm install @storybook/aem -D
    npm install -D storybook-aem-style-system storybook-addon-xd-designs @hoodoo/acme hygen @babel/preset-typescript
    ```

2. Add a `.storybook` directory inside of `ui.frontend` and add a `main.js` file inside of that. Below is an example `main.js` that will work with the default archetype setup, however you may need to alter this based on your project needs. Check out the Storybook docs for information on [custom webpack configs](https://storybook.js.org/docs/configurations/custom-webpack-config/).
    ```
    const path = require('path');

    module.exports = {
        stories: ['../stories/*.stories.js'],
        addons: [
          'storybook-addon-xd-designs/register',
          'storybook-aem-style-system/register'
        ],
        webpackFinal: async (config, { configType }) => {

          config.module.rules.push({
            test: /\.tsx?$/,
            exclude: [
                /(node_modules)/,
                /stories/
            ],
            use: ['ts-loader', 'webpack-import-glob-loader'],
            include: path.resolve(__dirname, '../'),
          });
          config.module.rules.push({
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader', 'webpack-import-glob-loader'],
            include: path.resolve(__dirname, '../'),
          });

          return config;
        },
    };
    ```

3. Run `acme init` inside the `ui.frontend` directory and follow the prompts to create your `acme.settings.json` file as described in the "Configuration File" section of this document.

4. Inside your `package.json` add the following commands to the `scripts` section

    ```
    "storybook": "start-storybook -s ./storybook-assets -p 9001",
    "acme": "DEBUG=acme:* acme pull --config acme.settings.json -d storybook-assets && DEBUG=acme:* acme create -s storybook-assets"
    ```

5. Ensure the AEM Core Component packages and sample content is installed on the instance specified in your `acme.settings.json`. The sample content installs to this location: `/content/core-components-examples/library`.

With those steps complete you can now run `npm run acme` to pull the component markup from your AEM instance and automatically generate Storybook stories inside your project.

Once `acme` has finished run `npm run storybook`.
