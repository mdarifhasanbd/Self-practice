PB.add({
  collection: { id: "exam-batch-library", icon: "📚", title: "Exam Batch(Library)", desc: "লাইব্রেরি এক্সাম ব্যাচ" },
  sub: { id: "exam-batch-library-sub", title: "Exam Batch(Library)" },
  id: "test-01",
  title: "Test 1",
  negative: 0.5,
  duration: 20,
  text: `
১. প্রশ্ন এখানে?
<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>৫১তম প্রিলি. ও কম্বাইন্ড ব্যাচ - পরীক্ষা নং-০২ (মক টেস্ট)</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .option-label {
            user-select: none;
        }
    </style>
</head>
<body class="bg-slate-50 min-h-screen py-8 px-4">
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-10">
        <header class="text-center mb-8 border-b pb-4">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-800">REZA'S JOB CARE</h1>
            <p class="text-slate-600 font-medium mt-1">৫১তম প্রিলি. ও কম্বাইন্ড ব্যাচের বিষয়ভিত্তিক পরীক্ষা নং-০২ (৩৫তম-৫০তম বিসিএস ও নন-ক্যাডার প্রশ্ন)</p>
            <p class="text-xs text-rose-500 font-semibold mt-1">নিয়ম: প্রতি সঠিক উত্তর +১.০০, ভুল উত্তরের জন্য -০.৫০ নেগেটিভ মার্ক কাটা হবে[cite: 26, 27].</p>
            <div id="timer-container" class="mt-3 text-lg font-semibold text-rose-600 hidden">
                সময় বাকি: <span id="timer">৪৫:০০</span> মিনিট[cite: 26]
            </div>
        </header>

        <!-- Start Screen -->
        <div id="start-screen" class="text-center py-10">
            <p class="text-slate-700 text-lg mb-4">এই পরীক্ষায় মোট ১০০টি বহু নির্বাচনী (MCQ) প্রশ্ন রয়েছে[cite: 26, 27]। সাবমিট করার পর আপনার প্রাপ্ত নম্বর ও ফলাফল দেখতে পাবেন।</p>
            <button onclick="startQuiz()" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg shadow transition duration-200">
                পরীক্ষা শুরু করুন
            </button>
        </div>

        <!-- Quiz Form -->
        <form id="quiz-form" class="hidden space-y-8" onsubmit="submitQuiz(event)">
            <div id="questions-container" class="space-y-6">
                <!-- Questions injected dynamically -->
            </div>

            <div class="text-center pt-6 border-t">
                <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-10 rounded-lg shadow-lg transition duration-200 text-lg">
                    উত্তর জমা দিন (Submit)
                </button>
            </div>
        </form>

        <!-- Result Screen -->
        <div id="result-screen" class="hidden text-center py-8">
            <h2 class="text-3xl font-bold text-slate-800 mb-4">পরীক্ষার ফলাফল</h2>
            <div class="bg-slate-100 p-6 rounded-xl max-w-md mx-auto mb-6 shadow-inner text-left space-y-2">
                <p class="text-lg text-slate-700">সঠিক উত্তর: <span id="correct-count" class="font-bold text-emerald-600">০</span> টি (+<span id="positive-score">০</span>)</p>
                <p class="text-lg text-slate-700">ভুল উত্তর: <span id="wrong-count" class="font-bold text-rose-600">০</span> টি (-<span id="negative-score">০</span>)</p>
                <p class="text-lg text-slate-700">উত্তর দেননি: <span id="unanswered-count" class="font-bold text-amber-600">০</span> টি</p>
                <hr class="my-2 border-slate-300">
                <p class="text-xl text-slate-800 font-bold">মোট প্রাপ্ত নম্বর: <span id="score-display" class="text-3xl text-indigo-600">০</span> / ১০০[cite: 26, 27]</p>
                <p id="feedback-text" class="text-slate-600 mt-2 font-medium text-center"></p>
            </div>
            <button onclick="location.reload()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition duration-200">
                পুনরায় পরীক্ষা দিন
            </button>
        </div>
    </div>

    <script>
        const questionsData = [
            { id: 1, q: "\"Custom\" শব্দের পরিভাষা কোনটি যথার্থ?", options: ["আইন", "প্রথা", "শুল্ক", "রাজস্বনীতি"], correct: 1 },
            { id: 2, q: "'কল্লোল' পত্রিকার প্রথম সম্পাদকের নাম কি?", options: ["বুদ্ধদেব বসু", "দীনেশরঞ্জন দাশ", "সজনীকান্ত দাশ", "প্রেমেন্দ্র মিত্র"], correct: 1 },
            { id: 3, q: "What is a funny poem of five lines called?", options: ["Quartet", "Limerick", "Sixtet", "Haiku"], correct: 1 },
            { id: 4, q: "প্রধান বীজ উৎপাদনকারী সরকারি প্রতিষ্ঠান-", options: ["BARI", "BRRI", "BADC", "BINA"], correct: 2 },
            { id: 5, q: "বাংলাদেশে সরকারি EPZ সংখ্যা-", options: ["৬ টি", "৮ টি", "১০ টি", "১২ টি"], correct: 1 },
            { id: 6, q: "একটি আয়তক্ষেত্রের দৈর্ঘ্য ৫% বৃদ্ধি করলে তার ক্ষেত্রফল শতকরা কত বৃদ্ধি পাবে?", options: ["৫%", "১০%", "২০%", "২৫%"], correct: 0 },
            { id: 7, q: "সলোমন-দ্বীপপুঞ্জ কোন মহাসাগরে অবস্থিত?", options: ["ভারত মহাসাগর", "প্রশান্ত মহাসাগর", "আটলান্টিক মহাসাগর", "আর্কটিক মহাসাগর"], correct: 1 },
            { id: 8, q: "World Development Report নিম্নের কোন সংস্থাটির বার্ষিক প্রকাশনা?", options: ["UNDP", "World Bank", "IMF", "BRICS"], correct: 1 },
            { id: 9, q: "কোনটি নিরস্ত্রীকরণের সঙ্গে সম্পৃক্ত নয়?", options: ["NATO", "SALT", "NPT", "CTBT"], correct: 0 },
            { id: 10, q: "\"একটি ২ (দুই) ইনপুট লজিক সেটের আউটপুট হবে, যদি এর ইনপুটগুলো সমান হয়\"- এই উক্তিটি কোন সেটের জন্য সত্য।", options: ["AND", "NOR", "Ex-OR", "OR"], correct: 2 },
            { id: 11, q: "কোনটি জসীম উদ্দীনের নাটক?", options: ["রাখালী", "মাটির কান্না", "বেদের মেয়ে", "বোবা কাহিনী"], correct: 2 },
            { id: 12, q: "Which of following writers belongs to the romantic period in English literature?", options: ["A. Tennyson", "Alexander Pope", "John Dryden", "S.T. Coleridge"], correct: 3 },
            { id: 13, q: "বাংলাদেশে রোপা আমন ধান কাটা হয়-", options: ["আষাঢ়-শ্রাবণ মাসে", "ভাদ্র-আশ্বিন মাসে", "অগ্রহায়ণ-পৌষ মাসে", "মাঘ-ফাল্গুন"], correct: 2 },
            { id: 14, q: "'অগ্নিশ্বর' কি ফসলের উন্নতজাত?", options: ["ধান", "কলা", "পাট", "গম"], correct: 1 },
            { id: 15, q: "'He ran with great speed.' The underlined part of the sentence is a -", options: ["noun phrase", "adverbial phrase", "adjective phrase", "participle phrase"], correct: 1 },
            { id: 16, q: "War and Peace উপন্যাসের রচয়িতা-", options: ["লিও টলষ্টয়", "ডেভিড রিকার্ডো", "কার্ল মার্কস", "জেন অস্টিন"], correct: 0 },
            { id: 17, q: "৫০ মিনিট আগে সময় ছিল ৪টা বেজে ৪৫ মিনিট, ৬টা বাজতে আর কতক্ষণ সময় বাকি আছে?", options: ["১৫ মিনিট", "২০ মিনিট", "২৫ মিনিট", "৩০ মিনিট"], correct: 2 },
            { id: 18, q: "মস্তিষ্ক কোন তন্ত্রের অঙ্গ?", options: ["স্নায়ুতন্ত্রের", "রেচন তন্ত্রের", "পরিপাক তন্ত্রের", "শ্বাস তন্ত্রের"], correct: 0 },
            { id: 19, q: "Find out the meaning of the following phrase: 'By and large'", options: ["verb large", "on the whole", "far away", "the largest one"], correct: 1 },
            { id: 20, q: "নিচের কোন মেমোরিটি Non-volatile?", options: ["SRAM", "DRAM", "ROM", "উপরের সবগুলোই"], correct: 2 },
            { id: 21, q: "12টি পুস্তক থেকে 5টি কত প্রকারে বাছাই করা যায় যেখানে 2টি পুস্তক সর্বদাই অন্তর্ভুক্ত থাকবে?", options: ["252", "792", "224", "120"], correct: 3 },
            { id: 22, q: "Which of the following words can be used as a verb?", options: ["Mister", "Mistress", "Master", "Mastery"], correct: 2 },
            { id: 23, q: "যদি তেলের মূল্য ২৫% বৃদ্ধি পায় তবে তেলের ব্যবহার শতকরা কত কমালে তেল বাবদ ব্যয় বৃদ্ধি পাবে না?", options: ["১৬%", "২০%", "২৫%", "২৪%"], correct: 1 },
            { id: 24, q: "আয়না থেকে ২ ফুট দুরত্বে দাঁড়িয়ে, আয়নাতে আপনার প্রতিবিম্ব কতদূর দেখা যাবে?", options: ["৫ ফুট", "৪ ফুট", "৩ ফুট", "২ ফুট"], correct: 3 },
            { id: 25, q: "'Making of a Nation Bangladesh' গ্রন্থের রচয়িতা কে?", options: ["কামাল হোসেন", "নুরুল ইসলাম", "এস.এ. করিম", "আনিসুর রহমান"], correct: 1 },
            { id: 26, q: "৬ সে.মি. ব্যাসার্ধ বিশিষ্ট বৃত্তের অন্তঃস্থ একটি সমবাহু ত্রিভুজের ক্ষেত্রফল-", options: ["২১√৩ বর্গ সে.মি.", "২৩√২ বর্গ সে.মি.", "২৫√৩ বর্গ সে.মি.", "২৭√৩ বর্গ সে.মি."], correct: 3 },
            { id: 27, q: "নিম্নের কোনটি বেকিং পাউডারের মূল উপাদানের সংকেত?", options: ["CaCO3", "NaHCO3", "NH4HCO3", "(NH4)2CO3"], correct: 1 },
            { id: 28, q: "Education is enlightening. Here 'enlightening' is:", options: ["A gerund", "A participle", "An infinitive", "A finite verb"], correct: 1 },
            { id: 29, q: "কলার দাম 20% কমে যাওয়ায় 12 টাকায় পূর্ব অপেক্ষা 2টি কলা বেশি পাওয়া গেলে বর্তমানে একটি কলার দাম কত টাকা?", options: ["1.50", "2.50", "3.00", "1.2"], correct: 3 },
            { id: 30, q: "x - 3 < 5 হলে-", options: ["2 < x < 8", "-2 < x < 8", "-8 < x < -2", "-4 < x < -2"], correct: 1 },
            { id: 31, q: "সবচেয়ে কম বয়সে কোন লেখক বাংলা একাডেমি পুরস্কার পান?", options: ["শওকত আলী", "সেলিনা হোসেন", "আখতারুজ্জামান ইলিয়াস", "সৈয়দ শামসুল হক"], correct: 3 },
            { id: 32, q: "Who is the author of the first scientific romance 'The Time Machine'?", options: ["H. G. Wells", "Samuel Butler", "Henry James", "George Moore"], correct: 0 },
            { id: 33, q: "৩, ৭, ৪, ১৪, ৫, ২১, ৬ ধারার অষ্টম সংখ্যাটি কত হবে?", options: ["৬", "৭", "২৮", "২৯"], correct: 2 },
            { id: 34, q: "জাতিসংঘের কোন সংস্থা বার্ষিক বিশ্ব বিনিয়োগ প্রতিবেদন প্রকাশ করে?", options: ["WTO", "MIGA", "World Bank", "UNCTAD"], correct: 3 },
            { id: 35, q: "দক্ষিণ গোলার্ধে উষ্ণতম মাস কোনটি?", options: ["জানুয়ারি", "ফেব্রুয়ারি", "ডিসেম্বর", "মে"], correct: 0 },
            { id: 36, q: "বাংলা পুঁথি সাহিত্যের উদাহরণ কোনটি?", options: ["নূরনামা", "আমীর হামজা", "গুলি চন্দ্রের সন্ন্যাস", "মহুয়া"], correct: 1 },
            { id: 37, q: "2/3, 4/5 ও 5/6 ভগ্নাংশগুলোর লঘিষ্ঠ সাধারণ গুণিতক (ল.সা.গু) হবে:", options: ["20", "10", "60/1", "অন্যান্য"], correct: 0 },
            { id: 38, q: "হার্ট থেকে রক্ত বাইরে নিয়ে যায় যে রক্তনালী-", options: ["ভেইন", "আর্টারি", "ক্যাপিলারি", "নার্ভ"], correct: 1 },
            { id: 39, q: "সূর্যের নিকটতম নক্ষত্রের নাম-", options: ["ভেগা", "প্রক্সিমা সেন্টাউরি", "আলফা সেন্টাউরি A", "আলফা সেন্টাউরি B"], correct: 1 },
            { id: 40, q: "০.১২ + ০.০০১২ + ০.০০০০১২ + ... ধারাটির অসীম পদ পর্যন্ত যোগফল-", options: ["12/99", "12/19", "14/99", "12/19"], correct: 0 },
            { id: 41, q: "'All the perfumes of Arabia will not sweeten this little hand.'- Who said this?", options: ["Macbeth", "Lady Macbeth", "Lady Macduff", "Macduff"], correct: 1 },
            { id: 42, q: "'Let there be Light'-বিখ্যাত ছবিটি পরিচালনা করেন-", options: ["আমজাদ হোসেন", "জহির রায়হান", "খান আতাউর রহমান", "শেখ নিয়ামত আলী"], correct: 1 },
            { id: 43, q: "কোন কঠিন পদার্থ বিশুদ্ধ নাকি অবিশুদ্ধ তা কীসের মাধ্যমে নির্ণয় করা যায়?", options: ["ঘনীভবন", "বাষ্পীভবন", "গলনাংক", "স্ফুটনাংক"], correct: 2 },
            { id: 44, q: "যুক্তরাষ্ট্রে রপ্তানি বাণিজ্যের বৃহত্তম বাজার কোথায়?", options: ["ইইউ", "ভারত", "কানাডা", "চীন"], correct: 2 },
            { id: 45, q: "যদি (25)²ˣ⁺³ = (5)³ˣ⁺⁶ হয়, তবে x = কত?", options: ["0", "1", "-1", "4"], correct: 0 },
            { id: 46, q: "বাংলাদেশের বাইরে প্রথম শহীদ মিনার স্থাপিত হয় .........", options: ["যুক্তরাজ্যে", "যুক্তরাষ্ট্রে", "ভারতে", "পাকিস্তানে"], correct: 0 },
            { id: 47, q: "বাংলাদেশের মোট দেশজ উৎপাদনে কৃষিখাতের অবদান-", options: ["নিয়মিতভাবে বৃদ্ধি পাচ্ছে", "অনিয়মিতভাবে বৃদ্ধি পাচ্ছে", "ক্রমহ্রাসমান", "অপরিবর্তিত থাকছে"], correct: 2 },
            { id: 48, q: "কোন গল্পকারের গল্পে ম্যাজিক রিয়েলিজমের প্রতিফলন ঘটেছে?", options: ["জ্যোতিপ্রকাশ দত্ত", "রিজিয়া রহমান", "শহীদুল জহির", "দিলারা হাশেম"], correct: 2 },
            { id: 49, q: "The antonym of 'boisterous' is-", options: ["noisy", "quiet", "unruly", "cheerful"], correct: 1 },
            { id: 50, q: "3x - y = 3, 5x + y = 21 হলে (x, y) এর মান-", options: ["(2, 5)", "(2, 6)", "(3, 5)", "(3, 6)"], correct: 3 },
            { id: 51, q: "একটি সিলিন্ডারের বৃত্তীয় তলের ব্যাসার্ধ ২ সে.মি. এবং উচ্চতা ৬ সে.মি. হলে, উহার তলগুলির মোট ক্ষেত্রফল কত?", options: ["১৬ বর্গ সে.মি.", "৩২ বর্গ সে.মি.", "৩৬ বর্গ সে.মি.", "৪৮ বর্গ সে.মি."], correct: 1 },
            { id: 52, q: "\"তুমি মা কল্পতরু, আমরা সব পোষাগরু\" এই কবিতাংশটির রচয়িতা কে?", options: ["রঙ্গলাল বন্দ্যোপাধ্যায়", "ঈশ্বরচন্দ্র বিদ্যাসাগর", "হেমচন্দ্র বন্দ্যোপাধ্যায়", "ঈশ্বরচন্দ্র গুপ্ত"], correct: 3 },
            { id: 53, q: "'Ulysses' is a poem written by-", options: ["Robert Browning", "Wordsworth", "S.T. Coleridge", "Alfred Tennyson"], correct: 3 },
            { id: 54, q: "ঐতিহাসিক ৭ মার্চের ভাষণ সংবিধানের কোন তফসিলে আছে?", options: ["চতুর্থ তফসিল", "পঞ্চম তফসিল", "ষষ্ঠ তফসিল", "সপ্তম তফসিল"], correct: 1 },
            { id: 55, q: "যদি log(a/b) + log(b/a) = log(a+b) হয়, তবে-", options: ["a+b = 1", "a-b = 1", "a = b", "a²-b² = 1"], correct: 0 },
            { id: 56, q: "'দেশের যত নদীর ধারা জল না, ওরা অশ্রুধারা।' এই উক্তিটি নিচের কোন পারিভাষিক অলংকার দ্বারা শোভিত?", options: ["অপহৃতি", "যমক", "অর্থোন্নতি", "অভিযোজন"], correct: 0 },
            { id: 57, q: "Indentify the right tense: 'My father --- before I came'.", options: ["would be leaving", "had been leaving", "had left", "will leave"], correct: 2 },
            { id: 58, q: "এক মেশিন থেকে অন্য মেশিনে ই-মেইল মেসেজ স্থানান্তর করতে কোন TCP/IP প্রটোকল ব্যবহার হয়?", options: ["FTP", "RPC", "SNMP", "SMTP"], correct: 3 },
            { id: 59, q: "একদল গরু প্রতিবার সমান সংখ্যায় ভাগ হয়ে তিন পথে গমন করে, সাত ঘাটে পানি পান করে, নয়টি বৃক্ষের নিচে ঘুমায় এবং বারো জন গোয়ালা সমান সংখ্যক গরুর দুধ দোয়ায়' তাহলে গরুর সংখ্যা কত?", options: ["522", "252", "225", "155"], correct: 1 },
            { id: 60, q: "২log₂ 3 + log₂ 5 এর মান কত?", options: ["8", "2", "45", "10"], correct: 2 },
            { id: 61, q: "এক ব্যক্তি ৫ মাইল পশ্চিমে, ২ মাইল দক্ষিণে, এর পর আবার ৫ মাইল পশ্চিমে যায়। যাত্রাস্থান থেকে তার সরাসরি দূরত্ব কত?", options: ["৮ মাইল", "১৫ মাইল", "১২ মাইল", "কোনটিই নয়"], correct: 3 },
            { id: 62, q: "Who is not an Irish writer?", options: ["Oscar Wilde", "James Joyce", "Jonathan Swift", "D. H. Lawrence"], correct: 3 },
            { id: 63, q: "0.6 কে 0.9 দ্বারা ভাগ করলে, নিচের কোনটি সঠিক?", options: ["0.6", "0.9", "0.23", "0.3"], correct: 0 },
            { id: 64, q: "একটি ব্যাগে 2 টি লাল, 3 টি সবুজ এবং 2 টি নীল বল আছে। যদি দৈবভাবে 2 টি বল নেওয়া হয়, তাহলে বল দুইটির কোনটিই নীল হওয়ার সম্ভাবনা কত?", options: ["2/7", "10/21", "5/21", "3/7"], correct: 1 },
            { id: 65, q: "'পরিবার থেকেই শিক্ষার শুরু'- এখানে 'থেকে' শব্দের ব্যাকরণিক পরিচয় কী?", options: ["উপসর্গ", "প্রত্যয়", "ধাতু", "বলক"], correct: 3 },
            { id: 66, q: "The novel 'Wuthering Heights' was penned by the author under the penname.", options: ["Ellise Bellet", "Ellis Belle", "Ellis Bell", "Una Elis"], correct: 2 },
            { id: 67, q: "x² + 6x - 27 < 0 অসমতাটির সমাধান সেট নিচের কোনটি?", options: ["[-9, 3]", "[3, ∞]", "(-9, 3)", "(-∞, -9)"], correct: 2 },
            { id: 68, q: "একটি বই 10% ক্ষতিতে বিক্রি করা হইল। বিক্রয়মূল্য 60 টাকা বেশী হলে 5% লাভ হত। বইটির ক্রয়মূল্য কত টাকা?", options: ["200", "300", "400", "500"], correct: 2 },
            { id: 69, q: "'We know that the earth is a planet' The underlined part is a/an-", options: ["noun clause", "adverbial clause", "adjective clause", "principal clause"], correct: 0 },
            { id: 70, q: "বাংলাদেশের সবচেয়ে বড় গণমাধ্যম নিয়ন্ত্রক সংস্থা কোনটি?", options: ["তথ্য মন্ত্রণালয়", "প্রেস কাউন্সিল", "বিটিআরসি", "বাংলাদেশ টেলিভিশন"], correct: 1 },
            { id: 71, q: "Which sentence is correct?", options: ["The picture was hanged on the wall", "The picture was hung on the wall", "The picture was hunged on the wall", "The picture had hanged on the wall"], correct: 1 },
            { id: 72, q: "যদি একটি গাড়ীর গতি দ্বিগুণ করা হয়, তবে গাড়ীটির গতিশক্তি পূর্বের গতিশক্তির কতগুণ হবে?", options: ["০.৫", "২", "০.২৫", "৪"], correct: 3 },
            { id: 73, q: "What is the antonym of percipience", options: ["shrewdness", "dullness", "discerning", "astuteness"], correct: 1 },
            { id: 74, q: "Which functions both as a transitive and an intransitive verb?", options: ["sleep", "arrive", "break", "die"], correct: 2 },
            { id: 75, q: "বাংলাদেশের পদ্মা ও যমুনা নদীর শাখা নদীগুলো কোনগুলো?", options: ["গড়াই ও মধুমতী", "মহানন্দা ও বংশী", "মহানন্দা ও আত্রাই", "গড়াই ও ধলেশ্বরী"], correct: 3 },
            { id: 76, q: "বাংলাদেশে রপ্তানী আয়ের প্রধান উৎস কোনটি?", options: ["জনশক্তি রপ্তানী", "তৈরি পোশাক রপ্তানী", "জাতিসংঘ শান্তি মিশনে শান্তিরক্ষী প্রেরণ", "চামড়া জাতীয় পণ্য রপ্তানী"], correct: 1 },
            { id: 77, q: "বস্তুর ওজন পৃথিবীর কোন স্থানে সবচেয়ে বেশি?", options: ["মেরু অঞ্চল", "নিরক্ষীয় অঞ্চল", "একটি পাহাড়ের চূড়ায়", "পৃথিবীর কেন্দ্রে"], correct: 0 },
            { id: 78, q: "জারিনের জন্ম ২৯ ফেব্রুয়ারী। তার জন্মগ্রহণের সাল কোনটি হতে পারে?", options: ["২০০২", "২০০৪", "২০০৬", "২০১০"], correct: 1 },
            { id: 79, q: "Be careful, don't --- your keys?", options: ["lose", "loose", "loss", "lost"], correct: 0 },
            { id: 80, q: "BOOK শব্দের বর্ণগুলোকে মোট কতভাবে বিন্যস্ত করা যায়?", options: ["18", "16", "14", "12"], correct: 3 },
            { id: 81, q: "আন্তর্জাতিক অপরাধ আদালতে (ICC) এর প্রধান কার্যালয় কোথায়?", options: ["জেনেভা", "প্যারিস", "নিউইয়র্ক", "দ্য হেগ"], correct: 3 },
            { id: 82, q: "মানবদেহে রক্তের গ্রুপ-এর মধ্যে নিচের কোনটি সর্বজনীন গ্রহীতা (Universal Recipient)?", options: ["A+", "B+", "AB+", "O+"], correct: 2 },
            { id: 83, q: "--- gold is a precious metal.", options: ["a", "an", "the", "None of the above"], correct: 3 },
            { id: 84, q: "কোন অঙ্গ মানুষের শরীরে ইনসুলিন উৎপাদন করে?", options: ["প্যানক্রিয়াস", "লিভার", "কিডনি", "হার্ট"], correct: 0 },
            { id: 85, q: "প্রতিবছর বাংলাদেশে বেশি মানুষ মারা যায় কোনটির ফলে?", options: ["রোড এক্সিডেন্ট", "সাইক্লোন", "বন্যা", "নদীভাঙন"], correct: 0 },
            { id: 86, q: "বাংলাদেশ ফিফার সদস্যপদ লাভ করে কত সালে?", options: ["১৯৭২", "১৯৭৩", "১৯৭৪", "১৯৭৬"], correct: 3 },
            { id: 87, q: "Choose the correct statment.", options: ["The boy gave his examination.", "The boy took his examination", "The teacher took his examination", "The boy gave off his examination"], correct: 1 },
            { id: 88, q: "কোনটি অসংক্রামক রোগ?", options: ["কালো জ্বর", "ডায়াবেটিস", "টাইফয়েড", "আমাশয়"], correct: 1 },
            { id: 89, q: "বাংলাদেশে গণভোট অনুষ্ঠিত হয়েছিল কত সালে?", options: ["১৯৭৬", "১৯৮২", "১৯৭৭", "১৯৭৫"], correct: 2 },
            { id: 90, q: "'আমূল' শব্দের ব্যাসবাক্য কোনটি?", options: ["নয় মূল", "মূল থেকে", "মূল পর্যন্ত", "ন মূল"], correct: 2 },
            { id: 91, q: "What is the antonym to the word 'appropriate'?", options: ["Parallel", "Synonymous", "Hostile", "Inappropriate"], correct: 3 },
            { id: 92, q: "কোনটি মাতৃপ্রধান উপজাতি?", options: ["চাকমা", "ঘুমি", "খাসিয়া", "মারমা"], correct: 2 },
            { id: 93, q: "Two-thirds of the bridge --- constructed so far,", options: ["have been", "are", "has been", "were"], correct: 2 },
            { id: 94, q: "যদি 2x + 1/x = 3 হয় তবে, x² + 1/x² = কত?", options: ["5", "3", "7", "4"], correct: 0 },
            { id: 95, q: "যদি একটি বর্গের বাহুগুলো ২০% বাড়ানো হয়, তাহলে এর ক্ষেত্রফল কত শতাংশ বৃদ্ধি পাবে?", options: ["২০%", "৪৪%", "২১%", "৪০%"], correct: 1 },
            { id: 96, q: "Which one is the correct sentence?", options: ["I will call you when I have time.", "I will call you when I will have time.", "I will call you when I am having time.", "None of the above."], correct: 0 },
            { id: 97, q: "ছোলা কোন শ্রেণির উদ্ভিদ?", options: ["গুল্ম", "একবর্ষজীবী", "উপগুল্ম", "বীরুৎ"], correct: 3 },
            { id: 98, q: "'Big Bang Theory'র ব্যাখ্যা উপস্থাপন করেন-", options: ["বার্নার", "স্টিফেন হকিং", "ডারউইন", "নিউটন"], correct: 1 },
            { id: 99, q: "কম্পিউটার-টু কম্পিউটার তথ্য আদান-প্রদানের প্রযুক্তিকে বলা হয়-", options: ["ই-মেইল", "ইন্টারকম", "ইন্টারনেট", "কমিউনিকেশন"], correct: 2 },
            { id: 100, q: "বাংলাদেশের প্রধান আইন কর্মকর্তা হলেন-", options: ["আইন সচিব", "অ্যাটর্নি জেনারেল", "আইনমন্ত্রী", "প্রধান বিচারপতি"], correct: 1 }
        ];

        function startQuiz() {
            document.getElementById('start-screen').classList.add('hidden');
            document.getElementById('quiz-form').classList.remove('hidden');
            document.getElementById('timer-container').classList.remove('hidden');
            
            const container = document.getElementById('questions-container');
            let html = '';
            
            questionsData.forEach((item, index) => {
                html += `
                    <div class="p-5 bg-slate-50 border border-slate-200 rounded-lg shadow-sm">
                        <p class="font-semibold text-slate-800 mb-3">${index + 1}. ${item.q}</p>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                `;
                item.options.forEach((opt, optIndex) => {
                    html += `
                        <label onclick="handleOptionClick(event, ${index}, ${optIndex})" class="option-label flex items-center space-x-3 p-2.5 rounded border border-slate-200 bg-white hover:bg-slate-100 cursor-pointer transition">
                            <input type="radio" id="q${index}_opt${optIndex}" name="q${index}" value="${optIndex}" class="text-indigo-600 focus:ring-indigo-500 h-4 w-4 pointer-events-none">
                            <span class="text-slate-700 text-sm pointer-events-none">${opt}</span>
                        </label>
                    `;
                });
                html += `</div></div>`;
            });
            container.innerHTML = html;
            startTimer(45 * 60, document.getElementById('timer'));
        }

        function handleOptionClick(event, qIndex, optIndex) {
            event.preventDefault();
            const radio = document.getElementById(`q${qIndex}_opt${optIndex}`);
            if (radio.checked) {
                radio.checked = false;
            } else {
                radio.checked = true;
            }
        }

        function startTimer(duration, display) {
            let timer = duration, minutes, seconds;
            const interval = setInterval(function () {
                minutes = parseInt(timer / 60, 10);
                seconds = parseInt(timer % 60, 10);

                minutes = minutes < 10 ? "০" + minutes : minutes;
                seconds = seconds < 10 ? "০" + seconds : seconds;

                display.textContent = minutes + ":" + seconds;

                if (--timer < 0) {
                    clearInterval(interval);
                    alert("সময় শেষ! আপনার উত্তর স্বয়ংক্রিয়ভাবে জমা হচ্ছে।");
                    document.getElementById('quiz-form').dispatchEvent(new Event('submit'));
                }
            }, 1000);
        }

        function submitQuiz(event) {
            event.preventDefault();
            let correctCount = 0;
            let wrongCount = 0;
            let unansweredCount = 0;
            
            questionsData.forEach((item, index) => {
                const selected = document.querySelector(`input[name="q${index}"]:checked`);
                const questionBox = document.querySelectorAll('#questions-container > div')[index];
                
                if (selected) {
                    const val = parseInt(selected.value);
                    if (val === item.correct) {
                        correctCount++;
                        questionBox.classList.add('border-emerald-500', 'bg-emerald-50/40');
                    } else {
                        wrongCount++;
                        questionBox.classList.add('border-rose-500', 'bg-rose-50/40');
                    }
                } else {
                    unansweredCount++;
                    questionBox.classList.add('border-amber-500', 'bg-amber-50/40');
                }
            });

            const positiveScore = correctCount * 1.0;
            const negativeScore = wrongCount * 0.50;
            const netScore = positiveScore - negativeScore;

            document.getElementById('quiz-form').classList.add('hidden');
            document.getElementById('result-screen').classList.remove('hidden');

            document.getElementById('correct-count').textContent = correctCount;
            document.getElementById('positive-score').textContent = positiveScore.toFixed(2);
            document.getElementById('wrong-count').textContent = wrongCount;
            document.getElementById('negative-score').textContent = negativeScore.toFixed(2);
            document.getElementById('unanswered-count').textContent = unansweredCount;
            document.getElementById('score-display').textContent = netScore.toFixed(2);

            let feedback = "";
            if (netScore >= 80) feedback = "চমৎকার প্রস্তুতি! আপনি পরীক্ষার জন্য দারুণভাবে প্রস্তুত।";
            else if (netScore >= 60) feedback = "ভালো প্রস্তুতি! তবে নেগেটিভ মার্কিংয়ের দিকে একটু খেয়াল রাখবেন।";
            else feedback = "আরও পড়াশোনা ও নেগেটিভ মার্কিং এড়ানোর চর্চা প্রয়োজন।";
            
            document.getElementById('feedback-text').textContent = feedback;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    </script>
</body>
</html>
});
