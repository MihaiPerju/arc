export function getImagePath(path) {
  return "/image/" + path;
}
export function getFacilityImagePath(path) {
  return "/facility-logo/" + path;
}

export function objectFromArray(array, objId) {
  for (let i of array) {
    if (i._id === objId) {
      return i;
    }
  }
}
