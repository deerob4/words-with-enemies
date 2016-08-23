import randomColour from 'randomcolor';
import colourLuminance from './colourLuminance';
import choice from './choice';

const luminosity = 'light';

// function playerColours(hues, quantity) {
//   let usedHues = [];
//   let colours = [];

//   for (let i = 0; i <= quantity; i++) {
//     const hue = choice(hues);

//     let primary = randomColour({ luminosity, hue });
//     let secondary = colourLuminance(primary, -0.2);
//     let tertiary = colourLuminance(primary, -0.3);

//     usedHues.push(hue);
//     colours.push({ primary, secondary, tertiary });
//   }

//   return colours;
// }

// function letterColours(hues, quantity) {
//   let usedHues = [];
//   let colours = [];

//   for (let i = 0; i <= quantity; i++) {
//     const hue = choice(hues);

//     let backgroundColor = randomColour({ luminosity, hue });
//     let borderColor = colourLuminance(backgroundColor, -0.2);
//     let color = colourLuminance(borderColor, -0.2);

//     usedHues.push(hue);
//     colours.push({ backgroundColor, borderColor, color });
//   }

//   return colours;
// }

// function interfaceColours(hues) {
//   const hue = choice(hues);

//   let primary = randomColour({ luminosity, hue });
//   let secondary = colourLuminance(primary, -0.2);
//   let button = colourLuminance(primary, -0.3);

//   return { primary, secondary, button };
// }










export let letterColours = (hue) => {
  let backgroundColor = randomColour({ luminosity, hue });
  let borderColor = colourLuminance(backgroundColor, -0.2);
  let color = colourLuminance(borderColor, -0.2);

  return { backgroundColor, borderColor, color };
};

export let interfaceColours = (hue) => {
  let primary = randomColour({ luminosity, hue });
  let secondary = colourLuminance(primary, -0.2);
  let button = colourLuminance(primary, -0.3);

  return { primary, secondary, button };
};

let playerColours = (hue) => {
  let primary = randomColour({ luminosity, hue });
  let secondary = colourLuminance(primary, 0.1);
  let tertiary = colourLuminance(secondary, -0.2);

  return { primary, secondary, tertiary };
};

let colourMap = (array) => (
  array.reduce((colours, item) => ({
    ...colours,
    [item.id]: item.colours
  }), {})
);

export let generateColours = (letters, players) => {
  const hues = [
    'red',
    'blue',
    'orange',
    'purple',
    'pink',
    'green'
  ];

  let interfaceHue = choice(hues);
  let playerHue = choice(hues.filter(h => h !== interfaceHue));
  let opponentHue = choice(hues.filter(h => h !== interfaceHue && h !== playerHue));

  letters = Object
              .keys(letters)
              .map(id => ({ id, colours: letterColours() }));

  players = Object
              .keys(players)
              .map(id => ({ id, colours: playerColours() }));

  return {
    letters: colourMap(letters),
    players: {
      player: playerColours(playerHue),
      opponent: playerColours(opponentHue)
    },
    interface: { ...interfaceColours(interfaceHue) }
  };
};

export default generateColours;
