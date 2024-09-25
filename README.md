# partner-sdk
This repository holds all libs for partner use.

### Local Quote

This SDK allows partners to quote for their customers without reaching RemessaOnline SaaS.

[Documentation](./src/local-quote/README.md)


# How publish a tag

1. Make your changes
2. Bump project version
3. Merge your branch on Main
4. Generate a Tag
5. Access https://ci.beetech.global/job/npm-publish/build?delay=0sec
6. Fill with REPO_TO_PUBLISH: partner-sdk and NODE_VERSION: `version in .nvmrc`