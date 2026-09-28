# contributors/

One JSON file per person. **Add your own file — never edit anyone else's, and
never edit `index.json`.**

## Adding yourself

```bash
cp contributors/_TEMPLATE.json contributors/your-username.json
# edit it
python3 -m json.tool contributors/your-username.json   # check it is valid
git add contributors/your-username.json
git commit -m "feat: add your-username to the contributor wall"
```

## The fields

| Field | Required | Notes |
|---|---|---|
| `github` | **yes** | Your GitHub username, lowercase. Must match the filename |
| `name` | no | How you want to be shown. Defaults to your handle |
| `quote` | no | Under 100 characters, or the card overflows |
| `interests` | no | Up to 4 short tags. Only the first 4 are shown |
| `first_contribution` | no | `YYYY-MM-DD` |

## Rules

- **One file per person**, named `<your-github-username>.json`
- **Do not touch `index.json`** — a GitHub Action regenerates it on every merge
- **Do not edit someone else's file**
- Keep it appropriate. The Code of Conduct applies here like anywhere else

## Why separate files?

So eighty people can add themselves during a two-hour event without a single
merge conflict. If we all shared one list, everyone after the first would have
to resolve a conflict before merging.
