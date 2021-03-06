
const {Plugin: Embed} = require('remarkable-embed');

// Our custom remarkable plugin factory.
const createVariableInjectionPlugin = variables => {
  // `let` binding used to initialize the `Embed` plugin only once for efficiency.
  // See `if` statement below.
  let initializedPlugin;

  const embed = new Embed();
  embed.register({
    // Call the render method to process the corresponding variable with
    // the passed Remarkable instance.
    // -> the Markdown markup in the variable will be converted to HTML.
    inject: (key) => {
      keyparts = key.split(":");
      // javadoc:<name>:<url_path>
      if (keyparts[0] == 'javadoc') {
          return renderUrl(initializedPlugin, javadocUrl, keyparts);
      // githubUrl:<name>:<path>
      } else if (keyparts[0] == 'github') {
          return renderUrl(initializedPlugin, githubUrl + "/tree/master/", keyparts);
      // rest api: rest:<name>:<path>
      } else if (keyparts[0] == 'rest') {
          return renderUrl(initializedPlugin, restApiUrl + "#", keyparts);
      } else if (keyparts[0] == 'functions') {
          return renderUrl(initializedPlugin, functionsApiUrl + "#", keyparts);
      } else if (keyparts[0] == 'source') {
          return renderUrl(initializedPlugin, sourceApiUrl + "#", keyparts);
      } else if (keyparts[0] == 'sink') {
          return renderUrl(initializedPlugin, sinkApiUrl + "#", keyparts);
      } else {
        keyparts = key.split("|");
        // endpoint api: endpoint|<op>
        if (keyparts[0] == 'endpoint') {
            return renderEndpoint(initializedPlugin, restApiUrl + "#", keyparts);
        }
      }
      return initializedPlugin.render(variables[key])
    }
  });

  return (md, options) => {
    if (!initializedPlugin) {
      initializedPlugin = {
        render: md.render.bind(md),
        hook: embed.hook(md, options)
      };
    }

    return initializedPlugin.hook;
  };
};

const renderUrl = (initializedPlugin, baseUrl, keyparts) => {
    content = '[' + keyparts[1] + '](' + baseUrl + keyparts[2] + ')';
    rendered_content = initializedPlugin.render(content);
    rendered_content = rendered_content.replace('<p>', '');
    rendered_content = rendered_content.replace('</p>', '');
    return rendered_content;
};

const renderEndpoint = (initializedPlugin, baseUrl, keyparts) => {
    content = '[<b>' + keyparts[1] + '</b> <i>' + keyparts[2] + '</i>](' + baseUrl + keyparts[3] + ')';
    rendered_content = initializedPlugin.render(content);
    rendered_content = rendered_content.replace('<p>', '');
    rendered_content = rendered_content.replace('</p>', '');
    return rendered_content;
};

const url = 'https://pulsar.incubator.apache.org';
const javadocUrl = url + '/api';
const restApiUrl = url + '/en' + "/admin-rest-api";
const functionsApiUrl = url + '/en' + "/functions-rest-api";
const sourceApiUrl = url + '/en' + "/source-rest-api";
const sinkApiUrl = url + '/en' + "/sink-rest-api";
const githubUrl = 'https://github.com/apache/incubator-pulsar';
const baseUrl = '/';

const siteVariables = {
};

const siteConfig = {
  title: 'Apache Pulsar' /* title for your website */,
  disableTitleTagline: true,
  tagline: '',
  url: url /* your website url */,
  baseUrl: baseUrl /* base url for your project */,
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  editUrl: `${githubUrl}/edit/master/site2/docs/`,

  // Used for publishing and more
  projectName: 'pulsar',
  organizationName: 'apache',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    {doc: 'standalone', label: 'Docs'},
    {page: 'download', label: 'Download'},
    {doc: 'client-libraries', label: 'Clients'},
    {href: '#restapis', label: 'REST APIs'},
    {blog: true, label: 'Blog'},
    {href: '#community', label: 'Community'},
    {href: '#apache', label: 'Apache'},
    // Determines search bar position among links
    //{ search: true },
    // Determines language drop down position among links
    { languages: true }
  ],

  // If you have users set above, you add it here:
  users: [],

  /* path to images for header/footer */
  headerIcon: 'img/pulsar.svg',
  footerIcon: 'img/pulsar.svg',
  favicon: 'img/pulsar.ico',
  algolia: {
    apiKey: 'd226a455cecdd4bc18a554c1b47e5b52',
    indexName: 'apache_pulsar',
    algoliaOptions: {
      facetFilters: ['language:LANGUAGE', 'version:VERSION'],
    },
  },
  gaTrackingId: 'UA-102219959-1',

  /* colors for website */
  colors: {
    primaryColor: '#188fff',
    secondaryColor: '#205C3B',
  },
  translationRecruitingLink: 'https://crowdin.com/project/apache-pulsar',
  // This copyright info is used in /core/Footer.js and blog rss/atom feeds.
  copyright:
    'Copyright ?? ' +
    new Date().getFullYear() +
    ' The Apache Software Foundation. All Rights Reserved.' +
    ' Apache, Apache Pulsar and the Apache feather logo are trademarks of The Apache Software Foundation.',

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: 'atom-one-dark',
  },

  // Add custom scripts here that would be placed in <script> tags
  scripts: [
    'https://buttons.github.io/buttons.js',
    'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js',
    `${baseUrl}js/custom.js`
  ],
  stylesheets: [
    `${baseUrl}css/code-blocks-buttons.css`
  ],

  /* On page navigation for the current documentation page */
  onPageNav: 'separate',

  /* Open Graph and Twitter card images */
  //ogImage: 'img/docusaurus.png',
  twitter: true,
  twitterUsername: 'apache_pulsar',
  twitterImage: 'img/pulsar.svg',

  disableHeaderTitle: true,

  cleanUrl: true,
  //scrollToTop: true,
  scrollToTopOptions: {
    zIndex: 100,
  },

  githubUrl: githubUrl,

  projectDescription: `
    Apache Pulsar is an open-source distributed pub-sub messaging system originally
    created at Yahoo and now part of the Apache Software Foundation
  `,

  markdownPlugins: [
    createVariableInjectionPlugin(siteVariables)
  ],
};

module.exports = siteConfig;
