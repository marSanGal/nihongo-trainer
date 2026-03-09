export type Category =
  | 'Basic Phrases'
  | 'Navigating the City'
  | 'Restaurants & Shopping'
  | 'Convenience Store & Photos';

export interface Phrase {
  id: number;
  japanese: string;
  romaji: string;
  english: string;
  category: Category;
  batch: number;
}

export const PHRASES: Phrase[] = [
  // Batch 1 — Basic Phrases (Week 1)
  { id: 1, japanese: 'ありがとうございます', romaji: 'Arigatou gozaimasu', english: 'Thank you (polite)', category: 'Basic Phrases', batch: 1 },
  { id: 2, japanese: 'すみません', romaji: 'Sumimasen', english: 'Excuse me / I\'m sorry', category: 'Basic Phrases', batch: 1 },
  { id: 3, japanese: 'はい、お願いします', romaji: 'Hai, onegaishimasu', english: 'Yes, please', category: 'Basic Phrases', batch: 1 },
  { id: 4, japanese: 'いいえ、大丈夫です。', romaji: 'Iie, daijoubu desu.', english: 'No, thank you / No, I\'m good', category: 'Basic Phrases', batch: 1 },

  // Batch 2 — Basic Phrases (Week 2)
  { id: 5, japanese: '英語（が）わかりますか？', romaji: 'Eigo (ga) wakarimasu ka?', english: 'Do you understand English?', category: 'Basic Phrases', batch: 2 },
  { id: 6, japanese: 'すみません、わかりません。', romaji: 'Sumimasen, wakarimasen.', english: 'I\'m sorry, I don\'t understand', category: 'Basic Phrases', batch: 2 },
  { id: 7, japanese: 'わかりました。', romaji: 'Wakarimashita.', english: 'I understood', category: 'Basic Phrases', batch: 2 },
  { id: 8, japanese: 'ちょっと待ってください。', romaji: 'Chotto matte kudasai.', english: 'Please wait a moment', category: 'Basic Phrases', batch: 2 },

  // Batch 3 — Navigating the City (Week 3)
  { id: 9, japanese: '（place）はどこですか。', romaji: '(place) wa doko desu ka?', english: 'Where is (place)?', category: 'Navigating the City', batch: 3 },
  { id: 10, japanese: '〜はありますか。', romaji: '... wa arimasu ka?', english: 'Do you have...?', category: 'Navigating the City', batch: 3 },
  { id: 11, japanese: 'Wi-Fiのパスワードは何ですか。', romaji: 'Waifai no pasuwaado wa nan desu ka?', english: 'What is the Wi-Fi password?', category: 'Navigating the City', batch: 3 },

  // Batch 4 — Navigating the City (Week 4)
  { id: 12, japanese: '〜までお願いします。', romaji: '... made onegai shimasu.', english: 'To (place), please', category: 'Navigating the City', batch: 4 },
  { id: 13, japanese: '〜に行きたいです。', romaji: '... ni ikitai desu.', english: 'I want to go to...', category: 'Navigating the City', batch: 4 },
  { id: 14, japanese: 'このバスは〜に行きますか。', romaji: 'Kono basu wa ... ni ikimasu ka?', english: 'Is this bus going to...?', category: 'Navigating the City', batch: 4 },

  // Batch 5 — Restaurants & Shopping (Week 5)
  { id: 15, japanese: 'これはいくらですか。', romaji: 'Kore wa ikura desu ka?', english: 'How much is this?', category: 'Restaurants & Shopping', batch: 5 },
  { id: 16, japanese: 'それはいくらですか。', romaji: 'Sore wa ikura desu ka?', english: 'How much is that one (near you)?', category: 'Restaurants & Shopping', batch: 5 },
  { id: 17, japanese: 'あれはいくらですか。', romaji: 'Are wa ikura desu ka?', english: 'How much is that one over there?', category: 'Restaurants & Shopping', batch: 5 },
  { id: 18, japanese: 'クレジットカード、使えますか？', romaji: 'Kurejittokaado, tsukaemasu ka?', english: 'Can I use a credit card?', category: 'Restaurants & Shopping', batch: 5 },
  { id: 19, japanese: 'ICカード、使えますか？', romaji: 'Aishii kaado, tsukaemasu ka?', english: 'Can I use IC card?', category: 'Restaurants & Shopping', batch: 5 },

  // Batch 6 — Restaurants & Shopping (Week 6)
  { id: 20, japanese: 'クレジットカードでお願いします。', romaji: 'Kurejittokaado de onegai shimasu.', english: 'I\'ll pay with credit card', category: 'Restaurants & Shopping', batch: 6 },
  { id: 21, japanese: '現金でお願いします。', romaji: 'Genkin de onegai shimasu.', english: 'I\'ll pay with cash', category: 'Restaurants & Shopping', batch: 6 },
  { id: 22, japanese: 'いらっしゃいませ', romaji: 'Irasshaimase.', english: 'Welcome in', category: 'Restaurants & Shopping', batch: 6 },
  { id: 23, japanese: '何名様ですか。', romaji: 'Nanmeisama desu ka?', english: 'How many people?', category: 'Restaurants & Shopping', batch: 6 },
  { id: 24, japanese: '二人です。', romaji: 'Futari desu.', english: '(We\'re) two people', category: 'Restaurants & Shopping', batch: 6 },
  { id: 25, japanese: '〜（を）ください。', romaji: '... (o) kudasai.', english: 'Please give me...', category: 'Restaurants & Shopping', batch: 6 },

  // Batch 7 — Restaurants & Shopping + Convenience Store & Photos (Week 7)
  { id: 26, japanese: 'これ（を）お願いします。', romaji: 'Kore (o) onegai shimasu.', english: 'This one, please (polite)', category: 'Restaurants & Shopping', batch: 7 },
  { id: 27, japanese: 'お会計（を）お願いします。', romaji: 'Okaikei (o) onegai shimasu.', english: 'Check, please', category: 'Restaurants & Shopping', batch: 7 },
  { id: 28, japanese: '袋（を）お願いします。', romaji: 'Fukuro (o) onegai shimasu.', english: 'Plastic bag, please', category: 'Restaurants & Shopping', batch: 7 },
  { id: 29, japanese: 'ごちそうさまでした。', romaji: 'Gochisousama deshita.', english: 'Thank you for the meal', category: 'Restaurants & Shopping', batch: 7 },
  { id: 30, japanese: 'お弁当温めますか。', romaji: 'Obentou atatamemasu ka?', english: 'Would you like to heat up your bento?', category: 'Convenience Store & Photos', batch: 7 },
  { id: 31, japanese: '写真（を）撮ってもらってもいいですか？', romaji: 'Shashin (o) totte morattemo iidesu ka?', english: 'Could you take a picture for me, please?', category: 'Convenience Store & Photos', batch: 7 },
  { id: 32, japanese: 'よかったら撮りましょうか？', romaji: 'Yokattara torimashou ka?', english: 'If you\'d like, may I take a picture for you?', category: 'Convenience Store & Photos', batch: 7 },
];

export const BATCH_COUNT = 7;
export const TOTAL_PHRASES = PHRASES.length;

export const getPhrasesByBatch = (batch: number) =>
  PHRASES.filter((p) => p.batch === batch);

export const getPhrasesByIds = (ids: number[]) =>
  PHRASES.filter((p) => ids.includes(p.id));

export const getPhraseById = (id: number) =>
  PHRASES.find((p) => p.id === id);
