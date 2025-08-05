// Valorant Agent Data
export const agentsByRole = {
  'Duelist': [
    { name: 'Jett', icon: 'Jett' },
    { name: 'Reyna', icon: 'Reyna' },
    { name: 'Phoenix', icon: 'Phoenix' },
    { name: 'Raze', icon: 'Raze' },
    { name: 'Yoru', icon: 'Yoru' },
    { name: 'Neon', icon: 'Neon' },
    { name: 'Iso', icon: 'Iso' },
    { name: 'Waylay', icon: 'Waylay' }
  ],
  'Controller': [
    { name: 'Brimstone', icon: 'Brimstone' },
    { name: 'Omen', icon: 'Omen' },
    { name: 'Viper', icon: 'Viper' },
    { name: 'Astra', icon: 'Astra' },
    { name: 'Harbor', icon: 'Harbor' },
    { name: 'Clove', icon: 'Clove' }
  ],
  'Initiator': [
    { name: 'Sova', icon: 'Sova' },
    { name: 'Breach', icon: 'Breach' },
    { name: 'Skye', icon: 'Skye' },
    { name: 'KAY/O', icon: 'KAY/O' },
    { name: 'Fade', icon: 'Fade' },
    { name: 'Gekko', icon: 'Gekko' }
  ],
  'Sentinel': [
    { name: 'Sage', icon: 'Sage' },
    { name: 'Cypher', icon: 'Cypher' },
    { name: 'Killjoy', icon: 'Killjoy' },
    { name: 'Chamber', icon: 'Chamber' },
    { name: 'Deadlock', icon: 'Deadlock' },
    { name: 'Vyse', icon: 'Vyse' }
  ]
};

// Role definitions
export const roles = ['Duelist', 'Controller', 'Initiator', 'Sentinel', 'Random'];
export const availableRoles = ['Duelist', 'Controller', 'Initiator', 'Sentinel'];

// Agent icon mapping with fallback placeholders for problematic agents
export const agentIconMap = {
  'Jett': 'https://static.wikia.nocookie.net/valorant/images/3/35/Jett_icon.png',
  'Reyna': 'https://static.wikia.nocookie.net/valorant/images/b/b0/Reyna_icon.png',
  'Phoenix': 'https://static.wikia.nocookie.net/valorant/images/1/14/Phoenix_icon.png',
  'Raze': 'https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba261/displayicon.png',
  'Yoru': 'https://static.wikia.nocookie.net/valorant/images/d/d4/Yoru_icon.png',
  'Neon': 'https://static.wikia.nocookie.net/valorant/images/d/d0/Neon_icon.png',
  'Iso': 'https://via.placeholder.com/50/FF4654/FFFFFF?text=I',
  'Waylay': 'https://via.placeholder.com/50/FF4654/FFFFFF?text=W',
  'Brimstone': 'https://static.wikia.nocookie.net/valorant/images/4/4d/Brimstone_icon.png',
  'Omen': 'https://static.wikia.nocookie.net/valorant/images/b/b0/Omen_icon.png',
  'Viper': 'https://static.wikia.nocookie.net/valorant/images/5/5f/Viper_icon.png',
  'Astra': 'https://static.wikia.nocookie.net/valorant/images/0/08/Astra_icon.png',
  'Harbor': 'https://static.wikia.nocookie.net/valorant/images/f/f3/Harbor_icon.png',
  'Clove': 'https://via.placeholder.com/50/00D4AA/FFFFFF?text=C',
  'Sova': 'https://static.wikia.nocookie.net/valorant/images/4/49/Sova_icon.png',
  'Breach': 'https://static.wikia.nocookie.net/valorant/images/5/53/Breach_icon.png',
  'Skye': 'https://static.wikia.nocookie.net/valorant/images/3/33/Skye_icon.png',
  'KAY/O': 'https://static.wikia.nocookie.net/valorant/images/f/f0/KAYO_icon.png',
  'Fade': 'https://static.wikia.nocookie.net/valorant/images/a/a6/Fade_icon.png',
  'Gekko': 'https://static.wikia.nocookie.net/valorant/images/6/66/Gekko_icon.png',
  'Sage': 'https://static.wikia.nocookie.net/valorant/images/7/74/Sage_icon.png',
  'Cypher': 'https://static.wikia.nocookie.net/valorant/images/8/88/Cypher_icon.png',
  'Killjoy': 'https://static.wikia.nocookie.net/valorant/images/1/15/Killjoy_icon.png',
  'Chamber': 'https://static.wikia.nocookie.net/valorant/images/0/09/Chamber_icon.png',
  'Deadlock': 'https://static.wikia.nocookie.net/valorant/images/e/eb/Deadlock_icon.png',
  'Vyse': 'https://via.placeholder.com/50/9C88FF/FFFFFF?text=V'
};
