import type { Group, Word } from '../types';

/**
 * Keyword-based semantic classification for N5 vocabulary.
 * Each category has keyword patterns matched against the English meaning.
 * Words are assigned to the FIRST matching category.
 */

interface CategoryDef {
  id: string;
  label: string;
  keywords: RegExp;
}

const CATEGORY_DEFS: CategoryDef[] = [
  {
    id: 'colors',
    label: 'Colors',
    keywords: /\b(red|blue|green|yellow|white|black|brown|orange|purple|pink|grey|gray|color)\b/i,
  },
  {
    id: 'numbers',
    label: 'Numbers & Counting',
    keywords: /\b(one|two|three|four|five|six|seven|eight|nine|ten|hundred|thousand|zero|count|number)\b/i,
  },
  {
    id: 'family',
    label: 'Family',
    keywords: /\b(father|mother|parent|brother|sister|son|daughter|husband|wife|family|child|grandpa|grandma|grandmother|grandfather|uncle|aunt|relative|oneself|myself|yourself|himself|herself|both parents)\b/i,
  },
  {
    id: 'body',
    label: 'Body Parts',
    keywords: /\b(head|eye|ear|nose|mouth|hand|foot|feet|leg|arm|neck|back|teeth|tooth|face|body|finger|hair|stomach|heart|voice|throat|shoulder|knee|tongue|lip|cheek|forehead)\b/i,
  },
  {
    id: 'food',
    label: 'Food & Drink',
    keywords: /\b(eat|food|rice|bread|meat|fish|egg|vegetable|fruit|drink|water|tea|milk|coffee|juice|beer|sake|meal|breakfast|lunch|dinner|soup|curry|sweet|salt|sugar|cake|snack|noodle|sushi|tempura|tofu|cuisine|cook|restaurant|flavor|taste|bite)\b/i,
  },
  {
    id: 'animals',
    label: 'Animals',
    keywords: /\b(dog|cat|bird|fish|horse|cow|pig|rabbit|bear|fox|lion|tiger|elephant|monkey|insect|animal|pet)\b/i,
  },
  {
    id: 'places',
    label: 'Places',
    keywords: /\b(school|university|college|hospital|store|shop|library|post office|bank|station|airport|hotel|house|home|building|room|kitchen|bathroom|garden|park|entrance|corridor|office|company|town|city|village|country|foreign|floor|hall|museum|zoo|stadium|temple|shrine|palace|castle|market|supermarket|mall|restroom|toilet|factory)\b/i,
  },
  {
    id: 'transport',
    label: 'Transport',
    keywords: /\b(train|bus|car|taxi|bicycle|bike|plane|airplane|ship|boat|subway|underground|vehicle|drive|ride|travel|ticket|highway|road|crossing|platform|port|harbor)\b/i,
  },
  {
    id: 'time',
    label: 'Time & Days',
    keywords: /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|morning|noon|afternoon|evening|night|today|tomorrow|yesterday|week|month|year|hour|minute|second|time|day|date|season|spring|summer|autumn|fall|winter|now|soon|always|sometimes|often|never|before|after|early|late|every|last|next|this|moment|period|era|age|holiday|vacation|birthday|anniversary)\b/i,
  },
  {
    id: 'weather',
    label: 'Weather',
    keywords: /\b(rain|snow|sunny|cloudy|wind|weather|hot|cold|warm|cool|cloud|storm|thunder|forecast|humid|dry|temperature|degree|freeze|melt)\b/i,
  },
  {
    id: 'nature',
    label: 'Nature',
    keywords: /\b(mountain|river|sea|ocean|lake|pond|sky|flower|tree|forest|grass|plant|nature|rock|stone|sand|island|valley|field|hill|beach|coast|desert|jungle|earth|ground|soil|leaf|branch|root|seed|petal)\b/i,
  },
  {
    id: 'people',
    label: 'People & Occupations',
    keywords: /\b(teacher|student|doctor|nurse|police|worker|employee|person|man|woman|boy|girl|friend|boss|director|musician|artist|driver|farmer|cook|chef|pupil|professor|manager|engineer|adult|child|foreigner|policeman|classmate|colleague|neighbor|guest|customer|client)\b/i,
  },
  {
    id: 'health',
    label: 'Health & Body',
    keywords: /\b(illness|sick|disease|pain|hurt|ache|medicine|hospital|doctor|nurse|injury|fever|cold|cough|sneeze|bleed|heal|recover|healthy|energy|tired|fatigue|dizzy|nausea|pregnant|birth|die|dead|alive)\b/i,
  },
  {
    id: 'clothing',
    label: 'Clothing',
    keywords: /\b(wear|clothes|shirt|coat|jacket|dress|skirt|pants|trousers|shoe|sock|hat|glove|scarf|sweater|jumper|underwear|uniform|put on|take off|change|fabric|sleeve|collar|button|pocket|belt|tie)\b/i,
  },
  {
    id: 'verbs-daily',
    label: 'Verbs — Daily Life',
    keywords: /\b(sleep|wake|wash|bathe|shower|brush|clean|cook|make|buy|sell|use|open|close|turn on|turn off|sit|stand|wait|rest|play|work|study|practice|read|write|say|speak|listen|watch|see|look|think|know|understand|remember|forget|learn|teach|help|give|take|receive|send|go|come|return|enter|exit|start|finish|end|stop|begin|move|put|bring|carry|hold|push|pull|cut|break|fix|build|draw|show|meet|visit|invite|call|answer|ask|reply|borrow|lend|share|check|count|compare|choose|decide|try|fail|succeed|prepare|plan|arrange|clean|organize|repair|paint|type|sign|stamp|pour|serve|mix|cut|boil|fry|grill)\b/i,
  },
  {
    id: 'verbs-motion',
    label: 'Verbs — Motion',
    keywords: /\b(walk|run|jump|swim|fly|climb|fall|ride|drive|go|come|return|arrive|leave|travel|move|go back|go out|go in|come back|rush|hurry|approach|pass|cross|turn|step|march|escape|follow|chase|carry)\b/i,
  },
  {
    id: 'verbs-state',
    label: 'Verbs — States & Change',
    keywords: /\b(become|change|turn into|get|grow|increase|decrease|expand|shrink|appear|disappear|exist|stay|remain|continue|belong|differ|resemble|suit|fit|match|cost|weigh|last|occur|happen|begin|end|seem|look like|feel like|sound like|smell|taste)\b/i,
  },
  {
    id: 'adjectives-physical',
    label: 'Adjectives — Physical',
    keywords: /\b(big|small|large|tall|short|long|wide|narrow|thick|thin|heavy|light|fast|slow|quick|far|near|high|low|deep|shallow|new|old|young|hot|cold|warm|cool|dark|bright|hard|soft|clean|dirty|noisy|quiet|dangerous|safe|round|flat|sharp|smooth|rough|wet|dry|loud|silent|loose|tight|full|empty|straight|curved)\b/i,
  },
  {
    id: 'adjectives-quality',
    label: 'Adjectives — Quality',
    keywords: /\b(good|bad|nice|pretty|cute|beautiful|ugly|easy|difficult|hard|interesting|boring|fun|important|useful|convenient|expensive|cheap|free|correct|wrong|true|false|kind|rude|busy|healthy|sick|tired|happy|sad|angry|surprised|scared|skillful|unskillful|clever|smart|strange|wonderful|terrible|awful|excellent|perfect|special|ordinary|simple|complex|serious|funny|cheerful|lively|peaceful|safe|dangerous|popular|famous|necessary|possible|impossible)\b/i,
  },
  {
    id: 'question-demo',
    label: 'Question & Demonstrative Words',
    keywords: /\b(what|when|where|who|why|how|which|this|that|here|there|every|all|both|some|any|each|which way|how much|how many|how long|over there|over here|like this|like that)\b/i,
  },
  {
    id: 'expressions',
    label: 'Expressions & Particles',
    keywords: /\b(yes|no|please|thank|thanks|sorry|excuse|hello|goodbye|bye|welcome|congratulation|good morning|good evening|good night|nice to meet|and|but|because|however|therefore|so|also|too|either|neither|or|whether|although|if|unless|while|since|even|already|yet|just|only|still|again|together|apart|instead|anyway|perhaps|maybe|probably|surely|really|actually|finally|suddenly|immediately|especially|almost|quite|rather|enough|about|approximately|at least|at most|for example|by the way|after all|in fact|of course|no problem)\b/i,
  },
  {
    id: 'adverbs',
    label: 'Adverbs & Degree Words',
    keywords: /\b(very|much|many|more|most|less|least|few|little|lot|quite|rather|really|so|too|enough|always|never|sometimes|often|usually|rarely|soon|already|still|again|just|only|even|almost|nearly|about|exactly|immediately|suddenly|gradually|slowly|quickly|carefully|easily|hardly|barely|merely|simply|directly|finally|recently|lately|possibly|certainly|definitely|probably|perhaps|maybe|especially|particularly|generally|usually|normally|typically|mostly|mainly|completely|entirely|totally|partly|slightly|somewhat|extremely|absolutely|perfectly|clearly|obviously|apparently|fortunately|unfortunately|luckily)\b/i,
  },
  {
    id: 'school-study',
    label: 'School & Study',
    keywords: /\b(book|dictionary|notebook|pencil|pen|paper|test|exam|class|lesson|homework|subject|language|japanese|english|math|music|art|sport|grade|answer|question|correct|practice|exercise|study|learn|teach|school|university|college|student|teacher|lecture|seminar|assignment|project|report|essay|composition|research|library|blackboard|chalk|eraser|ruler|compass|scissors)\b/i,
  },
  {
    id: 'home-objects',
    label: 'Home & Objects',
    keywords: /\b(table|chair|desk|bed|shelf|door|window|floor|wall|ceiling|telephone|phone|television|tv|radio|camera|refrigerator|elevator|key|bag|box|bottle|cup|glass|plate|bowl|spoon|fork|knife|chopstick|vase|umbrella|wallet|postcard|letter|newspaper|magazine|photo|film|tape|clock|watch|sofa|curtain|carpet|lamp|light|heater|fan|washing machine|microwave|oven|stove|sink|bathtub|shower|toilet|mirror|towel|soap|toothbrush|brush|comb|scissors|needle|thread|blanket|pillow|mat|tray|pot|pan|lid|cap|container|drawer|closet|hanger|hook)\b/i,
  },
  {
    id: 'directions',
    label: 'Directions & Location',
    keywords: /\b(north|south|east|west|right|left|front|back|above|below|inside|outside|between|beside|near|far|up|down|middle|center|side|area|around|corner|straight|direction|next to|across from|in front of|behind|on top of|under|beneath|over|along|through|toward|away from|upstairs|downstairs|nearby|somewhere|nowhere|everywhere|anywhere)\b/i,
  },
  // Catch-all for any remaining verb (meaning starts with "to ")
  {
    id: 'verbs-other',
    label: 'Verbs — Other',
    keywords: /^to \b/i,
  },
];

export function buildSemanticGroups(words: Word[]): Group[] {
  const buckets: Map<string, string[]> = new Map();
  for (const def of CATEGORY_DEFS) {
    buckets.set(def.id, []);
  }
  buckets.set('other', []);

  for (const word of words) {
    let placed = false;
    for (const def of CATEGORY_DEFS) {
      if (def.keywords.test(word.meaning)) {
        buckets.get(def.id)!.push(word.id);
        placed = true;
        break;
      }
    }
    if (!placed) {
      buckets.get('other')!.push(word.id);
    }
  }

  const groups: Group[] = CATEGORY_DEFS.map(def => ({
    id: def.id,
    label: def.label,
    wordIds: buckets.get(def.id)!,
  })).filter(g => g.wordIds.length > 0);

  const otherIds = buckets.get('other')!;
  if (otherIds.length > 0) {
    groups.push({ id: 'other', label: 'Other', wordIds: otherIds });
  }

  return groups;
}
