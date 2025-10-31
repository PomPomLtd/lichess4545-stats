# Team Statistics - Brainstorming

## Overview
Teams have 8 players each and compete throughout the season. We want to create fun, silly, and useful team statistics that aggregate individual player performances.

## Data Available
From our test extraction, we have:
- **42 teams** in Season 46
- **Team rosters** (player lists)
- **Team games** (player, opponent, color, result, round)
- **Individual game stats** (from existing round statistics)

## Team Statistics Categories

### 1. 🏆 Competitive Team Stats (Useful)

#### Team Performance
- **Win Rate** - Overall team win percentage
- **Draw Rate** - Team draw percentage (defensive style indicator)
- **Best Board** - Which board number performs best for the team
- **Consistency Score** - Standard deviation of player win rates
- **Clutch Factor** - Performance in critical games (when team score is tied)
- **Home/Away Performance** - White vs Black overall performance

#### Team Playstyle
- **Average Game Length** - Team's average moves per game
- **Endgame Specialists** - Team with most endgame experience (avg endgame length)
- **Speed Demons** - Shortest average game time
- **Marathon Runners** - Longest average game time
- **Decisive Team** - Fewest draws (most fighting spirit)

#### Opening Repertoire
- **Opening Diversity** - Number of unique ECO codes played
- **1.e4 vs 1.d4 Teams** - Preference split
- **Most Theoretical** - Most mainstream openings
- **Most Creative** - Most obscure openings

### 2. 🎯 Tactical Team Stats (Interesting)

#### Aggression Metrics
- **Bloodthirsty Team** - Most total captures across all games
- **Capture Rate** - Captures per game average
- **Exchange Champions** - Most piece exchanges
- **Material Hustlers** - Best at winning material (average material advantage)

#### Tactical Patterns
- **Fork Masters** - Most forks detected
- **Pin Perfectionists** - Most pins executed
- **Skewer Specialists** - Most skewers
- **Discovery Dynamos** - Most discovered attacks

#### Special Moves
- **Castling Speed** - Average move number for castling
- **Promotion Factory** - Most pawn promotions
- **En Passant Enthusiasts** - Most en passant captures
- **Longest Kingside Castling Streak** - Most consecutive games with O-O

### 3. 😂 Fun & Silly Team Awards (Creative)

#### Pun-Based Awards (Match Team Names)
- **PAnnini Team** 🥖 - Most pawn moves total
- **Pawn Crackers** 🍪 - Most pawn captures
- **Pawn Hub** 📹 - Most pawn promotions
- **The Late Knight Show** 🌙 - Most knight moves after move 30
- **Rooks on the seventh rank** 🏰 - Most rook moves to 7th rank
- **Silent Majority** 🤫 - Fewest checks given (quiet positional play)
- **Check, Please** ✅ - Most checks delivered
- **Nakamura Airlines** ✈️ - King traveled most total distance
- **Rim Reapers** 🔲 - Most activity on edge squares (a/h files, 1/8 ranks)
- **No Kings** 👑 - Most king moves (paradoxical award)
- **Fischer's Forkers** 🍴 - Most knight forks
- **Underpromotion Overachievers** ♘ - Most underpromotions (to knight/bishop/rook)
- **Doomsday Hedgehogs** 🦔 - Most pieces in own half (defensive formation)
- **Gambiteers and Gary** 🎲 - Most pawn sacrifices in opening
- **Creative Destruction** 💥 - Most piece sacrifices
- **Berge's Bishops** 👨‍🦰 - Most bishop activity/moves
- **Too OTH for OTB** 💻 - Most online-style tactics (mouse slips excluded!)

#### Piece Awards
- **Queen's Gambit Team** 👸 - Most queen activity (distance traveled)
- **Bishop Believers** 🔷 - Best bishop pair performance
- **Knight Riders** 🐴 - Most knight moves total
- **Rook Stars** 🎸 - Most rook activity on open files
- **Pawn Army** 🪖 - Most pawn pushes

#### Strategic Awards
- **Space Invaders** 🚀 - Most pieces in opponent's half (aggressive positioning)
- **Fortress Builders** 🏰 - Fewest pieces lost per game
- **Material Minimalists** ✨ - Won most games with least material
- **Piece Loyalty** 🏠 - Fewest pieces moved (concentrated play)
- **Square Tourists** 🗺️ - Most unique squares visited
- **Central Control** 🎯 - Most activity in center squares (d4, d5, e4, e5)

#### Time Management
- **Time Scramble Kings** ⏰ - Most games with <5 seconds on clock (if we have timing data)
- **Time Millionaires** 💰 - Most time left on average at game end

#### Chaos Awards
- **Blunder Brigade** 🤦 - Most blunders (Stockfish analysis required)
- **Comeback Kids** 🦸 - Most games won from losing position
- **Lucky Escapes** 🍀 - Most games won despite opponent missing mate
- **Accuracy Kings** 👑 - Highest average accuracy (Stockfish required)

### 4. 📊 Statistical Deep Dives

#### Board Heatmap
- **Hottest Team** 🔥 - Most total square activity
- **Corner Conquerors** - Most activity on corner squares
- **Diagonal Dominators** - Most activity on long diagonals

#### Game Phases
- **Opening Scholars** 📚 - Shortest average opening phase (know theory)
- **Middlegame Grinders** ⚙️ - Longest average middlegame
- **Endgame Wizards** 🧙 - Longest average endgame phase

#### Checkmate Stats
- **Checkmate Artists** 🎨 - Most checkmates delivered (not resignations)
- **Back Rank Specialists** - Most back rank mates
- **Smothered Mate Masters** - Most smothered mates
- **Queen Mate Experts** - Most checkmates with queen

### 5. 🎭 Head-to-Head Team Stats

#### Team vs Team
- **Biggest Rivalry** - Most competitive H2H record (closest win rate)
- **Best Matchup** - Team with best record against specific opponent
- **Kryptonite Team** - Team that loses most to a specific opponent
- **Derby Winners** - Best in close team matches (7-5, 6-6 scores)

## Implementation Notes

### Data Sources
1. **Round Statistics JSON** - Contains individual game stats
2. **Season Games JSON** - Contains team assignments
3. **Team Rosters JSON** - Contains player-team mapping

### Calculation Strategy
1. Load team rosters and season games
2. For each round, load round statistics JSON
3. Match games to teams using player usernames
4. Aggregate stats by team
5. Calculate fun awards and rankings

### Display Ideas
- **Team Leaderboard** - Sortable table with multiple stat columns
- **Team Profiles** - Individual team pages with:
  - Roster with player stats
  - Team awards and achievements
  - Best games (bloodbath, longest, etc.)
  - Head-to-head records
  - Opening repertoire pie chart
- **Team Awards Section** - Highlight 10-15 fun awards with icons
- **Team Comparison Tool** - Side-by-side team comparison
- **Team Trends** - Performance over rounds (line chart)

## Priority Stats for MVP

### Must Have (Top 10)
1. **Win Rate** - Core competitive stat
2. **Bloodthirsty Team** - Most captures (matches "Pawn Crackers" theme)
3. **PAnnini Team** - Most pawn moves (silly but requested)
4. **Speed Demons** - Shortest games
5. **Endgame Wizards** - Longest endgames
6. **Opening Diversity** - Unique openings played
7. **Checkmate Artists** - Most checkmates
8. **Fork Masters** - Most forks (tactical)
9. **Space Invaders** - Most aggressive positioning
10. **Team Consistency** - Player win rate variance

### Nice to Have (Next 10)
11. **The Late Knight Show** - Knight moves after move 30
12. **Rooks on the seventh rank** - Specific tactical stat
13. **Queen's Gambit Team** - Queen activity
14. **Piece Loyalty** - Fewest pieces moved
15. **Square Tourists** - Most squares visited
16. **Material Minimalists** - Won with least material
17. **Decisive Team** - Fewest draws
18. **Clutch Factor** - Performance in close matches
19. **Best Board** - Which board performs best
20. **Opening Theory** - Most mainstream vs most creative

### Stockfish-Dependent (If Available)
- Accuracy Kings
- Blunder Brigade
- Comeback Kids
- Lucky Escapes

## Next Steps
1. ✅ Extract team rosters from season data
2. Create team stats calculator utility
3. Add team section to round statistics
4. Create team overview component
5. Design team profile pages
6. Test with Season 46 data
