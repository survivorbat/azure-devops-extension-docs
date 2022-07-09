# Some other extension

Hey there! These are the tasks:

[//]: # (azure-devops-extension-docs-embed-start)
## Tasks


### MyTask (5.1.0)

My task creates amazing objects in Azure DevOps

Use this task if you want to create something


#### Inputs

| Name | Input | Help |
| ---- | ----- | ---- |
| name | string | This should be the name of the thing you&#x27;re going to create
| publishOrPreview | preview, publish | If not specified, things will be created but not published
| dryRun | boolean | If set to true, the task will not create/delete and only pretend to do so. Allows you to see what&#x27;d happen if you used the task.


#### Usage

```yaml
# My task creates amazing objects in Azure DevOps
- task: MyTask@5
  # Name of the thing (required)
  name: <string>
  # Publish or Preview (required)
  publishOrPreview: <radio>
  # Dry Run 
  dryRun: <boolean>
```


### TestTask (1.0.0)

This task performs tests

Should be used along side the other one


#### Inputs

| Name | Input | Help |
| ---- | ----- | ---- |
| name | string | This should be the name of the thing you&#x27;re going to create


#### Usage

```yaml
# This task performs tests
- task: TestTask@1
  # Name of the thing (required)
  name: <string>
```

[//]: # (azure-devops-extension-docs-embed-end)

Very cool!
