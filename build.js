// Copyright (C) 2023 Alvaro Ramirez https://xenodium.com
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.

const fs = require('fs');
const https = require('https');
const jsCode = fs.readFileSync('./dist/bundle.js', 'utf8');
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>emacs.tv</title>
  <link rel="alternate" type="application/rss+xml" title="feed" href="/videos.rss">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta property="og:type" content="website">
  <meta property="og:title" content="emacs.tv">
  <meta property="og:description" content="An index of Emacs-related videos">
  <meta property="og:url" content="https://emacs.tv">
  <style>
    body {
      padding: 5px;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #ffffff;
      margin: 0 auto;
      max-width: 70ch;
    }
    p {
      margin: 0;
    }
    .item {
      margin-bottom: 1em;
      line-height: 1.5em;
    }
    .tag {
      color: #2A9D8F;
      cursor: pointer;
    }
    #search-box {
      width: 200px;
      margin-bottom: 10px;
      padding-top: 4px;
      padding-bottom: 4px;
    }
    #search-button {
      margin-left: 5px;
      padding-top: 4px;
      padding-bottom: 4px;
    }
    #filter-speakers {
      width: 150px;
      margin-bottom: 10px;
      padding-top: 4px;
      padding-bottom: 4px;
    }
    #filter {
      width: 150px;
      margin-bottom: 10px;
      padding-top: 4px;
      padding-bottom: 4px;
    }
    #random-pick-heading {
      display: flex;
      justify-content: space-between;
      cursor: pointer;
    }
    #header {
      display: flex;
      justify-content: space-between; align-items: baseline;
    }
    #die {
      cursor: pointer;
    }
    .video-container {
      position: relative;
      width: 100%;
      padding-top: 56.25%; /* 16:9 Aspect Ratio (9/16 = 0.5625) */
    }
    .video-container iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .dismissible {
      padding: 0.3em 0.6em;
      border: 0.5px solid #777;
      border-radius: 5px;
      font-size: 0.8em;
      margin: 0 0.2em;
      cursor: pointer;
    }
    .x {
      color: #777;
    }
    .date {
      color: #777;
      font-size: 0.8em;
    }
    .by {
      color: #777;
      font-size: 0.8em;
    }
    .speaker {
      color: #777;
      font-size: 0.8em;
      cursor: pointer;
    }
    a, a:visited {
      text-decoration: none;
      color: #4183C4;
    }
    video {
      width: 100%;
      display: block;
      margin: 0 auto;
    }
    .video--caption {
      padding-top: 10px;
      padding-bottom: 10px;
    }
    @media (prefers-color-scheme: dark) {
      body, div, p, h3 {
        background-color: #121212;
        color: #E0E0E0;
      }
      .tag {
        color: #80CBC4;
      }
      .dismissible {
        color: #E0E0E0;
      }
      .x {
        color: #E0E0E0;
      }
      a, a:visited {
        color: #9DDFFA;
      }
      select {
        color: #E0E0E0;
        background-color: #121212;
        border: 1px solid #555;
      }
      option {
        background-color: #121212;
        color: #E0E0E0;
      }
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    document.addEventListener('DOMContentLoaded', async function () {
      store = app.makeStore();

      const url = new URL(window.location.href);
      store.state.mutate(state => {
        state.filterByTitle = url.searchParams.get('title') || '';
        const tagsParam = url.searchParams.get('tags');
        state.filterByTags = tagsParam ? tagsParam.split(',') : [];
        const speakersParam = url.searchParams.get('speakers');
        state.filterBySpeakers = speakersParam ? speakersParam.split(',') : [];
        return state;
      });

      store.state.subscribe((state) => {
        const root = document.getElementById("root");
        if (!root) {
          return;
        }

        const url = new URL(window.location.href);
        if (state.filterByTitle){
          url.searchParams.set('title', state.filterByTitle);
        } else {
          url.searchParams.delete('title');
        }

        if (state.filterByTags.length > 0) {
          url.searchParams.set('tags', state.filterByTags.join(','));
        } else {
          url.searchParams.delete('tags');
        }

        history.replaceState(null, '', url.toString());

        if (state.filterByTitle){
          url.searchParams.set('title', state.filterByTitle);
        } else {
          url.searchParams.delete('title');
        }

        if (state.filterBySpeakers && state.filterBySpeakers.length > 0) {
          url.searchParams.set('speakers', state.filterBySpeakers.join(','));
        } else {
          url.searchParams.delete('speakers');
        }

        history.replaceState(null, '', url.toString());

        const { html, handlers } = app.render(state, store);
        root.innerHTML = html;

        handlers.forEach(({ nodeId, listenerName, handler }) => {
          const element = document.getElementById(nodeId);
          if (element) {
            element.addEventListener(listenerName, handler);
          }
        });
      });
     store.load();
    });
    ${jsCode}
  </script>
</body>
</html>
`.trim();

fs.writeFileSync('./index.html', htmlContent, 'utf8');
