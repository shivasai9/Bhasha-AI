import { v4 as uuidv4 } from '@lukeed/uuid';

const fallbackArticles = {
  en: [
    {
      id: uuidv4(),
      title: "The Art of Coffee Making",
      summary: "Discover the intricate process of brewing the perfect cup of coffee, from bean selection to brewing techniques.",
      imageKeywords: ["coffee beans", "coffee brewing", "barista", "coffee cup"],
      text: "Coffee making is an art that starts with selecting high-quality coffee beans. The origin, roast, and grind of the beans all play a crucial role in the final taste of the coffee. Each step, from measuring the right amount of coffee to choosing the right water temperature, affects the flavor.\nMastering brewing techniques such as pour-over, espresso, and French press allows one to unlock the rich aromas and flavors of the coffee. A barista learns to balance these variables, bringing out the unique qualities of each bean to create the perfect cup."
    },
    {
      id: uuidv4(),
      title: "Space Exploration: Past and Future",
      summary: "Journey through humanity's greatest space achievements and peek into the future of interstellar travel.",
      imageKeywords: ["space shuttle", "nasa", "astronaut", "galaxy"],
      text: "Space exploration has been one of humanity's most ambitious endeavors, marking milestones from the first moon landing to sending probes to Mars and beyond. These missions have deepened our understanding of the universe and our place within it.\nAs technology advances, the future of space exploration may include human missions to Mars, lunar bases, and possibly interstellar travel. Researchers are developing innovative spacecraft and sustainable space habitats, promising new frontiers for human exploration and discovery."
    },
    {
      id: uuidv4(),
      title: "Understanding Climate Change",
      summary: "Learn about the science behind climate change and its impact on our planet's ecosystems.",
      imageKeywords: ["climate change", "global warming", "earth", "environment"],
      text: "Climate change refers to long-term shifts in temperature and weather patterns, largely driven by human activities such as burning fossil fuels. This leads to increased levels of greenhouse gases, trapping heat in the atmosphere and causing global warming.\nThe effects of climate change are profound, impacting ecosystems, sea levels, and weather patterns. Glaciers are melting, sea levels are rising, and extreme weather events are becoming more frequent, posing challenges for wildlife and human communities alike."
    },
    {
      id: uuidv4(),
      title: "The History of Jazz",
      summary: "Explore the evolution of jazz music from its origins to its influence on modern music.",
      imageKeywords: ["jazz musician", "saxophone", "jazz band", "music"],
      text: "Jazz originated in the early 20th century in African American communities in the southern United States. With roots in blues and ragtime, jazz quickly spread and evolved, characterized by improvisation, swing, and expressive rhythms.\nThroughout its history, jazz has influenced countless genres, from rock to hip-hop, and remains a dynamic force in music. Icons like Louis Armstrong, Duke Ellington, and Miles Davis pushed the boundaries of jazz, leaving a legacy that continues to inspire musicians worldwide."
    },
    {
      id: uuidv4(),
      title: "Ancient Egyptian Civilization",
      summary: "Uncover the mysteries and achievements of one of history's most fascinating civilizations.",
      imageKeywords: ["pyramids", "egyptian artifacts", "hieroglyphics", "sphinx"],
      text: "The civilization of ancient Egypt is one of the most remarkable in history, known for its advanced architecture, art, and religious practices. The Egyptians built impressive structures like the pyramids and developed a writing system with hieroglyphics.\nTheir contributions to art, science, and mathematics have had a lasting impact on the world. Egyptian mythology and the concept of an afterlife were central to their culture, leading to elaborate burial practices that continue to fascinate archaeologists and historians."
    }
  ],
  es: [
    {
      id: uuidv4(),
      title: "El Arte de Hacer Café",
      summary: "Descubre el intrincado proceso de preparar la taza perfecta de café, desde la selección del grano hasta las técnicas de preparación.",
      imageKeywords: ["granos de café", "preparación de café", "barista", "taza de café"],
      text: "Hacer café es un arte que comienza con la selección de granos de alta calidad. El origen, tostado y molienda de los granos juegan un papel crucial en el sabor final del café. Cada paso, desde medir la cantidad adecuada hasta elegir la temperatura del agua, afecta el sabor.\nDominar técnicas de preparación como pour-over, espresso y prensa francesa permite descubrir los ricos aromas y sabores del café. Un barista aprende a equilibrar estas variables, destacando las cualidades únicas de cada grano para crear la taza perfecta."
    },
    {
      id: uuidv4(),
      title: "Exploración Espacial",
      summary: "Viaja a través de los mayores logros espaciales de la humanidad y vislumbra el futuro de los viajes interestelares.",
      imageKeywords: ["transbordador espacial", "nasa", "astronauta", "galaxia"],
      text: "La exploración espacial ha sido uno de los esfuerzos más ambiciosos de la humanidad, marcando hitos desde el primer aterrizaje en la luna hasta enviar sondas a Marte y más allá. Estas misiones han profundizado nuestra comprensión del universo y de nuestro lugar en él.\nCon el avance de la tecnología, el futuro de la exploración espacial podría incluir misiones humanas a Marte, bases lunares y posiblemente viajes interestelares. Los investigadores están desarrollando naves innovadoras y hábitats espaciales sostenibles, prometiendo nuevas fronteras para la exploración y el descubrimiento humano."
    },
    {
      id: uuidv4(),
      title: "Entendiendo el Cambio Climático",
      summary: "Aprende sobre la ciencia detrás del cambio climático y su impacto en los ecosistemas de nuestro planeta.",
      imageKeywords: ["cambio climático", "calentamiento global", "tierra", "medio ambiente"],
      text: "El cambio climático se refiere a los cambios a largo plazo en las temperaturas y los patrones climáticos, impulsados en gran medida por actividades humanas como la quema de combustibles fósiles. Esto lleva al aumento de los gases de efecto invernadero, atrapando el calor en la atmósfera y provocando el calentamiento global.\nLos efectos del cambio climático son profundos, afectando ecosistemas, niveles del mar y patrones climáticos. Los glaciares se están derritiendo, el nivel del mar está aumentando y los eventos climáticos extremos son cada vez más frecuentes, lo que plantea desafíos para la vida silvestre y las comunidades humanas."
    },
    {
      id: uuidv4(),
      title: "La Historia del Jazz",
      summary: "Explora la evolución de la música jazz desde sus orígenes hasta su influencia en la música moderna.",
      imageKeywords: ["músico de jazz", "saxofón", "banda de jazz", "música"],
      text: "El jazz se originó a principios del siglo XX en las comunidades afroamericanas del sur de los Estados Unidos. Con raíces en el blues y el ragtime, el jazz se expandió rápidamente, caracterizado por la improvisación, el swing y ritmos expresivos.\nA lo largo de su historia, el jazz ha influido en innumerables géneros, desde el rock hasta el hip-hop, y sigue siendo una fuerza dinámica en la música. Íconos como Louis Armstrong, Duke Ellington y Miles Davis ampliaron los límites del jazz, dejando un legado que sigue inspirando a músicos de todo el mundo."
    },
    {
      id: uuidv4(),
      title: "La Civilización del Antiguo Egipto",
      summary: "Descubre los misterios y logros de una de las civilizaciones más fascinantes de la historia.",
      imageKeywords: ["pirámides", "artefactos egipcios", "jeroglíficos", "esfinge"],
      text: "La civilización del antiguo Egipto es una de las más notables de la historia, conocida por su arquitectura avanzada, arte y prácticas religiosas. Los egipcios construyeron estructuras impresionantes como las pirámides y desarrollaron un sistema de escritura con jeroglíficos.\nSus contribuciones al arte, la ciencia y las matemáticas han tenido un impacto duradero en el mundo. La mitología egipcia y el concepto de una vida después de la muerte eran fundamentales para su cultura, lo que dio lugar a prácticas de enterramiento elaboradas que siguen fascinando a arqueólogos e historiadores."
    }
  ],
  fr: [
    {
      id: uuidv4(),
      title: "L'Art de Faire le Café",
      summary: "Découvrez le processus complexe de la préparation du café parfait, de la sélection des grains aux techniques de brassage.",
      imageKeywords: ["grains de café", "préparation du café", "barista", "tasse de café"],
      text: "Faire du café est un art qui commence par la sélection de grains de haute qualité. L'origine, la torréfaction et la mouture des grains jouent tous un rôle essentiel dans le goût final du café. Chaque étape, de la mesure de la bonne quantité d'eau à la température, affecte la saveur.\nMaîtriser les techniques de brassage comme le pour-over, l'espresso et la presse française permet de libérer les arômes et saveurs riches du café. Un barista apprend à équilibrer ces variables, faisant ressortir les qualités uniques de chaque grain pour créer une tasse parfaite."
    },
    {
      id: uuidv4(),
      title: "L'Exploration Spatiale",
      summary: "Voyagez à travers les plus grandes réalisations spatiales de l'humanité et découvrez l'avenir des voyages interstellaires.",
      imageKeywords: ["navette spatiale", "nasa", "astronaute", "galaxie"],
      text: "L'exploration spatiale a été l'un des efforts les plus ambitieux de l'humanité, marquant des étapes clés du premier alunissage à l'envoi de sondes sur Mars et au-delà. Ces missions ont approfondi notre compréhension de l'univers et de notre place dans celui-ci.\nÀ mesure que la technologie progresse, l'avenir de l'exploration spatiale pourrait inclure des missions humaines vers Mars, des bases lunaires et peut-être des voyages interstellaires. Les chercheurs développent des vaisseaux innovants et des habitats spatiaux durables, ouvrant de nouvelles frontières pour l'exploration humaine."
    },
    {
      id: uuidv4(),
      title: "Comprendre le Changement Climatique",
      summary: "Apprenez la science du changement climatique et son impact sur les écosystèmes de notre planète.",
      imageKeywords: ["changement climatique", "réchauffement climatique", "terre", "environnement"],
      text: "Le changement climatique fait référence aux changements à long terme des températures et des modèles météorologiques, largement causés par les activités humaines comme la combustion des combustibles fossiles. Cela entraîne une augmentation des gaz à effet de serre, piégeant la chaleur dans l'atmosphère et provoquant un réchauffement climatique.\nLes effets du changement climatique sont profonds, impactant les écosystèmes, le niveau des mers et les modèles météorologiques. Les glaciers fondent, le niveau de la mer augmente et les événements météorologiques extrêmes deviennent plus fréquents, posant des défis pour la faune et les communautés humaines."
    },
    {
      id: uuidv4(),
      title: "L'Histoire du Jazz",
      summary: "Explorez l'évolution de la musique jazz de ses origines à son influence sur la musique moderne.",
      imageKeywords: ["musicien de jazz", "saxophone", "groupe de jazz", "musique"],
      text: "Le jazz est né au début du XXe siècle dans les communautés afro-américaines du sud des États-Unis. Avec des racines dans le blues et le ragtime, le jazz s'est rapidement répandu et a évolué, caractérisé par l'improvisation, le swing et des rythmes expressifs.\nTout au long de son histoire, le jazz a influencé d'innombrables genres, du rock au hip-hop, et reste une force dynamique dans la musique. Des icônes comme Louis Armstrong, Duke Ellington et Miles Davis ont repoussé les limites du jazz, laissant un héritage qui continue d'inspirer les musiciens du monde entier."
    },
    {
      id: uuidv4(),
      title: "La Civilisation de l'Égypte Ancienne",
      summary: "Découvrez les mystères et les réalisations de l'une des civilisations les plus fascinantes de l'histoire.",
      imageKeywords: ["pyramides", "artéfacts égyptiens", "hiéroglyphes", "sphinx"],
      text: "La civilisation de l'Égypte ancienne est l'une des plus remarquables de l'histoire, connue pour son architecture avancée, son art et ses pratiques religieuses. Les Égyptiens ont construit des structures impressionnantes comme les pyramides et développé un système d'écriture avec des hiéroglyphes.\nLeurs contributions à l'art, à la science et aux mathématiques ont eu un impact durable dans le monde. La mythologie égyptienne et le concept de vie après la mort étaient au cœur de leur culture, conduisant à des pratiques funéraires élaborées qui continuent de fasciner les archéologues et les historiens."
    }
  ]
};


export async function generateArticles(language, customTopic = null, count = 5) {
  // In a real implementation, this would use Chrome's AI API
  // For now, we'll return fallback articles
  const articles = fallbackArticles[language] || fallbackArticles.en;
  
  if (customTopic) {
    return [{
      id: uuidv4(),
      title: `${customTopic} (${language})`,
      summary: `A custom article about ${customTopic} in ${language}`,
      imageKeywords: [customTopic, "learning", "education"],
    }];
  }

  return articles.slice(0, count).map(article => ({
    ...article,
    id: uuidv4(), // Generate new ID for each article
  }));
}