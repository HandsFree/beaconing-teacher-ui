// @flow

function nullishCheck(toCheck: any, fail: any) {
    return toCheck !== null && toCheck !== undefined ? toCheck : fail;
}

export default nullishCheck;
