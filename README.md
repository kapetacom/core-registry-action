# Kapeta Registry Action

Interact with the Kapeta registry

## Inputs

## `action`
**Required** The action to invoke. Typically "push"

## `credentials`
**Required** A valid JWT token - must be base64 encoded. Create a service account in your Kapeta account - and use the JWT token from that. Note that it must be able to write to your registry.

## Example usage

```yaml
uses: kapeta/core-registry-action@v1
with:
  action: 'push'
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
