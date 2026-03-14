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
    keywords: /\b(father|mother|parent|brother|sister|son|daughter|husband|wife|family|child|grandpa|grandma|grandmother|grandfather|uncle|aunt|relative)\b/i,
  },
  {
    id: 'body',
    label: 'Body Parts',
    keywords: /\b(head|eye|ear|nose|mouth|hand|foot|feet|leg|arm|neck|back|teeth|tooth|face|body|finger|hair|stomach|heart)\b/i,
  },
  {
    id: 'food',
    label: 'Food & Drink',
    keywords: /\b(eat|food|rice|bread|meat|fish|egg|vegetable|fruit|drink|water|tea|milk|coffee|juice|beer|sake|meal|breakfast|lunch|dinner|soup|curry|sweet|salt|sugar|cake|snack|noodle|sushi|tempura|tofu|cuisine|cook|restaurant)\b/i,
  },
  {
    id: 'animals',
    label: 'Animals',
    keywords: /\b(dog|cat|bird|fish|horse|cow|pig|rabbit|bear|fox|lion|tiger|elephant|monkey|insect|animal)\b/i,
  },
  {
    id: 'places',
    label: 'Places',
    keywords: /\b(school|university|college|hospital|store|shop|library|post office|bank|station|airport|hotel|house|home|building|room|kitchen|bathroom|garden|park|entrance|corridor|office|company|town|city|village|country|foreign)\b/i,
  },
  {
    id: 'transport',
    label: 'Transport',
    keywords: /\b(train|bus|car|taxi|bicycle|bike|plane|airplane|ship|boat|subway|underground|vehicle|drive|ride|travel|ticket)\b/i,
  },
  {
    id: 'time',
    label: 'Time & Days',
    keywords: /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|morning|noon|afternoon|evening|night|today|tomorrow|yesterday|week|month|year|hour|minute|second|time|day|date|season|spring|summer|autumn|fall|winter|now|soon|always|sometimes|often|never|before|after|early|late|every|last|next|this)\b/i,
  },
  {
    id: 'weather',
    label: 'Weather',
    keywords: /\b(rain|snow|sunny|cloudy|wind|weather|hot|cold|warm|cool|cloud|storm|thunder|forecast)\b/i,
  },
  {
    id: 'nature',
    label: 'Nature',
    keywords: /\b(mountain|river|sea|ocean|lake|pond|sky|flower|tree|forest|grass|plant|nature|rock|stone|sand|island|valley|field|hill)\b/i,
  },
  {
    id: 'people',
    label: 'People & Occupations',
    keywords: /\b(teacher|student|doctor|nurse|police|worker|employee|person|man|woman|boy|girl|friend|boss|director|musician|artist|driver|farmer|cook|chef|pupil|professor|manager|engineer)\b/i,
  },
  {
    id: 'clothing',
    label: 'Clothing',
    keywords: /\b(wear|clothes|shirt|coat|jacket|dress|skirt|pants|trousers|shoe|sock|hat|glove|scarf|sweater|jumper|underwear|uniform|put on|take off|change)\b/i,
  },
  {
    id: 'verbs-daily',
    label: 'Verbs — Daily Life',
    keywords: /\b(sleep|wake|wash|bathe|shower|brush|clean|cook|make|buy|sell|use|open|close|turn on|turn off|sit|stand|wait|rest|play|work|study|practice|read|write|say|speak|listen|watch|see|look|think|know|understand|remember|forget|learn|teach|help|give|take|receive|send|go|come|return|enter|exit|start|finish|end|stop|begin|move|put|bring|carry|hold|push|pull|cut|break|fix|build|draw)\b/i,
  },
  {
    id: 'verbs-motion',
    label: 'Verbs — Motion',
    keywords: /\b(walk|run|jump|swim|fly|climb|fall|ride|drive|go|come|return|arrive|leave|travel|move|go back|go out|go in|come back)\b/i,
  },
  {
    id: 'adjectives-physical',
    label: 'Adjectives — Physical',
    keywords: /\b(big|small|large|tall|short|long|wide|narrow|thick|thin|heavy|light|fast|slow|far|near|high|low|deep|shallow|new|old|young|hot|cold|warm|cool|dark|bright|hard|soft|clean|dirty|noisy|quiet|dangerous|safe)\b/i,
  },
  {
    id: 'adjectives-quality',
    label: 'Adjectives — Quality',
    keywords: /\b(good|bad|nice|pretty|cute|beautiful|ugly|easy|difficult|hard|interesting|boring|fun|important|useful|convenient|expensive|cheap|free|correct|wrong|true|false|kind|rude|busy|free|healthy|sick|tired|happy|sad|angry|surprised|scared)\b/i,
  },
  {
    id: 'question-demo',
    label: 'Question & Demonstrative Words',
    keywords: /\b(what|when|where|who|why|how|which|this|that|here|there|every|all|both|some|any|each|which way|how much|how many|how long)\b/i,
  },
  {
    id: 'school-study',
    label: 'School & Study',
    keywords: /\b(book|dictionary|notebook|pencil|pen|paper|test|exam|class|lesson|homework|subject|language|japanese|english|math|music|art|sport|grade|answer|question|correct|practice|exercise)\b/i,
  },
  {
    id: 'home-objects',
    label: 'Home & Objects',
    keywords: /\b(table|chair|desk|bed|shelf|door|window|floor|wall|ceiling|telephone|phone|television|tv|radio|camera|refrigerator|elevator|key|bag|box|bottle|cup|glass|plate|bowl|spoon|fork|knife|chopstick|vase|umbrella|wallet|postcard|letter|newspaper|magazine|photo|film|tape|clock|watch)\b/i,
  },
  {
    id: 'directions',
    label: 'Directions & Location',
    keywords: /\b(north|south|east|west|right|left|front|back|above|below|inside|outside|between|beside|near|far|up|down|middle|center|side|area|around|corner|straight|direction)\b/i,
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
