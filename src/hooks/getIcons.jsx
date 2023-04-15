const images = [
  {
    name: 'stadium',
    icon: require('../../assets/stadium.png'),
  },
  {
    name: 'cricket_kit',
    icon: require('../../assets/cricket-kit.png'),
  },
  {
    name: 'helmet',
    icon: require('../../assets/helmet.png'),
  },
  {
    name: 'cricket_kit2',
    icon: require('../../assets/cricket-kit2.png'),
  },
];

export const GetIcons = name => {
  const icon = images.find(image => image.name === name).icon;
  return icon || null;
};
