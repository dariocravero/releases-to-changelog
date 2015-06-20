import fetch from 'node-fetch';
import moment from 'moment';

function baseUri(org, repo) { return `https://api.github.com/repos/${org}/${repo}` }
function releases(org, repo) { return `${baseUri(org, repo)}/releases` }

const ORG = 'gaearon';
const REPO = 'redux';

fetch(releases(ORG, REPO))
  .then(response => response.json())
  .then(parseReleases)
  .then(console.log.bind(console));

function parseReleases(list) {
  return compileChangelog(list.map(parseRelease).reduce(buildChangelog, {changes: '', links: ''}));
}

function parseRelease({body, created_at, tag_name}) {
  const version = formatVersion(tag_name);
  const changes = `## [${version}] - ${formatDate(created_at)}\n### Added\n${body}`;
  const link = `[${version}]: https://github.com/olivierlacan/keep-a-changelog/compare/TODO-PREVIOUS-TAG...${tag_name}`;

  return {
    changes,
    link
  };
}

function formatDate(raw) {
  return moment(raw).format('YYYY/MM/DD');
}
function formatVersion(raw) {
  return raw.replace('v', '');
}

function buildChangelog(result, release) {
  return {
    changes: `${result.changes}\n\n${release.changes}`,
    links: `${result.links}\n${release.link}`
  };
}

function compileChangelog({changes, links}) {
  return `${changes}\n\n${links}`;
}
