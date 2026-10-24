export type HouseId = "gryffindor" | "slytherin" | "hufflepuff" | "ravenclaw";

export type MenuCategory = "potions" | "pastries" | "specials";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  /** Price in Uzbek so'm. */
  price: number;
  image: string;
  category: MenuCategory;
  tags: string[];
  house?: HouseId;
}

export interface House {
  id: HouseId;
  name: string;
  traits: string;
  element: string;
  /** Hat's verdict, shown when the quiz lands on this house. */
  verdict: string;
  specialId: string;
  colors: {
    primary: string;
    secondary: string;
    /** Vivid tone that reads on the dark night background. */
    accent: string;
    glow: string;
  };
}

export interface QuizOption {
  label: string;
  house: HouseId;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizOption[];
}

export interface District {
  name: string;
  minutes: number;
  owl: string;
}

export const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=80`;

export const IMAGES = {
  hero: unsplash("1481627834876-b7833e8f5570"),
  library: unsplash("1507842217343-583bb7270b66"),
  nightSky: unsplash("1519681393784-d120267933ba"),
  cafe: unsplash("1501339847302-ac426a4a7cbb"),
  latteArt: unsplash("1572442388796-11668a67e53d"),
  cauldronCake: unsplash("1541783245831-57d6fb0926d3"),
  treacleTart: unsplash("1535920527002-b35e96722eb9"),
} as const;

export const MENU_CATEGORIES: { id: MenuCategory; label: string; blurb: string }[] = [
  {
    id: "potions",
    label: "Potions & Elixirs",
    blurb: "Brewed to order by our resident Potions Master.",
  },
  {
    id: "pastries",
    label: "Cauldron Cakes & Pastries",
    blurb: "Baked at dawn, enchanted by noon.",
  },
  {
    id: "specials",
    label: "House Specials",
    blurb: "One treat per house. Choose wisely — or let the Hat choose.",
  },
];

export const MENU: MenuItem[] = [
  // Potions & Elixirs
  {
    id: "butterbeer-latte",
    name: "Butterbeer Latte",
    description:
      "Double espresso, butterscotch cream and a cloud of salted-caramel foam. Leaves a moustache, as it should.",
    price: 42000,
    image: IMAGES.latteArt,
    category: "potions",
    tags: ["Signature", "Hot"],
  },
  {
    id: "felix-felicis-raf",
    name: "Felix Felicis Honey Raf",
    description:
      "Liquid luck: a velvety raf with mountain honey from Urgut and a whisper of vanilla. Your day will go suspiciously well.",
    price: 44000,
    image: unsplash("1470337458703-46ad1756a187"),
    category: "potions",
    tags: ["Bestseller"],
  },
  {
    id: "pumpkin-spice-elixir",
    name: "Pumpkin Spice Elixir",
    description:
      "Roasted pumpkin, cinnamon, clove and oat milk — stirred clockwise three times under a waxing moon.",
    price: 39000,
    image: unsplash("1485808191679-5f86510681a2"),
    category: "potions",
    tags: ["Seasonal", "Vegan option"],
  },
  {
    id: "polyjuice-cold-brew",
    name: "Polyjuice Cold Brew",
    description:
      "18-hour cold brew poured over tonic and blood orange. It changes colour as you sip — side effects may vary.",
    price: 36000,
    image: unsplash("1461023058943-07fcbe16d735"),
    category: "potions",
    tags: ["Iced"],
  },
  {
    id: "amortentia-cappuccino",
    name: "Amortentia Rose Cappuccino",
    description:
      "Rose, cardamom and a pinch of pink pepper. Smells different to everyone — mostly like your crush.",
    price: 41000,
    image: unsplash("1516743619420-154b70a65fea"),
    category: "potions",
    tags: ["Floral"],
  },
  {
    id: "dragons-breath-espresso",
    name: "Dragon’s Breath Espresso",
    description:
      "A fierce double ristretto with chilli-cacao. Not for the faint of heart — Gryffindors, please proceed.",
    price: 28000,
    image: unsplash("1514432324607-a09d9b4aefdd"),
    category: "potions",
    tags: ["Strong"],
  },

  // Cauldron Cakes & Pastries
  {
    id: "treacle-tart",
    name: "Treacle Tart",
    description:
      "The Chosen One’s favourite. Golden syrup, lemon zest and a buttery lattice of shortcrust.",
    price: 34000,
    image: IMAGES.treacleTart,
    category: "pastries",
    tags: ["Classic"],
  },
  {
    id: "cauldron-cake",
    name: "Cauldron Cake",
    description:
      "A molten dark-chocolate cauldron bubbling over with ganache and a dusting of edible gold.",
    price: 38000,
    image: IMAGES.cauldronCake,
    category: "pastries",
    tags: ["Signature", "Warm"],
  },
  {
    id: "golden-snitch-cupcake",
    name: "Golden Snitch Cupcake",
    description:
      "Cocoa sponge, hazelnut cream and a gilded praline snitch on top. Catch it before it flies off.",
    price: 45000,
    image: unsplash("1603532648955-039310d9ed75"),
    category: "pastries",
    tags: ["Bestseller"],
  },
  {
    id: "chocolate-frogs",
    name: "Chocolate Frogs",
    description:
      "Dark-chocolate praline frogs (they only hop a little). Every box hides a collectible wizard card.",
    price: 26000,
    image: unsplash("1481391319762-47dff72954d9"),
    category: "pastries",
    tags: ["Giftable"],
  },
  {
    id: "pumpkin-pasty",
    name: "Pumpkin Pasty",
    description:
      "Flaky, sugar-dusted pastry filled with roasted pumpkin and cinnamon — straight off the trolley.",
    price: 29000,
    image: unsplash("1555507036-ab1f4038808a"),
    category: "pastries",
    tags: ["Flaky"],
  },
  {
    id: "samarkand-non",
    name: "Hogsmeade × Samarkand Non",
    description:
      "Our nod to home: sweet cardamom non stamped with runes, served warm with kaymak and Urgut honey.",
    price: 30000,
    image: unsplash("1509440159596-0249088772ff"),
    category: "pastries",
    tags: ["Local legend"],
  },

  // House Specials — also the Sorting Hat's recommendations
  {
    id: "gryffindor-red-velvet-pie",
    name: "Gryffindor Red Velvet Pie",
    description:
      "Crimson velvet and sour-cherry lattice beneath a lion’s share of cream cheese and gold leaf.",
    price: 48000,
    image: unsplash("1464305795204-6f5bbfc7fb81"),
    category: "specials",
    tags: ["Gryffindor"],
    house: "gryffindor",
  },
  {
    id: "slytherin-mint-matcha",
    name: "Slytherin Mint Matcha Latte",
    description:
      "Ceremonial matcha, Black Lake mint and silky oat foam. Cool, ambitious, impossibly smooth.",
    price: 45000,
    image: unsplash("1515823064-d6e0c04616a7"),
    category: "specials",
    tags: ["Slytherin"],
    house: "slytherin",
  },
  {
    id: "hufflepuff-honey-swirl",
    name: "Hufflepuff Honey Swirl",
    description:
      "Warm cardamom-cinnamon swirls glazed in wildflower honey. Baked in batches big enough to share — obviously.",
    price: 32000,
    image: unsplash("1509365465985-25d11c17e812"),
    category: "specials",
    tags: ["Hufflepuff"],
    house: "hufflepuff",
  },
  {
    id: "ravenclaw-moonberry-cheesecake",
    name: "Ravenclaw Moonberry Cheesecake",
    description:
      "Vanilla-bean cheesecake under a midnight-blue blueberry compote. Wit beyond measure, sweetness beyond reason.",
    price: 42000,
    image: unsplash("1567171466295-4afa63d45416"),
    category: "specials",
    tags: ["Ravenclaw"],
    house: "ravenclaw",
  },
];

export const MENU_BY_ID: Record<string, MenuItem> = Object.fromEntries(
  MENU.map((item) => [item.id, item]),
);

export const HOUSES: Record<HouseId, House> = {
  gryffindor: {
    id: "gryffindor",
    name: "Gryffindor",
    traits: "Brave · Daring · Bold of palate",
    element: "Fire",
    verdict:
      "Plenty of nerve, I see — and an appetite to match. You’d storm the kitchens for the last slice… better be GRYFFINDOR!",
    specialId: "gryffindor-red-velvet-pie",
    colors: { primary: "#7f0909", secondary: "#d3a625", accent: "#c43a3a", glow: "rgba(211, 166, 37, 0.55)" },
  },
  slytherin: {
    id: "slytherin",
    name: "Slytherin",
    traits: "Cunning · Ambitious · Refined",
    element: "Water",
    verdict:
      "A mind for strategy and a taste for the finer things. You never order — you negotiate… SLYTHERIN!",
    specialId: "slytherin-mint-matcha",
    colors: { primary: "#1a472a", secondary: "#c0c7c2", accent: "#3f8f5f", glow: "rgba(63, 143, 95, 0.6)" },
  },
  hufflepuff: {
    id: "hufflepuff",
    name: "Hufflepuff",
    traits: "Loyal · Patient · Always shares",
    element: "Earth",
    verdict:
      "Ah, a warm heart and a generous plate. You’d split your last pastry seven ways… HUFFLEPUFF!",
    specialId: "hufflepuff-honey-swirl",
    colors: { primary: "#ecb939", secondary: "#372e29", accent: "#ecb939", glow: "rgba(236, 185, 57, 0.55)" },
  },
  ravenclaw: {
    id: "ravenclaw",
    name: "Ravenclaw",
    traits: "Wise · Witty · Endlessly curious",
    element: "Air",
    verdict:
      "Oh, a curious mind — you read the whole menu, footnotes included. There’s only one place for you… RAVENCLAW!",
    specialId: "ravenclaw-moonberry-cheesecake",
    colors: { primary: "#0e1a40", secondary: "#b08a4a", accent: "#4a6fd1", glow: "rgba(90, 130, 220, 0.55)" },
  },
};

export const QUIZ: QuizQuestion[] = [
  {
    id: "ingredient",
    prompt: "Choose your favourite potion ingredient…",
    options: [
      { label: "Moonlit mint from the Black Lake", house: "slytherin" },
      { label: "Phoenix-feather ember spice", house: "gryffindor" },
      { label: "Starlit lavender from the Astronomy Tower", house: "ravenclaw" },
      { label: "Golden honey from the castle hives", house: "hufflepuff" },
    ],
  },
  {
    id: "midnight",
    prompt: "It’s midnight in the castle. Where would we find you?",
    options: [
      { label: "Baking for friends by the common-room fire", house: "hufflepuff" },
      { label: "In the library — just one more chapter", house: "ravenclaw" },
      { label: "Sneaking to the kitchens on a dare", house: "gryffindor" },
      { label: "Quietly plotting tomorrow’s triumph", house: "slytherin" },
    ],
  },
  {
    id: "charm",
    prompt: "Which charm would you cast on your morning cup?",
    options: [
      { label: "Incendio — fiery hot, no hesitation", house: "gryffindor" },
      { label: "Engorgio — make it a double, for sharing", house: "hufflepuff" },
      { label: "Glacius — ice-cold and perfectly composed", house: "slytherin" },
      { label: "Wingardium Leviosa — light as floating foam", house: "ravenclaw" },
    ],
  },
];

export const DELIVERY = {
  freeFrom: 150000,
  fee: 12000,
  hours: "08:00 — 23:00",
} as const;

export const DISTRICTS: District[] = [
  { name: "Registan", minutes: 15, owl: "Hedwig" },
  { name: "Gur-e-Amir", minutes: 18, owl: "Hedwig" },
  { name: "Siab Bazaar", minutes: 20, owl: "Pigwidgeon" },
  { name: "Bibi-Khanym", minutes: 20, owl: "Pigwidgeon" },
  { name: "University Blvd", minutes: 22, owl: "Hermes" },
  { name: "Shah-i-Zinda", minutes: 24, owl: "Hermes" },
  { name: "Afrosiyob Station", minutes: 30, owl: "Errol" },
  { name: "Ulugbek Observatory", minutes: 32, owl: "Errol" },
];
