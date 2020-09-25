<p align="center"><a href="https://cube.dev"><img src="https://i.imgur.com/zYHXm4o.png" alt="Cube.js" width="300px"></a></p>

[Website](https://cube.dev) • [Docs](https://cube.dev/docs) • [Examples](#examples) • [Blog](https://cube.dev/blog) • [Slack](https://slack.cube.dev) • [Twitter](https://twitter.com/thecubejs)

# Cube.js Playground Templates

This repository contains the templates used by the Cube.js Playground to scaffold various Dashboard Apps.

## Contributing

You can contribute to this repository by creating new templates or extending the existing ones.

### Structure overview

To better understand the structure, you can look at the `manifest.json` file containing the information about templates and packages. It also describes the way these components interact with each other.

### Packages

Each package contains the information on where it can be installed to (`installsTo`) and what it can receive (`receives`).

For example, a root package may look like this:

```json
{
  "name": "create-react-app",
  "version": "0.0.1",
  "installsTo": null,
  "receives": {
    "react-ui-framework": "0.0.1"
  }
}
```

The `installsTo` and `receives` fields represent interfaces. That means that the concrete package implementation (e.g., `create-react-app`) can receive any package that can be installed to the `react-ui-framework` interface.

For example:

```json
{
  "name": "react-antd-dynamic",
  "version": "0.0.1",
  "installsTo": {
    "react-ui-framework": "0.0.1"
  },
  "receives": {}
}
```

### Templates

Each template contains the comprehensive information required for template installation. The following fields `name`, `description` and `coverUrl` will be used to display the template in the Cube.js Playground on the [Dashboard App](https://cube.dev/docs/dashboard-app) page.

The `templatePackages` field describes all the packages the template consists of. During template installation, all packages defined in `templatePackages` will be downloaded and resolved accordingly.

```json
{
  "name": "Dynamic Dashboard with React, AntD, and Recharts",
  "description": "Use this template to create a dynamic dashboard application with React, AntD, and Chart.js. It comes with a dynamic query builder and Apollo GraphQL client. Use it when you want to allow users to edit dashboards.",
  "coverUrl": "https://cube.dev/downloads/template-react-dashboard.png",
  "templatePackages": [
    "create-react-app",
    "react-antd-dynamic",
    "react-credentials",
    "recharts-charts",
    "antd-tables"
  ],
  "version": "0.0.1"
}
```
