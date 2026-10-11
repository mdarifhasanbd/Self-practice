/* ============================================================
 *  data/index.js  —  টাইটেল / কালেকশন / সাবসেকশনের তালিকা
 *  এটা একবার সাজালেই হবে। নতুন প্রশ্ন যোগ করতে এই ফাইল ছুঁতে হবে না।
 *  নতুন কালেকশন চাইলে: নিচে একটা অবজেক্ট যোগ করুন + data/<id>.js নামে ফাইল বানান।
 * ============================================================ */
window.PB = window.PB || {};
PB._sets = {};
PB.sets = function (collectionId, obj) { PB._sets[collectionId] = obj; };

PB.site = {
  title: "প্রশ্নভান্ডার",
  tagline: "কালেকশন খুলুন → সেট বেছে নিন → পরীক্ষা দিন, সাথে সাথে স্কোর দেখুন।"
};

PB.collections = [
  { id: "shakil-sir", icon: "👨‍🏫", title: "শাকিল স্যারের প্রশ্ন", desc: "স্যারের মডেল টেস্ট ও প্রশ্নব্যাংক",
    subs: [
      { id: "youth-officer", title: "যুব উন্নয়ন কর্মকর্তা" },
      { id: "model-test", title: "মডেল টেস্ট" },
      { id: "daily-exam", title: "দৈনিক পরীক্ষা" },
    ] },
  { id: "bcs", icon: "🏛️", title: "বিসিএস প্রশ্ন", desc: "বিসিএস প্রিলি ও মডেল টেস্ট",
    subs: [
      { id: "prelim", title: "প্রিলিমিনারি (বিগত বছর)" },
      { id: "model", title: "বিসিএস মডেল টেস্ট" },
      { id: "subject", title: "বিষয়ভিত্তিক" },
    ] },
  { id: "friends", icon: "🤝", title: "বন্ধুদের প্রশ্ন", desc: "বন্ধুদের শেয়ার করা প্রশ্ন",
    subs: [
      { id: "group-study", title: "গ্রুপ স্টাডি" },
      { id: "shared", title: "শেয়ার করা সেট" },
    ] },
  { id: "bank", icon: "🏦", title: "ব্যাংক নিয়োগ", desc: "ব্যাংকের নিয়োগ পরীক্ষা",
    subs: [
      { id: "officer", title: "অফিসার" },
      { id: "senior-officer", title: "সিনিয়র অফিসার" },
      { id: "previous", title: "বিগত বছরের প্রশ্ন" },
    ] },
  { id: "primary", icon: "🏫", title: "প্রাথমিক শিক্ষক নিয়োগ", desc: "সহকারী শিক্ষক নিয়োগ প্রস্তুতি",
    subs: [
      { id: "previous", title: "বিগত বছরের প্রশ্ন" },
      { id: "model", title: "মডেল টেস্ট" },
    ] },
  { id: "govt-job", icon: "📋", title: "সরকারি চাকরি (নন-ক্যাডার)", desc: "নন-ক্যাডার ও অন্যান্য সরকারি চাকরি",
    subs: [
      { id: "previous", title: "বিগত প্রশ্ন" },
      { id: "model", title: "মডেল টেস্ট" },
      { id: "others", title: "অন্যান্য নিয়োগ" },
    ] },
  { id: "bangla", icon: "📖", title: "বাংলা ভাষা ও সাহিত্য", desc: "ব্যাকরণ, সাহিত্য, বানান",
    subs: [
      { id: "grammar", title: "ব্যাকরণ" },
      { id: "literature", title: "সাহিত্য" },
      { id: "spelling", title: "বানান ও শব্দ" },
    ] },
  { id: "english", icon: "🔤", title: "ইংরেজি ভাষা ও সাহিত্য", desc: "Grammar, Vocabulary, Literature",
    subs: [
      { id: "grammar", title: "Grammar" },
      { id: "vocabulary", title: "Vocabulary" },
      { id: "literature", title: "Literature" },
    ] },
  { id: "math", icon: "🧮", title: "গণিত ও মানসিক দক্ষতা", desc: "পাটিগণিত, বীজগণিত, মানসিক দক্ষতা",
    subs: [
      { id: "arithmetic", title: "পাটিগণিত" },
      { id: "algebra-geometry", title: "বীজগণিত ও জ্যামিতি" },
      { id: "mental-ability", title: "মানসিক দক্ষতা" },
    ] },
  { id: "science", icon: "🔬", title: "সাধারণ বিজ্ঞান", desc: "পদার্থ, রসায়ন, জীববিজ্ঞান",
    subs: [
      { id: "physics-chemistry", title: "পদার্থ ও রসায়ন" },
      { id: "biology", title: "জীববিজ্ঞান" },
      { id: "daily-science", title: "দৈনন্দিন বিজ্ঞান" },
    ] },
  { id: "bd-affairs", icon: "🇧🇩", title: "বাংলাদেশ বিষয়াবলি", desc: "ইতিহাস, সংবিধান, অর্থনীতি",
    subs: [
      { id: "history", title: "ইতিহাস ও মুক্তিযুদ্ধ" },
      { id: "constitution", title: "সংবিধান ও রাষ্ট্র" },
      { id: "economy", title: "অর্থনীতি" },
    ] },
  { id: "intl", icon: "🌍", title: "আন্তর্জাতিক বিষয়াবলি", desc: "সংস্থা, চুক্তি, দেশ-রাজধানী",
    subs: [
      { id: "organizations", title: "সংস্থা ও চুক্তি" },
      { id: "countries", title: "দেশ ও রাজধানী" },
      { id: "world-now", title: "বর্তমান বিশ্ব" },
    ] },
  { id: "geography", icon: "🗺️", title: "ভূগোল ও পরিবেশ", desc: "বাংলাদেশ ও বিশ্ব ভূগোল, পরিবেশ",
    subs: [
      { id: "bd-geo", title: "বাংলাদেশের ভূগোল" },
      { id: "world-geo", title: "বিশ্ব ভূগোল" },
      { id: "environment", title: "দুর্যোগ ও পরিবেশ" },
    ] },
  { id: "ict", icon: "💻", title: "কম্পিউটার ও ICT", desc: "কম্পিউটার, ইন্টারনেট, ডিজিটাল বাংলাদেশ",
    subs: [
      { id: "basic", title: "কম্পিউটার বেসিক" },
      { id: "internet", title: "ইন্টারনেট" },
      { id: "digital-bd", title: "ডিজিটাল বাংলাদেশ" },
    ] },
  { id: "grammar-tense", icon: "✍️", title: "Grammar, Tense ও অনুবাদ", desc: "Tense, Translation, Right form of verb",
    subs: [
      { id: "tense", title: "Tense" },
      { id: "translation", title: "Translation" },
      { id: "right-form", title: "Right form of verbs" },
    ] },
  { id: "current", icon: "📰", title: "কারেন্ট অ্যাফেয়ার্স", desc: "সাম্প্রতিক ঘটনাপ্রবাহ",
    subs: [
      { id: "y2026", title: "২০২৬" },
      { id: "y2025", title: "২০২৫" },
      { id: "monthly", title: "মাসিক" },
    ] },
  { id: "admission", icon: "🎓", title: "ভর্তি পরীক্ষা", desc: "কলেজ ও বিশ্ববিদ্যালয় ভর্তি",
    subs: [
      { id: "college", title: "কলেজ ভর্তি" },
      { id: "university", title: "বিশ্ববিদ্যালয় ভর্তি" },
      { id: "med-eng", title: "মেডিকেল / ইঞ্জিনিয়ারিং" },
    ] },
  { id: "ssc-hsc", icon: "📚", title: "এসএসসি – এইচএসসি", desc: "বোর্ড পরীক্ষার MCQ",
    subs: [
      { id: "ssc", title: "এসএসসি" },
      { id: "hsc", title: "এইচএসসি" },
    ] },
  { id: "daily-quiz", icon: "⚡", title: "দৈনিক কুইজ", desc: "রোজকার ছোট কুইজ",
    subs: [
      { id: "today", title: "আজকের কুইজ" },
      { id: "weekly", title: "সাপ্তাহিক চ্যালেঞ্জ" },
    ] },
  { id: "mine", icon: "✏️", title: "আমার নিজের প্রশ্ন", desc: "নিজের নোট থেকে বানানো প্রশ্ন",
    subs: [
      { id: "notes", title: "নোট থেকে" },
      { id: "tricky", title: "কঠিন প্রশ্ন" },
      { id: "misc", title: "বিবিধ" },
    ] },
  { id: "general-knowledge", icon: "💡", title: "সাধারণ জ্ঞান", desc: "মিশ্র সাধারণ জ্ঞান",
    subs: [
      { id: "mixed", title: "মিশ্র" },
      { id: "quick", title: "দ্রুত রিভিশন" },
    ] },
  { id: "others", icon: "🗃️", title: "অন্যান্য", desc: "যেগুলো কোথাও মেলে না",
    subs: [
      { id: "misc-1", title: "বিবিধ ১" },
      { id: "misc-2", title: "বিবিধ ২" },
    ] },
];
