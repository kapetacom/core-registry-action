# core-regsitry-action

Interact with the Kapeta registry

## Inputs

## `action`

**Required** The action to invoke

## Example usage

```yaml
uses: kapeta/core-registry-action@v1
with:
  action: 'push'
```

### Requirements

In order for some of the actions to work we need the full history of the repository, so
please checkout eveything using
```
    - uses: actions/checkout@v3
      with:
        fetch-depth: 0
``` 
