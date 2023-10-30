# Kapeta Github Action

Helper action for performing CI/CD actions on Kapeta repositories

## Inputs

### `credentials`
**Required** A valid JWT token - must be base64 encoded. 
Create a service account in your Kapeta account - and use the JWT token from that. 
Note that it must be allowed to read and write to your registry.

### `action`
**Required** The action to invoke

_Possible actions are:_
- `publish` - Publish the current version of the package to the registry
- `validate` - Validate the kapeta.yml

## Example usage

```yaml
uses: kapetacom/core-registry-action@v3
with:
  action: publish
  credentials: ${{ secrets.BASE64_ENCODED_KAPETA_JWT_TOKEN }}
```

### Requirements

In order for some of the actions to work we need the full history of the repository, so
please checkout eveything using. This is needed for conventional commits and version calculations.
```
    - uses: actions/checkout@v3
      with:
        fetch-depth: 0
``` 
