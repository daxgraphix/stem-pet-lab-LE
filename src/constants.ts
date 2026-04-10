import { Experiment, PetId } from './types';

export const PET_INFO: { id: PetId; name: string }[] = [
  { id: 'bioBlob', name: 'Bio-Blob' },
  { id: 'roboPup', name: 'Robo-Pup' },
  { id: 'astroCritter', name: 'Astro-Critter' },
  { id: 'geoGolem', name: 'Geo-Golem' },
];

export const CUSTOMIZATIONS = {
  colors: [
    { id: 'default', value: '#34d399', dark: '#10b981', cost: 0 },
    { id: 'sky', value: '#7dd3fc', dark: '#38bdf8', cost: 100 },
    { id: 'rose', value: '#fb7185', dark: '#f43f5e', cost: 100 },
    { id: 'amber', value: '#fcd34d', dark: '#fbbf24', cost: 150 },
    { id: 'violet', value: '#c4b5fd', dark: '#a78bfa', cost: 150 },
    { id: 'neon', value: '#ccff00', dark: '#aaff00', cost: 300 },
  ],
  accessories: [
    { id: 'none', name: 'None', cost: 0 },
    { id: 'goggles', name: 'Lab Goggles', cost: 200 },
    { id: 'beanie', name: 'Propeller Beanie', cost: 250 },
    { id: 'cape', name: 'Science Cape', cost: 400 },
  ],
  items: [
    { id: 'battery', name: 'Super Battery', description: 'Restores 50 Energy', cost: 75 },
    { id: 'treat', name: 'Quantum Treat', description: 'Boosts Happiness by 30', cost: 50 },
  ]
};

export const QUEST_TEMPLATES = [
  { id: 'exp_50', type: 'points', target: 50, description: "Earn 50 EXP Points", reward: 25 },
  { id: 'complete_1', type: 'complete', target: 1, description: "Complete 1 Experiment", reward: 40 },
  { id: 'recharge', type: 'energy', target: 1, description: "Recharge Pet Energy", reward: 20 },
  { id: 'perfect', type: 'perfect_score', target: 1, description: "Get a Perfect Score", reward: 50 },
  { id: 'study', type: 'study', target: 3, description: "Flip 3 Flashcards", reward: 15 },
  { id: 'feed', type: 'feed', target: 1, description: "Feed your Pet", reward: 10 }
];

export const EXPERIMENTS: Record<string, Experiment> = {
  biology: {
    id: 'biology',
    title: 'Biology Blast',
    badgeName: 'Bio-Whiz',
    icon: 'Leaf',
    description: 'Discover the secrets of living things, from tiny cells to giant trees!',
    knowledge: {
      title: 'The Spark of Life',
      pages: [
        { text: "Welcome, Scientist! Biology is the amazing study of life. Today's mission dives into cells, plants, animals, and ecosystems." },
        { text: "Cells are the tiny building blocks of life. Every plant and animal is made from cells working together." },
        { text: "Plant cells have special parts called chloroplasts. These capture sunlight to power photosynthesis." },
        { text: "Photosynthesis lets plants turn water, carbon dioxide, and sunlight into sugar and oxygen." },
        { text: "Animals get energy by eating plants or other animals. This energy helps them grow, move, and play." },
        { text: "Food chains show how energy moves from plants to animals to larger animals." },
        { text: "A habitat is a place where an organism lives and finds food, water, and shelter." },
        { text: "An ecosystem includes all the living things in an area plus the air, water, and soil around them." },
        { text: "Adaptations are special traits that help animals and plants survive in their home." },
        { text: "You are learning the science that connects tiny cells to whole forests and food chains!" }
      ]
    },
    training: {
      title: 'Bio-Terms',
      flashcards: [
        { term: "Cell", definition: "The smallest unit of life that can survive on its own." },
        { term: "Photosynthesis", definition: "The process plants use to turn sunlight, water, and gas into food and oxygen." },
        { term: "Chlorophyll", definition: "The green chemical in leaves that captures sunlight." },
        { term: "Carbon Dioxide", definition: "A gas that plants take in from the air." },
        { term: "Oxygen", definition: "A gas that plants release and animals need to breathe." },
        { term: "Stomata", definition: "Tiny holes in leaves that let gases move in and out." },
        { term: "Habitat", definition: "The natural home of an animal or plant." },
        { term: "Ecosystem", definition: "A community of living things and their environment." },
        { term: "Food Chain", definition: "A path of energy flow from plants to animals." },
        { term: "Adaptation", definition: "A trait that helps a living thing survive in its environment." },
      ]
    },
    challenge: {
      title: 'Photosynthesis Power-Up',
      gameType: 'dragAndDrop',
      content: {
        items: [
          { text: "Sunlight", type: "ingredient" },
          { text: "Water", type: "ingredient" },
          { text: "Carbon Dioxide", type: "ingredient" },
          { text: "Chlorophyll", type: "ingredient" },
          { text: "Oxygen", type: "product" },
          { text: "Sugar", type: "product" },
          { text: "Soil", type: "distractor" },
          { text: "Animal", type: "distractor" },
        ],
        zones: [
          { id: 'ingredient', title: 'Ingredients', color: 'text-sky-400' },
          { id: 'product', title: 'Products', color: 'text-green-400' },
        ]
      }
    }
  },

  tech: {
    id: 'tech',
    title: 'Tech Time',
    badgeName: 'Code Commander',
    icon: 'Cpu',
    description: "Let's learn the language of computers and see how technology works.",
    knowledge: {
      title: 'Telling Computers What To Do',
      pages: [
        { text: "Computers run on instructions called code. Every app, game, and website uses code behind the scenes." },
        { text: "An algorithm is a clear set of steps that solves a problem, like a recipe for a computer." },
        { text: "Binary is the number system computers use. It only has two digits: 0 and 1." },
        { text: "Hardware is the physical parts of a computer. Software is the instructions that tell it what to do." },
        { text: "A program stores data in variables and decides actions with condition checks and loops." },
        { text: "Debugging means finding and fixing mistakes in code, just like a detective solving a mystery." },
        { text: "Networks let computers share data. The internet is a huge network connecting millions of devices." },
        { text: "Cybersecurity helps protect computers from hackers and keeps information safe." },
        { text: "Artificial Intelligence helps machines learn from examples and make smart decisions." },
        { text: "Today you practiced tech thinking: planning, testing, and solving problems like a coder." }
      ]
    },
    training: {
      title: 'Tech Terms',
      flashcards: [
        { term: "Code", definition: "Instructions written in a language computers understand." },
        { term: "Algorithm", definition: "A step-by-step plan for solving a problem." },
        { term: "Bug", definition: "An error in a program that stops it from working correctly." },
        { term: "Loop", definition: "An instruction that repeats an action over and over." },
        { term: "Variable", definition: "A container for storing data values, like a score in a game." },
        { term: "Hardware", definition: "The physical parts of a computer, like the screen and keyboard." },
        { term: "Software", definition: "Apps and programs that run on a computer." },
        { term: "Network", definition: "A group of computers connected so they can share information." },
        { term: "Debug", definition: "To find and fix mistakes in code." },
        { term: "AI", definition: "Smart computer behavior that learns from data." },
      ]
    },
    challenge: {
      title: 'Robo-Pup\'s Lunch',
      gameType: 'chooseYourResponse',
      content: [
        {
          scenario: "Robo-Pup is hungry! Which algorithm gets him to his food bowl?",
          options: [
            { text: "1. Turn right. 2. Bark. 3. Walk forward.", feedback: "Barking won't help!", correct: false },
            { text: "1. Walk forward. 2. Turn left. 3. Eat.", feedback: "Correct! Efficient steps.", correct: true },
          ]
        },
        {
          scenario: "You want Robo-Pup to wag his tail 10 times. What should you use?",
          options: [
            { text: "A Loop", feedback: "Exactly! Loops repeat actions efficiently.", correct: true },
            { text: "A Variable", feedback: "Variables store data, but don't repeat actions.", correct: false },
          ]
        },
        {
          scenario: "Which tool helps find mistakes in a program?",
          options: [
            { text: "A Debugger", feedback: "Yes! Debuggers help fix code problems.", correct: true },
            { text: "A Printer", feedback: "Printers are for paper, not code.", correct: false },
          ]
        },
        {
          scenario: "What does binary use to represent information?",
          options: [
            { text: "0s and 1s", feedback: "Perfect! Binary is made of zeros and ones.", correct: true },
            { text: "A through Z", feedback: "Letters are not binary digits.", correct: false },
          ]
        }
      ]
    }
  },

  physics: {
    id: 'physics',
    title: 'Physics Fun',
    badgeName: 'Gravity Guru',
    icon: 'Magnet',
    description: 'Explore the forces that move our world, from gravity to magnetism!',
    knowledge: {
      title: 'Forces and Motion',
      pages: [
        { text: "Physics is the study of how things move and why. A force is a push or a pull." },
        { text: "Gravity pulls objects toward the Earth and keeps planets in orbit around the sun." },
        { text: "Friction is the force that slows objects down when they rub against each other." },
        { text: "Inertia means objects keep doing what they're doing until a force changes them." },
        { text: "Acceleration happens when an object changes its speed or direction." },
        { text: "Mass is how much 'stuff' is in an object, and it affects how hard it is to move." },
        { text: "Energy comes in many forms, like motion, heat, and light." },
        { text: "Magnets have north and south poles. Opposite poles attract and same poles repel." },
        { text: "Simple machines like levers and ramps help us move heavy objects more easily." },
        { text: "When you learn physics, you can explain why a ball rolls, a rocket launches, or a magnet sticks." }
      ]
    },
    training: {
      title: 'Physics Terms',
      flashcards: [
        { term: "Force", definition: "A push or a pull on an object." },
        { term: "Gravity", definition: "The force that pulls objects toward each other." },
        { term: "Friction", definition: "A force that slows down moving things when they rub together." },
        { term: "Inertia", definition: "The tendency of an object to keep doing what it's doing." },
        { term: "Velocity", definition: "The speed of something in a given direction." },
        { term: "Acceleration", definition: "A change in speed or direction." },
        { term: "Mass", definition: "How much matter or 'stuff' is in an object." },
        { term: "Energy", definition: "The ability to do work or make things move." },
        { term: "Magnetism", definition: "A force that pulls some metals and pushes others." },
        { term: "Circuit", definition: "A path that electricity can flow through." },
      ]
    },
    challenge: {
      title: 'Force Field Match',
      gameType: 'matchThePairs',
      content: [
        { item: "Pulls things down", match: "Gravity" },
        { item: "Slows things down", match: "Friction" },
        { item: "A push or a pull", match: "Force" },
        { item: "Stays in motion", match: "Inertia" },
        { item: "Change in speed", match: "Acceleration" },
        { item: "Stuff inside an object", match: "Mass" },
      ]
    }
  },

  geology: {
    id: 'geology',
    title: 'Geology Gems',
    badgeName: 'Rock Star',
    icon: 'Mountain',
    description: 'Dig deep into the Earth to learn about rocks, minerals, and volcanoes!',
    knowledge: {
      title: 'Layers of the Earth',
      pages: [
        { text: "Geology is the study of the Earth's rocks, soil, and the forces that change them." },
        { text: "The Earth's outer layer is the crust. Beneath it is the mantle, then the outer core, and the inner core." },
        { text: "Igneous rocks form when hot magma or lava cools and hardens." },
        { text: "Sedimentary rocks are made from tiny pieces of rock, sand, or shells pressed together." },
        { text: "Metamorphic rocks change when heat and pressure reshape them deep underground." },
        { text: "Volcanoes erupt when magma rises from inside the Earth and bursts out." },
        { text: "Erosion wears away rocks over time with wind, water, and ice." },
        { text: "Fossils are ancient remains trapped in rock that tell us about past life." },
        { text: "Earthquakes happen when blocks of rock suddenly move along a fault." },
        { text: "Geologists are science detectives who study the Earth and its history." }
      ]
    },
    training: {
      title: 'Rock Talk',
      flashcards: [
        { term: "Crust", definition: "The thin, outermost layer of the Earth." },
        { term: "Mantle", definition: "The thick layer beneath the crust." },
        { term: "Core", definition: "The very hot center of the Earth." },
        { term: "Igneous", definition: "Rock formed from cooled magma or lava." },
        { term: "Sedimentary", definition: "Rock made from layers of sand, mud, or shells." },
        { term: "Metamorphic", definition: "Rock changed by heat and pressure." },
        { term: "Erosion", definition: "The movement of rock and soil by wind or water." },
        { term: "Fossil", definition: "The preserved remains of ancient plants or animals." },
        { term: "Volcano", definition: "A mountain that can erupt lava and ash." },
        { term: "Earthquake", definition: "A sudden shaking of the ground." },
      ]
    },
    challenge: {
      title: 'Layer Legend',
      gameType: 'sortTheSequence',
      content: [
        { sequence: ["Crust", "Mantle", "?", "Inner Core"], options: ["Outer Core", "Ocean", "Atmosphere"], answer: "Outer Core", rule: "Order from outside to inside" },
        { sequence: ["Magma", "?", "Igneous Rock"], options: ["Lava", "Sediment", "Pressure"], answer: "Lava", rule: "What magma becomes when it reaches the surface" },
      ]
    }
  },

  robotics: {
    id: 'robotics',
    title: 'Robotics Workshop',
    badgeName: 'Bot Builder',
    icon: 'Bot',
    description: 'Design and build your own robots to solve complex problems!',
    knowledge: {
      title: 'What Makes a Robot?',
      pages: [
        { text: "A robot is a machine that can perform tasks automatically." },
        { text: "Sensors help robots sense the world. Processors act like their brain." },
        { text: "Actuators are the parts that move and let robots do work." },
        { text: "Many robots follow instructions from a program to decide what to do next." },
        { text: "Some robots are autonomous, which means they can make decisions on their own." },
        { text: "Robots can help in medicine, factories, exploration, and even space missions." },
        { text: "Designing robots mixes science, engineering, and creativity." },
        { text: "Today you learned how smart machines sense, think, and act in the world." },
        { text: "Robot teams often use data to make better choices and solve hard problems." },
        { text: "Building a robot means testing, fixing, and improving it again and again." }
      ]
    },
    training: {
      title: 'Bot Basics',
      flashcards: [
        { term: "Sensor", definition: "A device that detects information about the environment." },
        { term: "Actuator", definition: "A part of a robot that moves or controls a mechanism." },
        { term: "Processor", definition: "The robot's brain that makes decisions." },
        { term: "Autonomous", definition: "Able to act without being told every step." },
        { term: "Microcontroller", definition: "A small computer used to control a robot's actions." },
        { term: "AI", definition: "Artificial Intelligence that helps machines learn." },
        { term: "Debugging", definition: "Finding and fixing problems in a design or code." },
        { term: "Prototype", definition: "A first version of a robot used to test ideas." },
        { term: "Program", definition: "A list of instructions that tells a robot what to do." },
        { term: "Feedback", definition: "Information used to improve a robot's behavior." },
      ]
    },
    challenge: {
      title: 'Build-a-Bot',
      gameType: 'matchThePairs',
      content: [
        { item: "The robot's brain", match: "Processor" },
        { item: "The robot's eyes", match: "Sensor" },
        { item: "The robot's muscles", match: "Actuator" },
        { item: "Thinking machine", match: "AI" },
        { item: "Fixing a mistake", match: "Debugging" },
        { item: "First test model", match: "Prototype" },
      ]
    }
  },

  ecology: {
    id: 'ecology',
    title: 'Eco Explorer',
    badgeName: 'Nature Guardian',
    icon: 'Leaf',
    description: 'Learn how living things interact with their environment and how to protect our planet!',
    knowledge: {
      title: 'Our Interconnected World',
      pages: [
        { text: "Ecology is the study of how living things interact with each other and their surroundings." },
        { text: "An ecosystem includes plants, animals, soil, air, and water all working together." },
        { text: "A habitat is the home where a living thing finds food, water, and shelter." },
        { text: "Biodiversity means having lots of different kinds of plants and animals." },
        { text: "A food web shows how many living things are connected through eating and energy." },
        { text: "Producers like plants make food from sunlight. Consumers eat plants or other animals." },
        { text: "A niche is the special role a plant or animal plays in its ecosystem." },
        { text: "Conservation means protecting habitats and using resources wisely." },
        { text: "Climate affects where animals and plants can live and how ecosystems change." },
        { text: "You are learning how to protect nature by understanding how everything is linked." }
      ]
    },
    training: {
      title: 'Eco Terms',
      flashcards: [
        { term: "Ecosystem", definition: "A community of living things and their non-living environment." },
        { term: "Biodiversity", definition: "The variety of different types of life on Earth." },
        { term: "Habitat", definition: "The natural home of an animal or plant." },
        { term: "Niche", definition: "The special role an organism plays in its ecosystem." },
        { term: "Food Chain", definition: "The path of energy from one living thing to another." },
        { term: "Producer", definition: "A living thing that makes its own food." },
        { term: "Consumer", definition: "A living thing that eats other organisms." },
        { term: "Conservation", definition: "Protecting nature so it stays healthy." },
        { term: "Climate", definition: "The usual weather in a place over a long time." },
        { term: "Pollution", definition: "Anything harmful added to the environment." },
      ]
    },
    challenge: {
      title: 'Food Chain Fixer',
      gameType: 'sortTheSequence',
      content: [
        { sequence: ["Sun", "Grass", "?", "Snake"], options: ["Grasshopper", "Rock", "Cloud"], answer: "Grasshopper", rule: "Energy flow: Sun -> Producer -> Primary Consumer -> Secondary Consumer" },
        { sequence: ["Tree", "?", "Frog"], options: ["Mosquito", "Sun", "Soil"], answer: "Mosquito", rule: "A food chain moves energy from plants to small animals to larger ones" },
      ]
    }
  }
};
