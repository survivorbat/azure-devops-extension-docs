# 🪠 Azure DevOps Extension Documentation generator

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/survivorbat/azure-devops-extension-docs/deploy)
![npm](https://img.shields.io/npm/dt/azure-devops-extension-docs)
![GitHub](https://img.shields.io/github/license/survivorbat/azure-devops-extension-docs)

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

- More fields in output
- Allow user to specify an area in their existing markdown to customize output
- Better error handling
