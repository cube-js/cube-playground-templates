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

### Development & Testing

In production, the `manifest.json` file, along with all the packages, are fetched from the [https://github.com/cube-js/cubejs-playground-templates]() master branch.

You can avoid this behavior and make the `server` "fetch" those packages from a local folder. To do so, go through the next steps:

1. run the server using the `TEST_TEMPLATES` env variable

```bash
TEST_TEMPLATES=true yarn start
```

2. create a `.tmp` folder, where the `cubejs-playground-templates` will be stored

```bash
mkdir /Users/username/Projects/cubejs-app/node_modules/.tmp
```

3. create a symlink to the local repository

```bash
ln -s /Users/username/Projects/cubejs-playground-templates /Users/username/Projects/cubejs-app/node_modules/.tmp/cubejs-playground-templates
```

Now, when you open the templates gallery in the Playground (by default at [http://localhost:4000/#/template-gallery]()), you'll see the templates you're developing locally.
