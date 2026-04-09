
export const MAL_BASE_IMAGE = "https://cdn.myanimelist.net/images/anime/";
export const MAL_BASE_CHAR = "https://cdn.myanimelist.net/images/characters/";

export const CATEGORY_CONFIG = [
  { id: "anime2025", title: "Best Anime of 2025" },
  { id: "isekai", title: "Best Isekai" },
  { id: "shone", title: "Best Shonen" },
  { id: "big3", title: "Best Big 3" },
  { id: "nextgen", title: "Best New Gen Anime" },
  { id: "winter2026", title: "Best of Spring 2026" },
  { id: "donghua", title: "Best Donghua" }
];

export const VOTING_CATEGORIES = {
  anime2025: [
    { id: 1, name: "Solo Leveling S2", votes: 0, img: "1448/147351", chars: ["9/536361", "2/540692", "15/583246"] },
    { id: 8, name: "Sakamoto Days", votes: 0, img: "1026/146459", chars: ["10/591047", "7/508475", "7/548406"] },
    { id: 5, name: "Chainsaw Man - Movie: Reze Arc", votes: 0, img: "1763/150638", chars: ["3/492407", "10/618421", "7/494969"] },
    { id: 10, name: "Orb: On the Movements of the Earth", votes: 0, img: "1749/145922", chars: ["10/564208", "13/566636", "13/574778"] },
    { id: 6, name: "The Apothecary Diaries S2", votes: 0, img: "1025/147458", chars: ["16/371204", "9/511065", "4/468711"] },
    { id: 7, name: "Gachiakuta", votes: 0, img: "1682/150432", chars: ["2/486858", "14/486859", "5/616658"] },
    { id: 9, name: "MHA: Vigilantes", votes: 0, img: "1538/148604", chars: ["6/577670", "10/577672", "11/577673"] },
    { id: 2, name: "Tobe Hero X", votes: 0, img: "1492/150628", chars: ["15/590525", "14/627309", "15/591683"] },
    { id: 4, name: "Lord of Mysteries", votes: 0, img: "1622/150761", chars: ["4/520529", "15/598886", "15/520691"] },
    { id: 3, name: "My Hero Academia", votes: 0, img: "1959/151055", chars: ["14/310613", "7/299404", "12/299406"] },
  ],
  isekai: [
    { id: 3, name: "Mushoku Tensei", votes: 0, img: "1898/138005", chars: ["2/423667", "10/423669", "6/545654"] },
    { id: 4, name: "Re:Zero", votes: 0, img: "1348/110644", chars: ["15/315153", "16/551926", "9/311327"] },
    { id: 5, name: "Overlord", votes: 0, img: "1530/120110", chars: ["10/508402", "14/578183", "13/321387"] },
    { id: 1, name: "Reincarnated as a slime", votes: 0, img: "1211/143476", chars: ["4/495795", "7/360786", "12/476920"] },
    { id: 10, name: "The devil is a part timer", votes: 0, img: "3/50177", chars: ["3/183237", "7/206523", "8/205261"] },
    { id: 6, name: "Shield Hero", votes: 0, img: "1122/114141", chars: ["6/266009", "6/374252", "2/464618"] },
    { id: 2, name: "Eminence in Shadow", votes: 0, img: "/1938/138295", chars: ["7/461218", "16/491824", "9/486844"] },
    { id: 9, name: "No Game No Life", votes: 0, img: "1074/111944", chars: ["12/274345", "16/246723", "12/274341"] },
    { id: 8, name: "Sword art online", votes: 0, img: "1698/142753", chars: ["7/204821", "11/453263", "4/367313"] },
    { id: 7, name: "Saga of Tanya", votes: 0, img: "7/89945", chars: ["2/512958", "12/370126", "15/320029"] },
  ],
  shone: [
    { id: 4, name: "One piece", votes: 0, img: "1810/139965", chars: ["9/310307", "3/100534", "15/523099"] },
    { id: 2, name: "Jujutsu Kaisen", votes: 0, img: "1659/154920", chars: ["6/467646", "15/422168", "2/392689"] },
    { id: 5, name: "Naruto Shippuden", votes: 0, img: "1477/120172", chars: ["2/284121", "9/131317", "9/69275"] },
    { id: 1, name: "Demon Slayer", votes: 0, img: "1286/99889", chars: ["6/386735", "2/378254", "10/459689"] },
    { id: 6, name: "Black Clover", votes: 0, img: "1232/93334", chars: ["8/312836", "6/318765", "14/338844"] },
    { id: 7, name: "Bleach", votes: 0, img: "1908/135431", chars: ["3/512788", "16/139189", "16/73909"] },
    { id: 8, name: "My Hero Academia", votes: 0, img: "1959/151055", chars: ["14/310613", "7/299404", "12/299406"] },
    { id: 9, name: "Hunter x Hunter", votes: 0, img: "1940/139867", chars: ["11/174517", "2/327920", "3/174561"] },
    { id: 10, name: "Dragon Ball Super", votes: 0, img: "1903/110225", chars: ["15/72546", "14/86185", "5/375125"] },
    { id: 3, name: "Attack on titan", votes: 0, img: "1948/120625", chars: ["10/216895", "9/215563", "8/220267"] },
  ],
  big3: [
    { id: 1, name: "One Piece", votes: 0, img: "1810/139965", chars: ["9/310307", "3/100534", "15/523099"] },
    { id: 3, name: "Bleach: TYBW", votes: 0, img: "1908/135431", chars: ["3/512788", "16/139189", "16/73909"] },
    { id: 2, name: "Naruto Shippuden", votes: 0, img: "1477/120172", chars: ["2/284121", "9/131317", "9/69275"] }
  ],
  nextgen: [
    { id: 10, name: "Dr Stone", votes: 0, img: "1071/124921", chars: ["9/508361", "4/478454", "10/387866"] },
    { id: 9, name: "Kaiju No. 8", votes: 0, img: "1177/150344", chars: ["4/592901", "15/556696", "14/531193"] },
    { id: 4, name: "Dandadan", votes: 0, img: "1721/149001", chars: ["7/562295", "5/531081", "14/471823"] },
    { id: 5, name: "Sakamoto Days", votes: 0, img: "1026/146459", chars: ["10/591047", "7/508475", "7/548406"] },
    { id: 1, name: "Jujustu Kaisen", votes: 0, img: "1659/154920", chars: ["6/467646", "15/422168", "2/392689"] },
    { id: 8, name: "Hell's Paradise", votes: 0, img: "1772/154456", chars: ["5/497163", "8/497169", "5/497165"] },
    { id: 7, name: "Blue Lock", votes: 0, img: "1258/126929", chars: ["6/558080", "7/509663", "14/491180"] },
    { id: 6, name: "Chainsaw Man", votes: 0, img: "1763/150638", chars: ["3/492407", "10/618421", "7/494969"] },
    { id: 2, name: "Demon Slayer", votes: 0, img: "1286/99889", chars: ["6/386735", "2/378254", "10/459689"] },
    { id: 3, name: "Frieren", votes: 0, img: "1921/154528", chars: ["7/525105", "12/619183", "7/621924"] },
  ],
  winter2026: [
    { id: 6, name: "MHA: Vigilantes", votes: 0, img: "1538/148604", chars: ["6/577670", "10/577672", "11/577673"] },
    { id: 3, name: "Fire Force Final", votes: 0, img: "1527/146836", chars: ["9/627776", "8/594733", "10/496649"] },
    { id: 9, name: "Dr. Stone: Science Future", votes: 0, img: "1071/124921", chars: ["9/508361", "4/478454", "10/387866"] },
    { id: 5, name: "Oshi no ko S3", votes: 0, img: "1979/153329", chars: ["8/512509", "5/496454", "6/496453"] },
    { id: 3, name: "Frieren S2", votes: 0, img: "1921/154528", chars: ["7/525105", "12/619183", "7/621924"] },
    { id: 7, name: "Sentenced to be a Hero", votes: 0, img: "1062/151911", chars: ["7/576375", "5/576374", "14/581615"] },
    { id: 4, name: "Hell's Paradise S2", votes: 0, img: "1772/154456", chars: ["5/497163", "8/497169", "5/497165"] },
    { id: 1, name: "Jujutsu Kaisen S3", votes: 0, img: "1659/154920", chars: ["6/467646", "15/422168", "2/392689"] },
    { id: 8, name: "Fate/strange Fake", votes: 0, img: "1752/150192", chars: ["10/618385", "14/618176", "12/338672"] },
    { id: 10, name: "Dead Account", votes: 0, img: "1622/154192", chars: ["6/585099", "16/585101", "10/585100"] },
  ],
  
  donghua: [
    { id: 3, name: "Link Click", votes: 0, img: "1135/114867", chars: ["2/491898", "11/464608", "3/464609"] },
    { id: 2, name: "Lord of mysteries", votes: 0, img: "1622/150761", chars: ["4/520529", "15/598886", "15/520691"] },
    { id: 4, name: "Scissor Seven", votes: 0, img: "1962/153860", chars: ["13/410959", "14/416716", "14/501761"] },
    { id: 6, name: "The King's Avatar", votes: 0, img: "1147/126723l", chars: ["6/425074", "/15/328709", "11/329179"] },
    { id: 9, name: "Daily life of the immortal king", votes: 0, img: "1674/105500", chars: ["13/614469", "16/623796", "5/424005"] },
    { id: 7, name: "Fog Hill of Five Elements", votes: 0, img: "1983/147467", chars: ["16/520803", "15/520100", "11/524286"] },
    { id: 8, name: "A Will Eternal", votes: 0, img: "1999/155867", chars: ["3/614391", "9/614884", "2/614864"] },
    { id: 10, name: "Super Cube", votes: 0, img: "1759/145944", chars: ["2/619405", "6/595262", "9/598498"] },
    { id: 1, name: "To Be Hero X", votes: 0, img: "1492/150628", chars: ["15/590525", "14/627309", "15/591683"] },
    { id: 5, name: "Sentenced to be a Hero", votes: 0, img: "1062/151911", chars: ["7/576375", "5/576374", "14/581615"] },
  ]
};

export default { MAL_BASE_IMAGE, MAL_BASE_CHAR, CATEGORY_CONFIG, VOTING_CATEGORIES };