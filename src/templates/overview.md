# {{ extension.name }}

{{#if extension.description}}
{{ extension.description }}
{{/if}}

{{#if extension.helpMarkDown}}
{{ extension.helpMarkDown }}
{{/if}}

## Tasks

{{#each tasks }}

### {{ this.name }} ({{ this.version.Major }}.{{ this.version.Minor }}.{{ this.version.Patch }})

{{ this.description }}

{{ this.helpMarkDown }}

#### Inputs

| Name | Input | Help |
| ---- | ----- | ---- |


{{#each this.inputs }}
| {{ this.name }} | {{ inputType this.type this.options }} | {{strip-newlines this.helpMarkDown }}
{{/each}}

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
