export type Trade =
  | "Plumber"
  | "Electrician"
  | "Carpenter"
  | "Painter"
  | "Builder"
  | "Roofer"
  | "Landscaper"
  | "Handyman";

export type Availability =
  | "Available now"
  | "Available this week"
  | "Booked till Tue"
  | "Booked till next week";

export interface Tradie {
  id: string;
  name: string;
  trade: Trade;
  photo: string;
  suburb: string;
  city: string;
  rating: number;
  reviews: number;
  yearsExp: number;
  distanceKm: number;
  hourlyRate: number;
  bio: string;
  portfolio: string[];
  badges: { abn: boolean; whiteCard: boolean; insurance: boolean; police: boolean };
  specialties: string[];
  responseTime: string;
  jobsDone: number;
  availability: Availability;
  featuredReview: { text: string; author: string; suburb: string };
}

const portrait = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;

const folio = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=80`;

export const TRADIES: Tradie[] = [
  {
    id: "t1",
    name: "Liam O'Sullivan",
    trade: "Plumber",
    photo: portrait("1521119989659-a83eee488004"),
    suburb: "Bondi",
    city: "Sydney",
    rating: 4.9,
    reviews: 127,
    yearsExp: 12,
    distanceKm: 2.3,
    hourlyRate: 110,
    bio: "G'day! Master plumber with 12 years across Sydney. Specialise in burst pipes, hot water systems and bathroom renos. No call-out fee for emergencies.",
    portfolio: [
      folio("1585704032915-c3400ca199e7"),
      folio("1607400201515-c2c41c07d307"),
      folio("1584622781564-1d987f7333c1"),
      folio("1581244277943-fe4a9c777189"),
    ],
    badges: { abn: true, whiteCard: true, insurance: true, police: true },
    specialties: ["Hot water", "Bathroom renos", "Emergency leaks"],
    responseTime: "Replies in ~12 min",
    jobsDone: 482,
    availability: "Available now",
    featuredReview: {
      text: "Liam was a legend — fixed our burst pipe at 11pm on a Sunday. Cleaned up after himself too.",
      author: "Sarah K.",
      suburb: "Bondi",
    },
  },
  {
    id: "t2",
    name: "Jack Thompson",
    trade: "Electrician",
    photo: portrait("1568602471122-7832951cc4c5"),
    suburb: "Surry Hills",
    city: "Sydney",
    rating: 4.8,
    reviews: 94,
    yearsExp: 9,
    distanceKm: 4.1,
    hourlyRate: 125,
    bio: "Licensed sparky. Smart home installs, EV chargers and full rewires. NSW Master Electricians member. Quality work, fair prices.",
    portfolio: [
      folio("1621905251918-48416bd8575a"),
      folio("1558618666-fcd25c85cd64"),
      folio("1565608438257-fac3c27beb36"),
      folio("1558002038-1055907df827"),
    ],
    badges: { abn: true, whiteCard: true, insurance: true, police: true },
    specialties: ["EV chargers", "Smart home", "Switchboard upgrades"],
    responseTime: "Replies in ~8 min",
    jobsDone: 312,
    availability: "Available this week",
    featuredReview: {
      text: "Installed our Wallbox in 4 hours. Tidy work, explained everything. Top bloke.",
      author: "David M.",
      suburb: "Paddington",
    },
  },
  {
    id: "t3",
    name: "Oliver Nguyen",
    trade: "Carpenter",
    photo: portrait("1500648767791-00dcc994a43e"),
    suburb: "Fremantle",
    city: "Perth",
    rating: 4.9,
    reviews: 156,
    yearsExp: 15,
    distanceKm: 6.7,
    hourlyRate: 95,
    bio: "Heritage carpenter and joiner. From decks to full timber kitchens. Old-school craftsmanship with modern precision. Based in Freo.",
    portfolio: [
      folio("1504148455328-c376907d081c"),
      folio("1565374395542-0ce18882c857"),
      folio("1503387762-592deb58ef4e"),
      folio("1556909114-f6e7ad7d3136"),
    ],
    badges: { abn: true, whiteCard: true, insurance: true, police: false },
    specialties: ["Decks", "Timber kitchens", "Heritage"],
    responseTime: "Replies in ~25 min",
    jobsDone: 621,
    availability: "Available this week",
    featuredReview: {
      text: "Built us a stunning blackbutt deck. Not a single nail out of place. Worth every cent.",
      author: "Emma B.",
      suburb: "Fremantle",
    },
  },
  {
    id: "t4",
    name: "Noah Williams",
    trade: "Painter",
    photo: portrait("1507003211169-0a1dd7228f2d"),
    suburb: "South Yarra",
    city: "Melbourne",
    rating: 4.7,
    reviews: 88,
    yearsExp: 8,
    distanceKm: 3.4,
    hourlyRate: 80,
    bio: "Interior and exterior. Specialise in heritage Victorian terraces — lime washes and proper prep work. Tidy, on time, no surprises.",
    portfolio: [
      folio("1562259949-e8e7689d7828"),
      folio("1589939705384-5185137a7f0f"),
      folio("1581922814484-0b48460b7010"),
      folio("1560448204-e02f11c3d0e2"),
    ],
    badges: { abn: true, whiteCard: true, insurance: true, police: true },
    specialties: ["Heritage Victorians", "Spray finish", "Lime wash"],
    responseTime: "Replies in ~18 min",
    jobsDone: 274,
    availability: "Booked till Tue",
    featuredReview: {
      text: "Re-painted our 1890s terrace. Picked the heritage colour palette for us — looked museum-grade.",
      author: "Tom &amp; Rachel",
      suburb: "South Yarra",
    },
  },
  {
    id: "t5",
    name: "William Chen",
    trade: "Builder",
    photo: portrait("1519085360753-af0119f7cbe7"),
    suburb: "New Farm",
    city: "Brisbane",
    rating: 4.9,
    reviews: 211,
    yearsExp: 18,
    distanceKm: 5.8,
    hourlyRate: 145,
    bio: "Registered builder. Extensions, second storeys and full knockdown rebuilds. QBCC licensed. Featured in Houses Magazine 2024.",
    portfolio: [
      folio("1503387762-592deb58ef4e"),
      folio("1545324418-cc1a3fa10c00"),
      folio("1572025442646-866d16c84a54"),
      folio("1600585154340-be6161a56a0c"),
    ],
    badges: { abn: true, whiteCard: true, insurance: true, police: true },
    specialties: ["Extensions", "Knockdown rebuilds", "Second storeys"],
    responseTime: "Replies in ~45 min",
    jobsDone: 89,
    availability: "Booked till next week",
    featuredReview: {
      text: "Will managed our second-storey extension end-to-end. Came in on budget, three days early.",
      author: "James &amp; Priya",
      suburb: "New Farm",
    },
  },
  {
    id: "t6",
    name: "Thomas Bailey",
    trade: "Roofer",
    photo: portrait("1531123897727-8f129e1688ce"),
    suburb: "Manly",
    city: "Sydney",
    rating: 4.8,
    reviews: 73,
    yearsExp: 11,
    distanceKm: 8.9,
    hourlyRate: 105,
    bio: "Coastal roofer. Colorbond, terracotta and slate. Storm damage assessments and insurance reports. 10-year workmanship warranty.",
    portfolio: [
      folio("1632759145351-1d76daabd66f"),
      folio("1503594384566-461fe158e797"),
      folio("1605276374104-dee2a0ed3cd6"),
      folio("1542621334-a254cf47733d"),
    ],
    badges: { abn: true, whiteCard: true, insurance: true, police: false },
    specialties: ["Colorbond", "Storm damage", "Insurance reports"],
    responseTime: "Replies in ~30 min",
    jobsDone: 198,
    availability: "Available this week",
    featuredReview: {
      text: "Storm took half our roof. Tom had us watertight by sundown and dealt with the insurer. Saviour.",
      author: "Mark D.",
      suburb: "Manly",
    },
  },
  {
    id: "t7",
    name: "James Patel",
    trade: "Landscaper",
    photo: portrait("1506794778202-cad84cf45f1d"),
    suburb: "Balmain",
    city: "Sydney",
    rating: 4.9,
    reviews: 142,
    yearsExp: 13,
    distanceKm: 5.2,
    hourlyRate: 90,
    bio: "Designed landscapes for over 800 inner-west homes. Native gardens, retaining walls, decks and outdoor kitchens. Sustainable focus.",
    portfolio: [
      folio("1416879595882-3373a0480b5b"),
      folio("1558904541-efa843a96f01"),
      folio("1602491453631-e2a5ad90a131"),
      folio("1558618666-fcd25c85cd64"),
    ],
    badges: { abn: true, whiteCard: true, insurance: true, police: true },
    specialties: ["Native gardens", "Retaining walls", "Outdoor kitchens"],
    responseTime: "Replies in ~20 min",
    jobsDone: 367,
    availability: "Available this week",
    featuredReview: {
      text: "Transformed our concrete jungle into a native oasis. Sandstone walls are works of art.",
      author: "Olivia R.",
      suburb: "Balmain",
    },
  },
  {
    id: "t8",
    name: "Lucas Romano",
    trade: "Handyman",
    photo: portrait("1463453091185-61582044d556"),
    suburb: "Subiaco",
    city: "Perth",
    rating: 4.8,
    reviews: 309,
    yearsExp: 7,
    distanceKm: 1.8,
    hourlyRate: 75,
    bio: "Your get-it-done guy. Flat-pack assembly, picture hanging, gutter cleaning, leaky taps — if it's broken, I'll fix it. Same-day service.",
    portfolio: [
      folio("1581578017093-cd30fce4eeb7"),
      folio("1581578731548-c64695cc6952"),
      folio("1572125675722-238a4f1f8ea3"),
      folio("1572297870735-ba60e3679f57"),
    ],
    badges: { abn: true, whiteCard: false, insurance: true, police: true },
    specialties: ["Same-day", "Flat-pack", "Small repairs"],
    responseTime: "Replies in ~5 min",
    jobsDone: 1240,
    availability: "Available now",
    featuredReview: {
      text: "Booked at 9am, fixed by midday. The guy's a machine — and great with our dog.",
      author: "Hannah W.",
      suburb: "Subiaco",
    },
  },
  {
    id: "t9",
    name: "Henry Mitchell",
    trade: "Plumber",
    photo: portrait("1564564321837-a57b7070ac4f"),
    suburb: "Carlton",
    city: "Melbourne",
    rating: 4.7,
    reviews: 64,
    yearsExp: 6,
    distanceKm: 4.6,
    hourlyRate: 95,
    bio: "Gas-fitting and hydronic heating specialist. Reliable, clean and fully licensed. VBA registered. No job too small.",
    portfolio: [
      folio("1607472586893-edb57bdc0e39"),
      folio("1581094288338-2314dddb7ece"),
      folio("1611117775350-ac3950990985"),
      folio("1604762524889-3e2fcc145683"),
    ],
    badges: { abn: true, whiteCard: true, insurance: true, police: true },
    specialties: ["Gas fitting", "Hydronic heating", "Hot water"],
    responseTime: "Replies in ~15 min",
    jobsDone: 156,
    availability: "Available this week",
    featuredReview: {
      text: "Henry quoted us a full hydronic system installation, came in lower than three competitors and finished early.",
      author: "Daniel L.",
      suburb: "Carlton",
    },
  },
  {
    id: "t10",
    name: "Ethan Walker",
    trade: "Electrician",
    photo: portrait("1570295999919-56ceb5ecca61"),
    suburb: "West End",
    city: "Brisbane",
    rating: 4.9,
    reviews: 178,
    yearsExp: 14,
    distanceKm: 3.1,
    hourlyRate: 130,
    bio: "Solar and battery specialist. Tesla Powerwall certified installer. Helping Queensland homes go off-grid since 2018.",
    portfolio: [
      folio("1509391366360-2e959784a276"),
      folio("1466611653911-95081537e5b7"),
      folio("1605980625600-88c1cc8d9e29"),
      folio("1509395176047-4a66953fd231"),
    ],
    badges: { abn: true, whiteCard: true, insurance: true, police: true },
    specialties: ["Solar", "Battery storage", "Off-grid"],
    responseTime: "Replies in ~10 min",
    jobsDone: 421,
    availability: "Booked till Tue",
    featuredReview: {
      text: "Designed our 13kW solar + battery setup. Slashed our power bill from $640 to $42 a quarter.",
      author: "Lachlan F.",
      suburb: "West End",
    },
  },
  {
    id: "t11",
    name: "Cooper Bennett",
    trade: "Carpenter",
    photo: portrait("1500648767791-00dcc994a43e"),
    suburb: "Cottesloe",
    city: "Perth",
    rating: 4.8,
    reviews: 95,
    yearsExp: 10,
    distanceKm: 7.4,
    hourlyRate: 100,
    bio: "Custom built-ins, wardrobes and feature walls. Workshop in O'Connor. I treat your home like my own.",
    portfolio: [
      folio("1556909114-f6e7ad7d3136"),
      folio("1505691938895-1758d7feb511"),
      folio("1555041469-a586c61ea9bc"),
      folio("1565374395542-0ce18882c857"),
    ],
    badges: { abn: true, whiteCard: true, insurance: true, police: true },
    specialties: ["Built-ins", "Wardrobes", "Feature walls"],
    responseTime: "Replies in ~22 min",
    jobsDone: 288,
    availability: "Available this week",
    featuredReview: {
      text: "Cooper built our entire wardrobe wall in oak veneer. Looks like a Nordic showroom.",
      author: "Sienna T.",
      suburb: "Cottesloe",
    },
  },
  {
    id: "t12",
    name: "Mason Riley",
    trade: "Painter",
    photo: portrait("1492562080023-ab3db95bfbce"),
    suburb: "Paddington",
    city: "Brisbane",
    rating: 4.9,
    reviews: 116,
    yearsExp: 11,
    distanceKm: 2.9,
    hourlyRate: 85,
    bio: "Premium residential painter. Queenslanders are my speciality — weatherboards, VJ panels and pressed metal ceilings. Dulux Accredited.",
    portfolio: [
      folio("1588854337236-6889d631faa8"),
      folio("1572297870735-ba60e3679f57"),
      folio("1599619351208-3e6c839d6828"),
      folio("1562259949-e8e7689d7828"),
    ],
    badges: { abn: true, whiteCard: true, insurance: true, police: true },
    specialties: ["Queenslanders", "Weatherboards", "Heritage colours"],
    responseTime: "Replies in ~14 min",
    jobsDone: 342,
    availability: "Available this week",
    featuredReview: {
      text: "Restored our 1920s Queenslander to its original glory. The neighbours keep stopping by to ask who did it.",
      author: "Ben &amp; Annie",
      suburb: "Paddington",
    },
  },
  {
    id: "t13",
    name: "Hudson Clarke",
    trade: "Builder",
    photo: portrait("1578765393056-37c7a85b3eb1"),
    suburb: "Mosman",
    city: "Sydney",
    rating: 4.9,
    reviews: 86,
    yearsExp: 22,
    distanceKm: 9.2,
    hourlyRate: 165,
    bio: "Custom luxury builder. Architect-collaborated homes, harbour-front renos. HIA member. 30+ year warranty on structural.",
    portfolio: [
      folio("1600585154340-be6161a56a0c"),
      folio("1545324418-cc1a3fa10c00"),
      folio("1600596542815-ffad4c1539a9"),
      folio("1605146769289-440113cc3d00"),
    ],
    badges: { abn: true, whiteCard: true, insurance: true, police: true },
    specialties: ["Luxury homes", "Architect-led", "Harbour-front"],
    responseTime: "Replies in ~1 hr",
    jobsDone: 47,
    availability: "Booked till next week",
    featuredReview: {
      text: "Hudson's team delivered our $4.2M harbour reno six weeks ahead of schedule. Absolute professionals.",
      author: "Catherine V.",
      suburb: "Mosman",
    },
  },
  {
    id: "t14",
    name: "Archer Donovan",
    trade: "Landscaper",
    photo: portrait("1542178243-bc20204b769f"),
    suburb: "Toorak",
    city: "Melbourne",
    rating: 4.8,
    reviews: 124,
    yearsExp: 11,
    distanceKm: 6.1,
    hourlyRate: 110,
    bio: "Award-winning landscape designer. MIFGS finalist 2023. Pools, formal gardens and entertaining decks. We turn yards into destinations.",
    portfolio: [
      folio("1558904541-efa843a96f01"),
      folio("1416879595882-3373a0480b5b"),
      folio("1582268611958-ebfd161ef9cf"),
      folio("1572297870735-ba60e3679f57"),
    ],
    badges: { abn: true, whiteCard: true, insurance: true, police: true },
    specialties: ["Pools", "Formal gardens", "Entertaining"],
    responseTime: "Replies in ~25 min",
    jobsDone: 92,
    availability: "Available this week",
    featuredReview: {
      text: "Archer designed and built our entire backyard — pool, deck, pergola. Got an article in Belle Magazine.",
      author: "Alexandra P.",
      suburb: "Toorak",
    },
  },
  {
    id: "t15",
    name: "Riley O'Connor",
    trade: "Roofer",
    photo: portrait("1556157382-97eda2d62296"),
    suburb: "Hamilton",
    city: "Brisbane",
    rating: 4.9,
    reviews: 102,
    yearsExp: 13,
    distanceKm: 4.4,
    hourlyRate: 115,
    bio: "Specialist roofer for character homes. Slate restoration, copper guttering, terracotta. We treat every roof like a heritage asset.",
    portfolio: [
      folio("1605276374104-dee2a0ed3cd6"),
      folio("1503594384566-461fe158e797"),
      folio("1632759145351-1d76daabd66f"),
      folio("1542621334-a254cf47733d"),
    ],
    badges: { abn: true, whiteCard: true, insurance: true, police: true },
    specialties: ["Slate", "Copper", "Terracotta restoration"],
    responseTime: "Replies in ~18 min",
    jobsDone: 211,
    availability: "Available this week",
    featuredReview: {
      text: "Riley re-slated our 1908 home with original Welsh slate. Heritage panel signed it off without a single note.",
      author: "Jonathon H.",
      suburb: "Hamilton",
    },
  },
];

export const CITIES = ["Sydney", "Melbourne", "Brisbane", "Perth"] as const;

export const TRADE_CATEGORIES: { id: Trade; label: string; emoji: string; jobs: number }[] = [
  { id: "Plumber", label: "Plumber", emoji: "🔧", jobs: 1284 },
  { id: "Electrician", label: "Electrician", emoji: "⚡", jobs: 967 },
  { id: "Carpenter", label: "Carpenter", emoji: "🪚", jobs: 743 },
  { id: "Painter", label: "Painter", emoji: "🎨", jobs: 612 },
  { id: "Builder", label: "Builder", emoji: "🏗️", jobs: 489 },
  { id: "Roofer", label: "Roofer", emoji: "🏠", jobs: 358 },
  { id: "Landscaper", label: "Landscaper", emoji: "🌿", jobs: 421 },
  { id: "Handyman", label: "Handyman", emoji: "🛠️", jobs: 1502 },
];

export interface Message {
  id: string;
  from: "customer" | "tradie";
  text: string;
  time: string;
  type?: "text" | "quote" | "schedule";
  meta?: { title?: string; price?: number; date?: string };
}

export interface ChatThread {
  tradieId: string;
  unread: number;
  lastSeen: string;
  messages: Message[];
}

export const CHATS: ChatThread[] = [
  {
    tradieId: "t1",
    unread: 2,
    lastSeen: "online now",
    messages: [
      { id: "m1", from: "customer", text: "Hey Liam! My hot water system's leaking from the bottom. Reckon it's done for?", time: "9:14 AM" },
      { id: "m2", from: "tradie", text: "G'day mate. Sounds like a tank failure. How old is the unit?", time: "9:18 AM" },
      { id: "m3", from: "customer", text: "About 11 years. It's a Rheem 250L.", time: "9:19 AM" },
      { id: "m4", from: "tradie", text: "Yeah, end of life. I'd recommend replacing rather than patching. Can pop round this arvo to take a look.", time: "9:22 AM" },
      { id: "m5", from: "tradie", text: "Sending through a quick quote 👇", time: "9:23 AM" },
      { id: "m6", from: "tradie", text: "", time: "9:23 AM", type: "quote", meta: { title: "Hot water system replacement", price: 2380 } },
      { id: "m7", from: "customer", text: "Thanks mate. That's reasonable. Can we do tomorrow morning?", time: "9:31 AM" },
      { id: "m8", from: "tradie", text: "", time: "9:33 AM", type: "schedule", meta: { date: "Tue 5 May, 8:30 AM" } },
      { id: "m9", from: "tradie", text: "Confirmed for tomorrow. I'll bring the new unit and remove the old one. Cheers 👍", time: "9:33 AM" },
    ],
  },
  {
    tradieId: "t2",
    unread: 0,
    lastSeen: "active 14 min ago",
    messages: [
      { id: "m1", from: "customer", text: "Hi Jack — interested in getting an EV charger installed for a Model Y.", time: "Yesterday" },
      { id: "m2", from: "tradie", text: "Easy. Single phase or three phase at the property?", time: "Yesterday" },
      { id: "m3", from: "customer", text: "Three phase I think. Built in 2019.", time: "Yesterday" },
      { id: "m4", from: "tradie", text: "Sweet — 22kW Wallbox Pulsar Plus would fly. Fully installed for…", time: "Yesterday" },
      { id: "m5", from: "tradie", text: "", time: "Yesterday", type: "quote", meta: { title: "Wallbox 22kW + install", price: 2640 } },
      { id: "m6", from: "customer", text: "Sounds good — locked in 👌", time: "Today" },
    ],
  },
  {
    tradieId: "t5",
    unread: 1,
    lastSeen: "active 2 hr ago",
    messages: [
      { id: "m1", from: "customer", text: "Will, we're considering an upstairs extension on our New Farm Queenslander. Two bed + bath.", time: "Mon" },
      { id: "m2", from: "tradie", text: "Beautiful — that style of home is my specialty. Rough budget you're working to?", time: "Mon" },
      { id: "m3", from: "customer", text: "Around the $380-450k mark.", time: "Mon" },
      { id: "m4", from: "tradie", text: "Realistic for the scope. I can come measure up Thursday and have concept sketches by the following week.", time: "Mon" },
      { id: "m5", from: "tradie", text: "", time: "Tue", type: "schedule", meta: { date: "Thu 8 May, 10:00 AM" } },
    ],
  },
];

export const DASHBOARD_CHART = [
  { day: "Mon", matches: 4 },
  { day: "Tue", matches: 7 },
  { day: "Wed", matches: 6 },
  { day: "Thu", matches: 9 },
  { day: "Fri", matches: 12 },
  { day: "Sat", matches: 8 },
  { day: "Sun", matches: 5 },
  { day: "Mon", matches: 11 },
  { day: "Tue", matches: 14 },
  { day: "Wed", matches: 10 },
  { day: "Thu", matches: 16 },
  { day: "Fri", matches: 19 },
  { day: "Sat", matches: 13 },
  { day: "Sun", matches: 9 },
];

export const INVESTOR_GROWTH = [
  { month: "Jul", customers: 1200, tradies: 180, gmv: 42 },
  { month: "Aug", customers: 1850, tradies: 270, gmv: 78 },
  { month: "Sep", customers: 2940, tradies: 410, gmv: 142 },
  { month: "Oct", customers: 4120, tradies: 560, gmv: 218 },
  { month: "Nov", customers: 5680, tradies: 740, gmv: 296 },
  { month: "Dec", customers: 6890, tradies: 920, gmv: 358 },
  { month: "Jan", customers: 7740, tradies: 1040, gmv: 401 },
  { month: "Feb", customers: 8932, tradies: 1247, gmv: 487 },
];

export const MRR_PROJECTION = [
  { month: "M0", label: "Now", mrr: 43, actual: true, milestone: "Series A" },
  { month: "M3", label: "Aug '26", mrr: 78, actual: false, milestone: null },
  { month: "M6", label: "Nov '26", mrr: 124, actual: false, milestone: null },
  { month: "M9", label: "Feb '27", mrr: 168, actual: false, milestone: null },
  { month: "M12", label: "May '27", mrr: 218, actual: false, milestone: "$2M ARR" },
  { month: "M14", label: "Jul '27", mrr: 264, actual: false, milestone: "Break-even" },
  { month: "M18", label: "Nov '27", mrr: 358, actual: false, milestone: null },
  { month: "M24", label: "May '28", mrr: 510, actual: false, milestone: "$6M ARR" },
];

export const COMPETITORS = [
  {
    name: "TradieMatch",
    self: true,
    model: "Subscription",
    matching: "1-to-1 swipe",
    mobile: "Mobile-first native",
    fees: "$0 customer / $89 tradie",
    quality: "Verified ABN + insurance",
    founded: 2025,
  },
  {
    name: "HiPages",
    self: false,
    model: "Lead pay-per-click",
    matching: "Mass broadcast",
    mobile: "Web-first",
    fees: "$30-95 / lead",
    quality: "Self-attested",
    founded: 2004,
  },
  {
    name: "Oneflare",
    self: false,
    model: "Lead pay-per-click",
    matching: "Mass broadcast",
    mobile: "Web-first",
    fees: "$25-80 / lead",
    quality: "Self-attested",
    founded: 2012,
  },
  {
    name: "Airtasker",
    self: false,
    model: "Bid-based",
    matching: "Race-to-bottom",
    mobile: "Mobile",
    fees: "15-22% take rate",
    quality: "Customer reviews only",
    founded: 2012,
  },
];

export const TESTIMONIALS = [
  {
    type: "tradie",
    text: "Pro tier paid for itself in week one. I've booked $14k of work this month — without lifting a finger on marketing.",
    author: "Jack Thompson",
    role: "Electrician · Surry Hills",
    photo: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=200&q=80",
  },
  {
    type: "customer",
    text: "Found a plumber, got a quote, and had a leak fixed by lunchtime. Felt like ordering an Uber.",
    author: "Sarah K.",
    role: "Customer · Bondi",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    type: "tradie",
    text: "I've been on HiPages for 8 years burning $3k/month on dead leads. Switched to TradieMatch in March, never going back.",
    author: "William Chen",
    role: "Builder · New Farm",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
  },
];

export const PRESS = [
  { name: "AFR", display: "Australian Financial Review" },
  { name: "news.com.au", display: "news.com.au" },
  { name: "The Australian", display: "The Australian" },
  { name: "Sydney Morning Herald", display: "Sydney Morning Herald" },
  { name: "Startup Daily", display: "Startup Daily" },
];

export interface Scenario {
  id: string;
  name: string;
  capture: string;
  badge: string;
  tone: "navy" | "orange" | "success";
  popular?: boolean;
  rows: { metric: string; y1: string; y2: string; y3: string }[];
  valuation: string;
  roi: string;
}

export const SCENARIOS: Scenario[] = [
  {
    id: "conservative",
    name: "Conservative",
    capture: "1% of AU tradie market",
    badge: "Safe floor",
    tone: "navy",
    rows: [
      { metric: "Paying tradies (EOY)", y1: "800", y2: "3,500", y3: "8,000" },
      { metric: "Annual revenue", y1: "$340K", y2: "$2.1M", y3: "$5.8M" },
      { metric: "EBITDA", y1: "−$380K", y2: "+$300K", y3: "+$2.3M" },
    ],
    valuation: "$45M – $70M",
    roi: "50× – 80×",
  },
  {
    id: "realistic",
    name: "Realistic",
    capture: "3% of AU tradie market",
    badge: "Base case",
    tone: "orange",
    popular: true,
    rows: [
      { metric: "Paying tradies (EOY)", y1: "1,500", y2: "6,000", y3: "13,500" },
      { metric: "Annual revenue", y1: "$680K", y2: "$3.8M", y3: "$9.8M" },
      { metric: "EBITDA", y1: "−$170K", y2: "+$1.4M", y3: "+$5.0M" },
    ],
    valuation: "$80M – $120M",
    roi: "90× – 140×",
  },
  {
    id: "ambitious",
    name: "Ambitious",
    capture: "5% + NZ expansion",
    badge: "Upside case",
    tone: "success",
    rows: [
      { metric: "Paying tradies (EOY)", y1: "2,500", y2: "10,000", y3: "22,000" },
      { metric: "Annual revenue", y1: "$1.1M", y2: "$6.2M", y3: "$15.0M" },
      { metric: "EBITDA", y1: "+$50K", y2: "+$2.8M", y3: "+$8.0M" },
    ],
    valuation: "$150M – $220M",
    roi: "175× – 260×",
  },
];

export const TEAM = [
  {
    name: "Braxton Harkotsikas",
    role: "Founder & Strategic Sponsor",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    bio: "Capital, strategic vision, network access across Australian construction & marketing companies. Direct supply-side advantage: thousands of tradie relationships through existing operations.",
    commitment: "1 day/week · Board-level oversight",
    superpower: "Solves the supply-side cold-start problem",
  },
  {
    name: "Marwan",
    role: "Co-founder, Head of Product & Delivery",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    bio: "Product strategy, roadmap, build management. Manages offshore senior engineering team delivering at 1/3 of local agency cost. Single point of execution accountability.",
    commitment: "4 days/week · Full-time execution",
    superpower: "Ships faster &amp; cheaper than any AU agency",
  },
];

export const FUTURE_HIRES = [
  { role: "Senior Mobile Engineer (RN)", phase: "M2", type: "Offshore senior", cost: "$80K" },
  { role: "Senior Backend Engineer", phase: "M2", type: "Offshore senior", cost: "$70K" },
  { role: "Senior Product Designer", phase: "M1", type: "Contract", cost: "$45K" },
  { role: "Growth / Marketing Lead", phase: "M5", type: "Local AU", cost: "$120K" },
  { role: "Sales — Tradie outreach (×2)", phase: "M5", type: "Local AU", cost: "$130K" },
  { role: "Customer & Tradie Support", phase: "M7", type: "Hybrid", cost: "$60K" },
];

export const RISKS = [
  {
    risk: "HiPages copies the exclusive-match model",
    likelihood: "Medium",
    mitigation: "Speed to market is our defense. Their tech debt and current model dependence mean a 12–18 month minimum copy lag — by then we have brand, network effects, and tradie loyalty.",
  },
  {
    risk: "Tradie-side acquisition slower than projected",
    likelihood: "High",
    mitigation: "Braxton's construction network provides a warm-start advantage no competitor can replicate. Direct outreach via existing relationships from day one.",
  },
  {
    risk: "Customer CAC higher than projected",
    likelihood: "Medium",
    mitigation: "Multi-channel approach. Heavy bias toward organic, referral, and SEO from month 1. Paid channels only after unit economics are validated.",
  },
  {
    risk: "Burn rate exceeds plan before break-even",
    likelihood: "Medium",
    mitigation: "Phased capital deployment with explicit stop-go gates. Every dollar after Phase 1 is conditional on milestone delivery.",
  },
  {
    risk: "App Store / Play Store policy changes",
    likelihood: "Low",
    mitigation: "Web fallback. Direct payment via Stripe for non-subscription transactions. Independent web app for desktop tradie management.",
  },
];

export const EXIT_PATHS = [
  {
    title: "Strategic acquisition",
    likelihood: "Most likely",
    timing: "Months 24–36",
    multiple: "8× – 15× ARR",
    range: "$80M – $150M",
    acquirers: "HiPages (defensive), REA Group, News Corp / Domain, Houzz, Thumbtack",
    tone: "orange",
  },
  {
    title: "ASX IPO",
    likelihood: "If growth > 50% YoY",
    timing: "Months 30–42",
    multiple: "10× – 20× ARR",
    range: "$100M – $200M+",
    acquirers: "Following Airtasker (ASX:ART, IPO'd at $260M in 2021)",
    tone: "navy",
  },
  {
    title: "Series A cash-out",
    likelihood: "Optional liquidity",
    timing: "Months 18–24",
    multiple: "6× – 10× ARR",
    range: "$40M – $80M",
    acquirers: "Founders take 20–30% secondary, continue building",
    tone: "success",
  },
];

export const ROI_TABLE = [
  { scenario: "Conservative", arr: "$5.8M", valuation: "$45M – $70M", multiple: "50× – 80×" },
  { scenario: "Realistic", arr: "$9.8M", valuation: "$80M – $120M", multiple: "90× – 140×", highlight: true },
  { scenario: "Ambitious", arr: "$15.0M", valuation: "$150M – $220M", multiple: "175× – 260×" },
];

export const WHY_NOW = [
  {
    title: "Tradie discontent peaking",
    desc: "HiPages reported a 7% decline in active paying tradies in FY24. Trustpilot avg 1.5/5 stars. Reddit & Facebook groups asking 'what's the alternative?'",
  },
  {
    title: "Mobile penetration is total",
    desc: "95% of Aussie tradies use a smartphone as their primary work device. They check it 80+ times a day. Conditioned to swipe interfaces.",
  },
  {
    title: "Build costs collapsed",
    desc: "Modern stacks (RN, Supabase, Stripe) cut MVP cost 60% since 2018. $200–300K builds what used to cost $800K–$1.2M.",
  },
  {
    title: "No major entrant since 2014",
    desc: "Airtasker launched 11 years ago. ServiceSeeking and Oneflare are older. The category has been ossified for over a decade.",
  },
];

export const CITY_HEAT = [
  { city: "Sydney", x: 78, y: 55, intensity: 1.0, count: 3284 },
  { city: "Melbourne", x: 70, y: 78, intensity: 0.85, count: 2671 },
  { city: "Brisbane", x: 80, y: 38, intensity: 0.72, count: 1894 },
  { city: "Perth", x: 12, y: 60, intensity: 0.55, count: 983 },
  { city: "Adelaide", x: 56, y: 70, intensity: 0.4, count: 612 },
  { city: "Canberra", x: 73, y: 65, intensity: 0.35, count: 488 },
  { city: "Hobart", x: 71, y: 92, intensity: 0.18, count: 142 },
  { city: "Darwin", x: 49, y: 12, intensity: 0.15, count: 98 },
];
