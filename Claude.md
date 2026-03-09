# 🇯🇵 Nihongo Trainer — CLAUDE.md

## Project Overview

A mobile phone app (React Native / Expo) to help a user learn 25 essential Japanese travel phrases over 7 weeks before a trip to Japan. The app lives entirely on the user's phone with all progress stored locally (no backend, no accounts). The tone is fun and playful — emoji, encouraging messages, celebratory moments.

---

## The Data

### 25 Phrases across 4 categories

#### Basic Phrases (1–8)
| # | Japanese | Romaji | English |
|---|----------|--------|---------|
| 1 | ありがとうございます | Arigatou gozaimasu | Thank you (polite) |
| 2 | すみません | Sumimasen | Excuse me / I'm sorry |
| 3 | はい、お願いします | Hai, onegaishimasu | Yes, please |
| 4 | いいえ、大丈夫です。 | Iie, daijoubu desu. | No, thank you / No, I'm good |
| 5 | 英語（が）わかりますか？ | Eigo (ga) wakarimasu ka? | Do you understand English? |
| 6 | すみません、わかりません。 | Sumimasen, wakarimasen. | I'm sorry, I don't understand |
| 7 | わかりました。 | Wakarimashita. | I understood |
| 8 | ちょっと待ってください。 | Chotto matte kudasai. | Please wait a moment |

#### Navigating the City (9–14)
| # | Japanese | Romaji | English |
|---|----------|--------|---------|
| 9 | (place)はどこですか。 | (place) wa doko desu ka? | Where is (place)? |
| 10 | 〜はありますか。 | ... wa arimasu ka? | Do you have...? |
| 11 | Wi-Fiのパスワードは何ですか。 | Waifai no pasuwaado wa nan desu ka? | What is the Wi-Fi password? |
| 12 | 〜までお願いします。 | ... made onegai shimasu. | To (place), please |
| 13 | 〜に行きたいです。 | ... ni ikitai desu. | I want to go to... |
| 14 | このバスは〜に行きますか。 | Kono basu wa ... ni ikimasu ka? | Is this bus going to...? |

#### Restaurants & Shopping (15–22)
| # | Japanese | Romaji | English |
|---|----------|--------|---------|
| 15 | これはいくらですか。 | Kore wa ikura desu ka? | How much is this? |
| 16 | それはいくらですか。 | Sore wa ikura desu ka? | How much is that one (near you)? |
| 17 | あれはいくらですか。 | Are wa ikura desu ka? | How much is that one over there? |
| 18 | クレジットカード、使えますか？ | Kurejittokaado, tsukaemasu ka? | Can I use a credit card? |
| 19 | ICカード、使えますか？ | Aishii kaado, tsukaemasu ka? | Can I use IC card? |
| 20 | クレジットカードでお願いします。 | Kurejittokaado de onegai shimasu. | I'll pay with credit card |
| 21 | 現金でお願いします。 | Genkin de onegai shimasu. | I'll pay with cash |
| 22 | いらっしゃいませ | Irasshaimase. | Welcome in |
| 23 | 何名様ですか。 | Nanmeisama desu ka? | How many people? |
| 24 | 二人です。 | Futari desu. | (We're) two people |
| 25 | 〜（を）ください。 | ... (o) kudasai. | Please give me... |
| 26 | これ（を）お願いします。 | Kore (o) onegai shimasu. | This one, please (polite) |
| 27 | お会計（を）お願いします。 | Okaikei (o) onegai shimasu. | Check, please |
| 28 | 袋（を）お願いします。 | Fukuro (o) onegai shimasu. | Plastic bag, please |
| 29 | ごちそうさまでした。 | Gochisousama deshita. | Thank you for the meal |

#### Convenience Store & Photos (30–32)
| # | Japanese | Romaji | English |
|---|----------|--------|---------|
| 30 | お弁当温めますか。 | Obentou atatamemasu ka? | Would you like to heat up your bento? |
| 31 | 写真（を）撮ってもらってもいいですか？ | Shashin (o) totte morattemo iidesu ka? | Could you take a picture for me, please? |
| 32 | よかったら撮りましょうか？ | Yokattara torimashou ka? | If you'd like, may I take a picture for you? |

### Suggested Unlock Schedule (batches)
| Batch | Phrases | Suggested Week |
|-------|---------|----------------|
| 1 | 1–4 | Week 1 |
| 2 | 5–8 | Week 2 |
| 3 | 9–11 | Week 3 |
| 4 | 12–14 | Week 4 |
| 5 | 15–19 | Week 5 |
| 6 | 20–25 | Week 6 |
| 7 | 26–32 | Week 7 (full review) |

---

## Core Learning Logic

### Unlock System
- Phrases are released in batches following the suggested schedule above
- User can unlock the **next batch early** if they hit the 80% threshold (see below)
- Unlocking is manual — a button appears when eligible, user chooses when to proceed
- There is no hard lock — user can also choose to stay on their current batch longer

### 80% Threshold
- To unlock the next batch, the user must achieve **80% average "Got it" rating across ALL phrases unlocked so far**
- This average is calculated over the **last 3 days of sessions** (not just a single day)
- This prevents a lucky day from unlocking things prematurely
- If the user hasn't completed 3 days yet, use available days

### Spaced Repetition (simplified)
- After each card, user rates themselves: 😕 Still learning / 🙂 Almost / 😄 Got it
- "Got it" phrases appear less frequently in the full quiz pool
- "Still learning" phrases appear more frequently
- Even mastered phrases reappear occasionally in warm-up to prevent forgetting

### Daily Missed Phrases Tracker
- Any phrase rated 😕 "Still learning" during a session is flagged
- Next session always **starts with yesterday's flagged phrases** as a warm-up
- If a phrase is failed 3 days in a row, a persistent nudge appears: "This one's tricky — take an extra look 👀"
- Persistently failed phrases appear at higher frequency in the full quiz pool
- On the results screen, all flagged phrases are shown in full (Japanese + romaji + English) so the user can study them passively before the next session

---

## App Screens

### 1. Home Screen
- Trip countdown (days until Japan — user sets departure date on first launch)
- Streak counter (consecutive days practiced)
- Progress indicator: X of 25 phrases unlocked
- Pace indicator: "Ahead of schedule 🚀 / On track ✅ / Take your time 🌱"
- "Start Today's Session" button — primary CTA
- Navigation to Progress screen

### 2. Lesson Screen
- Triggered when a new batch has been unlocked and not yet studied
- Shows **new phrases only**, one at a time
- Front: English meaning
- Tap to reveal: Japanese characters + romaji
- Simple "Got it, next →" to move through
- No scoring, no pressure — pure absorption
- After all new phrases seen, transitions to Practice screen

### 3. Practice Screen (new phrases only)
- Mini quiz on the **new batch only** before they enter the full pool
- Same card mechanics as full quiz (see below)
- Helps the user get comfortable with new phrases before mixing them in
- Shorter session — just the new phrases, a couple of passes

### 4. Full Quiz Screen
- All unlocked phrases mixed together
- **Card ratio: ~70% English → Japanese / 30% Japanese → English**
- Card Type A (English → Japanese):
  - Front: English meaning
  - Back (tap to reveal): Japanese characters + romaji together
- Card Type B (Japanese → English):
  - Front: Japanese characters + romaji together
  - Back (tap to reveal): English meaning
- After revealing, user rates: 😕 Still learning / 🙂 Almost / 😄 Got it
- Session ends after a full pass through the active pool (adjusted by spaced repetition weighting)

### 5. Results Screen
- Today's score and breakdown (Got it / Almost / Still learning counts)
- 3-day rolling average shown clearly
- Unlock button appears here if 80% threshold is met across 3 days
- "Yesterday's misses" section — shows all flagged phrases in full (Japanese + romaji + English visible, no tapping required) so the user can study them
- Streak update + playful encouragement message
- "See you tomorrow!" with a hint of what's coming next

### 6. Progress Screen
- All 25 phrases listed, grouped by category
- Each phrase has a status indicator: 🔒 Locked / 📖 Learning / ⭐ Confident
- Tapping a phrase reveals the full card (tap to reveal mechanic, same as quiz)
- Shows overall stats: current streak, 3-day average, total sessions

---

## Session Flow

### If flagged phrases from yesterday exist:
1. "Yesterday's misses" warm-up — flagged phrases only
2. → Lesson screen (if new batch unlocked and not yet studied)
3. → Practice screen (new phrases mini quiz, if applicable)
4. → Full quiz (all unlocked phrases mixed)
5. → Results screen

### If no flagged phrases:
1. → Lesson screen (if new batch unlocked and not yet studied)
2. → Practice screen (if applicable)
3. → Full quiz
4. → Results screen

---

## Local Storage Schema

All data stored using AsyncStorage (React Native) or expo-secure-store.

```json
{
  "settings": {
    "departureDate": "2026-04-27",
    "setupComplete": true
  },
  "progress": {
    "currentBatch": 1,
    "unlockedPhrases": [1, 2, 3, 4],
    "streak": 3,
    "lastSessionDate": "2026-03-09"
  },
  "phraseStats": {
    "1": {
      "totalSeen": 12,
      "gotItCount": 9,
      "almostCount": 2,
      "stillLearningCount": 1,
      "lastRating": "got_it",
      "failedStreak": 0,
      "lastSeenDate": "2026-03-09"
    }
  },
  "dailySessions": [
    {
      "date": "2026-03-09",
      "averageScore": 0.82,
      "flaggedPhrases": [3, 7]
    },
    {
      "date": "2026-03-08",
      "averageScore": 0.75,
      "flaggedPhrases": [3]
    },
    {
      "date": "2026-03-07",
      "averageScore": 0.78,
      "flaggedPhrases": [3, 5]
    }
  ],
  "todayFlagged": [3, 7]
}
```

---

## Tech Stack

- **Framework**: React Native with Expo (easiest path to a real phone app)
- **Navigation**: Expo Router or React Navigation
- **Local storage**: AsyncStorage for progress data
- **Animations**: React Native Reanimated for card flip animations
- **Styling**: StyleSheet API with a consistent colour palette
- **Icons**: Expo vector icons or react-native-vector-icons

### Colour Palette
- Primary pink: `#D63384`
- Light pink background: `#FFF0F6`
- Purple accent: `#7B5EA7`
- Green accent: `#1A7A4A`
- Warm amber: `#C06000`
- Text dark: `#1A1A1A`
- Text muted: `#666666`

---

## Build Phases

### Phase 1 — Foundation
- Expo project setup
- Navigation structure (all screens stubbed)
- Local storage setup and data schema
- Phrase data hardcoded as a constants file
- First launch onboarding (set departure date)
- Home screen with countdown, streak, progress

### Phase 2 — Core Learning Loop
- Lesson screen (new phrases, tap to reveal)
- Full quiz screen with card flip animation
- Rating buttons (😕 / 🙂 / 😄)
- Results screen with score breakdown
- Basic spaced repetition logic (weighting by rating)

### Phase 3 — Progress & Unlock System
- 3-day rolling average calculation
- 80% threshold detection and unlock button
- Batch unlock flow with celebratory moment
- Practice screen (new phrases mini quiz)
- Progress screen with all phrases and status

### Phase 4 — Missed Phrases & Polish
- Yesterday's misses warm-up flow
- 3-day fail streak detection and nudge
- Pace indicator on home screen (ahead / on track / take your time)
- Playful copy, emoji, encouragement messages throughout
- Animations and transitions
- Edge cases: first session ever, no phrases unlocked yet, all phrases mastered

### Phase 5 — Testing & Final Touches
- Test full 7-week flow end to end
- Ensure all local storage reads/writes are robust
- Handle app being closed mid-session gracefully
- Final UI polish and consistency pass
- Build for device with Expo Go or EAS Build

---

## Key Constraints & Notes

- **No backend, no accounts** — everything lives on the device via AsyncStorage
- **Phone only** — optimise for portrait mobile layout
- **Playful tone** — emoji, warm colours, celebratory moments on milestones (streak achievements, batch unlocks, hitting 80%)
- **Japanese characters must render correctly** — use a system font or bundle a font that supports CJK characters (e.g. Noto Sans JP)
- **Session should work offline** — no network dependency whatsoever
- **Departure date** is set once on first launch and drives the countdown; should be editable in settings
- The 80% unlock is a **suggestion**, not a hard gate — consider adding a "unlock anyway" option with a gentle warning so the user always feels in control