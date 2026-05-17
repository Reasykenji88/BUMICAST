#!/usr/bin/env node
/**
 * BumiCast — GitHub → Notion sync script
 * Triggered by the workflow in .github/workflows/notion-sync.yml
 *
 * Behaviour:
 *  - On issues/PR events: upserts (creates or updates) the matching row in the
 *    Notion "GitHub Issues" database, keyed by Issue Number.
 *  - On workflow_dispatch with backfill=true: walks every open issue and PR in
 *    the repo and upserts each one. Run this once after you wire up secrets.
 */

const { Client } = require('@notionhq/client');
const fs = require('fs');

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DB_ID = process.env.NOTION_DB_ID;
const REPO         = process.env.GITHUB_REPOSITORY; // e.g. "danny/bumicast"
const GH_TOKEN     = process.env.GITHUB_TOKEN;

if (!NOTION_TOKEN || !NOTION_DB_ID) {
  console.error('❌ NOTION_TOKEN and NOTION_DB_ID secrets must be set.');
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });

// ─── Map GitHub usernames → Notion "Assignee" SELECT options ───────────────
// EDIT THIS once you know each team member's GitHub handle.
// Anyone not in the map will be set to "Unassigned".
const USER_MAP = {
  // 'github-handle': 'Notion Name',
  // 'dannyariff':    'Danny',
  // 'carol-uthm':    'Carol',
  // 'dania-uthm':    'Dania',
  // 'aisyah-uthm':   'Aisyah',
  // 'naz-uthm':      'Naz',
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function mapAssignee(issue) {
  if (!issue.assignees || issue.assignees.length === 0) return 'Unassigned';
  const handle = issue.assignees[0].login.toLowerCase();
  return USER_MAP[handle] || 'Unassigned';
}

function mapState(issue, isPR) {
  if (issue.state === 'open') return 'Open';
  if (isPR && issue.merged) return 'Merged';
  return 'Closed';
}

function buildProperties(issue, isPR) {
  const props = {
    'Issue Title':  { title:     [{ text: { content: issue.title.slice(0, 1900) } }] },
    'Issue Number': { number:    issue.number },
    'State':        { select:    { name: mapState(issue, isPR) } },
    'Repository':   { rich_text: [{ text: { content: REPO } }] },
    'Assignee':     { select:    { name: mapAssignee(issue) } },
    'Created Date': { date:      { start: issue.created_at.slice(0, 10) } },
    'Issue URL':    { url:       issue.html_url },
    'Type':         { select:    { name: isPR ? 'Pull Request' : 'Issue' } },
  };

  if (issue.closed_at) {
    props['Closed Date'] = { date: { start: issue.closed_at.slice(0, 10) } };
  }

  if (issue.labels && issue.labels.length > 0) {
    props['Labels'] = {
      multi_select: issue.labels.map(l => ({
        name: (typeof l === 'string' ? l : l.name).slice(0, 100),
      })),
    };
  }

  return props;
}

async function findExisting(issueNumber) {
  const res = await notion.databases.query({
    database_id: NOTION_DB_ID,
    filter: { property: 'Issue Number', number: { equals: issueNumber } },
    page_size: 1,
  });
  return res.results[0] || null;
}

async function upsert(issue, isPR) {
  const properties = buildProperties(issue, isPR);
  const existing = await findExisting(issue.number);

  if (existing) {
    await notion.pages.update({ page_id: existing.id, properties });
    console.log(`↻ Updated #${issue.number}: ${issue.title}`);
  } else {
    await notion.pages.create({
      parent: { database_id: NOTION_DB_ID },
      properties,
    });
    console.log(`✚ Created #${issue.number}: ${issue.title}`);
  }
}

// ─── Backfill mode (manual trigger) ────────────────────────────────────────

async function backfill() {
  console.log(`🔄 Backfilling open issues & PRs from ${REPO}…`);
  const headers = {
    Authorization: `Bearer ${GH_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  for (let page = 1; page < 20; page++) {
    const url = `https://api.github.com/repos/${REPO}/issues?state=all&per_page=100&page=${page}`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
    const items = await res.json();
    if (items.length === 0) break;

    for (const item of items) {
      await upsert(item, !!item.pull_request);
    }
  }
  console.log('✅ Backfill complete.');
}

// ─── Event-driven mode ─────────────────────────────────────────────────────

async function handleEvent() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) throw new Error('GITHUB_EVENT_PATH not set');

  const event = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
  const eventName = process.env.GITHUB_EVENT_NAME;

  if (eventName === 'issues') {
    await upsert(event.issue, false);
  } else if (eventName === 'pull_request') {
    // PRs come on event.pull_request but lack the unified `labels`/`assignees`
    // shape used by the issues endpoint — normalise.
    const pr = event.pull_request;
    pr.labels    = pr.labels    || [];
    pr.assignees = pr.assignees || [];
    await upsert(pr, true);
  } else if (eventName === 'workflow_dispatch') {
    if (process.env.BACKFILL === 'true') await backfill();
    else console.log('ℹ️  Dispatched without backfill=true — nothing to do.');
  } else {
    console.log(`ℹ️  Ignoring event: ${eventName}`);
  }
}

handleEvent().catch(err => {
  console.error('💥 Sync failed:', err);
  process.exit(1);
});
