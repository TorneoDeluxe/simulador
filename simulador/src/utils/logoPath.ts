const logoImports = import.meta.glob("../assets/Escudos/**/*.{png,webp}", {
  eager: true,
  import: "default",
});

const sanitizeName = (name: string) => name.replace(/\s+/g, "_").replace(/[()]/g, "");

export const getTeamLogoPath = (name: string, country: string) => {
  const sanitizedName = sanitizeName(name);
  const expectedSuffixes = [`/Escudos/${country}/${sanitizedName}.png`, `/Escudos/${country}/${sanitizedName}.webp`];

  const matchedLogo = Object.entries(logoImports).find(([path]) =>
    expectedSuffixes.some((suffix) => path.endsWith(suffix))
  );

  if (matchedLogo) {
    return matchedLogo[1] as string;
  }

  return new URL(`../assets/Escudos/${country}/${sanitizedName}.png`, import.meta.url).href;
};