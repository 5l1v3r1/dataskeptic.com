import express                   from 'express';
import React                     from 'react';
import axios                     from 'axios';
import xml2js                    from 'xml2js';
import { renderToString }        from 'react-dom/server';
import { RoutingContext, match } from 'react-router';
import createLocation            from 'history/lib/createLocation';
import routes                    from 'routes';
import { Provider }              from 'react-redux';
import * as reducers             from 'reducers';
import promiseMiddleware         from 'lib/promiseMiddleware';
import fetchComponentData        from 'lib/fetchComponentData';
import { createStore,
         combineReducers,
         applyMiddleware }       from 'redux';
import path                      from 'path';
import getEpisodes               from 'daos/episodes';
import getBlogs                  from 'daos/blogs';
import redirects_map             from './redirects';

const app = express();

if (process.env.NODE_ENV !== 'production') {
  require('./webpack.dev').default(app);
}

var title_map = {}
var content_map = {}

var env = "dev"

axios
.get("https://obbec1jy5l.execute-api.us-east-1.amazonaws.com/" + env + "/blogs?env=" + env)
.then(function(result) {
  var blogs = result.data
  for (var i=0; i < blogs.length; i++) {
    var blog = blogs[i]
    var pn = blog['prettyname']
    var title = blog['title']
    title_map[pn] = title
    generate_content_map(blog)
  }
  console.log("Loaded all blogs into content_map")
})
.catch((err) => {
  console.log("bblogs error")
  console.log(err)
})

function generate_content_map(blog) {
  var pn = blog['prettyname']
  var envv = env + "."
  if (env == "prod") {
    envv = ""
  }
  var key = blog["rendered"]
  var pn = blog["prettyname"]
  var uri = "https://s3.amazonaws.com/" + envv + 'dataskeptic.com/' + key
  axios.get(uri).then(function(result) {
    var content = result.data
    content_map[pn] = content
  })
  .catch((err) => {
    console.log("content cache error")
    console.log(err)
  })
}

global.title_map = title_map
global.content_map = content_map

app.use(express.static(path.join(__dirname, 'public')));

app.use( (req, res) => {
  var redir = redirects_map['redirects_map'][req.url]
  var hostname = req.headers.host
  if (redir != undefined) {
    console.log("Redirecting to " + hostname + redir)
    return res.redirect(301, 'http://' + hostname + redir)
  }
  if (req.url == '/feed.rss') {
    return res.redirect(307, 'http://dataskeptic.libsyn.com/rss')
  }

  const location = createLocation(req.url);
  const reducer  = combineReducers(reducers);
  const store    = applyMiddleware(promiseMiddleware)(createStore)(reducer);

  const initialState = store.getState()
  var oepisodes = initialState.episodes.toJS()
  var oblogs = initialState.blogs.toJS()
  var osite = initialState.site.toJS()

  match({ routes, location }, (err, redirectLocation, renderProps) => {
    if(err) {
      console.error(err);
      return res.status(500).end('Internal server error');
    }

    if(!renderProps) {
      return res.status(404).end('<html><body><h1>Not found</h1></body></html>');
    }

    function renderView() {
      const InitialView = (
        <Provider store={store}>
          <RoutingContext {...renderProps} />
        </Provider>
      );

      var title = osite.title + ":"+location.pathname
      var pathname = location.pathname.substring('/blog'.length, location.pathname.length)
      var alt_title = title_map[pathname]
      if (alt_title != undefined) {
        title = alt_title
      }
      console.log("title: " + title)

      const componentHTML = renderToString(InitialView);
      var content = content_map[pathname]
      if (content == undefined) {
        content = ""
      }

      const HTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="apple-touch-icon" sizes="57x57" href="/favicon/apple-icon-57x57.png" />
          <link rel="apple-touch-icon" sizes="60x60" href="/favicon/apple-icon-60x60.png" />
          <link rel="apple-touch-icon" sizes="72x72" href="/favicon/apple-icon-72x72.png" />
          <link rel="apple-touch-icon" sizes="76x76" href="/favicon/apple-icon-76x76.png" />
          <link rel="apple-touch-icon" sizes="114x114" href="/favicon/apple-icon-114x114.png" />
          <link rel="apple-touch-icon" sizes="120x120" href="/favicon/apple-icon-120x120.png" />
          <link rel="apple-touch-icon" sizes="144x144" href="/favicon/apple-icon-144x144.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/favicon/apple-icon-152x152.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-icon-180x180.png" />
          <link rel="icon" type="image/png" sizes="192x192"  href="/favicon/android-icon-192x192.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
          <link rel="manifest" href="/favicon/manifest.json" />
          <title>${title}</title>
          <link href="https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/cosmo/bootstrap.min.css" type="text/css" rel="stylesheet"/>
            <link rel="stylesheet" type="text/css" href="/css/style.css">
          <script>
            window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
          </script>
        </head>
        <body>
          <div id="react-view">${componentHTML}</div>
          <div id="content-view">${content}</div>
          <script type="application/javascript" src="/bundle.js"></script>
          <script type="text/javascript" src="https://js.stripe.com/v2/"></script>
           <script type="text/javascript" 
                src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
        </body>
      </html>
      `;

      return HTML;
    }

    fetchComponentData(store.dispatch, renderProps.components, renderProps.params)
      .then(renderView)
      .then(html => res.status(200).end(html))
      .catch(err => res.end(err.message));
  });
});

export default app;