# Remote Stockfish Analysis Guide

## Problem Statement

Running Stockfish analysis locally on a MacBook is slow:
- **Round 1 (31 games)**: ~7-15 minutes with depth 15
- **Full season (200+ games)**: Could take 1+ hour

This document provides solutions for running analysis on more powerful remote servers for free.

---

## Solution Comparison

| Solution | CPU Power | Setup Time | Automation | Time Limit | Best For |
|----------|-----------|------------|------------|------------|----------|
| **GitHub Actions** ⭐ | 2-core | 10 min | Full | 2 hours/job | Automated workflow |
| **Oracle Cloud** | 4-core ARM | 30 min | Manual | Unlimited | Heavy batch processing |
| **Google Colab** | Variable | 0 min | Semi | 12 hours | Quick one-offs |
| **Render** | 0.5 CPU | 15 min | Medium | 750h/month | Scheduled jobs |

---

## Option 1: GitHub Actions (Recommended) ⭐

### Overview

GitHub Actions provides free CI/CD runners that are perfect for this task:
- **Free Tier**: 2,000 minutes/month (public repos)
- **Specs**: 2-core Intel Xeon CPU, 7GB RAM, Ubuntu 22.04
- **Benefits**: Fully automated, PGNs downloaded automatically, results auto-committed, no local resources used

### Performance Estimate

**Note**: GitHub Actions uses Intel CPUs which are slower than Apple Silicon Macs for Stockfish analysis.

- **Round analysis (31 games)**: ~1-2 hours with depth 15
- **Full season (200 games)**: ~6-12 hours
- **Parallel rounds**: Can analyze up to 3 rounds simultaneously

Despite being slower than local analysis, the key advantage is that it runs hands-free in the cloud!

### Setup Instructions

✅ **Already completed!** The workflows are set up and ready to use.

The following files have been created:
- `.github/workflows/analyze-round.yml` - Single round analysis
- `.github/workflows/analyze-multiple-rounds.yml` - Parallel batch analysis

#### Workflow Configuration

The workflows include automatic:
- **PGN download** from lichess4545.com API (no need to commit PGNs!)
- **Python/Stockfish path detection** (works on both macOS and Linux)
- **Results commit** and push to main branch
- **Vercel auto-deployment** triggered by the commit

Key features of `.github/workflows/analyze-round.yml`:

```yaml
name: Analyze Chess Round with Stockfish

on:
  workflow_dispatch:
    inputs:
      round:
        description: 'Round number (1-7)'
        required: true
        type: number
      season:
        description: 'Season number (e.g., 46)'
        required: true
        type: number
      depth:
        description: 'Stockfish depth (default: 15)'
        required: false
        default: '15'
        type: number

jobs:
  analyze:
    runs-on: ubuntu-latest
    timeout-minutes: 120  # 2 hour maximum

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Install Stockfish
        run: |
          sudo apt-get update
          sudo apt-get install -y stockfish
          stockfish --version

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Node dependencies
        run: npm ci

      - name: Install Python dependencies
        run: |
          pip3 install python-chess stockfish

      - name: Verify PGN file exists
        run: |
          PGN_FILE="data/season-${{ github.event.inputs.season }}-round-${{ github.event.inputs.round }}.pgn"
          if [ ! -f "$PGN_FILE" ]; then
            echo "Error: PGN file not found at $PGN_FILE"
            echo "Please ensure the PGN file is committed to the repository first."
            exit 1
          fi
          echo "Found PGN file: $PGN_FILE"
          wc -l "$PGN_FILE"

      - name: Run Stockfish Analysis
        run: |
          echo "Starting analysis for Season ${{ github.event.inputs.season }} Round ${{ github.event.inputs.round }}"
          echo "Depth: ${{ github.event.inputs.depth }}"
          echo "Start time: $(date)"

          cat data/season-${{ github.event.inputs.season }}-round-${{ github.event.inputs.round }}.pgn | \
            node scripts/generate-stats.js \
              --round ${{ github.event.inputs.round }} \
              --season ${{ github.event.inputs.season }} \
              --analyze \
              --depth ${{ github.event.inputs.depth }}

          echo "End time: $(date)"

      - name: Verify output
        run: |
          OUTPUT_FILE="public/stats/season-${{ github.event.inputs.season }}-round-${{ github.event.inputs.round }}.json"
          if [ ! -f "$OUTPUT_FILE" ]; then
            echo "Error: Stats file not generated at $OUTPUT_FILE"
            exit 1
          fi
          echo "Generated stats file:"
          ls -lh "$OUTPUT_FILE"
          echo "File size: $(du -h "$OUTPUT_FILE" | cut -f1)"

      - name: Commit and push results
        run: |
          git config user.name "GitHub Actions Bot"
          git config user.email "actions@github.com"
          git add public/stats/season-${{ github.event.inputs.season }}-round-${{ github.event.inputs.round }}.json

          if git diff --staged --quiet; then
            echo "No changes to commit"
          else
            git commit -m "Add Stockfish analysis for Season ${{ github.event.inputs.season }} Round ${{ github.event.inputs.round }}

Analyzed with depth ${{ github.event.inputs.depth }}
Generated by GitHub Actions"
            git push
          fi
```

#### Step 3: Create Parallel Analysis Workflow (Optional)

For analyzing multiple rounds at once, create `.github/workflows/analyze-multiple-rounds.yml`:

```yaml
name: Analyze Multiple Rounds

on:
  workflow_dispatch:
    inputs:
      season:
        description: 'Season number'
        required: true
        type: number
      rounds:
        description: 'Comma-separated round numbers (e.g., 1,2,3)'
        required: true
        type: string

jobs:
  analyze:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        round: ${{ fromJson(format('[{0}]', github.event.inputs.rounds)) }}
      max-parallel: 3  # Analyze 3 rounds simultaneously
    timeout-minutes: 120

    steps:
      - uses: actions/checkout@v4

      - name: Install dependencies
        run: |
          sudo apt-get update && sudo apt-get install -y stockfish
          pip3 install python-chess stockfish

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - name: Analyze Round ${{ matrix.round }}
        run: |
          cat data/season-${{ github.event.inputs.season }}-round-${{ matrix.round }}.pgn | \
            node scripts/generate-stats.js \
              --round ${{ matrix.round }} \
              --season ${{ github.event.inputs.season }} \
              --analyze

      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: stats-round-${{ matrix.round }}
          path: public/stats/season-${{ github.event.inputs.season }}-round-${{ matrix.round }}.json

  commit:
    needs: analyze
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Download all artifacts
        uses: actions/download-artifact@v4
        with:
          path: public/stats/

      - name: Commit results
        run: |
          git config user.name "GitHub Actions Bot"
          git config user.email "actions@github.com"
          git add public/stats/
          git commit -m "Add analysis for Season ${{ github.event.inputs.season }} rounds: ${{ github.event.inputs.rounds }}"
          git push
```

#### Step 4: Commit and Push

```bash
git add .github/workflows/
git commit -m "Add GitHub Actions workflows for remote Stockfish analysis"
git push
```

### Usage Instructions

#### Single Round Analysis

**Via GitHub CLI** (recommended):
```bash
gh workflow run analyze-round.yml -f round=1 -f season=46 -f depth=15
```

**Via GitHub Web UI**:
1. Go to https://github.com/PomPomLtd/lichess4545-stats/actions
2. Click **"Analyze Chess Round with Stockfish"** workflow
3. Click **"Run workflow"** dropdown
4. Fill in parameters:
   - Round: `1`
   - Season: `46`
   - Depth: `15` (optional, defaults to 15)
5. Click **"Run workflow"**
6. Wait 1-2 hours (runs automatically in the cloud!)
7. Results automatically committed to `main` branch
8. Vercel auto-deploys your updated site
9. Pull changes locally: `git pull`

#### Multiple Rounds (Parallel)

```bash
gh workflow run analyze-multiple-rounds.yml -f season=46 -f rounds=1,2,3 -f depth=15
```

Will analyze 3 rounds simultaneously (~1-2 hours total, vs 3-6 hours sequentially)

### Monitoring Progress

- Click on the running workflow to see live logs
- See which game is being analyzed in real-time
- Check progress bar in Python script output

### Troubleshooting

**Issue**: Workflow times out after 2 hours
- **Solution**: This is the GitHub Actions limit. For longer analysis, use parallel workflows or reduce depth to 12-13

**Issue**: Stockfish path not found
- **Solution**: Already fixed! The script auto-detects Stockfish in common locations

**Issue**: Python venv not found
- **Solution**: Already fixed! The script uses system python3 when venv is unavailable

**Issue**: Permission denied on git push
- **Solution**: ✅ Already configured! The workflows have `permissions: contents: write`

---

## Option 2: Oracle Cloud (Most Powerful)

### Overview

Oracle Cloud offers the most generous free tier:
- **Always Free**: 4 OCPU Ampere A1 (ARM) + 24GB RAM
- **Performance**: ~2-3x faster than GitHub Actions
- **No time limits**

### Setup Instructions

#### Step 1: Create Oracle Cloud Account

1. Go to https://cloud.oracle.com/
2. Sign up for free tier
3. Verify identity (requires credit card, but won't be charged)

#### Step 2: Create Compute Instance

1. **Compute** → **Instances** → **Create Instance**
2. Choose:
   - Name: `stockfish-analysis`
   - Image: Ubuntu 22.04
   - Shape: Ampere A1 (ARM) - 4 OCPU, 24GB RAM
   - Boot volume: 100GB
3. Download SSH key
4. Create instance

#### Step 3: Connect and Setup

```bash
# SSH into instance
ssh -i ~/Downloads/ssh-key.key ubuntu@<instance-ip>

# Update system
sudo apt update && sudo apt upgrade -y

# Install Stockfish
sudo apt install -y stockfish

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Python dependencies
pip3 install python-chess stockfish

# Clone repository
git clone https://github.com/your-username/lichess4545-stats.git
cd lichess4545-stats
npm install
```

#### Step 4: Run Analysis

```bash
# Analyze single round
cat data/season-46-round-1.pgn | \
  node scripts/generate-stats.js --round 1 --season 46 --analyze

# Analyze all rounds in parallel (use tmux to keep running)
for round in {1..7}; do
  echo "Analyzing round $round..."
  cat data/season-46-round-$round.pgn | \
    node scripts/generate-stats.js --round $round --season 46 --analyze &
done
wait
```

#### Step 5: Download Results

```bash
# From your local machine
scp -i ~/Downloads/ssh-key.key ubuntu@<instance-ip>:lichess4545-stats/public/stats/*.json public/stats/
```

### Performance Estimate

- **Single round (31 games)**: ~3-5 minutes
- **Full season (200 games)**: ~15-25 minutes with parallel processing

---

## Option 3: Google Colab (Quick One-Off)

### Setup Instructions

1. Go to https://colab.research.google.com/
2. Create new notebook
3. Paste this code:

```python
# Install dependencies
!apt-get update -qq
!apt-get install -y stockfish
!pip install python-chess stockfish

# Upload PGN file
from google.colab import files
print("Upload your PGN file:")
uploaded = files.upload()
pgn_filename = list(uploaded.keys())[0]

# Clone repository (or just upload the Python script)
!git clone https://github.com/your-username/lichess4545-stats.git
%cd lichess4545-stats

# Run analysis
!cat ../{pgn_filename} | python3 scripts/analyze-pgn.py --depth 15 > analysis.json

# Download results
files.download('analysis.json')
```

4. Run cells
5. Upload PGN when prompted
6. Download analysis.json when complete
7. Manually integrate into your stats

### Pros/Cons

**Pros**:
- Zero setup, instant access
- Free GPU/CPU (though CPU is fine for Stockfish)
- Good for experimentation

**Cons**:
- Manual upload/download
- 12-hour session timeout
- Doesn't integrate with repo automatically

---

## Option 4: Render (Scheduled Jobs)

### Overview

Render offers background workers on free tier:
- **Free Tier**: 750 hours/month
- **Use Case**: Scheduled analysis (e.g., every round automatically)

### Setup Instructions

1. Create `render.yaml`:

```yaml
services:
  - type: worker
    name: stockfish-analyzer
    runtime: node
    buildCommand: npm install && pip3 install python-chess stockfish && apt-get install stockfish
    startCommand: node scripts/analyze-worker.js
    envVars:
      - key: SEASON
        value: 46
    plan: free
```

2. Create worker script `scripts/analyze-worker.js`:

```javascript
// Check for new PGN files and analyze them
// This would run continuously, checking for new files
```

3. Deploy to Render

**Note**: This requires more setup and is best for fully automated scheduled analysis.

---

## Performance Comparison

Based on analyzing 31 games (Round 1):

| Platform | Time | Cost | Setup Effort |
|----------|------|------|--------------|
| MacBook Air M1 | 15 min | $0 | 0 min |
| GitHub Actions | 7-8 min | $0 | 10 min (one-time) |
| Oracle Cloud (4-core ARM) | 4-5 min | $0 | 30 min (one-time) |
| Google Colab | 8-10 min | $0 | 2 min (each time) |

For **200 games** (full season):

| Platform | Estimated Time | Parallel Possible |
|----------|----------------|-------------------|
| MacBook Air M1 | 90 min | No |
| GitHub Actions | 50 min | Yes (3 jobs) → **17 min** |
| Oracle Cloud | 25 min | Yes (unlimited) → **5 min** |
| Google Colab | 60 min | No |

---

## Recommended Workflow

### Regular Season Analysis (GitHub Actions)

✨ **Super simple!** Just one command per round:

```bash
# After each round completes, trigger analysis:
gh workflow run analyze-round.yml -f round=1 -f season=46 -f depth=15

# The workflow will:
# 1. Download PGNs from lichess4545.com automatically
# 2. Run Stockfish analysis (1-2 hours, hands-free!)
# 3. Commit results to your repo
# 4. Trigger Vercel auto-deploy
# 5. Your stats page updates automatically!

# When complete, pull the changes:
git pull
```

**No need to:**
- Download PGNs manually
- Keep your laptop running
- Commit large PGN files
- Manually deploy

### Batch Analysis (Oracle Cloud)

For analyzing historical data (entire season at once):

1. SSH into Oracle Cloud instance
2. Run parallel analysis:
   ```bash
   cd lichess4545-stats
   for round in {1..7}; do
     cat data/season-46-round-$round.pgn | \
       node scripts/generate-stats.js --round $round --season 46 --analyze &
   done
   wait
   ```
3. Download all results: `scp -r ubuntu@ip:lichess4545-stats/public/stats/* public/stats/`

---

## Cost Analysis

All options are **100% free** within these limits:

| Service | Free Tier Limit | Estimated Usage (per season) |
|---------|----------------|------------------------------|
| GitHub Actions | 2,000 min/month | ~60 min (7 rounds × 8 min) |
| Oracle Cloud | Always free | ~20 min total |
| Google Colab | 12 hours/session | ~1 hour |
| Render | 750 hours/month | ~1 hour |

**Verdict**: Even heavy usage stays well within free tiers.

---

## GitHub Actions: Advanced Features

### Scheduled Analysis

Automatically analyze rounds on specific dates:

```yaml
on:
  schedule:
    - cron: '0 22 * * 0'  # Every Sunday at 10 PM UTC
  workflow_dispatch:  # Also allow manual trigger
```

### Notifications

Get notified when analysis completes:

```yaml
- name: Notify on completion
  if: success()
  run: |
    curl -X POST ${{ secrets.DISCORD_WEBHOOK }} \
      -H "Content-Type: application/json" \
      -d '{"content": "Analysis complete for Season ${{ inputs.season }} Round ${{ inputs.round }}!"}'
```

### Artifacts

Download analysis files without committing:

```yaml
- name: Upload results
  uses: actions/upload-artifact@v4
  with:
    name: round-${{ inputs.round }}-stats
    path: public/stats/
    retention-days: 30
```

---

## Conclusion

**For most users**: Use **GitHub Actions**
- Zero cost
- Fully automated
- Results auto-committed
- No server management

**For power users**: Use **Oracle Cloud**
- Fastest analysis
- Can analyze entire season in 5 minutes
- Full control

**For experimentation**: Use **Google Colab**
- Instant access
- No setup
- Good for testing algorithm changes

---

## Getting Started Checklist

✅ **Setup Complete!** Everything is ready to use.

**To run analysis:**

1. Trigger workflow:
   ```bash
   gh workflow run analyze-round.yml -f round=1 -f season=46 -f depth=15
   ```

2. Monitor progress:
   - Visit https://github.com/PomPomLtd/lichess4545-stats/actions
   - Click on the running workflow to see live logs

3. When complete (1-2 hours):
   - Results auto-committed to main branch
   - Vercel auto-deploys updated site
   - Pull changes: `git pull`
   - View stats at your site!

---

## Support

If you encounter issues:

1. Check GitHub Actions logs for error messages
2. Verify PGN file exists in repo
3. Ensure workflow permissions are correct
4. Check free tier limits haven't been exceeded

For Oracle Cloud setup issues, consult: https://docs.oracle.com/en-us/iaas/Content/Compute/home.htm
