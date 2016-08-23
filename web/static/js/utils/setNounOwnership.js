const setNounOwnership = noun => {
  const endsWithS = noun.substr(-1) === 's';

  if (endsWithS) {
    noun = noun + '\'';
  } else {
    noun = noun + '\'s';
  }

  return noun;
};

export default setNounOwnership;
