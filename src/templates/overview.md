{{#if extension.name }}# {{ extension.name }} {{#if extension.version }}({{ extension.version }}){{/if}}

{{/if}}
{{#if extension.icons.default }}
![{{ extension.icons.default }}]({{ extension.icons.default }})

{{/if}}
{{#if extension.description}}
{{ extension.description }}

{{/if}}
{{#if extension.helpMarkDown}}
{{ extension.helpMarkDown }}

{{/if}}
{{#if tasks}}

## Tasks

{{#each tasks }}

### {{ this.name }} {{#if this.version }}({{ this.version.Major }}.{{ this.version.Minor }}.{{ this.version.Patch }}){{/if}}

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
  # {{ this.label }} {{#if this.required}}(required){{/if}}
  {{ this.name }}: <{{ this.type }}>
  {{/each}}
```

{{/each}}
{{/if}}
{{#if extension.links }}

## Links

{{#each extension.links }}

- [**{{capitalize @key }}**]({{ this.uri }})
  {{/each}}

{{/if}}
{{#if extension.publisher }}

---

_Published by {{ extension.publisher }}_
{{/if}}
