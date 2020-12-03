const traverse = require('@babel/traverse').default;
const SourceSnippet = require('./SourceSnippet');

class QueryRendererSnippet extends SourceSnippet {
  mergeTo(targetSource) {
    super.mergeTo(targetSource);

    const methods = [];
    const properties = [];

    traverse(this.ast, {
      ClassDeclaration(path) {
        // if (path.get('id').node.name === 'QueryRendererComponent') {
        traverse(
          path.node,
          {
            ClassMethod(path) {
              methods.push(path);
            },
            ClassProperty(path) {
              properties.push(path);
            },
          },
          path.scope,
          path.state,
          path.parentPath
        );
        // }
      },
    });

    traverse(targetSource.ast, {
      ClassDeclaration(path) {
        // if (path.get('id').node.name === 'QueryRendererComponent') {
        properties.concat(methods).forEach(({ node }) => {
          path.get('body').unshiftContainer('body', node);
        });
        // }
      },
    });
  }
}

module.exports = QueryRendererSnippet;
