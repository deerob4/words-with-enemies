const nextId = (obj) => {
  const keys = Object.keys(obj);

  if (keys.length === 0) return 0;

  return Math.max(...keys) + 1;
};

export default nextId;
