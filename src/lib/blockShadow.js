export const makeBlockShadow = (shade) => {
  let shadow = "";
  for (let i = 1; i <= 8; i++) {
    shadow += `${i}px ${i}px 0 0 ${shade}, `;
  }
  return shadow + `12px 12px 15px 0 rgba(0,0,0,0.3)`;
};