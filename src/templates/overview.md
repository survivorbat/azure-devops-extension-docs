# {{ extension.name }}

{{#if extension.description}}
{{ extension.description }}

{{/if}}
{{#if extension.helpMarkDown}}
{{ extension.helpMarkDown }}

{{/if}}
{{#if tasks}}
## Tasks

{{#each tasks }}
### {{ this.name }} ({{ this.version.Major }}.{{ this.version.Minor }}.{{ this.version.Patch }})

{{#if this.description}}
{{ this.description }}

{{/if}}
{{#if this.helpMarkDown}}
{{ this.helpMarkDown }}

{{/if}}
{{#if this.inputs}}
#### Inputs

| Name | Input | Help |
| ---- | ----- | ---- |
{{#each this.inputs }}
| {{ this.name }} | {{ inputType this.type this.options }} | {{strip-newlines this.helpMarkDown }}
{{/each}}

{{/if}}
#### Usage

```yaml
# {{ this.description }}
- task: {{ this.name }}@{{ this.version.Major }}
  {{#each this.inputs }}
  # {{ this.label }} {{ this.required }}
  {{ this.name }}: <{{ this.type }}>
  {{/each}}
```

{{/each}}
{{/if}}