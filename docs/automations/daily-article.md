# Daily AutomateMeJay article

## Ownership and schedule

- Runtime: GitHub Actions; Codex does not need to be open.
- Repository: `Jason-Simp/sirotin-consulting`.
- Schedule: daily at 7:30 AM in `America/New_York`, including daylight-saving changes.
- Deployment: a successful scoped commit to `main` triggers the existing Render deployment for `sirotin-consulting`.
- Credential: repository secret `OPENROUTER_API_KEY`; never store it in source, artifacts, or logs.
- Cutover switch: repository variable `DAILY_ARTICLE_ENABLED`; scheduled runs remain skipped until it is exactly `true`.
- Primary model: `google/gemini-3.7-flash`.
- Fallback model: `qwen/qwen3.7-plus` only when the primary model cannot serve the request.

## Gates

The workflow stops without publishing unless all of these pass:

1. The automation harness tests pass.
2. The dependency audit, lint, typecheck, and production build pass.
3. OpenRouter returns schema-conforming article data grounded with web research.
4. The topic is not a slug or near-topic duplicate.
5. The article has 1,200-3,200 words, an approved existing image, and four or more reachable HTTPS sources.
6. Only `src/lib/blog.ts` changed.
7. The commit reaches `main` and the public article, canonical URL, title, and sitemap entry are live.

The workflow does not print the API key or full prompt. Its run summary contains only the title, slug, selected model, word count, and dry-run state.

## Failure alerts

GitHub retains the complete workflow log. On failure, the workflow creates or updates an open GitHub issue titled `Daily AutomateMeJay article failed` with a link to the failed run. GitHub notification settings should route Actions and issue notifications to the responsible operator.

## Controlled test and cutover

1. Add the scoped OpenRouter key as the encrypted repository secret `OPENROUTER_API_KEY`.
2. Run **Daily AutomateMeJay article** manually with **dry_run = true**.
3. Confirm the run completed, the run summary is sane, the worktree remained unchanged, and no secret appeared in logs.
4. Run manually with **dry_run = false** when a controlled live publication is approved.
5. Confirm the public article and sitemap verification step passed.
6. Set repository variable `DAILY_ARTICLE_ENABLED` to `true`.
7. Only then disable the Codex automation `daily-automatemejay-article`.

## Recovery

1. Open the failure issue and linked workflow run; identify the first failing gate.
2. If authentication or budget failed, rotate or fund only the dedicated OpenRouter key and update the encrypted GitHub secret.
3. If the model output failed validation, keep the site unchanged. Adjust the prompt/schema or model list in a reviewed code change.
4. If source or build verification failed, repair the source or repository test first; do not bypass a gate.
5. If the commit succeeded but Render verification timed out, inspect the existing `sirotin-consulting` Render deploy. Do not republish the same date unless the live slug is absent.
6. Rerun manually with **dry_run = true**. Publish only after that recovery run succeeds.
