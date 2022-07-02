# 🪠 Azure DevOps Extension Documentation generator

_Also known as **azedoc**_

Markdown generator for the documentation of Azure DevOps Pipeline extensions.
We use the `vss-extension.json` together with any `task.json` files to generate
a overview of the extension from a template.

## ⬇️ Installation

`npm i -g azure-devops-extension-docs`

## 📋 Usage

### azedoc generate \<extension-directory>

Generates a markdown file using the vss-extension.json and task.json files.

#### Options

- `--output`: Allows you to specify the output file
- `--template`: Allows you to specify a custom handlebars template to use

## 🪧 Examples

Check out [the examples](./examples) to see how the markdown is generated.

## 🔭 Plans

- Add file, links and other relevant information for the extension
- Allow user to specify an area in their existing markdown to customize output
- Expand template to include more info
- Better error handling
