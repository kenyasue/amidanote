var visit = require('unist-util-visit')
var is = require('unist-util-is');
import utils from "../util";

function plugin(options) {
    const accessTokenKey = "__TOKEN__";
    const accessToken = options.accessToken;
    
    
    function transformer(tree) {

        visit(tree, 'link', (node) => {

            if (node.url) {

                if(accessToken)
                    node.url = node.url.replace(accessTokenKey, utils.sha1(accessToken));
                else
                    node.url = node.url.replace(`?token=${accessTokenKey}`, "");
            }
        });

        visit(tree, 'image', (node) => {

            if (node.url) {
                if(accessToken)
                    node.url = node.url.replace(accessTokenKey, utils.sha1(accessToken));
                else
                    node.url = node.url.replace(`?token=${accessTokenKey}`, "");

            }

        });

    }

    return transformer;
}

export default plugin;
