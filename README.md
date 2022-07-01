# 🪠 Azure DevOps Extension Documentation generator

_Also known as **azedoc**_

Markdown generator for the documentation of Azure DevOps Pipeline extensions.
We use the `vss-extension.json` together with any `task.json` files to generate
a overview of the extension from a template.

## ⬇️ Installation

`npm i -g azure-devops-extension-docs`

## 📋 Usage

There's currently only one command with one option.

`azedoc generate . --output=my-docs.md`

## 🪧 Examples

Check out [the examples](./examples) to see how the markdown is generated.

## 🔭 Plans

- Perhaps switch to a different templating engine, twig makes whitespace hard to deal with
- Add file, links and other relevant information for the extension
- Allow user to specify an area in their existing markdown to customize output
