const PROPOSAL_PUBLIC_KEY_SPKI =
  "MCowBQYDK2VwAyEAggnbthptItBNyu8fWoSVH/jzbn3jCFbimAKMuni739M=";

let importedKey: Promise<CryptoKey> | undefined;

function base64ToBytes(value: string) {
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

export function getWorkoutProposalPublicKey() {
  importedKey ??= crypto.subtle.importKey(
    "spki",
    base64ToBytes(PROPOSAL_PUBLIC_KEY_SPKI),
    { name: "Ed25519" },
    false,
    ["verify"],
  );
  return importedKey;
}
